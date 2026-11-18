import { NextResponse } from "next/server";
import { verifyPaystackTransaction } from "@/lib/paystack";
import {
  findBookingByRef,
  findMemberByEmail,
  findPassByRef,
  saveBooking,
  saveMember,
  savePass,
} from "@/lib/store";
import { makeReferralCode } from "@/lib/pricing";
import type { Member } from "@/lib/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = url.searchParams.get("kind") || "booking";
  const ref = url.searchParams.get("ref") || url.searchParams.get("reference") || "";
  const origin = process.env.NEXT_PUBLIC_SITE_URL || url.origin;

  if (!ref) {
    return NextResponse.redirect(`${origin}/nights?pay=missing`);
  }

  try {
    const verified = await verifyPaystackTransaction(ref);
    const ok = verified.demo || verified.status === "success";

    if (kind === "pass") {
      const pass = await findPassByRef(ref);
      if (!pass) return NextResponse.redirect(`${origin}/fee?pay=missing#pass`);
      if (!ok) {
        await savePass({ ...pass, paymentStatus: "failed" });
        return NextResponse.redirect(`${origin}/fee?pay=failed#pass`);
      }

      await savePass({ ...pass, paymentStatus: "paid" });
      const existing = await findMemberByEmail(pass.email);
      if (existing) {
        await saveMember({
          ...existing,
          fullName: existing.fullName || pass.fullName,
          passCredits: existing.passCredits + pass.credits,
          passPlan: pass.plan,
        });
      } else {
        const member: Member = {
          id: `mem_${Date.now()}`,
          createdAt: new Date().toISOString(),
          fullName: pass.fullName,
          email: pass.email,
          age: 21,
          city: "lagos",
          area: "",
          reason: "other",
          tablePreference: "mixed",
          referralCode: makeReferralCode(pass.fullName),
          creditNaira: 0,
          passCredits: pass.credits,
          passPlan: pass.plan,
          status: "active",
        };
        await saveMember(member);
      }
      return NextResponse.redirect(`${origin}/fee?pay=success&ref=${encodeURIComponent(ref)}#pass`);
    }

    const booking = await findBookingByRef(ref);
    if (!booking) return NextResponse.redirect(`${origin}/nights?pay=missing`);
    if (!ok) {
      await saveBooking({ ...booking, paymentStatus: "failed" });
      return NextResponse.redirect(`${origin}/nights/${booking.nightId}?pay=failed`);
    }

    const member = await findMemberByEmail(booking.email);
    if (member && booking.creditAppliedNaira > 0 && booking.paymentStatus !== "paid") {
      await saveMember({
        ...member,
        creditNaira: Math.max(member.creditNaira - booking.creditAppliedNaira, 0),
      });
    }

    await saveBooking({
      ...booking,
      paymentStatus: "paid",
      amountPaidNaira: verified.demo ? booking.feeNaira - booking.creditAppliedNaira : verified.amountNaira,
    });

    return NextResponse.redirect(
      `${origin}/booked?night=${encodeURIComponent(booking.nightId)}&ref=${encodeURIComponent(booking.ref)}`,
    );
  } catch (err) {
    console.error("[paystack/verify]", err);
    return NextResponse.redirect(`${origin}/nights?pay=error`);
  }
}
