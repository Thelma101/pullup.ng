import { NextResponse } from "next/server";
import { findBookingByRef, findMutualReconnects, saveReconnect } from "@/lib/store";
import type { ReconnectOptIn } from "@/lib/types";

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

    const entry: ReconnectOptIn = {
      id: `rc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      bookingRef,
      nightId: booking.nightId,
      fromEmail,
      fromName,
      targetLabel,
      note,
    };
    await saveReconnect(entry);
    const mutual = await findMutualReconnects(booking.nightId);
    const matched = mutual.some(
      (m) =>
        (m.a === fromEmail || m.b === fromEmail) &&
        m.labels.some((l) => l.toLowerCase() === targetLabel.toLowerCase()),
    );

    return NextResponse.json({
      ok: true,
      matched,
      message: matched
        ? "It’s mutual — we’ll connect you both by email."
        : "Saved. If they opt in too, we’ll connect you.",
    });
  } catch (err) {
    console.error("[reconnect]", err);
    return NextResponse.json({ error: "Could not save." }, { status: 500 });
  }
}
