# Portfolio Polish + Repositioning — Implementation Plan

**Date:** 2026-04-29
**Status:** Ready to hand off to implementation
**Predecessor:** [2026-04-28-hire-on-upwork-section-design.md](./2026-04-28-hire-on-upwork-section-design.md) (already implemented and deployed)

---

## Goal

Reposition the portfolio so that within five seconds a visitor thinks **"this person can build at this level"** — premium SaaS, named-client-quality work. Apply approved fixes from the multi-lens audit, replace timeline-led service tiles with deliverable-shape language, surface client credentials prominently, give the prototype demo its own destination section, and tighten copy throughout.

**Anti-goal:** sales-iness. Hire on Upwork is the only CTA surface; everything upstream is craft and proof.

---

## Context

### Approved audit fixes (from prior conversation)

| #  | Issue | Decision |
|----|-------|----------|
| 1  | Hero "Start a project" copy mismatches "Hire me on Upwork" section | Drop the right-rail "Start a project" text |
| 2  | Hero "Test a Prototype" CTA dominates and doesn't funnel to hire | Move into its own section further down |
| 3  | About says Web3/fintech, Services lists WordPress/SEO — contradiction | Unify framing as Designer-Developer, end to end |
| 4  | About "let's talk" line has no link, dead ending | Cut the line entirely; let scroll into Hire section do the job |
| 5  | Footer "Built with Next.js 14" stale (actual 16) | Drop the line |
| 6  | System Lab debug modal in HeroText (~280 lines) is dead code in prod | Remove |
| 7  | Hero `select-none` blocks copying name | Remove |
| 8  | Audio on toggle / prototype click | **Keep** — user confirmed not intrusive |
| 9  | Process drag interaction is a flex without payoff | Remove drag, keep visual layout |
| 10 | `text-dim` (#707070) on bg-primary fails WCAG AA (3.9:1) | Bump to #909090 (5.7:1) |
| 11 | Footer "Contact" label out of sync with section name | Rename to "Hire on Upwork" |
| 12 | TikTok 16k vs 15k inconsistency | Use **15K** everywhere |

### New decisions from this session

- **Drop timelines** from all Services tiles. Replace with deliverable shapes.
- **AI-assisted dev** is mentioned as a *capability* for speed, not framed as a speed pitch.
- **Frame as "Product Designer & Developer"** (not just Product Designer).
- **Don't merge About + Hire on Upwork** — keep separate but adjacent. About ends without a CTA; the natural scroll into Hire on Upwork is the funnel.
- **Pricing now hidden on Upwork profile** — do not list rates anywhere on the portfolio either. Project-shape language only.
- **Add client logo bar** featuring IOG, Cardano, Nike (Nike Training Club), Bournemouth University.
- **Add CMS comfort band** (WordPress + Sanity) signalling that George can build *and* hand off systems clients can manage themselves.

### What I learned from the two comp sites

**[dodgeux.com](https://www.dodgeux.com/)** ($800K+ on Upwork). Lessons worth borrowing:
- Hero sequence: eyebrow → bold H1 statement → 1-line subhead → 2 CTAs.
- **Trust band sits directly under the hero** — "Trusted by Leading SaaS Teams, Startups, and Fortune 100 Brands" with logos.
- **Before/after gallery** demonstrates the *transformation* the designer delivers — not just final screens.
- Numbered process emphasizing thinking ("Generative Research", "Progress Review & Insights"), not just deliverables.
- "What It's Like to Work With Us" voice frames the *partnership*, not the SOW.
- Humanizes the founder at the bottom after the agency framing — softens.

Lessons to **reject**:
- Agency "we" pronoun. George is one person; that's the differentiator.
- "Book a discovery call" CTA on every section. Too transactional; conflicts with the Upwork-only CTA strategy.
- Generic 4-pillar value-prop blocks. Feels Squarespace-template.

**[asaadmahmood.com](https://asaadmahmood.com/)** (28K hours on Upwork). Less directly relevant — the site is split between agency, courses, and personal brand. Notable only for confirming that conversion-language ("experiences that convert") is the dominant SaaS-designer voice. We're consciously *not* going there.

**[Max Lobanov / Behance](https://www.behance.net/maxlobanov)** ($300K+ on Upwork). No personal site — runs entirely on Upwork + Behance. Relevant only as a data point: most top Upwork earners *don't* have a designed portfolio site, so George's site is itself a differentiator — provided it converts to "this person ships at this level," not "this person enjoys side projects."

### The "build at this level" mechanism

A visitor needs to feel three things within five seconds:

1. **This person ships premium product** — proven by named-brand credentials surfaced near the top.
2. **This person has a rare skill stack** — designer + developer, end-to-end, is the explicit differentiator.
3. **The site itself is the proof** — craft level of the site = craft level of the work.

Right now point 1 is buried in About. Point 2 is implicit. Point 3 is partly there but the copy doesn't anchor it. The plan below addresses each.

---

## Architecture decisions

### Final page order

```
1. Hero (ProductHero)
2. CredibilityBar           ← rebuilt with logos, mobile-visible
3. Intro                    ← unchanged
4. Selected Projects        ← unchanged
5. Services                 ← rewritten copy, no timelines, + CMS strip
6. How I Work (Process)     ← drag removed
7. Prototype Showcase       ← NEW — destination for the demo modal
8. Resources                ← unchanged
9. About                    ← rewritten copy, closing CTA cut
10. Hire on Upwork (Contact) ← unchanged (already implemented)
11. Footer                  ← label + version line fixes
```

The Prototype Showcase sits between Process and Resources because:
- It's the proof of the "vibe-coded prototypes" claim implicit in the Process section.
- It comes after the visitor has seen the case studies and the way-of-working — by this point they're in "show me what's possible" mode, not first-impression mode.
- Resources (tutorials) afterwards reinforces "this person teaches what they do."

### Modal state lifting

The "Test a Prototype" modal currently lives inside `ProductHero.tsx` and is wired to a button there. The new Prototype Showcase needs to open the same modal. Two choices:

**Option A (recommended)**: Use the existing `featured:open` custom-event pattern. Dispatch `prototype:open` from the new section; listen in `ProductHero` (or a new `PrototypeModal` component lifted to `app/page.tsx`). Minimal refactor. Same pattern already in use for `featured:open`.

**Option B**: Lift modal into `app/page.tsx` as a context/portal. Cleaner architecturally, more refactor.

Pick A. Keep scope tight.

### Logo asset acquisition

Save SVGs to `public/logos/`:
- `iog.svg` — sourced from iohk.io brand assets
- `cardano.svg` — sourced from cardano.org/brand-assets
- `nike.svg` — Swoosh, widely available official SVG
- `bournemouth.svg` — Bournemouth University brand resources
- `wordpress.svg` — WordPress.org brand assets
- `sanity.svg` — Sanity.io brand assets

Use `currentColor` fills where possible so logos can render in muted state by default and brighten on hover. Each logo gets a comment in source noting where it came from for license traceability.

---

## Section-by-section work

### S1. Hero (`components/sections/ProductHero.tsx` + `components/ui/HeroText.tsx`)

#### Files touched
- `components/ui/HeroText.tsx` — copy + structural changes
- `components/sections/ProductHero.tsx` — modal state changes, audio kept

#### Copy

**H1:**
> PRODUCT DESIGNER<br />& DEVELOPER

**Sub:**
> End to end. By one person.

**Right rail (desktop only):**
- Tagline: *Product · Web · Brand · AI*
- Credit line: *Previously: Input Output (Cardano), Nike Training Club*
- Status pill: *Open for new projects* (green dot — keep as is)

#### Removed
- "Test a Prototype" `InstrumentButton` and surrounding container in HeroText (lines ~226–239)
- "Start a project" right-rail line (line ~245)
- The whole **System Lab debug modal** block — `AnimatePresence` on `isDebugOpen`, `SidebarTab`, `DebugInspector`, dragControls, dims state, resize handles. ~280 lines.
- All `useState`/`useEffect` related to System Lab (`isDebugOpen`, `activeTab`, `dims`, `dragControls`, the `Escape` handler that closes it, `handleResize`).
- `select-none` on the hero text wrapper (line ~172). Replace with no class — default selection allowed.

#### Kept
- Vibrant mode toggle + audio (per user)
- FeaturedWorkStrip (horizontal desktop, vertical mobile)
- Scroll indicator
- Signature image
- `pointer-events-none` on the wrapper with `pointer-events-auto` on children that need it

#### Modal lifecycle change
The "Test a Prototype" modal stays defined in `ProductHero.tsx`, but its trigger moves out:
- Remove the InstrumentButton call.
- Add a `useEffect` listener for a custom event `prototype:open` that calls `setIsModalOpen(true)`.
- The new Prototype Showcase section (S6) dispatches this event from its button.

#### Mobile
Same H1 ("Product Designer" small-screen variant becomes "Product Designer & Developer"), same vertical featured strip. No hero CTA on mobile — visitor scrolls into CredibilityBar next.

#### Acceptance check
- Hero renders with new H1 + sub on desktop and mobile.
- "Test a Prototype" no longer appears in hero.
- "Start a project" no longer appears in hero.
- Selecting hero text with cursor works (highlight visible).
- Vibrant mode toggle still works, audio still plays.
- System Lab modal cannot be opened (no trigger exists).
- File line count reduced by ~280 lines.

---

### S2. CredibilityBar (`components/sections/CredibilityBar.tsx`) — rebuilt

#### Goal
Replace text-heavy bar with a logo-led credibility band. Mobile-visible (currently `hidden md:block`).

#### Layout

```
[Past work and clients]              ← small uppercase eyebrow

[IOG]    [CARDANO]    [NIKE]    [BOURNEMOUTH UNIVERSITY]    [↗ View case studies]

2 yrs at IOG · Lead designer on RealFi (Cardano) · 12 yrs freelancing
```

- Eyebrow: `text-xs uppercase tracking-wider text-text-muted`
- Logos: rendered inline-SVG, `text-text-secondary` default, `hover:text-white` on the row, ~28–32px height each, generous gap.
- Caption: `text-sm text-text-muted font-mono`
- "View case studies" anchor link to `#work`, subtle (`text-text-muted hover:text-accent-primary`)
- Section background: same as bg-primary, but with `border-y border-border-subtle/50` to set it apart visually.
- Padding: `py-10 md:py-14`

#### Mobile
- Same content, but logos wrap or scroll horizontally with `overflow-x-auto` + `snap-x` to fit smaller widths
- Or: stack into 2 rows of 2 on `<sm`. Pick whichever feels less cramped — try horizontal-scroll first.

#### Removed
- The `hidden md:block` wrapper (visible on all sizes now)
- Existing text-heavy multi-column layout — full rewrite

#### Acceptance check
- Bar visible at mobile, tablet, desktop.
- All four logos load (no broken images).
- Eyebrow + caption render with correct contrast.
- "View case studies" link scrolls to #work section.

---

### S3. Intro (`components/sections/Intro.tsx`) — minor

No copy change. Just verify `text-dim` isn't used here (used on the dim halves of the H2 — confirm contrast after the token bump in S11).

---

### S4. Selected Projects (`components/sections/CaseStudies.tsx`) — no change

Already in good shape. Filter pills, modal pattern, featured-strip event listener — all work as intended. Out of scope for this plan.

---

### S5. Services (`components/sections/Services.tsx`) — copy rewrite + CMS strip

#### Section header

**H2:** Services
**Sub:** Designed and built by one person. Choose your shape.

(Drop the existing "Fixed-price or hourly - from one-page builds to full products." line.)

#### Tile copy (replace existing)

| Tile | Title | Body |
|---|---|---|
| 1 | Product & UX Design | SaaS interfaces, dashboards, and mobile apps. Research, wireframes, hi-fi UI, and design systems your engineers can build from. Same person designs and ships — no handoff meetings. |
| 2 | WordPress + Elementor | Brand-led WordPress builds your team can actually edit. Schema-marked, performance-tuned, handed over with a Loom walkthrough. AI-assisted dev so basic sites ship in days. |
| 3 | Custom Next.js Builds | Bespoke marketing sites, conversion pages, and lightweight web apps on Next.js + Tailwind. Green Core Web Vitals out of the box. |
| 4 | AI Image & Video Direction | Directed AI imagery for brand and marketing — image libraries, social content, product visuals. Briefed and art-directed, not slot-machined. |
| 5 | SEO, AEO & Schema | Schema.org markup, local SEO, and AEO so Google (and AI assistants) understand the page. Plus Google Ads when you need traffic this week. |
| 6 | Brand, Strategy & Audits | Positioning, copy direction, palette, and async audits. Useful when the build is fine but the message isn't landing. |

#### Removed from each tile

- The `timeline` field (e.g., "1–3 weeks") — drop the data + the visible pill.
- The `scope` field ("Includes: discovery, design, prototypes, handover") — drop the data + the visible line. The new tile body already covers what's included; an extra "includes" line adds SOW vibes.

#### CMS comfort strip (new, below the grid)

A small horizontal strip with three logos:

```
Comfortable in:    [WordPress]   [Sanity]   [Webflow]
                   for clients who want a backend they can actually use.
```

- Eyebrow-style mini-section
- `mt-12 pt-8 border-t border-border-subtle`
- Logos at ~24px height, muted, `hover:text-white`
- One-line caption beneath

#### Code structure
The `services` array drops `timeline` and `scope`. Tile JSX drops the bottom block (`mt-auto`/`space-y-3` div containing the timeline pill + scope text). Existing card chrome (icon, title, description) stays.

#### Acceptance check
- All six tiles render with new body copy.
- No timeline pill or "Includes:" line visible.
- CMS strip renders with three logos beneath the grid.
- Hover states still work (border + glow + title color shift).

---

### S6. NEW: Prototype Showcase (`components/sections/PrototypeShowcase.tsx`)

#### File: new

#### Layout

```
[How I work, demonstrated]          ← eyebrow

Vibe-coded prototypes               ← H2
Real, clickable, tweak-able. Not Figma frames.   ← sub

┌──────────────────────────────────────┐
│   [ POS demo screenshot or short    ]│
│   [ looping mp4 of the demo running ]│
└──────────────────────────────────────┘

Every project starts with a working prototype, not a static mockup.
AI-assisted development lets us iterate live — swap a flow, test a
variant, change a layout — in minutes instead of days.

Decisions get made on real product. Feedback loops shorten.
Surprises at handoff don't happen, because there's no handoff.

           [ Open the prototype → ]
```

#### Copy (verbatim)

- Eyebrow: *How I work, demonstrated*
- H2: **Vibe-coded prototypes**
- Sub: *Real, clickable, tweak-able. Not Figma frames.*
- Body 1: Every project starts with a working prototype, not a static mockup. AI-assisted development lets us iterate live — swap a flow, test a variant, change a layout — in minutes instead of days.
- Body 2: Decisions get made on real product. Feedback loops shorten. Surprises at handoff don't happen, because there's no handoff.
- Body 3 (small, muted): Click below to play with one I built.
- Button: **Open the prototype →**

#### Behavior

- Button click dispatches `window.dispatchEvent(new CustomEvent('prototype:open'))`.
- ProductHero listens for this event and opens its existing modal.

#### Visual

- Section structure mirrors Services / Resources patterns: `max-w-6xl mx-auto`, `py-12 md:py-24`, `bg-bg-primary`.
- Image/video container: `bg-bg-secondary rounded-xl border border-border-subtle aspect-video`, max width ~768px centered.
- For first pass, use a static screenshot. The video can come later — listed as out of scope.
- CTA button: same `bg-bg-secondary border` treatment as elsewhere, NOT the Upwork green (this isn't a sales surface — keep it neutral).

#### Asset needed

- `public/images/prototype-showcase.png` — high-quality screenshot of the POS demo in its open state. Capture from the live modal.

#### Insertion point

In `app/page.tsx`, between `<Process />` and `<Resources />`:

```tsx
<Process />
<PrototypeShowcase />
<Resources />
```

#### Acceptance check
- Section renders between Process and Resources.
- Image displays.
- Clicking the button opens the existing POS modal.
- Closing the modal works (existing close behavior unchanged).

---

### S7. Process (`components/sections/Process.tsx`) — remove drag

#### Change
Set `drag={false}` on the `motion.div` in `ProcessNode` (line ~243). Or remove the prop. Or replace `motion.div` with plain `div` since drag was its main reason for being a motion node.

Optional: remove the `cursor-grab active:cursor-grabbing` classes since they imply draggability.

Optional: remove the "(Drag to explore)" hint copy on line 53.

#### What stays
The visual layout (4 cards with connecting SVG paths, big-numbered backgrounds, hover scale). The connecting paths can stay since they're decorative SVG with no interaction dependency.

#### Acceptance check
- Cannot drag a process card on desktop.
- Cards still hover-scale.
- Visual connecting lines still render.
- "(Drag to explore)" copy gone.

---

### S8. Resources — no change

---

### S9. About (`components/sections/About.tsx`) — copy rewrite

#### Replace bio paragraphs with:

> I'm George — a product designer and developer based in Cyprus. I've been freelancing for 12 years and spent two of those leading design at Input Output, the engineering company behind Cardano.
>
> I designed and shipped RealFi — a financial inclusion platform now serving SMEs in East Africa, part of Cardano's $80bn ecosystem. Before that, design work for Nike Training Club, Bournemouth University, and startups across fintech, hospitality, ecommerce, and healthtech.
>
> What I do now is rare on Upwork: I design *and* build. Next.js front-end, WordPress, AI image direction, SEO, marketing automation. One person, one workflow, one person responsible.

#### "What I bring" bullets

Update to:
- Experience designing at scale — Cardano's $80bn ecosystem
- AI-native workflows — Cursor, generative tools, modern automation
- Full-stack capability — design *and* Next.js/React development
- Teaching mindset — **15K** designers follow my content on TikTok

(Change `16k` to `15K` in both copies — there are two: mobile/desktop and tablet-only.)

#### Removed

- The closing paragraph: *"Currently open for new work - small builds to full products. If you've got something to ship, let's talk."* — delete entirely.
- The trailing social links block (LinkedIn / TikTok / YouTube / Email / Phone). Reasoning: the same links are in the Hire section's bottom strip and the global Footer. Showing them three times feels insistent. Cut from About.

#### Kept

- Image column with `george-about.jpg`
- "What I bring" block (mobile + tablet variants)

#### Acceptance check
- Bio paragraphs match new copy verbatim.
- Bullet for TikTok says "15K", not "16k".
- "If you've got something to ship" copy is gone.
- Trailing social-links block is gone.
- Image column unchanged.

---

### S10. Hire on Upwork — already implemented, no change

(Per the prior spec: 2026-04-28-hire-on-upwork-section-design.md. Already deployed.)

---

### S11. Footer (`components/ui/Footer.tsx`)

#### Change 1
In the "Explore" links list (line ~39), change:

```ts
['Work', 'Services', 'Resources', 'About', 'Contact']
```

to:

```ts
['Work', 'Services', 'Resources', 'About', 'Hire on Upwork']
```

And ensure the `href` resolves to `#contact` (the section id is preserved). Either map manually or change the rendering to handle the label differently from the id.

Cleaner version: change the array to `[{label, href}]` shape:
```ts
[
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Resources', href: '#resources' },
  { label: 'About', href: '#about' },
  { label: 'Hire on Upwork', href: '#contact' },
]
```

#### Change 2
Delete the line:
> "Built with Next.js 14, Tailwind CSS & Framer Motion"

(Or update to "Built with Next.js, Tailwind, Framer Motion" without a version. Cutting it entirely is cleaner; that area becomes just the copyright.)

#### Acceptance check
- Footer "Explore" list shows "Hire on Upwork" (not "Contact"); link still scrolls to the section.
- "Built with Next.js 14" copy removed.
- Copyright line still present.

---

### S12. Token fix (`app/globals.css`)

Change:
```css
--text-dim: #707070;
```
to:
```css
--text-dim: #909090;
```

#### Why
3.9:1 → 5.7:1 contrast ratio against `--bg-primary` (#0F0F0F). Passes WCAG AA for normal text.

#### Spot check after change
- Intro section H2 "Your technology is " (dim half) — still legible, less faded.
- Footer copyright — slight brightness bump.
- Any other place using `text-text-dim` — eyeball pass.

---

## Asset acquisition checklist

Before implementation, fetch and save to `public/logos/`:

| File | Source | Notes |
|---|---|---|
| `iog.svg` | iohk.io / IOG brand assets | Wordmark or "IOG" mark. Preferred white/single-color. |
| `cardano.svg` | cardano.org/brand-assets | Wordmark or ADA mark — pick whichever reads at 28px height. |
| `nike.svg` | Standard Swoosh, widely available official SVG | Single-path, single-color. |
| `bournemouth.svg` | Bournemouth University brand resources | Consider whether to use the "BU" monogram or the full wordmark. |
| `wordpress.svg` | wordpress.org/about/logos | The simple W mark. |
| `sanity.svg` | sanity.io brand resources | Wordmark. |

For each: replace any hardcoded fill with `currentColor` so they pick up the parent's `color`.

Also needed:
- `public/images/prototype-showcase.png` — screenshot of the POS demo. Capture from `localhost:3000`, click "Test a Prototype" (in the *current* hero — this is captured *before* implementation removes the button), screenshot the modal at desktop size.

---

## Suggested execution order

Order is chosen to minimize risk: copy/style changes first, then structural moves, finally the new section.

1. **Token fix** (S12) — one-line CSS change. Verify nothing breaks.
2. **Footer fixes** (S11) — small, well-scoped.
3. **Process drag removal** (S7) — small, well-scoped.
4. **Services rewrite** (S5) — copy-only changes plus the CMS strip.
5. **About rewrite** (S9) — copy-only.
6. **Hero cleanup** (S1) — meaningful refactor: remove System Lab modal, remove Test a Prototype button, remove `select-none`, update copy. Save the modal-event-listener change for the *next* step.
7. **CredibilityBar rebuild** (S2) — depends on logos being available. Source logos first.
8. **Prototype Showcase + modal lifecycle change** (S6) — new file + the `prototype:open` event hookup in ProductHero.
9. **Verify** end-to-end on dev, then mobile responsive, then ship one big commit.

Suggested commit shape: one focused commit per stage, OR group as `polish: post-pivot copy + restructure` if shipping all at once. Given prior practice in this repo, a single bundled commit is fine.

---

## Acceptance criteria for the whole release

- [ ] Hero: new H1 + sub, no "Test a Prototype" button, no "Start a project" line, no System Lab modal, text is selectable.
- [ ] CredibilityBar: visible on mobile + desktop, four client logos render, "View case studies" link works.
- [ ] Services: all six tiles use new copy, no timelines, no "Includes:" lines, CMS strip with three logos below.
- [ ] Prototype Showcase: section exists between Process and Resources, button opens existing POS modal.
- [ ] Process: cannot drag cards, "(Drag to explore)" copy gone.
- [ ] About: new bio, "15K" not "16k", no closing CTA paragraph, no trailing social-links block.
- [ ] Footer: "Hire on Upwork" label, no "Built with Next.js 14" line.
- [ ] `--text-dim` is #909090.
- [ ] Production build passes (`npm run build`).
- [ ] No console errors on dev server load.
- [ ] Mobile (375px), tablet (768px), desktop (1440px) all render without obvious layout breakage.

---

## Out of scope (deferred)

- Looping video for the Prototype Showcase (use static screenshot first).
- Lifting modal state out of ProductHero into app-level context (use event-bus pattern instead).
- Before/after gallery (good idea borrowed from DodgeUX, but separate effort — needs paired screenshots from Kingfisher rebuild and others).
- Renaming the section anchor `#contact` to `#hire` (would require updating nav, footer, and any inbound links — not worth the churn).
- Reorganizing the case studies array into separate data files.
- Cleaning up BOM bytes in the `'use client'` directives flagged in earlier review.

---

## Open questions for the implementer

1. **Bournemouth University logo usage** — confirm the work for them was attributable enough to feature alongside Nike / IOG. If not, drop and add a fifth (perhaps a shipped client like UK Vehicles Cyprus or Kingfisher Mortgages, though those are smaller brands).
2. **Sanity vs. alternative** — Sanity is the recommended headless CMS. If George prefers Payload or Strapi, swap that logo. The signal is "I can hand you a backend you can use," not the specific tool.
3. **Prototype showcase asset format** — start with PNG. If, after looking at the live result, a 5–10 second silent mp4 loop would land harder, we can revisit.
4. **Hero subhead alternative** — "End to end. By one person." is the recommended line. Alternatives if it lands flat in context:
   - "I design and build. End to end. Rare on Upwork."
   - "Designer who can also code. One person, one workflow."
   - "Product, web, brand, AI — all by the same person."

---

## Files modified (summary)

```
M  app/globals.css                             (token bump)
M  app/page.tsx                                 (insert <PrototypeShowcase />)
M  components/sections/About.tsx                (copy rewrite)
M  components/sections/CredibilityBar.tsx       (rebuilt)
A  components/sections/PrototypeShowcase.tsx    (new)
M  components/sections/ProductHero.tsx          (event listener for prototype:open)
M  components/sections/Process.tsx              (drag removed)
M  components/sections/Services.tsx             (copy + CMS strip)
M  components/ui/Footer.tsx                     (label + version line)
M  components/ui/HeroText.tsx                   (System Lab removed, copy update)
A  public/images/prototype-showcase.png         (new asset)
A  public/logos/iog.svg                         (new asset)
A  public/logos/cardano.svg                     (new asset)
A  public/logos/nike.svg                        (new asset)
A  public/logos/bournemouth.svg                 (new asset)
A  public/logos/wordpress.svg                   (new asset)
A  public/logos/sanity.svg                      (new asset)
```

That's it. Ship.
