import { NextResponse } from "next/server";
import { getNight, seatsLeft } from "@/lib/nights";
import { saveWaitlistEntry } from "@/lib/store";
import type { WaitlistEntry } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nightId = String(body.nightId || "");
    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    const night = getNight(nightId);
    if (!night) return NextResponse.json({ error: "Hangout not found." }, { status: 404 });
    if (seatsLeft(night) > 0 && night.status !== "full") {
      return NextResponse.json({ error: "Seats are still open — book directly." }, { status: 400 });
    }
    if (!fullName || !email.includes("@")) {
      return NextResponse.json({ error: "Name and email required." }, { status: 400 });
    }

    const entry: WaitlistEntry = {
      id: `wl_${Date.now()}`,
      createdAt: new Date().toISOString(),
      nightId,
      fullName,
      email,
      status: "waiting",
    };
    await saveWaitlistEntry(entry);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error("[waitlist]", err);
    return NextResponse.json({ error: "Could not join waitlist." }, { status: 500 });
  }
}
