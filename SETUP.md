# PullUp Setup Guide

## Required Environment Variables

Before running the application, you need to configure these environment variables:

### 1. Database (Required)

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/pullup?retryWrites=true&w=majority
```

**How to set up MongoDB:**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address (allow `0.0.0.0/0` for development)
5. Click "Connect" → "Connect your application"
6. Copy the connection string and replace `<password>` with your password

### 2. Email (Required for production)

```env
RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE
EMAIL_FROM=PullUp <hello@gopullup.ng>
```

**How to set up Resend:**
1. Sign up at [Resend](https://resend.com)
2. Add and verify your domain (or use `onboarding@resend.dev` for testing)
3. Create an API key
4. Add the key to your `.env.local`

### 3. Payments (Required for bookings)

```env
PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=YOUR_PAYSTACK_PUBLIC_KEY
```

**How to set up Paystack:**
1. Sign up at [Paystack](https://paystack.com)
2. Go to Settings → API Keys & Webhooks
3. Copy both test and live keys
4. Use test keys for development, live keys for production

### 4. Site URL

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, set this to your actual domain: `https://gopullup.ng`

### 5. Operations Dashboard

```env
OPS_DASHBOARD_SECRET=your-long-random-secret-here
```

Generate a secure random string for production.

### 6. Optional: Test Mode

```env
NEXT_PUBLIC_TEST_MODE=false
```

Set to `true` to use ₦2,000 pricing for all bookings (development only).

### 7. Optional: SMS Notifications

```env
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER=YOUR_TWILIO_PHONE_NUMBER
```

Only needed if you want to send SMS reminders via Twilio.

### 8. Optional: Automated Reminders

```env
CRON_SECRET=YOUR_RANDOM_CRON_SECRET
```

Used to authenticate cron job requests for automated email reminders.

## Quick Start

1. **Clone and install:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Troubleshooting

### "Database not configured" error

**Problem:** You see this error when trying to create an account or book a seat.

**Solution:** 
1. Make sure `MONGODB_URI` is set in your `.env.local`
2. Check that your MongoDB cluster is running
3. Verify IP address is whitelisted in MongoDB Atlas
4. Test the connection string in MongoDB Compass

### Application form hangs or times out

**Problem:** Form submission takes forever and fails.

**Solutions:**
1. Check MongoDB is accessible (Network Access settings)
2. Verify your connection string has the correct password
3. Check the browser console for detailed error messages
4. Check server logs for database connection errors

### Email not sending

**Problem:** Welcome emails or reminders not arriving.

**Solution:**
1. Verify `RESEND_API_KEY` is set
2. Check domain is verified in Resend dashboard
3. For testing, use `onboarding@resend.dev` as FROM address
4. Check spam folder

### Payments not working

**Problem:** Paystack checkout not loading.

**Solution:**
1. Verify both secret and public keys are set
2. Make sure you're using matching keys (both test or both live)
3. Check Paystack dashboard for API status

## Production Checklist

Before deploying to production:

- [ ] Set all required environment variables
- [ ] Use live Paystack keys (not test keys)
- [ ] Verify domain with Resend
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Set `NEXT_PUBLIC_TEST_MODE=false`
- [ ] Set strong `OPS_DASHBOARD_SECRET`
- [ ] Set up MongoDB backups
- [ ] Configure IP whitelist in MongoDB
- [ ] Test all flows (signup, booking, payment)
- [ ] Set up cron jobs for reminders (see NOTIFICATIONS.md)

## Development Tips

- Use test mode (`NEXT_PUBLIC_TEST_MODE=true`) for ₦2k test bookings
- Use Paystack test keys for development
- Use `onboarding@resend.dev` for email testing
- Check `.next/server` logs for detailed error messages
- Use MongoDB Compass to view database directly

## Need Help?

- MongoDB: https://docs.mongodb.com/atlas/
- Resend: https://resend.com/docs
- Paystack: https://paystack.com/docs
- Next.js: https://nextjs.org/docs

For PullUp-specific issues, check the terminal output and browser console for detailed error messages.
