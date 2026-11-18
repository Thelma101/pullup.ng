import { NextResponse } from "next/server";
import { makeReferralCode, REFERRAL_CREDIT_NAIRA } from "@/lib/pricing";
import { findMemberByEmail, findMemberByReferralCode, saveMember } from "@/lib/store";
import type { Member } from "@/lib/types";

const REASONS = new Set([
  "new-in-town",
  "empty-weekends",
  "friends-outside-work",
  "small-groups",
  "try-something-new",
  "other",
]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const age = Number(body.age);
    const email = String(body.email || "").trim().toLowerCase();
    const city = String(body.city || "");
    const area = String(body.area || "").trim();
    const reason = String(body.reason || "").trim();
    const tablePreference = String(body.tablePreference || "mixed");
    const dietary = String(body.dietary || "").trim();
    const howFound = String(body.howFound || "").trim();
    const referralCode = String(body.referralCode || "").trim().toUpperCase();

    if (!fullName || !email || !area || !reason) {
      return NextResponse.json({ error: "Please fill every required field." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    if (!["lagos", "abuja"].includes(city)) {
      return NextResponse.json({ error: "Choose Lagos or Abuja." }, { status: 400 });
    }
    if (!Number.isFinite(age) || age < 21) {
      return NextResponse.json({ error: "PullUp is for ages 21 and up." }, { status: 400 });
    }
    if (!REASONS.has(reason)) {
      return NextResponse.json({ error: "Pick why you want to Pull Up." }, { status: 400 });
    }

    const existing = await findMemberByEmail(email);
    if (existing) {
      return NextResponse.json({
        ok: true,
        id: existing.id,
        referralCode: existing.referralCode,
        returning: true,
      });
    }

    let referredBy: string | undefined;
    let starterCredit = 0;
    if (referralCode) {
      const referrer = await findMemberByReferralCode(referralCode);
      if (referrer && referrer.email !== email) {
        referredBy = referrer.referralCode;
        starterCredit = REFERRAL_CREDIT_NAIRA;
        await saveMember({
          ...referrer,
          creditNaira: referrer.creditNaira + REFERRAL_CREDIT_NAIRA,
        });
      }
    }

    const entry: Member = {
      id: `mem_${Date.now()}`,
      createdAt: new Date().toISOString(),
      fullName,
      email,
      age,
      city: city as Member["city"],
      area,
      reason,
      tablePreference: tablePreference as Member["tablePreference"],
      dietary,
      howFound,
      referralCode: makeReferralCode(fullName),
      referredBy,
      creditNaira: starterCredit,
      passCredits: 0,
      passPlan: null,
      status: "active",
    };

    await saveMember(entry);
    return NextResponse.json({
      ok: true,
      id: entry.id,
      referralCode: entry.referralCode,
      creditNaira: entry.creditNaira,
    });
  } catch (err) {
    console.error("[apply]", err);
    return NextResponse.json({ error: "Could not save your registration." }, { status: 500 });
  }
}
