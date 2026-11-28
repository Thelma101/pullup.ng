import { NextResponse } from "next/server";
import { findMemberByEmail, listBookings, listWaitlist } from "@/lib/store";
import { getNight } from "@/lib/nights";

export async function GET(request: Request) {
  try {
    const email = new URL(request.url).searchParams.get("email")?.trim().toLowerCase() || "";
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Enter your email." }, { status: 400 });
    }

    const [member, allBookings, allWaitlist] = await Promise.all([
      findMemberByEmail(email),
      listBookings(),
      listWaitlist(),
    ]);

    const bookings = allBookings.filter((b) => b.email.toLowerCase() === email);
    const waitlist = allWaitlist.filter((w) => w.email.toLowerCase() === email);
    const today = new Date().toISOString().slice(0, 10);

    const upcoming = bookings
      .filter((b) => b.paymentStatus === "paid")
      .map((b) => ({ booking: b, night: getNight(b.nightId) || null }))
      .filter((x) => !x.night || x.night.date >= today);

    const past = bookings
      .filter((b) => b.paymentStatus === "paid" || b.paymentStatus === "no_show")
      .map((b) => ({ booking: b, night: getNight(b.nightId) || null }))
      .filter((x) => x.night && x.night.date < today);

    return NextResponse.json({
      member,
      upcoming,
      past,
      waitlist,
    });
  } catch (err) {
    console.error("[me]", err);
    const detail = err instanceof Error ? err.message : "";
    const dbHint =
      /MONGODB|Mongo|IP|whitelist|access list|auth|ServerSelection|placeholder/i.test(detail);
    return NextResponse.json(
      {
        error: dbHint
          ? "Database unavailable. In MongoDB Atlas → Network Access, allow 0.0.0.0/0, and set MONGODB_URI on Vercel with your real password."
          : "Could not load your home. Try again.",
      },
      { status: dbHint ? 503 : 500 },
    );
  }
}
