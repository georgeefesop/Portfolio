# Aktí

**Brand, design and build for a fictional Cyprus prefab studio - landing page plus a five-step configurator with real lead capture, shipped end to end.**

- **Role:** Brand, art direction, design, build
- **Period:** 2026
- **Live:** https://efesop.com/akti/
- **Code:** https://github.com/georgeefesop/akti
- **Tags:** React, Vite, Brand, Art Direction, CRO, Configurator, AI Image, Cyprus

---

## Honest note

Aktí is a fictional Cyprus prefab brand built as a portfolio piece, so outcomes are qualitative rather than measured against a real funnel. Per-model render coverage is also incomplete: the Aktí 60 has the full style/exterior/add-on set, the other three models fall back to A60 imagery in the configurator preview.

---

## Brief

**Situation.** Aktí is a fictional brand for a backyard-studio and small-home prefab business in Limassol, priced €115k to €225k. Two pages: a landing page that has to make the case in eight seconds, and a configurator that turns interest into a qualified lead. Brand fiction, art direction, AI-generated photography, React build, Vercel deploy - all done solo on one branch.

**Audience.** Cold visitors arriving from Instagram, around 60% on mobile, considering a six-figure decision. They are not architecture students; they are couples, retirees, families looking for a guest house, a home office, or a starter home on family land. The brief from the (fictional) client put the success bar at "understands the product within eight seconds".

**What made it hard:**

1. The Cypriot prefab market is dominated by shipping containers with bad windows, so the visual reference points buyers know are working against the work; the site has to look like a €150k decision in a market where it does not.
2. Cold mobile traffic with no brand familiarity needs a single-question offer answered above the fold; that rules out the multi-CTA, nav-heavy real-estate template that every competitor uses.
3. Five compounding configuration choices (model, style, add-ons, exterior, interior) had to feel like one continuous decision with running visual feedback, not a five-page wizard with a price reveal at the end.

---

## Decisions

### 1. Editorial register, not real-estate listing

One photograph, one sentence, one CTA. No floor plans, no agent phone, no "starting from" chip, no spec sheet above the fold.

A €150k purchase has to feel like a furniture choice, not a property listing. Samara is the obvious reference and it earned that position by treating the homepage as a magazine cover, not an inventory page. The rejected default was a real-estate hero with prices, three CTAs, and a "Get in touch" sticky bar; we cut all of it. The cost is that anyone who wants a spec sheet within four seconds bounces, which is the right cost because that visitor is not buying. Editorial register also gives the photography room to do the persuading; in this market the renders are what makes the difference, and crowding them with copy weakens the only argument the homepage actually has.

### 2. Models as the IA, not a menu

The first scroll under the hero is four oblique architectural photographs of the four models. Names plus floor area only; no spec lists, no pricing chip, no "compare" matrix.

Most prefab sites bury the photography behind a sidebar nav (Studio | 1BR | 2BR | Custom) or a comparison table that reads like a spreadsheet. Both kill the only thing actually selling the unit. We made the four models the navigation: oblique shots, terse labels, prices pushed below the fold to a single strip. The version with spec lists under each card ("25 m² | 90 days | solar-ready") got cut because the same data is better delivered inside the configurator where it reacts to the user's choices, rather than competing for attention with the photograph in a 250px card. The catalogue is the navigation; the navigation is the catalogue.

### 3. Configurator-first conversion path

One CTA across the entire site: "Configure yours." No newsletter signup, no contact form, no quote request, no "Talk to us".

A hardcoded contact form would have converted faster on warm leads, but it would have produced a much worse cold-traffic funnel: the configurator turns "I am curious" into "I just spent four minutes building my house" before the form ever loads. By the time the lead form appears, the visitor is qualified, contextualised, and emotionally committed. We rejected the conventional addition of a newsletter signup or a "Talk to a specialist" button because they water down the single-path commitment. One CTA across the page is also the cleanest measurement story: every drop-off has one cause, and every step in the funnel is the one before it.

### 4. Five steps, live preview, every change visible

The configurator splits the decision into five small ones (Model | Style | Add-ons | Exterior | Interior). The hero render swaps on every selection. The price ticks in real time at the bottom of the preview pane.

A single long form with every option visible converts faster on power users (Tesla, Apple BTO, custom-PC builders) but it overwhelms first-time buyers, which is the entire audience here. Five steps gives each decision its own moment without thirteen other knobs distracting. The render swap is the load-bearing piece: the cost of every choice is shown before the user moves on, so the price reveal at the end is never a surprise. The trade-off is more clicks; we accepted that because the model is buying €150k of building, not a t-shirt size, and the friction is doing real work in slowing the decision down to a manageable pace.

---

## Process

Started with a competitive teardown of Samara, then sketched the IA on paper before any code. Brand fiction (name, voice, market positioning, pricing) before any visual direction. Generated around 60 product renders via Nano Banana Pro, with a locked "architectural DNA" prompt block and a flat-3D register reused across every shot so the catalogue reads as one product. Static HTML prototype first to lock the design, then ported to Vite + React 18 + React Router for the production build. Lead form wired to a Vercel serverless function with Resend and an optional Attio CRM sync, both env-gated. Reserve flow built as a simulated Stripe Elements checkout, ready to swap in real Stripe with one prop change. Image pipeline runs PNG originals through JPG q85 locally and WebP for deploy, taking the shipped payload from 402MB to 6.9MB. Hosted at efesop.com/akti via a Next.js rewrite from the parent portfolio project.

---

## Outcome

Live at efesop.com/akti as a working two-page site with a real lead capture path, a simulated reserve flow, and GA4 funnel events ready to read. The brand reads as a single product across photography, copy, and pacing rather than as a prefab listing site, which was the bar set in the brief. Lead capture, CRM sync and email confirmation are all wired but dormant; flipping them on is an env-var change, not a build.
