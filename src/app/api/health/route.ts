import { NextResponse } from "next/server";
import { mongoConfigured } from "@/lib/db";
import { emailConfigured } from "@/lib/email/send";
import { paystackConfigured } from "@/lib/paystack";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "PullUp",
    site: process.env.NEXT_PUBLIC_SITE_URL || null,
    checks: {
      mongodb: mongoConfigured(),
      paystack: paystackConfigured(),
      resend: emailConfigured(),
    },
    time: new Date().toISOString(),
  });
}
