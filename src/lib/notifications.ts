import { sendEmail } from "./email/send";
import { formatNightLabel, getNight } from "./nights";

type BookingReminder = {
  fullName: string;
  email: string;
  nightId: string;
  ref: string;
  venue?: string;
};

export async function sendBookingReminder(reminder: BookingReminder) {
  const night = getNight(reminder.nightId);
  if (!night) return;

  const firstName = reminder.fullName.split(" ")[0] || "there";
  const nightLabel = formatNightLabel(night);

  const subject = `Tomorrow: ${nightLabel} · ${reminder.ref}`;
  const text = `Hi ${firstName},\n\nYour PullUp is tomorrow!\n\n${nightLabel}\nTime: ${night.time}\n${reminder.venue ? `Venue: ${reminder.venue}` : "Venue details will be sent in the morning"}\n\nSee you there!\n\n— PullUp`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Tomorrow: Pull Up!</h2>
      <p>Hi ${firstName},</p>
      <p>Your PullUp is tomorrow! Here are the details:</p>
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-weight: 600;">${nightLabel}</p>
        <p style="margin: 8px 0 0; color: #666;">Time: ${night.time}</p>
        <p style="margin: 8px 0 0; color: #666;">Ref: ${reminder.ref}</p>
        ${reminder.venue ? `<p style="margin: 8px 0 0; color: #666;">Venue: ${reminder.venue}</p>` : ""}
      </div>

      ${!reminder.venue ? '<p style="color: #666; font-size: 14px;">Exact venue details will land in your inbox the morning of the event.</p>' : ""}
      
      <p>See you there!</p>
      <p style="color: #999; font-size: 14px; margin-top: 32px;">— PullUp</p>
    </div>
  `;

  await sendEmail({
    to: reminder.email,
    payload: { subject, text, html },
  });
}

export async function sendVenueDetails(params: {
  fullName: string;
  email: string;
  nightId: string;
  ref: string;
  venue: {
    name: string;
    address: string;
    mapsLink?: string;
  };
}) {
  const night = getNight(params.nightId);
  if (!night) return;

  const firstName = params.fullName.split(" ")[0] || "there";
  const nightLabel = formatNightLabel(night);

  const subject = `Venue: ${params.venue.name} · ${nightLabel}`;
  const text = `Hi ${firstName},\n\nYour table is set!\n\n${params.venue.name}\n${params.venue.address}\n${params.venue.mapsLink || ""}\n\nTime: ${night.time}\nRef: ${params.ref}\n\nSee you tonight!\n\n— PullUp`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Your table is set!</h2>
      <p>Hi ${firstName},</p>
      
      <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; font-size: 18px; font-weight: 600;">${params.venue.name}</p>
        <p style="margin: 8px 0 0; color: #666;">${params.venue.address}</p>
        ${params.venue.mapsLink ? `<p style="margin: 12px 0 0;"><a href="${params.venue.mapsLink}" style="color: #0066cc;">📍 Open in Maps</a></p>` : ""}
        <hr style="border: none; border-top: 1px solid #ddd; margin: 16px 0;" />
        <p style="margin: 0; color: #666;">Time: ${night.time}</p>
        <p style="margin: 8px 0 0; color: #666;">Ref: ${params.ref}</p>
      </div>

      <p>Arrive on time. Table for ${night.seatsTotal}. Everyone arrives alone.</p>
      <p>See you tonight!</p>
      <p style="color: #999; font-size: 14px; margin-top: 32px;">— PullUp</p>
    </div>
  `;

  await sendEmail({
    to: params.email,
    payload: { subject, text, html },
  });
}

export async function send24HourReminder(bookings: BookingReminder[]) {
  const sent: string[] = [];
  const failed: string[] = [];

  for (const booking of bookings) {
    try {
      await sendBookingReminder(booking);
      sent.push(booking.ref);
    } catch (err) {
      console.error(`Failed to send reminder for ${booking.ref}:`, err);
      failed.push(booking.ref);
    }
  }

  return { sent, failed };
}

export async function sendSMSReminder(params: {
  phone: string;
  message: string;
}) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("Twilio not configured - SMS reminders disabled");
    return;
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;
  
  const body = new URLSearchParams({
    To: params.phone,
    From: process.env.TWILIO_FROM_NUMBER || "",
    Body: params.message,
  });

  const response = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`SMS failed: ${response.statusText}`);
  }

  return await response.json();
}
