# READY FOR REVIEW

# Kingfisher Mortgages - Sanity Recon

## Section inventory (DOM order)

### 0. Global: Fonts
- **Fraunces** (Google Fonts, variable: opsz, SOFT, wght) - headings, large display, italic accents
- **Inter** (Google Fonts) - body, labels, UI
- **Manrope** (local woff2, theme default) - overridden everywhere by Fraunces/Inter inline styles
- **Fira Code** (local woff2, theme default) - not visibly used on this page

### 0. Header / Nav
- Logo: `kingfisher-logo-v4-dark.svg` (48px height, light bg)
- Nav links: Remortgage (#remortgage), Buy-to-let (#buy-to-let), For Freelancers (/for-freelancers/), About (/about/)
- CTA: "Book a chat" -> fires `window.kfBookingOpen()` (JS booking modal)
- All CTA buttons across the page wire to the same modal via JS click listeners

### 1. Hero (section `elementor-94901ed`)
- Eyebrow: "SPECIALIST MORTGAGES"
- H1: "The bank said **no**."
- H2 (italic): "So we said *fine*."
- Lede: "Specialist mortgages for the *self-employed*, the *contractors*, and the *limited company directors*..."
- CTA primary: "Book a 15-min chat"
- CTA subtext: "Fifteen minutes. No application forms. No sales pressure."
- Hero image: `1472adc8-c457-4f56-ad03-982526287db0-818x1024.png` (woman at laptop, 4/5 aspect)
- Rate badge (absolutely positioned over image): "Best 5-yr fix today / 4.09% / Live - self-employed"
- Lender logos strip (hidden by CSS in current build): Santander SVG, Barclays SVG, HSBC UK SVG, "+ 47 more"
- Background: warm cream `#efe9dd`

### 2. Marquee stats bar (section `elementor-db74424`)
- Background: dark teal (from elementor post CSS)
- Scrolling stats: £2.1bn / 11,400+ homes / 92% approval / 9 days avg / 4.8/5 Trustpilot / 90+ lenders
- Repeats twice for infinite loop effect
- CSS animation: `kf-marquee-scroll`, 40s linear infinite

### 3. Problem framing (section `elementor-31cb35e`)
- Background: cream `#efe9dd`
- Two-column grid layout
- **Left col:**
  - Eyebrow: "HOW WE THINK DIFFERENTLY"
  - H2: "Your bank looks at a payslip. We look at your business."
  - Two body paragraphs about high-street vs specialist underwriting
- **Right col** (left-bordered):
  - Eyebrow: "WHAT WE ACCEPT"
  - Checklist (5 items with custom checkmark):
    1. One year of accounts. Sometimes none.
    2. Contractor day rates and fixed-term income.
    3. Retained profits in a limited company.
    4. Seasonal and irregular months.
    5. Income paid in foreign currency.
  - CTA: "Book a 15-min chat" (chevron icon)

### 4. Calculator (section `elementor-07ae200`, id="calculator")
- Background: cream `#efe9dd`
- Static display (not interactive in WP build - no JS slider)
- **Left:** Heading "What could you *actually* afford?", lede, eyebrow "Based on self-employed income"
- **Right panel:** Ledger rows: Annual income £72,000 / Deposit £40,000 / Term 25 years / **Indicative borrowing £284,000** (coral italic)
- CTA: "Book a 15-min chat" (pill button)
- Disclaimer text below CTA

### 5. How it works (section `elementor-a33694c`)
- Background: dark teal
- H2: "From stuck to keys in *four to six weeks.*"
- 3-card staggered layout (card 1 up, card 2 down, card 3 up) with orange shadow
- Step 01: "Book a 15-minute chat." - "No paperwork..."
- Step 02: "We match you with the right lender." - "...50+ specialist panel. Typically within 48 hours."
- Step 03: "You get your mortgage." - "Average time four to six weeks..."
- Decorative horizontal orange line behind cards

### 6. Audiences (section `elementor-b5c27d1`)
- Background: cream
- H2: "Whatever *self-employed* looks like for you."
- Subheading paragraph
- 3-column bordered card grid:
  - 01 / Freelancers / "Designers, developers, writers..." / link: /for-freelancers/
  - 02 / Contractors / "Day-rate IT, engineering, healthcare..." / link: # (stub)
  - 03 / Company Directors / "Limited company owners with salary plus dividends..." / link: # (stub)
- Cards have hover: background tint + arrow gap animation

### 7. Receipt Testimonial (section `elementor-b06460f`, currently `display:none` via CSS)
- Background: dark teal `#122926`
- **Left col:**
  - Eyebrow "A RECEIPT"
  - Intro: "Three high-street lenders. Same applicant. Same week."
  - Declined list: Halifax declined. / HSBC declined. / Santander declined. / **Kingfisher 9 days.**
  - Outro paragraph
- **Right col:**
  - Portrait photo: `e69033dd-05ff-4f5f-b42c-c8f920904fc2-825x1024.png` (Marcus T., music producer)
  - Stats grid: £420k borrowed / 4.09% 5-yr fix / £0 broker fee / 9 days to offer
  - Attribution: "Marcus T. - music producer - Bristol - 2026"
- **Note:** This section is hidden (`display:none`) in the current WP build. Include in Sanity rebuild but render it.

### 8. Case Study (section `elementor-9a45878`)
- Background: cream
- Wide hero image: `6ccad206-b7f2-4e69-8874-d202396772c2.png` (Sarah, tattoo artist, 1376x768)
- **Right col:**
  - Eyebrow: "A recent case"
  - H2: "How Sarah bought her first flat with 18 months of accounts."
  - 3 body paragraphs (Sarah's story)
  - Animated counter stats: £312k borrowed / 5.2% fix / 85% LTV / 38 days to offer
  - Pull quote: "They read my business, not just my paperwork. I wish I'd started here."
  - Attribution: "Sarah, freelance illustrator, Bristol"

### 9. Freelancer Fair (section `elementor-f44c064`)
- Background: cream
- H2: "Come say hi at a *freelancer* fair."
- Lede paragraph
- Wide photo (16/5.85 ratio): `ded8269f-b821-4c41-87b3-bb7478593da4.png` (Amira and Tom at stand)
- Caption: "Amira Patel and Tom Chen, Freelancer Fair, Manchester, March 2026."
- Events grid (3 col):
  - MAR / Freelancer Fair / Manchester / Stand 14
  - MAY / UK Contractors Summit / Olympia London / Stand B7
  - OCT / Self-Employed Live / Birmingham / Stand 22

### 10. Remortgage product band (section `elementor-47fdd8d`, currently `display:none`)
- Background: white/cream
- Left: image `23a37f13-ff16-4c2b-af0b-ca40a2396743.png` (stone cottage, 580px height)
- Right:
  - Eyebrow: "Remortgage - Self-employed"
  - H2: "Remortgage that looks past PAYE."
  - Body with bold stat: "Customers saved £2,400 a year on average moving off SVR last quarter."
  - Checklist: 3 items
  - CTA: "See your remortgage options" -> /contact/?product=remortgage
  - Trust note: "No credit check. Five-minute form."
- **Note:** Hidden in WP build. Show in Sanity rebuild.

### 11. Buy-to-let product band (section `elementor-dcd1531`, id="buy-to-let")
- Background: cream
- Left col (content):
  - Eyebrow: "Buy-to-let - Self-employed landlords"
  - H2: "Buy-to-let that counts your *real* income."
  - Body paragraph
  - Feature rows: Personal name or SPV / Portfolio landlords / HMO and holiday-let
  - CTA: "Check your BTL eligibility" -> /contact/?product=btl
  - Trust note: "Rental stress-test included."
- Right col (image): `pexels-photo-20703514.jpeg` (London white-stucco terraces, 600px height)
- Caption: "Pimlico, three-flat conversion."

### 12. FAQ (section `elementor-9ef30f8`)
- Background: cream
- Sticky heading (desktop): "Awkward questions, *answered.*"
- Two Elementor accordions stacked (10 total questions), custom +/x toggle styling
- **Group 1 - Eligibility:**
  1. I've been turned down twice. Can you actually help?
  2. How much can I borrow as a freelancer?
  3. Can I apply with less than two years of accounts?
  4. Do you work with limited company directors, not just sole traders?
  5. My income varies month to month. Does that matter?
- **Group 2 - Process:**
  1. What's your fee? (£495 on completion; nothing if no offer)
  2. How long does the whole thing take?
  3. What if I'm declined again?
  4. What documents will I need?
  5. Can we do this entirely remotely?
- FAQPage JSON-LD schema embedded in both accordions

### 13. Final CTA (section `elementor-ba1a2f9`, currently `display:none`)
- Background: dark teal
- H2: "Still renting because your bank said no?"
- Body: "Fifteen minutes. No application forms. No sales pressure..."
- CTA: "Book a 15-min chat"
- Social proof card: quote from Daniel M., IT contractor, Manchester
- **Note:** Hidden in WP build. Show in Sanity rebuild.

### 14. Footer (section `elementor-950f29b`)
- Background: dark teal
- 4-col grid: Brand col / Pages / Legal / Compliance
- Signature line: "From Brighton, working nationwide, with *care*."
- Bottom bar: copyright + FCA risk warning
- FCA reference: 987654 | Company: 13245678 | NACFB member

### 15. Booking modal (global, fixed overlay)
- Multi-step: date picker (calendar) -> time slots -> contact form -> confirmation
- All "Book a chat" buttons wire to `window.kfBookingOpen()`
- In the Sanity rebuild: this can be a simple Calendly embed or a static "contact us" link - no backend is wired in the WP version either

---

## Image asset list

| File | Used in | Suggested Sanity field |
|------|---------|----------------------|
| `kingfisher-logo-v4-dark.svg` | Nav | `siteSettings.logoDark` |
| `kingfisher-logo-v4-light.svg` | Footer | `siteSettings.logoLight` |
| `Banco_Santander_Logotipo.svg` | Hero lender strip | `hero.lenderLogos[].logo` |
| `Barclays-Logo.svg` | Hero lender strip | `hero.lenderLogos[].logo` |
| `HSBC_UK_logo.svg` | Hero lender strip | `hero.lenderLogos[].logo` |
| `1472adc8...png` | Hero | `hero.heroImage` |
| `e69033dd...png` | Receipt Testimonial | `receiptTestimonial.clientPhoto` |
| `6ccad206...png` | Case Study | `caseStudy.heroImage` |
| `ded8269f...png` | Freelancer Fair | `freelancerFair.photo` |
| `23a37f13...png` | Remortgage band | `productBand[remortgage].image` |
| `pexels-photo-20703514.jpeg` | BTL band | `productBand[btl].image` |

---

## Proposed schemas (as implemented)

```
kf_siteSettings     - singleton: nav, logos, footer copy, compliance
kf_hero             - hero section + rate badge + lender logos
kf_marquee          - scrolling stats bar (array of value/label)
kf_problemFrame     - 2-col "Your bank looks at a payslip" + checklist
kf_calculator       - static calc display with configurable defaults
kf_howItWorks       - 3-step process cards
kf_audiences        - 3 audience cards (freelancers/contractors/directors)
kf_receiptTestimonial - declined list + client photo + stats
kf_caseStudy        - Sarah's story + animated counters + pull quote
kf_freelancerFair   - photo + events itinerary
kf_productBand      - reusable for both remortgage + BTL sections
kf_faq              - heading + array of Q/A items
kf_finalCta         - bottom CTA + testimonial card
```

All schemas are in `sanity/schemas/kingfisher/` with barrel export at `sanity/schemas/kingfisher/index.ts`.

---

## Visual quirks worth flagging

1. **Fraunces variable font axes** - `opsz` and `SOFT` axes are used extensively. The headings use `opsz 144, SOFT 50`; italic accents use `opsz 144, SOFT 100`. These need to be loaded as variable font in the Next.js rebuild (`next/font/google` supports variable fonts).

2. **Hidden sections** - Sections 7 (Receipt Testimonial), 10 (Remortgage), and 13 (Final CTA) are `display:none` in the WP build via inline CSS overrides. These appear to be work-in-progress sections. The Sanity rebuild should render them - they contain complete content.

3. **Booking modal** - The 15-min chat CTA fires a custom JS modal with a fake calendar UI (slots are pseudo-randomly generated from a date seed). No real booking backend. The Sanity rebuild will need a decision: replace with Calendly, keep as a contact form, or rebuild the modal in React.

4. **Animated counters in Case Study** - JS `IntersectionObserver` animates numbers from 0 on scroll. Straightforward to replicate in React with a custom hook.

5. **Rate badge currency** - The "4.09%" rate badge in the hero is hardcoded. In Sanity this becomes a field so it can be updated without a deploy.

6. **Color palette** - All colors are Elementor CSS custom properties. For the rebuild use these literal values:
   - `--paper`: `#efe9dd` (cream background)
   - `--ink`: `#1a3530` (dark teal text)
   - `--ink-2`: `#2d4843`
   - `--accent`: `#e88d6e` (warm orange)
   - `--accent-deep`: `#d4714e`
   - `--muted`: `#6e6855`
   - `--line`: `#d2c8b3`
   - `--teal`: `#1d3f3a` (dark section bg)

7. **Marquee** - Uses `will-change: transform` + `backface-visibility: hidden` for GPU compositing. Straightforward CSS animation.

8. **FAQPage JSON-LD** - Both FAQ accordion widgets embed separate `<script type="application/ld+json">` blocks. In the Next.js rebuild, generate a single consolidated JSON-LD from the Sanity FAQ data.

---

## Open questions for the user

1. **Booking modal** - Replace with Calendly embed, a simple contact form (`/contact/` route), or rebuild the fake calendar in React? The WP version has no real backend.

2. **Hidden sections** - Sections 7 (receipt testimonial), 10 (remortgage band), 13 (final CTA) are currently hidden in the WP build. Render them in the Sanity rebuild?

3. **Dataset name** - Use `production` or a separate dataset like `kingfisher`? Separate dataset keeps it clean but costs nothing extra on the free tier.

4. **Contractor/Directors pages** - The audience cards link to `#` stubs for contractors and directors. Are those pages in scope for this build?

5. **Calculator interactivity** - Should the calculator section be interactive (sliders update the indicative figure client-side), or stay as a static display like in the WP version?

6. **Analytics / FCA compliance** - The footer has a hardcoded FCA reference (987654) and company number (13245678). Are these real or placeholder? If real, confirm before publishing.

---

## Next steps for the user

### Step 1 - Install dependencies (run once)

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision
```

### Step 2 - Create the Sanity project

```bash
npx sanity login
# Then in repo root:
npx sanity init --env .env.local
```

When prompted:
- "Create new project" - yes
- Project name: Kingfisher Mortgages
- Dataset: production (or kingfisher if you prefer isolation)
- Output path: leave as `.` (repo root)

This writes `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` into `.env.local`.

### Step 3 - Verify the Studio route

Start the dev server and open `http://localhost:3000/kingfisher-sanity/studio`. The embedded Studio should load. If you see a blank page, check that both env vars are set.

### Step 4 - Phase 3 (frontend components)

Build the actual page at `/kingfisher-sanity` using the schemas:
- One GROQ query fetching all section documents in a single round-trip
- One React component per section (Hero, Marquee, ProblemFrame, etc.)
- Tailwind 4 + CSS custom properties matching the Kingfisher color palette
- `revalidate = 60` for ISR (already stubbed in `app/kingfisher-sanity/page.tsx`)

### Step 5 - Phase 4 (seed script)

Write a `scripts/seed-kingfisher.mjs` that:
- Reads content from the recon doc
- Creates one document per schema type in Sanity via the `@sanity/client` mutate API
- Uploads the image files from `public/kingfisher/wp-content/uploads/2026/04/` to the Sanity media library and patches the image references

### Step 6 - Side-by-side comparison

Both routes are live:
- `/kingfisher` - static WP export (unchanged)
- `/kingfisher-sanity` - headless Sanity rebuild

---

## Phase 3 + 4 results

### Components created

| File | Notes |
|------|-------|
| `components/kingfisher/KfNav.tsx` | Sticky nav, logo, CTA dispatches `kf:booking:open` event |
| `components/kingfisher/KfHero.tsx` | Two-col hero, rate badge, lender strip fallback |
| `components/kingfisher/KfMarquee.tsx` | CSS keyframe scroll, GPU composited |
| `components/kingfisher/KfProblemFrame.tsx` | Two-col, portable text body, checklist |
| `components/kingfisher/KfCalculator.tsx` | `'use client'` - sliders for income/deposit/term/rate, live monthly payment |
| `components/kingfisher/KfHowItWorks.tsx` | 3-card staggered grid, orange shadow |
| `components/kingfisher/KfAudiences.tsx` | 3-col bordered cards |
| `components/kingfisher/KfReceiptTestimonial.tsx` | Dark teal, declined table, stats grid |
| `components/kingfisher/KfCaseStudy.tsx` | `'use client'` - IntersectionObserver animated counters |
| `components/kingfisher/KfFreelancerFair.tsx` | Wide photo, 3-col events grid |
| `components/kingfisher/KfProductBand.tsx` | Reversible image/content grid (remortgage + BTL) |
| `components/kingfisher/KfFaq.tsx` | `'use client'` - accordion, FAQPage JSON-LD |
| `components/kingfisher/KfFinalCta.tsx` | Dark teal, testimonial card |
| `components/kingfisher/KfFooter.tsx` | 4-col, compliance, FCA ref |
| `components/kingfisher/KfBookingModal.tsx` | `'use client'` - 4-step: date picker / time slots / contact form / confirm; saves to localStorage |

All hidden WP sections (Receipt Testimonial, Remortgage band, Final CTA) are rendered.

### Page + layout

- `app/kingfisher-sanity/page.tsx` - single GROQ query, ISR revalidate=60, renders section components in DOM order, graceful empty state before seeding
- `app/kingfisher-sanity/layout.tsx` - loads Fraunces + Inter from Google Fonts, no portfolio chrome

### Seed script

**Path:** `scripts/seed-kingfisher-sanity.mjs`

**Run:**
1. Add `SANITY_AUTH_TOKEN=<your-write-token>` to `.env.local`
   - Get token: https://www.sanity.io/manage -> project `bfonjqiz` -> API -> Tokens -> Add API token (Editor)
2. `npm run seed:kingfisher`

Uploads all 8 images from `public/kingfisher/wp-content/uploads/2026/04/` then upserts 13 documents (deterministic `_id`s so re-running is safe).

### Assumptions + punts

- `data-kf-booking` attribute on every CTA button triggers the modal via a delegated click listener in `KfBookingModal` - no prop drilling needed.
- Fraunces font axes (`opsz`, `SOFT`) applied via `fontVariationSettings` inline style - not all browsers show variable-axis differences identically but modern Chrome/Firefox handle it.
- The `KfCaseStudy` left column intentionally renders an empty `<div>` as a spacer so the content panel sits on the right side - matches the WP layout where the full-width image is above and the content is right-aligned.
- `productBands` are fetched ordered by `_createdAt asc` so the seed order (remortgage first, BTL second) determines render order. If reordering is needed, add an `order` field to the schema.
- Responsive breakpoints are stubbed in layout CSS (`.kf-two-col` / `.kf-three-col` class names) but the components use inline grid styles. Full mobile responsiveness would need media query hooks or a CSS module pass.

### Left for the user to decide

- Mobile layout: components use inline `grid-template-columns: 1fr 1fr` with no responsive override wired up. A polish pass with CSS modules or Tailwind responsive variants would complete this.
- Lender logos in hero: schema supports an array of `lenderLogos` images but the seed leaves the array empty (SVGs are uploaded separately). Upload Santander/Barclays/HSBC SVGs via the Studio if you want them rendered.
- Real booking backend: modal saves to `localStorage` only. Replace with a Calendly embed or POST to an API route when ready for production.

---

*Files created in this session:*

- `_export/kingfisher-sanity-recon.md` (this file)
- `sanity/schemas/kingfisher/siteSettings.ts`
- `sanity/schemas/kingfisher/hero.ts`
- `sanity/schemas/kingfisher/marquee.ts`
- `sanity/schemas/kingfisher/problemFrame.ts`
- `sanity/schemas/kingfisher/calculator.ts`
- `sanity/schemas/kingfisher/howItWorks.ts`
- `sanity/schemas/kingfisher/audiences.ts`
- `sanity/schemas/kingfisher/receiptTestimonial.ts`
- `sanity/schemas/kingfisher/caseStudy.ts`
- `sanity/schemas/kingfisher/freelancerFair.ts`
- `sanity/schemas/kingfisher/productBand.ts`
- `sanity/schemas/kingfisher/faq.ts`
- `sanity/schemas/kingfisher/finalCta.ts`
- `sanity/schemas/kingfisher/index.ts`
- `sanity.config.ts`
- `lib/sanity/client.ts`
- `lib/sanity/image.ts`
- `app/kingfisher-sanity/layout.tsx`
- `app/kingfisher-sanity/page.tsx`
- `app/kingfisher-sanity/studio/[[...tool]]/page.tsx`
- `.env.local.example`
