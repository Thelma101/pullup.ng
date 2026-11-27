import { NextResponse } from "next/server";
import { sendVenueDetails } from "@/lib/notifications";
import { BookingModel } from "@/lib/models";
import { dbConnect } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || process.env.OPS_DASHBOARD_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const nightId = String(body.nightId || "");
    const venue = body.venue;

    if (!nightId || !venue?.name || !venue?.address) {
      return NextResponse.json(
        { error: "nightId and venue details required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const bookings = await BookingModel.find({
      nightId,
      paymentStatus: "paid",
    }).lean();

    const sent: string[] = [];
    const failed: string[] = [];

    for (const booking of bookings) {
      try {
        await sendVenueDetails({
          fullName: booking.fullName,
          email: booking.email,
          nightId: booking.nightId,
          ref: booking.ref,
          venue,
        });
        sent.push(booking.ref);
      } catch (err) {
        console.error(`Failed to send venue for ${booking.ref}:`, err);
        failed.push(booking.ref);
      }
    }

    return NextResponse.json({
      message: `Sent venue details to ${sent.length} attendees`,
      sent,
      failed,
    });
  } catch (err) {
    console.error("[venue]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send venue details" },
      { status: 500 },
    );
  }
}
