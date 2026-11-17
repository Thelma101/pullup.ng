import { NextResponse } from "next/server";
import { saveApplication } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || "").trim();
    const age = Number(body.age);
    const whatsapp = String(body.whatsapp || "").trim();
    const city = String(body.city || "");
    const area = String(body.area || "").trim();
    const reason = String(body.reason || "").trim();
    const tablePreference = String(body.tablePreference || "mixed");
    const dietary = String(body.dietary || "").trim();
    const howFound = String(body.howFound || "").trim();

    if (!fullName || !whatsapp || !area || !reason) {
      return NextResponse.json({ error: "Please fill every required field." }, { status: 400 });
    }
    if (!["lagos", "abuja"].includes(city)) {
      return NextResponse.json({ error: "Choose Lagos or Abuja." }, { status: 400 });
    }
    if (!Number.isFinite(age) || age < 21) {
      return NextResponse.json({ error: "PullUp is for ages 21 and up." }, { status: 400 });
    }
    if (reason.length < 12) {
      return NextResponse.json({ error: "Tell us a little more about why you want to join." }, { status: 400 });
    }

    const entry = {
      id: `app_${Date.now()}`,
      createdAt: new Date().toISOString(),
      fullName,
      age,
      whatsapp,
      city,
      area,
      reason,
      tablePreference,
      dietary,
      howFound,
      status: "pending_verification",
    };

    await saveApplication(entry);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Could not save your application." }, { status: 500 });
  }
}
