import { NextResponse } from "next/server";
import { findReconnectByToken, saveReconnect } from "@/lib/store";
import { sendEmail } from "@/lib/email/send";
import { reconnectIntroEmail } from "@/lib/email/templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "").trim();
    const decision = String(body.decision || "").trim(); // approve | decline
    const targetEmail = String(body.targetEmail || "").trim().toLowerCase();
    const targetName = String(body.targetName || "").trim();

    const entry = await findReconnectByToken(token);
    if (!entry) {
      return NextResponse.json({ error: "This link is invalid or expired." }, { status: 404 });
    }
    if (entry.status !== "pending") {
      return NextResponse.json({
        ok: true,
        status: entry.status,
        message:
          entry.status === "approved" || entry.status === "connected"
            ? "Already confirmed — we’ll email you both."
            : "This request was declined.",
      });
    }
    if (!["approve", "decline"].includes(decision)) {
      return NextResponse.json({ error: "Choose approve or decline." }, { status: 400 });
    }

    if (decision === "decline") {
      await saveReconnect({
        ...entry,
        status: "declined",
        respondedAt: new Date().toISOString(),
      });
      return NextResponse.json({
        ok: true,
        status: "declined",
        message: "All good — we won’t connect you.",
      });
    }

    const email = targetEmail || entry.targetEmail || "";
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Confirm your email so we can connect you." },
        { status: 400 },
      );
    }

    await saveReconnect({
      ...entry,
      targetEmail: email,
      status: "connected",
      respondedAt: new Date().toISOString(),
    });

    const fromFirst = entry.fromName.trim().split(/\s+/)[0] || entry.fromName;
    const toDisplay = targetName || entry.targetLabel || email.split("@")[0];

    try {
      await Promise.all([
        sendEmail({
          to: entry.fromEmail,
          payload: reconnectIntroEmail({
            toName: fromFirst,
            otherName: toDisplay,
            otherEmail: email,
          }),
        }),
        sendEmail({
          to: email,
          payload: reconnectIntroEmail({
            toName: toDisplay.split(/\s+/)[0] || toDisplay,
            otherName: entry.fromName,
            otherEmail: entry.fromEmail,
          }),
        }),
      ]);
    } catch (mailErr) {
      console.error("[reconnect/validate] email", mailErr);
    }

    return NextResponse.json({
      ok: true,
      status: "connected",
      message: `Confirmed. We’ll email you and ${entry.fromName} so you can reconnect.`,
    });
  } catch (err) {
    console.error("[reconnect/validate]", err);
    return NextResponse.json({ error: "Could not update request." }, { status: 500 });
  }
}
