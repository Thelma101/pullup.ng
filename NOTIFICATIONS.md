# PullUp Notifications System

## Overview

Automated email and SMS reminder system for upcoming events and venue details.

## Email Reminders

### 24-Hour Reminder
Sent automatically 24 hours before an event to all paid bookings.

**Endpoint**: `POST /api/notifications/reminders`

**Authentication**: Bearer token (use `CRON_SECRET` or `OPS_DASHBOARD_SECRET`)

**Example**:
```bash
curl -X POST https://gopullup.ng/api/notifications/reminders \
  -H "Authorization: Bearer your-secret-here"
```

**Response**:
```json
{
  "message": "Sent 5 reminders for tomorrow's events",
  "sent": ["PU-LA-123456", "PU-AB-123457"],
  "failed": [],
  "date": "2026-11-28"
}
```

### Venue Details
Send venue information to all paid attendees of a specific event.

**Endpoint**: `POST /api/notifications/venue`

**Authentication**: Bearer token (use `CRON_SECRET` or `OPS_DASHBOARD_SECRET`)

**Payload**:
```json
{
  "nightId": "lagos-dinner-nov-22",
  "venue": {
    "name": "Terra Kulture",
    "address": "1376 Tiamiyu Savage St, Victoria Island, Lagos",
    "mapsLink": "https://maps.google.com/?q=Terra+Kulture+Lagos"
  }
}
```

**Example**:
```bash
curl -X POST https://gopullup.ng/api/notifications/venue \
  -H "Authorization: Bearer your-secret-here" \
  -H "Content-Type: application/json" \
  -d '{
    "nightId": "lagos-dinner-nov-22",
    "venue": {
      "name": "Terra Kulture",
      "address": "1376 Tiamiyu Savage St, Victoria Island, Lagos",
      "mapsLink": "https://maps.google.com/?q=Terra+Kulture+Lagos"
    }
  }'
```

## SMS Reminders (Optional)

Requires Twilio configuration. Set these environment variables:

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_FROM_NUMBER=+1234567890
```

## Scheduled Jobs

### Recommended Cron Schedule

**24-hour reminders** (runs daily at 10 AM):
```
0 10 * * * curl -X POST https://gopullup.ng/api/notifications/reminders -H "Authorization: Bearer $CRON_SECRET"
```

**Venue details** (manual trigger via ops dashboard or API call)

## Member Preferences

Members can control notification preferences from their profile at `/me`:

- Email notifications (booking confirmations, venue details, reminders)
- SMS reminders (day-of text messages)
- New hangout alerts (marketing emails for new events)

## Testing Locally

1. Set `CRON_SECRET` in `.env.local`
2. Create a booking for tomorrow's date
3. Call the reminders endpoint:

```bash
curl -X POST http://localhost:3000/api/notifications/reminders \
  -H "Authorization: Bearer your-local-secret"
```

## Production Setup

1. Add `CRON_SECRET` to environment variables
2. Configure cron job or use a service like:
   - Vercel Cron Jobs
   - GitHub Actions scheduled workflows
   - External cron service (cron-job.org, EasyCron)
3. Optional: Add Twilio credentials for SMS
4. Test with a staging event first

## Notes

- Reminders only sent to bookings with `paymentStatus: "paid"`
- Venue details must be sent manually via API (ops decision per event)
- Failed sends are logged and returned in response
- Email is powered by Resend (configured via `RESEND_API_KEY`)
