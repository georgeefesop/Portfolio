# Hire on Upwork — Section Redesign

**Date:** 2026-04-28
**Replaces:** the existing `Start a project` Contact form section
**File:** `components/sections/Contact.tsx` (rewritten in place)
**Anchor preserved:** `id="contact"` (so navbar links don't break)

## Goal

Convert the bottom-of-page Contact section from a generic intake form into a single-purpose, Upwork-first hire CTA. Sells the platform (escrow, reviews, billing) instead of asking visitors to fill out yet another form. Keeps email, phone, and WhatsApp visible as direct channels without apologetic "prefer off-platform?" framing.

## Why

Four problems with the current section, all confirmed by the user:

- **Generic.** Looks like every other freelancer contact form.
- **Friction-heavy.** Long form (name, email, brief, company, type, budget) for a first touch.
- **Stale intake plumbing.** The form still reads from a `ge_portfolio_estimate` localStorage key set by a ProjectEstimator that's no longer mounted on the page — dead pre-fill code.
- **Wrong framing for the Upwork pivot.** The recent commit `feat: portfolio overhaul for Upwork pivot` repositioned the portfolio toward Upwork; the Contact section never followed.

A committed Upwork-first section frames the platform as an asset (trust, protection, payment infrastructure) rather than apologizing for it.

## Scope

In scope:
- Rewrite `components/sections/Contact.tsx` end-to-end.
- Add `public/upwork-logo.svg` (official wordmark, sourced from upwork.com header SVG, fills converted to `currentColor`).
- Delete the form, react-hook-form usage, FormSubmit.co integration, and estimator pre-fill — all inside this file only.

Out of scope (explicit):
- ProjectEstimator changes. User confirmed the estimator is no longer in use; not editing.
- Navbar / footer changes.
- `/api/contact` route — leave as-is. Other code may still call it, and removing it isn't required for this section.
- The success state (`isSuccess`) — gone with the form.

## Layout

Single centered card, `max-w-3xl`, same vertical rhythm as the current section (`py-16 md:py-24`).

### Above the card

```
[eyebrow, small, muted]   The fastest way to work together
[h2, 3xl–4xl bold]        Hire me on Upwork
[subhead, lg, muted]      Escrow protection, verified reviews, no
                          invoices to chase. I work mostly through
                          Upwork — it's the cleanest path for both of us.
```

### Card top — identity strip

Two-row block on `bg-bg-secondary` with `border-border-subtle`, `rounded-2xl`, padded `p-6 md:p-8`.

Row 1 — logo + rate:
- Left: Upwork wordmark SVG, `text-[#14A800]` (so the `currentColor` fill picks it up), `h-7` ish.
- Right: a small `PRO` pill (Upwork green bg, white text, rounded-full, `px-2 py-0.5 text-xs font-bold`) followed by `$50/hr` in `text-text-primary`.

Row 2 — name + title:
- `George E.` bold + `Product Designer + Bespoke Web Builder` muted, single line on desktop, wraps on mobile.

### Stats row

Three columns, `grid-cols-3`, `divide-x divide-border-subtle`. Each cell:
- Big number in `text-2xl md:text-3xl font-bold text-text-primary`
- Small label below in `text-xs uppercase tracking-wide text-text-muted`

Values:
- `100%` — Job Success
- `5.0 ★` — Avg rating
- `0–4 hr` — Response time

Deliberately omitted: total earnings ($5K+), total jobs (7), total hours (112). Modest absolute numbers undersell the profile; the three above are the strong signals.

### Pulled testimonial

One blockquote, italic, with attribution:

> "George impressed me a lot. With a two-day turnaround and a challenging brief, he brought the goods and put together a design that nailed the tone."
> — Upwork client, UI/UX project

Styled with a subtle left border in `accent-primary` and `text-text-secondary`.

### Why-Upwork (3 mini value props)

`grid-cols-1 md:grid-cols-3 gap-4` row. Each item is an icon + a one-liner, no card chrome:

- `Shield` icon — **Escrow-protected.** Funded before I start.
- `Star` icon — **Verified reviews.** Real clients, every contract.
- `Zap` icon — **Zero admin.** Upwork handles billing.

Icons in `accent-primary`, headings in `text-text-primary`, body in `text-text-secondary`.

### Primary CTA

Big anchor styled as a button:
- Full-width on mobile, generous padding on desktop.
- `bg-[#14A800] hover:bg-[#108300]`, `text-white`, `font-bold`, `py-4 rounded-lg`.
- Text: **"Hire me on Upwork"** + arrow icon.
- `href="https://www.upwork.com/freelancers/~0192f6c9c9c1e1bf83"`
- `target="_blank" rel="noopener noreferrer"`

### Direct-contact strip (bottom of card)

Quiet horizontal row, separated from the CTA by a thin divider (`border-t border-border-subtle/50`, `pt-6 mt-6`). No apologetic framing, no headline — just three icon-prefixed links, centered, `text-sm text-text-muted hover:text-text-primary`:

- `Mail` icon — `george.efesop@gmail.com` → `mailto:`
- `MessageCircle` icon — `WhatsApp` → `https://wa.me/35797907137`
- `Phone` icon — `+357 97 907 137` → `tel:+35797907137`

WhatsApp and phone share the same number but they're distinct channels (chat vs voice), so both are listed.

## Visual treatment

### Upwork brand

- Wordmark color: `#14A800` (Upwork brand green).
- Hover-darken on the CTA button: `#108300`.
- The `PRO` pill uses the same green at full saturation.
- These are the only "off-portfolio" colors in the section. Everything else uses the existing dark theme tokens (`bg-bg-primary`, `bg-bg-secondary`, `text-text-primary`, `border-border-subtle`).

### Logo asset

`public/upwork-logo.svg` — official wordmark from upwork.com header (5 paths, `viewBox="0 0 102 28"`), with the `var(--nav-logo)` fills replaced with `currentColor` so it can be themed via CSS.

Imported as a React component via Next.js's import syntax for SVGs (or rendered inline if SVGR isn't configured — check next.config first):

