import { NextResponse } from "next/server";
import { getNight, seatsLeft } from "@/lib/nights";
import { initializePaystackTransaction } from "@/lib/paystack";
import { findMemberByEmail, saveBooking } from "@/lib/store";
import type { Booking } from "@/lib/types";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nightId = String(body.nightId || "");
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const tablePreference = String(body.tablePreference || "mixed");
    const dietary = String(body.dietary || "").trim();
    const budgetBand = String(body.budgetBand || "moderate");
    const usePass = Boolean(body.usePass);
    const useCredit = body.useCredit !== false;

    const night = getNight(nightId);
    if (!night) {
      return NextResponse.json({ error: "That hangout doesn’t exist." }, { status: 404 });
    }
    if (seatsLeft(night) <= 0 || night.status === "full") {
      return NextResponse.json({ error: "That table is full." }, { status: 409 });
    }
    if (!fullName || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    const member = await findMemberByEmail(email);
    const creditAvailable = useCredit ? member?.creditNaira || 0 : 0;
    const passAvailable = usePass ? member?.passCredits || 0 : 0;

    let feeNaira = night.feeNaira;
    let creditApplied = 0;
    let paidWith: Booking["paidWith"] = "paystack";
    let amountDue = feeNaira;

    if (passAvailable > 0 && usePass) {
      paidWith = "pass";
      amountDue = 0;
      creditApplied = 0;
    } else if (creditAvailable > 0) {
      creditApplied = Math.min(creditAvailable, feeNaira);
      amountDue = Math.max(feeNaira - creditApplied, 0);
      paidWith = creditApplied > 0 && amountDue > 0 ? "mixed" : creditApplied >= feeNaira ? "mixed" : "paystack";
    }

    const ref = `PU-${night.city.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const entry: Booking = {
      id: `book_${Date.now()}`,
      ref,
      createdAt: new Date().toISOString(),
      nightId,
      fullName,
      email,
      tablePreference: tablePreference as Booking["tablePreference"],
      dietary,
      budgetBand: budgetBand as Booking["budgetBand"],
      feeNaira,
      amountPaidNaira: 0,
      creditAppliedNaira: creditApplied,
      paidWith,
      paymentStatus: "pending",
      paystackReference: ref,
      referralCodeUsed: member?.referredBy,
    };

    if (amountDue <= 0) {
      entry.paymentStatus = "paid";
      entry.amountPaidNaira = 0;
      if (paidWith === "pass" && member) {
        const { saveMember } = await import("@/lib/store");
        await saveMember({ ...member, passCredits: Math.max(member.passCredits - 1, 0) });
      } else if (creditApplied > 0 && member) {
        const { saveMember } = await import("@/lib/store");
        await saveMember({ ...member, creditNaira: Math.max(member.creditNaira - creditApplied, 0) });
      }
      await saveBooking(entry);
      return NextResponse.json({
        ok: true,
        ref,
        paid: true,
        redirectTo: `/booked?night=${encodeURIComponent(nightId)}&ref=${encodeURIComponent(ref)}`,
      });
    }

    await saveBooking(entry);

    const init = await initializePaystackTransaction({
      email,
      amountNaira: amountDue,
      reference: ref,
      callbackUrl: `${siteUrl(request)}/api/paystack/verify?kind=booking&ref=${encodeURIComponent(ref)}`,
      metadata: {
        kind: "booking",
        bookingRef: ref,
        nightId,
        fullName,
        creditApplied,
      },
    });

    return NextResponse.json({
      ok: true,
      ref,
      paid: false,
      amountDue,
      authorization_url: init.authorization_url,
      demo: init.demo,
    });
  } catch (err) {
    console.error("[book]", err);
    return NextResponse.json({ error: "Could not hold your seat. Please try again." }, { status: 500 });
  }
}
