import { emailLayout, metaRow, note, p } from "./layout";

const site = () => process.env.NEXT_PUBLIC_SITE_URL || "https://gopullup.ng";

export type EmailPayload = { subject: string; html: string; text: string };

export function welcomeEmail(args: { firstName: string; referralCode: string }): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `You’re in, ${first} — welcome to PullUp`,
    text: `Hi ${first},\n\nYour application is in. Browse hangouts when you’re ready: ${site()}/nights\nYour referral code: ${args.referralCode}\n\n— PullUp`,
    html: emailLayout({
      preheader: "Your seat at the table starts here.",
      title: "You’re in.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`Glad you applied. PullUp is small tables, real conversation, and evenings that don’t feel like work or a dating app.`),
        p(`When you’re ready, pick a hangout and book a seat. Venue lands the morning of — we keep it that way on purpose.`),
        note(`Your referral code: <strong>${args.referralCode}</strong> · friends who join with it get ₦2,000 credit.`),
      ].join(""),
      cta: { label: "See hangouts", href: `${site()}/nights` },
    }),
  };
}

export function bookingConfirmedEmail(args: {
  firstName: string;
  ref: string;
  nightLabel: string;
  feeLabel: string;
}): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Seat locked · ${args.nightLabel}`,
    text: `Hi ${first},\n\nYour seat is booked for ${args.nightLabel}. Ref: ${args.ref}. Amount: ${args.feeLabel}.\nVenue details arrive the morning of.\n\nMember home: ${site()}/me`,
    html: emailLayout({
      preheader: "You’re on the table. Venue comes the morning of.",
      title: "Seat locked.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`You’re booked. Show up curious; we’ll handle the matching.`),
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 4px;">
          ${metaRow("Hangout", args.nightLabel)}
          ${metaRow("Reference", args.ref)}
          ${metaRow("Paid", args.feeLabel)}
        </table>`,
        note(`Exact venue drops the morning of your hangout — check this inbox.`),
      ].join(""),
      cta: { label: "Open my home", href: `${site()}/me` },
    }),
  };
}

export function passConfirmedEmail(args: {
  firstName: string;
  planLabel: string;
  credits: number;
  amountLabel: string;
}): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Pass active · ${args.credits} hangouts ready`,
    text: `Hi ${first},\n\nYour ${args.planLabel} Pass is active (${args.credits} credits). Paid ${args.amountLabel}.\nBook: ${site()}/nights`,
    html: emailLayout({
      preheader: `${args.credits} hangouts on your Pass.`,
      title: "Pass is live.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`Your Pass is ready. Credits apply at checkout — no coupon hunting.`),
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 4px;">
          ${metaRow("Plan", args.planLabel)}
          ${metaRow("Credits", String(args.credits))}
          ${metaRow("Paid", args.amountLabel)}
        </table>`,
      ].join(""),
      cta: { label: "Book a hangout", href: `${site()}/nights` },
    }),
  };
}

export function waitlistJoinedEmail(args: { firstName: string; nightLabel: string }): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Waitlist · ${args.nightLabel}`,
    text: `Hi ${first},\n\nYou’re on the waitlist for ${args.nightLabel}. If a seat opens, we’ll email you first.\n\n— PullUp`,
    html: emailLayout({
      preheader: "We’ll ping you if a seat opens.",
      title: "You’re on the list.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`<strong>${args.nightLabel}</strong> is full right now. If someone drops, you hear from us before it goes public.`),
        note(`Flash seats move fast — keep an eye on this inbox.`),
      ].join(""),
      cta: { label: "Browse other nights", href: `${site()}/nights` },
    }),
  };
}

export function waitlistSeatOpenEmail(args: {
  firstName: string;
  nightLabel: string;
  bookUrl: string;
}): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Seat open · ${args.nightLabel}`,
    text: `Hi ${first},\n\nA seat opened for ${args.nightLabel}. Book now: ${args.bookUrl}\n\n— PullUp`,
    html: emailLayout({
      preheader: "A seat just opened. Grab it while it’s yours.",
      title: "A seat opened.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`Someone released a spot for <strong>${args.nightLabel}</strong>. It’s yours to take — or it’ll go to the next person on the list.`),
      ].join(""),
      cta: { label: "Book this seat", href: args.bookUrl },
    }),
  };
}

export function reconnectAskEmail(args: {
  targetFirstName: string;
  fromName: string;
  validateUrl: string;
  noteText?: string;
}): EmailPayload {
  const target = args.targetFirstName || "there";
  return {
    subject: `${args.fromName} wants to Pull Up again`,
    text: `Hi ${target},\n\n${args.fromName} would like to reconnect after your table.\nConfirm here: ${args.validateUrl}\n\nIf you’d rather not, you can decline on that page. We only share emails if you say yes.`,
    html: emailLayout({
      preheader: `${args.fromName} asked to reconnect — your call.`,
      title: "Pull Up again?",
      bodyHtml: [
        p(`Hi ${target},`),
        p(`<strong>${args.fromName}</strong> sat at your table and would like to reconnect.`),
        args.noteText ? note(`They said: “${args.noteText}”`) : "",
        p(`If you say yes, we introduce you both by email. If not, nothing happens — no awkwardness on us.`),
      ].join(""),
      cta: { label: "Respond here", href: args.validateUrl },
    }),
  };
}

