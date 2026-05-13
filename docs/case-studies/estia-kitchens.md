# Estia Kitchens

**Subtitle.** Fictional Cyprus kitchen studio. Conversion-first build with a five-step estimator that drops into WhatsApp, AI photography across the gallery, and tracked auto-reply emails behind every form.

**Role.** Brand, design, build, lead pipeline
**Period.** 2026
**Live.** https://estia-kitchens.vercel.app
**Tags.** React, Vite, Conversion, AI Image, Lead pipeline

## Honest note

Estia is a fictional brand built as a portfolio piece. Outcomes are qualitative; phone, WhatsApp and Google review counts are placeholders that swap in on a real client deploy. The lead pipeline (Resend auto-reply, Attio sync, PostHog + GA4 + Meta events) is live and tested against the demo URL.

## Brief

**Situation.** Estia is a fictional mid-market kitchen studio in Limassol. Seven pages, one primary action, a fixed price floor of 4,500 euro and a 14-day install promise. Brand, copy, design, build, AI photography and the full lead pipeline (form to Resend auto-reply to Attio record) shipped end to end on Vite and a Vercel serverless handler.

**Audience.** A 38-year-old Cypriot homeowner renovating a 1995 flat in Mesa Geitonia. She has a fixed budget, will get three quotes before signing, trusts WhatsApp recommendations over Google reviews and reads the headline in Greek-accented English. Around 70% of sessions land on mobile. Every page has to clear the 3-second test on a phone.

**What made it hard.**

1. Cyprus kitchen sites bury price, reply in days and ship Wix templates; the bar to clear is low, but the trust ceiling is the same as a 25,000 euro Italian importer.
2. The buyer prefers WhatsApp to email, so the conversion has to land in a thread, not an inbox, without losing the tracking and auto-reply hooks an email funnel gives you.
3. No real photography exists for a fictional brand, and AI renders that read as renders kill credibility on a six-figure purchase faster than any other mistake.

## Decisions

### 1. Audience-in-headline, one CTA, price floor above the fold

Hero reads "Your kitchen, ready in fourteen days." in Cormorant Garamond. One filled sage CTA, one text link, one Google review chip. Side meta strip: 247 kitchens installed, 4,500 to 20,000 euro range, 14 days end-to-end, 4.9 on Google.

Most Limassol kitchen sites open with a brand statement (Welcome to X) or a luxury platitude (transform your home) and three competing CTAs. Neither answers the four questions a cold visitor asks in the first three seconds: what is this, who is it for, why should I care, what do I do next. Audience-in-headline plus a hard number (fourteen days) plus a price floor (4,500 euro) settles all four before the fold and repels luxury shoppers who would have bounced at the calculator anyway. One CTA, repeated word-for-word on every page, removes the choice paralysis that a four-button hero forces on a phone.

### 2. Five-step estimator that defers the email gate to step five

A five-step calculator (size, finish, appliances, extras, estimate) with a live euro range that updates after every choice. Email and phone are only requested at step five, after the visitor has seen their own range. Submit triggers a Resend auto-reply, writes the lead to Attio with the full bracket trail, and fires a tracked event with the full funnel state.

A kitchen costs more than a car and visitors will not hand over an email to find that out. Putting the form on step one buys you a 6% conversion at best and most of those leads are junk. Deferring the gate to step five flips the deal: the calculator becomes the value, the email becomes the price of the answer. The live range builds trust on the way (numbers move, the visitor stays in control), and by the time the form lands the prospect has already self-qualified into a bracket. The Resend auto-reply lands in their inbox inside a minute with the same numbers they saw on screen, which closes the loop the WhatsApp competitors leave hanging for three days.

### 3. WhatsApp as the primary lead path, not a fallback

A 56-pixel WhatsApp button fades in bottom-right after three seconds, prefilled with a contextual message and a from_section identifier. Contact page leads with "Fastest. Usually replied within an hour." and puts WhatsApp above the form, not below it. Every click fires a whatsapp_click event with section context.

Cypriot homeowners chat. They book plumbers, dentists and renovation quotes on WhatsApp. Burying the WhatsApp button under a contact form because that is what kitchen sites in London do throws away the highest-intent channel. Putting WhatsApp first and reframing the email form as the slower second option matches how the buyer actually behaves. The tracking nuance is the part most builds miss: a WhatsApp click is not a lost lead, it is a captured one. Tagging the click with the section it fired from (hero, calculator step three, financing page) means the funnel reads end-to-end even when the conversation moves out of the browser.

### 4. AI photography with a visible provenance pill, not a hidden render

Hero photography, before/after gallery cards and the three team portraits are all generated with Nano Banana Pro. Wherever a render is not yet a real photograph, a small AI pill renders next to the caption stating the image is AI-generated. The diagonal-stripe placeholders on the remaining gallery cards flag the unshipped state without faking it.

For a fictional brand with no shoot budget, the choice is renders or stock photography, and stock kitchens read worse than competent renders on a Cypriot site. The risk is the opposite of the cliche: not that AI imagery looks fake, but that hiding the provenance reads as deception the moment a visitor zooms in. The pill costs nothing visually (it sits in the caption row at body weight) and earns the trust back, which on a 16,000 euro purchase is worth more than the half-second of polish you lose. The same pattern carries over to a real client: ship with renders on day one, swap to verified photographs as they come in, leave the disclosure architecture in place so nothing breaks when the swap happens.

## Process

Brand, persona and copy were locked in three markdown files before any code shipped, so every section had to survive a 3-second test on grey-box logic rather than be patched in CSS later. The Vite build uses hand-rolled CSS tokens (no Tailwind, no shadcn) keyed off a per-brand token file, which means a re-skin is one file edit. A Vercel serverless handler at `/api/lead` validates the payload, fires a Resend auto-reply, writes the record to Attio with the full bracket trail and emits a server-side event so the funnel reads cleanly even when the buyer turns off ad blockers. Analytics is PostHog plus GA4 plus a Meta pixel, all env-gated so the demo URL is not noisy. A vite plugin strips em dashes from JSX at build, and a banned-words grep runs before any production deploy to catch the usual AI-tells (empower, unlock, leverage, transform your home).

## Outcome

Seven pages live at estia-kitchens.vercel.app. Lighthouse mobile performance 88 (gate was 85), accessibility 100, best practices 100, SEO 100. Eight of fifteen target features fully shipped, seven stubbed at the right level for a portfolio build (real testimonials, real Google reviews API, real bilingual GR content and a chatbot backend all flagged behind ProvenanceTag pills so nothing on the page pretends to be more than it is). The lead pipeline (form to Resend to Attio to PostHog) runs end-to-end against the demo URL and is the asset most directly portable to a real Cyprus kitchen client.
