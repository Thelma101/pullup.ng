import { NextResponse } from "next/server";
import { getNight, seatsLeft } from "@/lib/nights";
import { saveBooking } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nightId = String(body.nightId || "");
    const fullName = String(body.fullName || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const tablePreference = String(body.tablePreference || "mixed");
    const dietary = String(body.dietary || "").trim();
    const budgetBand = String(body.budgetBand || "moderate");

    const night = getNight(nightId);
    if (!night) {
      return NextResponse.json({ error: "That night doesn’t exist." }, { status: 404 });
    }
    if (seatsLeft(night) <= 0 || night.status === "full") {
      return NextResponse.json({ error: "That table is full." }, { status: 409 });
    }
    if (!fullName || !whatsapp) {
      return NextResponse.json({ error: "Name and WhatsApp are required." }, { status: 400 });
    }

    const ref = `BR-${night.city.slice(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const entry = {
      id: `book_${Date.now()}`,
      ref,
      createdAt: new Date().toISOString(),
      nightId,
      fullName,
      whatsapp,
      tablePreference,
      dietary,
      budgetBand,
      feeNaira: night.feeNaira,
      paymentStatus: "hold_pending_paystack",
    };

    await saveBooking(entry);
    return NextResponse.json({ ok: true, ref });
  } catch {
    return NextResponse.json({ error: "Could not hold your seat." }, { status: 500 });
  }
}
