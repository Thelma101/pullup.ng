/** Writes HTML previews you can open in a browser (no Resend needed). */
import { mkdirSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
// Run via: node --experimental-strip-types won't work for TS easily.
// Duplicate minimal HTML here for file previews.
const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../email-previews");
mkdirSync(outDir, { recursive: true });

const site = "https://gopullup.ng";
function layout({ preheader, title, bodyHtml, cta }) {
  const ctaHtml = cta
    ? `<p style="margin:28px 0 8px;"><a href="${cta.href}" style="display:inline-block;background:#0d9488;color:#fff;font-family:Georgia,serif;font-size:16px;text-decoration:none;padding:14px 28px;border-radius:999px;">${cta.label}</a></p>`
    : "";
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title></head>
<body style="margin:0;background:#e8eef1;">
<div style="display:none">${preheader}</div>
<table width="100%" style="background:#e8eef1;padding:32px 12px;"><tr><td align="center">
<table width="560" style="max-width:560px;background:#fff;border-radius:20px;border:1px solid #d5dee4;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0b1c2c,#1a3347 55%,#0e7490);padding:28px 32px;">
<p style="margin:0;font-family:Arial;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#9fd4d0;">PullUp</p>
<p style="margin:10px 0 0;font-family:Georgia,serif;font-size:28px;color:#fff;">${title}</p>
</td></tr>
<tr><td style="padding:32px;font-family:Arial;font-size:16px;line-height:1.65;color:#0b1c2c;">${bodyHtml}${ctaHtml}</td></tr>
<tr><td style="padding:20px 32px 28px;border-top:1px solid #e8eef1;font-size:12px;color:#5a6a78;font-family:Arial;">
Invite-only hangouts · <a href="${site}" style="color:#0e7490;text-decoration:none;">gopullup.ng</a>
</td></tr></table></td></tr></table></body></html>`;
}
const p = (t) => `<p style="margin:0 0 16px;">${t}</p>`;
const note = (t) =>
  `<p style="margin:20px 0 0;padding:14px 16px;background:#f4f7f8;border-left:3px solid #0d9488;border-radius:0 10px 10px 0;font-size:14px;">${t}</p>`;

const files = {
  "01-welcome.html": layout({
    preheader: "Your seat at the table starts here.",
    title: "You’re in.",
    bodyHtml:
      p("Hi Thelma,") +
      p("Glad you applied. PullUp is small tables, real conversation, and evenings that don’t feel like work or a dating app.") +
      note("Your referral code: <strong>PUTHELMA9X2A</strong>"),
    cta: { label: "See hangouts", href: `${site}/nights` },
  }),
  "02-booking-confirmed.html": layout({
    preheader: "Venue comes the morning of.",
    title: "Seat locked.",
    bodyHtml:
      p("Hi Thelma,") +
      p("You’re booked for <strong>Dinner · Lekki · Saturday, 22 November</strong>. Ref <strong>PU-DEMO-1042</strong>. Paid <strong>₦8,000</strong>.") +
      note("Exact venue drops the morning of your hangout."),
    cta: { label: "Open my home", href: `${site}/me` },
  }),
  "03-pass-confirmed.html": layout({
    preheader: "3 hangouts on your Pass.",
    title: "Pass is live.",
    bodyHtml: p("Hi Thelma,") + p("Your <strong>3 hangouts / month</strong> Pass is ready. Paid ₦20,000."),
    cta: { label: "Book a hangout", href: `${site}/nights` },
  }),
  "04-waitlist-joined.html": layout({
    preheader: "We’ll ping you if a seat opens.",
    title: "You’re on the list.",
    bodyHtml: p("Hi Thelma,") + p("<strong>Drinks · Ikoyi</strong> is full. If someone drops, you hear first."),
    cta: { label: "Browse other nights", href: `${site}/nights` },
  }),
  "05-waitlist-seat-open.html": layout({
    preheader: "A seat just opened.",
    title: "A seat opened.",
    bodyHtml: p("Hi Thelma,") + p("Someone released a spot for <strong>Drinks · Ikoyi</strong>. Grab it while it’s yours."),
    cta: { label: "Book this seat", href: `${site}/nights` },
  }),
  "06-reconnect-ask.html": layout({
    preheader: "Ada asked to reconnect — your call.",
    title: "Pull Up again?",
    bodyHtml:
      p("Hi Thelma,") +
      p("<strong>Ada Okafor</strong> sat at your table and would like to reconnect.") +
      note("They said: “Loved our chat about food markets — would be fun to continue.”"),
    cta: { label: "Respond here", href: `${site}/again/validate?token=preview` },
  }),
  "07-reconnect-intro.html": layout({
    preheader: "Meet Ada — you’re both in.",
    title: "You’re connected.",
    bodyHtml:
      p("Hi Thelma,") +
      p("Both of you said yes. Here’s how to reach <strong>Ada Okafor</strong>:") +
      note('<a href="mailto:ada@example.com" style="color:#0e7490;font-weight:600;">ada@example.com</a>'),
    cta: { label: "Back to PullUp", href: site },
  }),
  "08-venue-details.html": layout({
    preheader: "Nok by Alara · 7:00 PM",
    title: "Here’s the spot.",
    bodyHtml:
      p("Hi Thelma,") +
      p("Morning-of drop for <strong>Dinner · Lekki</strong>.") +
      note("<strong>Nok by Alara</strong> · Victoria Island · 7:00 PM"),
    cta: { label: "Open in Maps", href: "https://maps.google.com" },
  }),
  "09-community-welcome.html": layout({
    preheader: "Hangout drops and flash seats.",
    title: "Community seat saved.",
    bodyHtml:
      p("Hi Thelma,") +
      p("We got your join request. You’ll land in the WhatsApp community shortly."),
    cta: { label: "Book a hangout", href: `${site}/nights` },
  }),
};

for (const [name, html] of Object.entries(files)) {
  writeFileSync(resolve(outDir, name), html, "utf8");
  console.log("wrote", name);
}
console.log(`\nOpen folder: ${outDir}`);
