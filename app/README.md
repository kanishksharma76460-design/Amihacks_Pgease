# PGease — PG Business Manager

A two-sided prototype: **tenants** search verified PGs by commute and budget, and
**PG owners** run the whole business — rooms & tenants, billing, GST-compliant
receipts, payment tracking, electricity, meal plans, compliance — and receive
tenant leads.

Built from the research in [`../research/`](../research/) — every feature maps to a
documented pain point or regulatory requirement (see
[`../research/06-product-opportunity.md`](../research/06-product-opportunity.md)).

---

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # type-check + production build
pnpm preview    # serve the production build
```

Node 20.19+ required (built on Node 25 / pnpm 10).

---

## What it does today (MVP)

| Module | Route | What you get |
|---|---|---|
| Landing | `#/` | Two-sided entry — tenants vs owners |
| Explore | `#/explore` | Tenant search: locality, commute, filters, live map |
| Listing detail | `#/listing/:id` | Photos, pricing, compliance, reviews, request-a-visit |
| Login / Onboarding | `#/login` | Owner sign-in + property verification wizard (GST, photos, GPS) |
| Dashboard | `#/dashboard` | Occupancy, rent roll, collections, outstanding dues, compliance alerts |
| Leads | `#/leads` | Tenant enquiries from listings (fills from request-a-visit) |
| Properties | `#/properties` | Add / remove the buildings you manage |
| Rooms & Tenants | `#/rooms` | Bed-level inventory, move-in, vacate |
| Billing | `#/billing` | Generate monthly bills, add charges, record payments |
| Payments | `#/payments` | Every collection across UPI / cash / bank |
| Receipts | `#/receipts` | Auto-generated GST-compliant receipts, printable |
| Electricity | `#/electricity` | Sub-meter readings → units used → add to bill |
| Food | `#/food` | Meal plans + per-tenant assignment |
| Compliance | `#/compliance` | Trade licence, Fire NOC, FSSAI, police Form-A with expiry alerts |

### The GST engine

Bills compute GST automatically using the rules from
[`../research/04-regulations.md`](../research/04-regulations.md):

- **Zero GST** when rent ≤ ₹20,000/person/month **and** continuous stay ≥ 90 days
  (Entry 12AA, Notification 12/2017-CT(R)).
- **12% GST** (SAC 9963) otherwise.
- **Electricity** is billed as a pass-through (no GST); rent/food/other charges are taxable.
- Every receipt prints the applicable declaration.

> Demo data intentionally shows both cases: two long-stay tenants at zero GST, and
> one short-stay / >₹20,000 tenant at 12%.

---

## Dark mode

A light/dark theme toggle lives in the sidebar (and mobile header). The preference
is persisted and follows the system setting on first load. All components use
Tailwind `dark:` variants; the `dark` class is toggled on `<html>`.

## Owner login & fraud-prevention verification

Before entering the app, owners sign up through a 4-step wizard:

1. **Owner** — business name, owner name, phone (for OTP)
2. **Property** — name, address, PIN code
3. **Verification** — GSTIN (15-char format validated), up to 3 property photos
   (downscaled in-browser), and GPS location capture
4. **Review** — submit for verification

New sign-ups stay in **verification pending** until an admin approves; a banner
shows this in the app. The demo owner (phone `9000000000`) is pre-verified.

> ⚠️ **This is a front-end simulation.** Data is stored in `localStorage` and there
> is no real admin review yet. See below for the production plan.

### How to make verification real (production plan)

| Step | What it does | Tooling |
|---|---|---|
| Phone OTP | Proves the owner controls the number | MSG91 / Twilio / AWS SNS |
| GSTIN lookup | Cross-checks the GST number against the owner's legal name | GST portal / Cleartax / Razorpay GST API |
| Photo review | Human or AI checks photos match the listed address | Admin queue, image-matching API |
| GPS cross-check | Compares captured location with entered address/PIN | Reverse geocoding (Google Maps API) |
| KYC | Optional Aadhaar/DigiLocker consent verification | DigiLocker / Setu / Signzy |
| Document storage | Stores GST certificate + photos securely | S3 / Cloudinary |
| Admin approval | Review dashboard with approve/reject | Admin UI + DB flag |

---

## Stack

- **React 19 + TypeScript + Vite 7**
- **Tailwind CSS v4** (CSS-first config, no `tailwind.config.js`)
- **React Router v7** (hash-based, so it works on any static host)
- **Zustand** with `persist` — all data lives in `localStorage`
- **lucide-react** icons

### Why no backend yet

The MVP persists to `localStorage` so it runs anywhere with zero setup and works
offline. The data layer is isolated in [`src/lib/store.ts`](src/lib/store.ts) —
swap the store for API calls without touching the UI.

---

## Architecture

```
src/
  main.tsx            entry (HashRouter)
  App.tsx             routes
  lib/
    types.ts          domain types
    utils.ts          currency, dates, GST rules
    store.ts          Zustand store + seed data + all actions
  components/
    Layout.tsx        sidebar (desktop) + top tabs (mobile)
    ui.tsx            Button, Card, Modal, Badge, StatCard, table cells…
  pages/
    Dashboard.tsx
    Properties.tsx
    Rooms.tsx
    Billing.tsx
    Payments.tsx
    Receipts.tsx
    ReceiptView.tsx
    Electricity.tsx
    Food.tsx
    Compliance.tsx
```

---

## Roadmap (next steps, in priority order)

1. **Legal blocker first** — confirm whether a PG/hostel licence permits short-stay
   transient guests (see `../research/07-open-questions.md` #G1) before building any
   tourism feature.
2. **Real backend** — Postgres + auth (owner/caretaker roles), replace the Zustand
   store's actions with API calls.
3. **Multi-property + roles** — owners vs caretakers with per-property permissions.
4. **UPI payment collection** — generate a UPI QR per bill, webhook reconciliation.
5. **PWA install + offline** — manifest + service worker (the current hash-router +
   localStorage setup is already PWA-friendly).
6. **WhatsApp integration** — the research shows WhatsApp is the incumbent channel
   for rent collection in this market.
7. **Tenant + parent portals** — view bill, pay, raise requests.
8. **Short-stay / tourism mode** — the demand side, gated on the licence question above.

## Notes

- The GSTIN in demo data (`36AAAAA0000A1Z5`) is a placeholder.
- Reset the demo dataset any time from the sidebar → "Reset demo data".
