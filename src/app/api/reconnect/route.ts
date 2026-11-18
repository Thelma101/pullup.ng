import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import {
  findBookingByRef,
  findTablemates,
  saveReconnect,
} from "@/lib/store";
import type { ReconnectRequest } from "@/lib/types";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const bookingRef = String(body.bookingRef || "").trim();
    const fromEmail = String(body.fromEmail || "").trim().toLowerCase();
    const fromName = String(body.fromName || "").trim();
    const targetLabel = String(body.targetLabel || "").trim();
    const note = String(body.note || "").trim();

    const booking = await findBookingByRef(bookingRef);
    if (!booking || booking.paymentStatus !== "paid") {
      return NextResponse.json({ error: "Valid paid booking required." }, { status: 400 });
    }
    if (booking.email.toLowerCase() !== fromEmail) {
      return NextResponse.json({ error: "Email must match the booking." }, { status: 403 });
    }
    if (!fromName || !targetLabel) {
      return NextResponse.json({ error: "Tell us who you’d Pull Up with again." }, { status: 400 });
    }

    const mates = await findTablemates(booking.nightId, fromEmail);
    const needle = targetLabel.toLowerCase();
    const match =
      mates.find((m) => m.fullName.toLowerCase() === needle) ||
      mates.find((m) => m.firstName.toLowerCase() === needle) ||
      mates.find((m) => m.fullName.toLowerCase().includes(needle));

    const token = randomBytes(16).toString("hex");
    const entry: ReconnectRequest = {
      id: `rc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      bookingRef,
      nightId: booking.nightId,
      fromEmail,
      fromName,
      targetLabel,
      targetEmail: match?.email,
      note: note || undefined,
      status: "pending",
      token,
    };
    await saveReconnect(entry);

    const validateUrl = `${siteUrl(request)}/again/validate?token=${encodeURIComponent(token)}`;
    // Email send lands here later — for now ops + logs carry the validate link.
    console.info("[reconnect] validate link", {
      to: entry.targetEmail || `(unmatched: ${targetLabel})`,
      from: fromName,
      validateUrl,
    });

    return NextResponse.json({
      ok: true,
      id: entry.id,
      matchedTarget: Boolean(match),
      message: match
        ? `Got it. We’ll message ${match.firstName} to confirm. If they say yes, we connect you both by email.`
        : `Got it. We’ll reach out to “${targetLabel}” from that table to confirm. If they say yes, we connect you by email.`,
      // Only expose validate URL in development so local testing is easy
      validateUrl: process.env.NODE_ENV === "development" ? validateUrl : undefined,
    });
  } catch (err) {
    console.error("[reconnect]", err);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
