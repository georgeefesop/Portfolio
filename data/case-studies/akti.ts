import type { CaseStudy } from './types';

const akti: CaseStudy = {
    id: 'akti',
    title: 'Aktí',
    subtitle: 'Brand, design and build for a fictional Cyprus prefab studio - landing page plus a five-step configurator with real lead capture, shipped end to end.',
    role: 'Brand, art direction, design, build',
    period: '2026',
    tags: ['React', 'Vite', 'Brand', 'Art Direction', 'CRO', 'Configurator', 'AI Image', 'Cyprus'],
    categories: ['design', 'nextjs', 'ai-image'],
    aiBuilt: true,
    links: {
        live: 'https://efesop.com/akti/',
        github: 'https://github.com/georgeefesop/akti',
    },
    body: {
        honest_note: 'Aktí is a fictional Cyprus prefab brand built as a portfolio piece, so outcomes are qualitative rather than measured against a real funnel. Per-model render coverage is also incomplete: the Aktí 60 has the full style/exterior/add-on set, the other three models fall back to A60 imagery in the configurator preview.',
        brief: {
            situation: 'Aktí is a fictional brand for a backyard-studio and small-home prefab business in Limassol, priced €115k to €225k. Two pages: a landing page that has to make the case in eight seconds, and a configurator that turns interest into a qualified lead. Brand fiction, art direction, AI-generated photography, React build, Vercel deploy - all done solo on one branch.',
            audience: 'Cold visitors arriving from Instagram, around 60% on mobile, considering a six-figure decision. They are not architecture students; they are couples, retirees, families looking for a guest house, a home office, or a starter home on family land. The brief from the (fictional) client put the success bar at "understands the product within eight seconds".',
            what_made_it_hard: [
                'The Cypriot prefab market is dominated by shipping containers with bad windows, so the visual reference points buyers know are working against the work; the site has to look like a €150k decision in a market where it does not',
            ],
        },
        decisions: [
            {
                title: 'Editorial register, not real-estate listing',
                what: 'One photograph, one sentence, one CTA. No floor plans, no agent phone, no "starting from" chip, no spec sheet above the fold.',
                why: 'A €150k purchase has to feel like a furniture choice, not a property listing. Samara is the obvious reference and it earned that position by treating the homepage as a magazine cover, not an inventory page. The rejected default was a real-estate hero with prices, three CTAs, and a "Get in touch" sticky bar; we cut all of it. The cost is that anyone who wants a spec sheet within four seconds bounces, which is the right cost because that visitor is not buying. Editorial register also gives the photography room to do the persuading; in this market the renders are what makes the difference, and crowding them with copy weakens the only argument the homepage actually has.',
                screenshot: '/images/akti/akti-hero.png',
                caption: 'Hero: one photograph, one sentence, one CTA. The catalogue starts on the second scroll.',
            },
            {
                title: 'Models as the IA, not a menu',
                what: 'The first scroll under the hero is four oblique architectural photographs of the four models. Names plus floor area only; no spec lists, no pricing chip, no "compare" matrix.',
                why: 'Most prefab sites bury the photography behind a sidebar nav (Studio | 1BR | 2BR | Custom) or a comparison table that reads like a spreadsheet. Both kill the only thing actually selling the unit. We made the four models the navigation: oblique shots, terse labels, prices pushed below the fold to a single strip. The version with spec lists under each card ("25 m² | 90 days | solar-ready") got cut because the same data is better delivered inside the configurator where it reacts to the user\'s choices, rather than competing for attention with the photograph in a 250px card. The catalogue is the navigation; the navigation is the catalogue.',
                screenshot: '/images/akti/akti__s1__product-grid-four-models__desktop.png',
                caption: 'Four models, four photographs. The catalogue is the navigation.',
            },
            {
                title: 'Process transparency as trust, not marketing copy',
                what: 'A section showing how units are built - workshop photography, panel construction, install sequence, resident lifestyle - appears before the pricing strip.',
                why: 'At €150k+, the buyer\'s second concern after affordability is "will it actually show up and be what I thought it was." The fast-build market in Cyprus has burned enough buyers that a clean render and a price is not enough. Showing the workshop and a resident in a finished unit gives the "ready in 90 days" claim a physical reality. We positioned this section before the pricing strip deliberately: a buyer who has already seen the factory and a happy resident reads the prices differently than one who has only seen renders.',
                screenshot: '/images/akti/akti__s4__how-it-works__desktop.png',
                caption: '03 - How it works. Workshop-to-doorstep sequence placed before the pricing strip.',
            },
            {
                title: 'Configurator-first conversion path',
                what: 'One CTA across the entire site: "Configure yours." No newsletter signup, no contact form, no quote request, no "Talk to us".',
                why: 'A hardcoded contact form would have converted faster on warm leads, but it would have produced a much worse cold-traffic funnel: the configurator turns "I am curious" into "I just spent four minutes building my house" before the form ever loads. By the time the lead form appears, the visitor is qualified, contextualised, and emotionally committed. We rejected the conventional addition of a newsletter signup or a "Talk to a specialist" button because they water down the single-path commitment. One CTA across the page is also the cleanest measurement story: every drop-off has one cause, and every step in the funnel is the one before it.',
                screenshot: '/images/akti/akti__s6__configure-preview__desktop.png',
                caption: 'One path. The configurator is the conversion surface, not a "learn more" link.',
            },
            {
                title: 'Five steps, live preview, every change visible',
                what: 'The configurator splits the decision into five small ones (Model | Style | Add-ons | Exterior | Interior). The hero render swaps on every selection. The price ticks in real time at the bottom of the preview pane.',
                why: 'A single long form with every option visible converts faster on power users (Tesla, Apple BTO, custom-PC builders) but it overwhelms first-time buyers, which is the entire audience here. Five steps gives each decision its own moment without thirteen other knobs distracting. The render swap is the load-bearing piece: the cost of every choice is shown before the user moves on, so the price reveal at the end is never a surprise. The trade-off is more clicks; we accepted that because the model is buying €150k of building, not a t-shirt size, and the friction is doing real work in slowing the decision down to a manageable pace.',
                screenshot: '/images/akti/akti__configurator__configurator-desktop__desktop.png',
                caption: 'Step 1 of 5. The render reflects the selection before the user moves on.',
            },
            {
                title: 'Incremental pricing per decision, not a price reveal at checkout',
                what: 'Every configurator step shows a running subtotal that updates on each selection. Style adds €0, €8,500, or €18,000 to the base. Add-ons and extras tick in one by one. The final summary has no surprises.',
                why: 'High-ticket purchase anxiety peaks at the moment the price appears. When buyers only see a final number, they compare it against their ceiling and often bail. Showing the same total as a running tally that builds through their own choices reframes the number as their decision - not a sticker price. The trade-off is that showing the price at every step means some buyers will exit mid-configurator when they hit their limit; we accepted that because a lead who knows they cannot afford the Akti 60 but can afford the Akti 25 is more valuable than an enquiry that goes nowhere.',
                screenshot: '/images/akti/akti__configurator__step2-style__desktop.png',
                caption: 'Step 2 of 5 - Style. Each option shows its delta; the subtotal updates before the user moves on.',
            },
        ],
        process: 'Started with a competitive teardown of Samara, then sketched the IA on paper before any code. Brand fiction (name, voice, market positioning, pricing) before any visual direction. Generated around 60 product renders via Nano Banana Pro, with a locked "architectural DNA" prompt block and a flat-3D register reused across every shot so the catalogue reads as one product. Static HTML prototype first to lock the design, then ported to Vite + React 18 + React Router for the production build. Lead form wired to a Vercel serverless function with Resend and an optional Attio CRM sync, both env-gated. Reserve flow built as a simulated Stripe Elements checkout, ready to swap in real Stripe with one prop change. Image pipeline runs PNG originals through JPG q85 locally and WebP for deploy, taking the shipped payload from 402MB to 6.9MB. Hosted at efesop.com/akti via a Next.js rewrite from the parent portfolio project.',
        outcome: {
            summary: 'Live at efesop.com/akti as a working two-page site with a real lead capture path, a simulated reserve flow, and GA4 funnel events ready to read. The brand reads as a single product across photography, copy, and pacing rather than as a prefab listing site, which was the bar set in the brief. Lead capture, CRM sync and email confirmation are all wired but dormant; flipping them on is an env-var change, not a build.',
        },
    },
    images: {
        thumbnail: '/images/akti/akti-thumb.jpg',
        hero: '/images/akti/akti-hero.png',
        gallery: {
            desktop: [
                '/images/akti/akti-hero.png',
                '/images/akti/akti__s1__product-grid-four-models__desktop.png',
                '/images/akti/akti__s2__gallery-face-on-showcase__desktop.png',
                '/images/akti/akti__s6__configure-preview__desktop.png',
                '/images/akti/akti__configurator__configurator-desktop__desktop.png',
                '/images/akti/akti__configurator__step2-style__desktop.png',
                '/images/akti/akti__s4__how-it-works__desktop.png',
            ],
            tablet: [
                '/images/akti/akti__hero__hero__tablet.png',
            ],
            mobile: [
                '/images/akti/akti__hero__hero__mobile.png',
                '/images/akti/akti__configurator__configurator-mobile__mobile.png',
            ],
        },
    },
};

export default akti;