```tsx
import UpworkLogo from '@/public/upwork-logo.svg';
// or
<img src="/upwork-logo.svg" alt="Upwork" className="h-7 text-[#14A800]" />
```

If using `<img>`, can't recolor with `currentColor`. Use inline SVG or `next/image` with the SVG component pattern. Decide at implementation; default to inline SVG for color flexibility.

### Motion

Wrap the whole section in the existing `<FadeIn>` motion component, same as the current Contact section. No new animation logic.

## Behavior

- The CTA opens Upwork in a new tab.
- Email/phone/WhatsApp links use the standard `mailto:`, `tel:`, and `wa.me` URLs — same numbers used in the current section's footer.
- No JavaScript state. No form submission. No client-side dependencies beyond `lucide-react` (already in use).

## What gets deleted

From `Contact.tsx`:
- All `react-hook-form` imports and `useForm` usage
- `useState` for `showDetails`, `isSubmitting`, `isSuccess`
- `useEffect` that reads from localStorage to pre-fill from estimator
- `getFormattedMessage`, `handleEmail`, `handleWhatsApp` handlers
- The success state UI block
- The whole `<form>` element with all fields
- `ContactFormData` interface
- `cn` helper (no longer needed in this file)

Imports kept: `FadeIn`, lucide icons (Shield, Star, Zap, Mail, MessageCircle, Phone, ArrowRight).

## Risks and tradeoffs accepted

- **No form means warm leads who'd rather fill a form than message a freelancer have less structured intake.** Acceptable — the estimator already qualified them, and the Upwork message thread is structured intake. Email/WhatsApp/phone are the unstructured fallback.
- **The Upwork brand green is "off-brand" for the portfolio's dark accent palette.** Intentional — the section is meant to feel like Upwork's official corner of the site, not blend in. The greens are scoped to the logo, PRO pill, and CTA only.
- **Logo usage rights.** Upwork's Mark Use Guidelines (linked from `upwork.com/legal#mark-use-guidelines`) generally permit freelancers to indicate they work on the platform via a profile link. Using the wordmark to label a "Hire me on Upwork" CTA pointing at the user's own profile fits that use case. If Upwork's guidelines require explicit permission for any wordmark use, swap to a text-only "Hire on Upwork" button without the wordmark — same layout, no asset.
- **Hard-coded testimonial.** Pulled from the live Upwork profile at design time. If profile testimonials change, this stays stale until manually updated. Acceptable — testimonials change rarely, and the alternative (fetching live) adds an API dependency for one quote.

## Files touched

- `components/sections/Contact.tsx` — rewritten
- `public/upwork-logo.svg` — new file

That's it. No route changes, no new dependencies, no env vars.
