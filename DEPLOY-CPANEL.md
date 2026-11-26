# Deploy PullUp to shared cPanel (gopullup.ng)

This app needs **Node.js** (not plain PHP static hosting). Use cPanel → **Setup Node.js App**.

## 1. Pack locally

```bash
npm run pack:cpanel
```

Upload `dist-cpanel/gopullup-cpanel.zip` via File Manager and extract into the Node app root.

## 2. Create Node app

| Setting | Value |
|---------|--------|
| Node.js version | **20.x** (or 18+) |
| Application root | e.g. `gopullup` |
| Application URL | `gopullup.ng` |
| Startup file | **`server.js`** |
| Mode | Production |

## 3. Environment variables

Set in the Node.js App UI (preferred) or a `.env` file in the app root:

```env
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
MONGODB_URI=mongodb+srv://...@cluster0.xxxxx.mongodb.net/pullup?retryWrites=true&w=majority
RESEND_API_KEY=re_...
EMAIL_FROM=PullUp <hello@gopullup.ng>
NEXT_PUBLIC_SITE_URL=https://gopullup.ng
OPS_DASHBOARD_SECRET=long-random-secret
NODE_ENV=production
```

### Still required from you

1. **MongoDB** — replace the `CLUSTER` placeholder with your real Atlas host. In Atlas → Network Access, allow the server IP (or `0.0.0.0/0` on shared hosting).
2. **Resend** — Domains → add `gopullup.ng` → copy DNS (SPF/DKIM) into cPanel Zone Editor → wait for Verified → create API key → set `RESEND_API_KEY`. Until verified, you can temporarily use `EMAIL_FROM=PullUp <onboarding@resend.dev>` (sends only to your Resend account email).
3. **Paystack** — live keys already in local env; set the same on the server. Dashboard site URL / callbacks → `https://gopullup.ng`.

## 4. Install & build on the server

In cPanel Node terminal or SSH:

```bash
npm install --omit=dev
npm run build
```

Then **Restart** the application.

## 5. Point the domain

- Document root / proxy should hit the Node app (cPanel usually wires this when Application URL = domain).
- SSL: AutoSSL or Let’s Encrypt for `gopullup.ng`.

## 6. Smoke test

- https://gopullup.ng  
- https://gopullup.ng/api/health → should show `mongodb` / `paystack` / `resend` true once env is set  
- https://gopullup.ng/ops → ops key  
- Submit community / apply → check Mongo + Resend delivery  

## Emails wired

| Event | Template |
|-------|----------|
| Apply | Welcome |
| Booking paid | Seat locked |
| Pass paid | Pass is live |
| Waitlist | You’re on the list |
| Reconnect ask | Pull Up again? |
| Reconnect yes | You’re connected |
| Community (with email) | Community seat saved |
