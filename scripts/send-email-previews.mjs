/**
 * Sends all PullUp email template previews.
 * Usage: node scripts/send-email-previews.mjs
 * Requires RESEND_API_KEY (+ optional EMAIL_FROM) in .env.local
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnvLocal() {
  const path = resolve(root, ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 0) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const TO = process.argv[2] || "akpata.thelma@gmail.com";
const key = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "PullUp <onboarding@resend.dev>";
const site = process.env.NEXT_PUBLIC_SITE_URL || "https://gopullup.ng";

if (!key) {
  console.error("Missing RESEND_API_KEY in .env.local");
  process.exit(1);
}

// Inline sample templates (mirrors src/lib/email/templates.ts visuals)
function layout({ preheader, title, bodyHtml, cta }) {
  const ctaHtml = cta
    ? `<tr><td style="padding:28px 0 8px;"><a href="${cta.href}" style="display:inline-block;background:#0d9488;color:#fff;font-family:Georgia,serif;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:999px;">${cta.label}</a></td></tr>`
    : "";
  return `<!DOCTYPE html><html><body style="margin:0;background:#e8eef1;">
  <div style="display:none">${preheader}</div>
  <table width="100%" style="background:#e8eef1;padding:32px 12px;"><tr><td align="center">
  <table width="560" style="max-width:560px;background:#fff;border-radius:20px;border:1px solid #d5dee4;overflow:hidden;">
  <tr><td style="background:linear-gradient(135deg,#0b1c2c,#1a3347 55%,#0e7490);padding:28px 32px;">
  <p style="margin:0;font-family:Arial;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#9fd4d0;">PullUp · preview</p>
  <p style="margin:10px 0 0;font-family:Georgia,serif;font-size:28px;color:#fff;">${title}</p>
  </td></tr>
  <tr><td style="padding:32px;font-family:Arial;font-size:16px;line-height:1.65;color:#0b1c2c;">${bodyHtml}
  <table width="100%">${ctaHtml}</table></td></tr>
  <tr><td style="padding:20px 32px 28px;border-top:1px solid #e8eef1;font-size:12px;color:#5a6a78;font-family:Arial;">
  gopullup.ng · hello@gopullup.ng</td></tr>
  </table></td></tr></table></body></html>`;
}

const p = (t) => `<p style="margin:0 0 16px;">${t}</p>`;
const note = (t) =>
  `<p style="margin:20px 0 0;padding:14px 16px;background:#f4f7f8;border-left:3px solid #0d9488;border-radius:0 10px 10px 0;font-size:14px;">${t}</p>`;

const samples = [
  {
    subject: "[Preview] You’re in, Thelma — welcome to PullUp",
    html: layout({
      preheader: "Your seat at the table starts here.",
      title: "You’re in.",
      bodyHtml:
        p("Hi Thelma,") +
        p("Glad you applied. PullUp is small tables, real conversation, and evenings that don’t feel like work or a dating app.") +
        note("Your referral code: <strong>PUTHELMA9X2A</strong>"),
      cta: { label: "See hangouts", href: `${site}/nights` },
    }),
  },
  {
    subject: "[Preview] Seat locked · Dinner · Lekki",
    html: layout({
      preheader: "Venue comes the morning of.",
      title: "Seat locked.",
      bodyHtml:
        p("Hi Thelma,") +
        p("You’re booked for <strong>Dinner · Lekki · Sat 22 Nov</strong>. Ref <strong>PU-DEMO-1042</strong>.") +
        note("Exact venue drops the morning of your hangout."),
      cta: { label: "Open my home", href: `${site}/me` },
    }),
  },
  {
    subject: "[Preview] Pass active · 3 hangouts ready",
    html: layout({
      preheader: "3 hangouts on your Pass.",
      title: "Pass is live.",
      bodyHtml: p("Hi Thelma,") + p("Your 3 hangouts / month Pass is ready. Paid ₦20,000."),
      cta: { label: "Book a hangout", href: `${site}/nights` },
    }),
  },
  {
    subject: "[Preview] Waitlist · Drinks · Ikoyi",
    html: layout({
      preheader: "We’ll ping you if a seat opens.",
      title: "You’re on the list.",
      bodyHtml: p("Hi Thelma,") + p("<strong>Drinks · Ikoyi</strong> is full. If someone drops, you hear first."),
      cta: { label: "Browse other nights", href: `${site}/nights` },
    }),
  },
  {
    subject: "[Preview] Seat open · Drinks · Ikoyi",
    html: layout({
      preheader: "A seat just opened.",
      title: "A seat opened.",
      bodyHtml: p("Hi Thelma,") + p("Someone released a spot. Grab it while it’s yours."),
      cta: { label: "Book this seat", href: `${site}/nights` },
    }),
  },
  {
    subject: "[Preview] Ada Okafor wants to Pull Up again",
    html: layout({
      preheader: "Ada asked to reconnect — your call.",
      title: "Pull Up again?",
      bodyHtml:
        p("Hi Thelma,") +
        p("<strong>Ada Okafor</strong> sat at your table and would like to reconnect.") +
        note("They said: “Loved our chat about food markets.”"),
      cta: { label: "Respond here", href: `${site}/again/validate?token=preview` },
    }),
  },
  {
    subject: "[Preview] You’re connected · Ada Okafor",
    html: layout({
      preheader: "Meet Ada — you’re both in.",
      title: "You’re connected.",
      bodyHtml:
        p("Hi Thelma,") +
        p("Both of you said yes.") +
        note('<a href="mailto:ada@example.com" style="color:#0e7490;font-weight:600;">ada@example.com</a>'),
      cta: { label: "Back to PullUp", href: site },
    }),
  },
  {
    subject: "[Preview] Tonight’s spot · Nok by Alara",
    html: layout({
      preheader: "Nok by Alara · 7:00 PM",
      title: "Here’s the spot.",
      bodyHtml:
        p("Hi Thelma,") +
        p("Morning-of drop for <strong>Dinner · Lekki</strong>.") +
        note("<strong>Nok by Alara</strong> · Victoria Island · 7:00 PM"),
      cta: { label: "Open in Maps", href: "https://maps.google.com" },
    }),
  },
  {
    subject: "[Preview] Welcome to the PullUp community",
    html: layout({
      preheader: "Hangout drops and flash seats.",
      title: "Community seat saved.",
      bodyHtml:
        p("Hi Thelma,") +
        p("We got your join request. You’ll land in WhatsApp shortly."),
      cta: { label: "Book a hangout", href: `${site}/nights` },
    }),
  },
];

const resend = new Resend(key);

console.log(`Sending ${samples.length} previews to ${TO} from ${from}…`);
for (const sample of samples) {
  const { data, error } = await resend.emails.send({
    from,
    to: [TO],
    subject: sample.subject,
    html: sample.html,
  });
  if (error) {
    console.error("FAIL", sample.subject, error);
    process.exitCode = 1;
  } else {
    console.log("OK", sample.subject, data?.id);
  }
  await new Promise((r) => setTimeout(r, 600));
}
