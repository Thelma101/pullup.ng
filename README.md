# PullUp.ng

Invite-only small-group dinners in **Lagos** and **Abuja**.  
Pull up. We pick the people. You show up.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Local JSON storage for applications & seat holds (`data/`)
- Paystack wiring left as next upgrade

## Run locally

```bash
cd branch-ng
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What’s in the app

| Route | Purpose |
|-------|---------|
| `/` | Brand landing |
| `/apply` | Invite application → WhatsApp verify flow |
| `/how` | How PullUp works |
| `/nights` | Lagos / Abuja calendar |
| `/nights/[id]` | Hold a seat |
| `/fee` | Seat fee + future 3×/month pass |
| `/safety` | Trust guardrails |
| `/thanks` | Post-apply |
| `/booked` | Post-hold confirmation |

Applications land in `data/applications.json`.  
Bookings land in `data/bookings.json`.

## Product decisions baked in

- Solo / tiny ops · invite-only · dual city
- Seat fee first; PullUp Pass (up to 3 nights/month) later
- City WhatsApp groups stay separate
