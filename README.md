# Hyderabad PG + Tourism Platform — Research Base

Research compiled **22 September 2026** to support the design of an application serving
Hyderabad's PG (paying guest) / co-living market and the city's tourism economy.

---

## How to read this research

Every factual claim is tagged with a confidence level. **Do not remove these tags** — several
published figures in this space contradict each other and the tags are how we keep track.

| Tag | Meaning |
|---|---|
| `[VERIFIED]` | Source page was actually fetched and read in full |
| `[SNIPPET]` | Search-result excerpt only — **verify before citing externally** |
| `[ESTIMATE]` | Comes from a market-research firm (Mordor, Colliers, etc.), not a census/registry |
| `[UNVERIFIED]` | Could not be confirmed. **Do not cite.** Listed so we know what to go get |
| ⚠️ | Known conflict or data-integrity problem |

---

## Executive summary — the 12 numbers that matter

### The PG market

1. **Organised co-living serves under 5% of demand** in India. Demand ≈ **6.6 million beds**;
   organised supply ≈ **300,000 beds** `[VERIFIED — Colliers India, May 2025]`
2. Hyderabad co-living (single occupancy) rents **₹10,500–17,300/month** vs **₹14,000–26,500**
   for a 1BHK — a **25–35% cost advantage** `[VERIFIED — Colliers, Apr 2025]`
3. **~35,000 organised co-living beds** in Hyderabad `[ESTIMATE — Everything Coliving]`
4. **1,500+ IT/ITES companies**, **9.39 lakh direct IT jobs**, **~400 GCCs** employing 3 lakh+
   `[VERIFIED — Deccan Herald, 21 Mar 2026]`
5. **447 women's hostels** audited in the Hyderabad Police Commissionerate alone
   `[VERIFIED — NewsMeter, 18 Jul 2026]`
6. **Only 44%** of audited hostels had a valid GHMC trade licence; **62% scored below 40/100**;
   **0% had a fire exit plan** `[VERIFIED — Project Safe Stay, Jul 2026]`

### The tourism market

7. Tourism is a **₹1,224 crore line item** in Telangana's **₹3.24 lakh crore** budget —
   about **0.38%** of state spending `[SNIPPET — Mar 2026]`
8. Domestic visits fell from **8.82 crore (2024) → 8.48 crore (2025)**, a **−3.9% reversal**
   the government does not explain `[VERIFIED — New Indian Express, 3 Sep 2026]`
9. **98.9%** of Telangana's foreign tourists visit Hyderabad and nearby districts
   `[VERIFIED — The Hans India, 4 Dec 2025]`
10. RGIA airport: **25.04M → 29.16M → 30.48M** passengers (FY24→FY26); **31M in CY2025**;
    now **100 destinations** (74 domestic, 26 international) `[VERIFIED]`
11. Hotel demand is **corporate / extended-stay / MICE-led**, and the city has a
    **notable shortage of hotel capacity** `[VERIFIED — Hotelivate, Apr 2025]`
12. **446 airport touting cases** reported in 2024 — the single best-quantified tourist
    friction point `[VERIFIED — Deccan Chronicle, 9 Jan 2025]`

---

## The strategic read

Two markets, one shared root cause.

**The PG market** is enormous, fragmented and *currently being forcibly formalised*. A regulatory
shock (Project Safe Stay, Jul 2026) plus a tax incentive (GST Entry 12AA, Jul 2024) plus a
governance overhaul (the CURE Bill replacing the GHMC Act 1955) all landed within ~24 months.
Thousands of small owners who run on *registers and WhatsApp* now need digital records,
licences and inspections — and they have no tooling.

**The tourism market** is growing at the infrastructure layer (airport, connectivity) but
stalling at the experience layer (falling domestic numbers, admitted information gaps, touting).
Its capacity constraint is *hotel rooms*, not demand.

**The overlap — and the actual opportunity — is beds.** Hyderabad has ~35,000 organised co-living
beds and 447+ hostels sitting largely empty during off-peak, while the city runs short of hotel
capacity and peak season (Nov–mid-Feb) strains it further. A PG inventory network is a
distributed hotel network that already exists and is already paid for.

---

## Index

| File | Contents |
|---|---|
| [`research/01-pg-market.md`](research/01-pg-market.md) | PG market size, demand drivers, pricing, fragmentation |
| [`research/02-tourism-market.md`](research/02-tourism-market.md) | Tourism arrivals, revenue, attractions, MICE, medical tourism |
| [`research/03-competitors.md`](research/03-competitors.md) | Co-living operators, marketplaces, PMS software, funding |
| [`research/04-regulations.md`](research/04-regulations.md) | GST, licensing, fire NOC, safety mandates, tenancy law |
| [`research/05-pain-points.md`](research/05-pain-points.md) | Consumer and owner pain points, with evidence quality noted |
| [`research/06-product-opportunity.md`](research/06-product-opportunity.md) | Synthesis, app concept, features, monetisation, GTM |
| [`research/07-open-questions.md`](research/07-open-questions.md) | Data gaps, contradictions, verification checklist |
| [`data/key-metrics.csv`](data/key-metrics.csv) | Machine-readable metric table |

---

## Critical caveats before you build on this

1. **There is no published count of PGs in Hyderabad.** Not from GHMC, not from anyone.
   Any headline number you see is an estimate. The best proxies are platform listing counts
   (MagicBricks: 1,436) and the 447-hostel police audit.
2. **Hyderabad medical-tourism volume appears to be double-counted** with total state foreign
   arrivals — the identical figure **1,55,313** is used for both. Flagged in
   [`07-open-questions.md`](research/07-open-questions.md).
3. **IT employment trajectory is disputed.** Government sources support both "9.39 lakh, flat
   and falling" and "10.2 lakh by end-2025". This directly changes PG demand forecasts.
4. **Reddit / consumer-forum evidence is `[SNIPPET]` throughout** and was not independently
   verified. Use it as colour, not as proof.
5. Several regulatory timelines were **still moving** as of this compilation date — the
   Suraksha Nivas 2-month compliance window had just closed, and the CURE Bill's passage status
   needs rechecking.
