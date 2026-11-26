import { Resend } from "resend";
import type { EmailPayload } from "./templates";

function fromAddress() {
  return process.env.EMAIL_FROM || "PullUp <hello@gopullup.ng>";
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(args: {
  to: string | string[];
  payload: EmailPayload;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email] skipped (no RESEND_API_KEY)", {
      to: args.to,
      subject: args.payload.subject,
    });
    return { skipped: true as const };
  }

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: Array.isArray(args.to) ? args.to : [args.to],
    subject: args.payload.subject,
    html: args.payload.html,
    text: args.payload.text,
    replyTo: args.replyTo,
  });

  if (error) {
    console.error("[email] send failed", error);
    throw new Error(error.message || "Email send failed");
  }

  return { skipped: false as const, id: data?.id };
}