export function reconnectIntroEmail(args: {
  toName: string;
  otherName: string;
  otherEmail: string;
}): EmailPayload {
  const to = args.toName || "there";
  return {
    subject: `You’re connected · ${args.otherName}`,
    text: `Hi ${to},\n\nYou’re connected with ${args.otherName} (${args.otherEmail}). Take it from here.\n\n— PullUp`,
    html: emailLayout({
      preheader: `Meet ${args.otherName} — you’re both in.`,
      title: "You’re connected.",
      bodyHtml: [
        p(`Hi ${to},`),
        p(`Both of you said yes. Here’s how to reach <strong>${args.otherName}</strong>:`),
        note(`<a href="mailto:${args.otherEmail}" style="color:#0e7490;font-weight:600;text-decoration:none;">${args.otherEmail}</a>`),
        p(`From here it’s between you — coffee, another dinner, or just a hello.`),
      ].join(""),
      cta: { label: "Back to PullUp", href: site() },
    }),
  };
}

export function venueDetailsEmail(args: {
  firstName: string;
  nightLabel: string;
  venueName: string;
  venueArea: string;
  time: string;
  mapsUrl?: string;
}): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Tonight’s spot · ${args.venueName}`,
    text: `Hi ${first},\n\nVenue for ${args.nightLabel}: ${args.venueName}, ${args.venueArea}. Time: ${args.time}.\n${args.mapsUrl || ""}\n\nSee you there.`,
    html: emailLayout({
      preheader: `${args.venueName} · ${args.time}`,
      title: "Here’s the spot.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`Morning-of drop for <strong>${args.nightLabel}</strong>. Arrive on time; the table starts together.`),
        `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 4px;">
          ${metaRow("Venue", args.venueName)}
          ${metaRow("Area", args.venueArea)}
          ${metaRow("Time", args.time)}
        </table>`,
        note(`Food & drinks are on you (from about ₦15,000). Come as yourself.`),
      ].join(""),
      cta: args.mapsUrl
        ? { label: "Open in Maps", href: args.mapsUrl }
        : { label: "Member home", href: `${site()}/me` },
    }),
  };
}

export function communityWelcomeEmail(args: { firstName: string }): EmailPayload {
  const first = args.firstName || "there";
  return {
    subject: `Welcome to the PullUp community`,
    text: `Hi ${first},\n\nYou’re on the WhatsApp community list. We’ll add you shortly.\nHangouts: ${site()}/nights`,
    html: emailLayout({
      preheader: "Hangout drops and flash seats, in one place.",
      title: "Community seat saved.",
      bodyHtml: [
        p(`Hi ${first},`),
        p(`We got your join request. You’ll land in the WhatsApp community shortly — hangout drops, flash seats, area vibes.`),
        p(`Want a real table sooner? Book a hangout anytime.`),
      ].join(""),
      cta: { label: "Book a hangout", href: `${site()}/nights` },
    }),
  };
}

/** All templates with sample data — for previews / ops review */
export function allPreviewEmails(toName = "Thelma") {
  const first = toName;
  return [
    { key: "welcome", ...welcomeEmail({ firstName: first, referralCode: "PUTHELMA9X2A" }) },
    {
      key: "booking",
      ...bookingConfirmedEmail({
        firstName: first,
        ref: "PU-DEMO-1042",
        nightLabel: "Dinner · Lekki · Sat 22 Nov",
        feeLabel: "₦8,000",
      }),
    },
    {
      key: "pass",
      ...passConfirmedEmail({
        firstName: first,
        planLabel: "3 hangouts / month",
        credits: 3,
        amountLabel: "₦20,000",
      }),
    },
    {
      key: "waitlist",
      ...waitlistJoinedEmail({ firstName: first, nightLabel: "Drinks · Ikoyi · Fri 28 Nov" }),
    },
    {
      key: "waitlist-open",
      ...waitlistSeatOpenEmail({
        firstName: first,
        nightLabel: "Drinks · Ikoyi · Fri 28 Nov",
        bookUrl: `${site()}/nights/demo-night`,
      }),
    },
    {
      key: "reconnect-ask",
      ...reconnectAskEmail({
        targetFirstName: first,
        fromName: "Ada Okafor",
        validateUrl: `${site()}/again/validate?token=preview`,
        noteText: "Loved our chat about food markets — would be fun to continue.",
      }),
    },
    {
      key: "reconnect-intro",
      ...reconnectIntroEmail({
        toName: first,
        otherName: "Ada Okafor",
        otherEmail: "ada@example.com",
      }),
    },
    {
      key: "venue",
      ...venueDetailsEmail({
        firstName: first,
        nightLabel: "Dinner · Lekki · Sat 22 Nov",
        venueName: "Nok by Alara",
        venueArea: "Victoria Island",
        time: "7:00 PM",
        mapsUrl: "https://maps.google.com",
      }),
    },
    { key: "community", ...communityWelcomeEmail({ firstName: first }) },
  ] as const;
}
