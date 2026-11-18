import { NextResponse } from "next/server";
import { initializePaystackTransaction } from "@/lib/paystack";
import { PASS_PLANS } from "@/lib/pricing";
import { savePass } from "@/lib/store";
import type { PassPlan, PassPurchase } from "@/lib/types";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const plan = String(body.plan || "") as PassPlan;

    if (!fullName || !email.includes("@")) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!PASS_PLANS[plan]) {
      return NextResponse.json({ error: "Choose a PullUp Pass." }, { status: 400 });
    }

    const selected = PASS_PLANS[plan];
    const ref = `PASS-${plan === "pass_3" ? "3" : "5"}-${Date.now().toString().slice(-6)}`;
    const entry: PassPurchase = {
      id: `pass_${Date.now()}`,
      createdAt: new Date().toISOString(),
      email,
      fullName,
      plan,
      amountNaira: selected.amountNaira,
      credits: selected.credits,
      paymentStatus: "pending",
      paystackReference: ref,
    };

    await savePass(entry);

    const init = await initializePaystackTransaction({
      email,
      amountNaira: selected.amountNaira,
      reference: ref,
      callbackUrl: `${siteUrl(request)}/api/paystack/verify?kind=pass&ref=${encodeURIComponent(ref)}`,
      metadata: { kind: "pass", plan, email, fullName },
    });

    return NextResponse.json({
      ok: true,
      ref,
      authorization_url: init.authorization_url,
      demo: init.demo,
    });
  } catch (err) {
    console.error("[pass]", err);
    return NextResponse.json({ error: "Could not start Pass checkout." }, { status: 500 });
  }
}
