import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { listBookings, listMembers, listPasses, saveBooking } from "@/lib/store";

function authorized(request: Request) {
  const key = process.env.OPS_DASHBOARD_SECRET || "pullup-ops";
  const header = request.headers.get("x-ops-key") || "";
  const url = new URL(request.url);
  const query = url.searchParams.get("key") || "";
  return header === key || query === key;
}

async function listCommunity() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data", "community.json"), "utf8");
    if (!raw.trim()) return [];
    return JSON.parse(raw) as Array<{
      id: string;
      fullName: string;
      whatsapp: string;
      city: string;
      email?: string;
      createdAt: string;
    }>;
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [members, bookings, passes, community] = await Promise.all([
    listMembers(),
    listBookings(),
    listPasses(),
    listCommunity(),
  ]);

  return NextResponse.json({
    members,
    bookings,
    passes,
    community,
    summary: {
      members: members.length,
      paidBookings: bookings.filter((b) => b.paymentStatus === "paid").length,
      pendingBookings: bookings.filter((b) => b.paymentStatus === "pending").length,
      noShows: bookings.filter((b) => b.paymentStatus === "no_show").length,
      activePasses: passes.filter((p) => p.paymentStatus === "paid").length,
      communityLeads: community.length,
    },
  });
}

export async function PATCH(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const bookingId = String(body.bookingId || "");
  const status = String(body.paymentStatus || "");
  if (!bookingId || !["paid", "failed", "refunded", "no_show", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const bookings = await listBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const updated = await saveBooking({ ...booking, paymentStatus: status as typeof booking.paymentStatus });
  return NextResponse.json({ ok: true, booking: updated });
}
