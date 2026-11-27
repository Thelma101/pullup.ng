import { NextResponse } from "next/server";
import { send24HourReminder } from "@/lib/notifications";
import { BookingModel } from "@/lib/models";
import { dbConnect } from "@/lib/db";
import { nights } from "@/lib/nights";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedToken = process.env.CRON_SECRET || process.env.OPS_DASHBOARD_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    const tomorrowNights = nights.filter((n) => n.date === tomorrowDate);
    const tomorrowNightIds = tomorrowNights.map((n) => n.id);

    if (tomorrowNightIds.length === 0) {
      return NextResponse.json({ message: "No events tomorrow", sent: [], failed: [] });
    }

    const bookings = await BookingModel.find({
      nightId: { $in: tomorrowNightIds },
      paymentStatus: "paid",
    }).lean();

    const reminders = bookings.map((b) => ({
      fullName: b.fullName,
      email: b.email,
      nightId: b.nightId,
      ref: b.ref,
    }));

    const result = await send24HourReminder(reminders);

    return NextResponse.json({
      message: `Sent ${result.sent.length} reminders for tomorrow's events`,
      sent: result.sent,
      failed: result.failed,
      date: tomorrowDate,
    });
  } catch (err) {
    console.error("[reminders]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send reminders" },
      { status: 500 },
    );
  }
}
