import { NextResponse } from "next/server";
import { findMemberByEmail, saveMember } from "@/lib/store";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const preferences = body.preferences || {};

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const member = await findMemberByEmail(email);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updated = {
      ...member,
      tablePreference: preferences.defaultTablePreference || member.tablePreference,
      groupSizePreference: preferences.groupSizePreference || member.groupSizePreference || "any",
      dietary: preferences.dietaryNotes || member.dietary,
    };

    await saveMember(updated);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[preferences]", err);
    return NextResponse.json(
      { error: "Failed to save preferences" },
      { status: 500 },
    );
  }
}
