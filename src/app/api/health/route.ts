import { NextResponse } from "next/server";
import { mongoConfigured, mongoPing } from "@/lib/db";
import { emailConfigured } from "@/lib/email/send";
import { paystackConfigured } from "@/lib/paystack";

export async function GET() {
  const mongo = await mongoPing();

  return NextResponse.json({
    ok: mongo.ok && paystackConfigured() && emailConfigured(),
    service: "PullUp",
    site: process.env.NEXT_PUBLIC_SITE_URL || null,
    checks: {
      mongodb: mongoConfigured(),
      mongodbReachable: mongo.ok,
      mongodbDetail: mongo.ok ? undefined : mongo.detail,
      paystack: paystackConfigured(),
      resend: emailConfigured(),
    },
    time: new Date().toISOString(),
  });
}
