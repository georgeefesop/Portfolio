import type { CaseStudy } from './types';

const akti: CaseStudy = {
    id: 'akti',
    title: 'Aktí',
    subtitle: 'Fictional Cyprus prefab studio, built end to end on React then rebuilt in Webflow. Brand, AI photography, and a five-step configurator that turns interest into a qualified lead before any contact form loads.',
    role: 'Brand, art direction, design, build, Webflow port',
    period: '2026',
    tags: ['React', 'Webflow', 'Brand', 'AI Image', 'Configurator'],
    categories: ['design', 'nextjs', 'ai-image'],
    aiBuilt: true,
    // Top-level stack drives the thumbnail overlay on the work grid.
    // Per-build stacks live inside each `builds[]` entry below.
    stack: ['react', 'vite', 'webflow'],
    links: {
        live: 'https://efesop.com/akti/',
    },
    comparison: {
        heading: 'Same site, two stacks',
        intro: 'Both builds ship the same homepage. Desktop scores land within two points; the honest gap is mobile performance (88 vs 79), which is what Google ranks on. The trade-off: Webflow lets the marketing team publish without touching code or running a deploy. For a small brand publishing a few posts a month, that is the right call. For a high-traffic page where every Lighthouse point matters, the React build wins.',
        methodology: 'Numbers measured live via the Google PageSpeed Insights v5 API on 2026-05-08, desktop strategy. Mobile performance is shown in extras for context (Google ranks on mobile). Lighthouse scores fluctuate run-to-run by a few points; values shown are from a single sample.',
        builds: [
            {
                label: 'React + Vite',
                href: 'https://efesop.com/akti/',
                note: 'Hand-rolled static build, asset pipeline tuned for payload weight.',
                lighthouse: { performance: 99, accessibility: 87, bestPractices: 100, seo: 100 },
                extras: [
                    { label: 'Mobile perf', value: '88' },
                    { label: 'Mobile a11y', value: '87' },
                ],
            },
            {
                label: 'Webflow',
                href: 'https://akti-e65d14.webflow.io',
                note: 'Designer-built, client-editable from a Variables panel + CMS.',
                lighthouse: { performance: 97, accessibility: 86, bestPractices: 100, seo: 91 },
                extras: [
                    { label: 'Mobile perf', value: '79' },
                    { label: 'Mobile a11y', value: '84' },
                ],
            },
        ],
    },
    builds: [
        {
            id: 'react',
            label: 'Original design & build',
            description: 'Brand fiction, art direction, AI photography and a custom React/Vite build, shipped end to end.',
            stack: ['react', 'vite'],
            briefLabel: 'Design Brief',
            links: [
                { href: 'https://efesop.com/akti/', label: 'Live (React)', logo: 'react' },
            ],
            body: {
                honest_note: 'Aktí is a fictional brand built as a portfolio piece, so outcomes are qualitative rather than measured against a real funnel. Render coverage is also uneven: the Aktí 60 has the full style/exterior/add-on set, the other three models fall back to A60 imagery in the configurator preview.',
                brief: {
                    situation: 'Aktí is a fictional brand for a backyard-studio and small-home prefab business in Limassol, priced €115k to €225k. Two pages: a landing page that has to make the case in eight seconds, and a configurator that turns interest into a qualified lead. Brand fiction, art direction, AI photography and React build, end to end.',
                    audience: 'Cold visitors arriving from Instagram, around 60% on mobile, considering a six-figure decision. They are not architecture students; they are couples, retirees and families looking for a guest house, a home office or a starter home on family land. The brief put the success bar at "understands the product within eight seconds".',
                    what_made_it_hard: [
                        'The Cypriot prefab market is dominated by shipping containers with bad windows; the buyer\'s reference points are working against the work.',
                        'AI-generated photography had to read as a real product, not a render that triggers the AI-image alarm.',
                    ],
                },
                decisions: [
                    {
                        title: 'Editorial register, not real-estate listing',
                        what: 'One photograph, one sentence, one CTA. No floor plans, no agent phone, no "starting from" chip, no spec sheet above the fold.',
                        why: 'A €150k purchase has to feel like a furniture choice, not a property listing. The rejected default was a real-estate hero with prices, three CTAs and a "Get in touch" sticky bar; we cut all of it. Editorial register gives the photography room to do the persuading, and in this market the renders are the only argument the homepage actually has.',
                        screenshot: '/images/akti/akti-hero.jpg',
                        caption: 'Hero: one photograph, one sentence, one CTA. The catalogue starts on the second scroll.',
                    },
                    {
                        title: 'Models as the IA, not a menu',
                        what: 'The first scroll under the hero is four oblique architectural photographs of the four models. Names plus floor area only; no spec lists, no pricing chip, no "compare" matrix.',
                        why: 'Most prefab sites bury the photography behind a sidebar nav or a comparison table that reads like a spreadsheet, and both kill the only thing actually selling the unit. We made the four models the navigation: oblique shots, terse labels, prices pushed below the fold to one strip. Spec lists got cut from the cards because the same data lands harder inside the configurator, where it reacts to the user\'s choices.',
                        screenshot: '/images/akti/akti__s1__product-grid-four-models__desktop.png',
                        caption: 'Four models, four photographs. The catalogue is the navigation.',
                    },
                    {
                        title: 'Process transparency as trust, not marketing copy',
                        what: 'A section showing how units are built - workshop photography, panel construction, install sequence, resident lifestyle - appears before the pricing strip.',
                        why: 'At €150k+, the buyer\'s second concern after affordability is "will it actually show up and be what I thought it was." A clean render and a price is not enough in a market that has burned buyers before. Workshop and lifestyle photography ahead of the pricing strip means the buyer reads the price after seeing the factory, not before.',
                        screenshot: '/images/akti/akti__s4__how-it-works__desktop.png',
                        caption: '03 - How it works. Workshop-to-doorstep sequence placed before the pricing strip.',
                    },
                    {
                        title: 'Configurator-first conversion path',
                        what: 'One CTA across the entire site: "Configure yours." No newsletter signup, no contact form, no quote request, no "Talk to us".',
                        why: 'A contact form converts faster on warm leads but worse on cold traffic. The configurator turns "I am curious" into "I just spent four minutes building my house" before the form ever loads, and by then the visitor is qualified, contextualised and emotionally committed. The newsletter signup and "Talk to a specialist" button got rejected because they water down the single-path commitment.',
                        screenshot: '/images/akti/akti__s6__configure-preview__desktop.png',
                        caption: 'One path. The configurator is the conversion surface, not a "learn more" link.',
                    },
                    {
                        title: 'Five steps, live preview, every change visible',
                        what: 'The configurator splits the decision into five small ones (Model | Style | Add-ons | Exterior | Interior). The hero render swaps on every selection. The price ticks in real time at the bottom of the preview pane.',
                        why: 'A single long form with every option visible converts faster on power users but overwhelms first-time buyers, which is the entire audience. Five steps give each decision its own moment without thirteen other knobs distracting; the render swap shows the cost of every choice before the user moves on. The trade-off is more clicks; the friction is doing real work in slowing the €150k decision down to a manageable pace.',
                        screenshot: '/images/akti/akti__configurator__configurator-desktop__desktop.png',
                        caption: 'Step 1 of 5. The render reflects the selection before the user moves on.',
                    },
                    {
                        title: 'Incremental pricing per decision, not a price reveal at checkout',
                        what: 'Every configurator step shows a running subtotal that updates on each selection. Style adds €0, €8,500, or €18,000 to the base. Add-ons and extras tick in one by one. The final summary has no surprises.',
                        why: 'High-ticket purchase anxiety peaks at the moment the price appears. A running tally that builds through the buyer\'s own choices reframes the number as their decision, not a sticker price. The trade-off is that some buyers exit mid-configurator when they hit their limit; we accepted that because a lead who can afford the Akti 25 but not the Akti 60 is more valuable than an enquiry that goes nowhere.',
                        screenshot: '/images/akti/akti__configurator__step2-style__desktop.png',
                        caption: 'Step 2 of 5 - Style. Each option shows its delta; the subtotal updates before the user moves on.',
                    },
                ],
                process: 'Started with a Samara teardown, then sketched the IA on paper before any code. Brand fiction (name, voice, market positioning, pricing) before any visual direction. Generated around 60 product renders via Nano Banana Pro, with a locked "architectural DNA" prompt block reused across every shot so the catalogue reads as one product. Static HTML prototype first to lock the design, then ported to Vite + React 18 for the production build. Lead form wired to a Vercel serverless function with Resend and an optional Attio CRM sync, both env-gated. Image pipeline runs PNG originals through JPG q85 locally and WebP for deploy, taking the shipped payload from 402 MB to 6.9 MB. Hosted at efesop.com/akti via a Next.js rewrite from the parent portfolio.',
                outcome: {
                    summary: 'Live at efesop.com/akti as a working two-page site with a real lead capture path, a simulated reserve flow, and GA4 funnel events ready to read. The brand reads as a single product across photography, copy and pacing, rather than a prefab listing site, which was the bar set in the brief. Lead capture, CRM sync and email confirmation are wired but dormant; flipping them on is an env-var change, not a build.',
                },
            },
        },
        {
            id: 'webflow',
            label: 'Port & configure for client ease',
            description: 'Same site, rebuilt in Webflow with editable design tokens, a CMS-backed blog, and a non-technical maintenance path.',
            stack: ['webflow'],
            briefLabel: 'Site Rebuild Brief',
            links: [
                { href: 'https://akti-e65d14.webflow.io', label: 'Live (Webflow)', logo: 'webflow' },
            ],
            body: {
                honest_note: 'A portfolio rebuild on a fictional brand, not a paid client engagement. The configurator at efesop.com/akti/configurator is still the original React app; the Webflow site links out to it rather than reproducing it.',
                brief: {
                    situation: 'With Aktí running as a custom React/Vite app, I wanted to see what the same site looks like if a non-technical marketing team had to maintain it. Webflow is the obvious answer for that audience, so I rebuilt the landing using the official MCP: same visual fidelity, same copy, plus a CMS-backed blog and design tokens that let the team re-skin the brand from one panel.',
                    audience: 'A small marketing team that wants to swap colours, fonts and blog posts without filing tickets. Secondary audience: anyone evaluating whether Webflow\'s MCP server is ready to drive real production builds.',
                    what_made_it_hard: [
                        'Free Starter blocks site-level Custom Code, killing any "10 lines of JS" pattern that would normally close the gap to a custom React reference.',
                        'The Webflow MCP can\'t populate HtmlEmbed code; agent-driven JS is not shippable, it lands in the user\'s clipboard for a manual paste.',
                    ],
                },
                decisions: [
                    {
                        title: 'Variables-driven design tokens, client-editable from one panel',
                        what: 'Mirrored the React app\'s akti-tokens.css 1:1 into a Webflow Variable Collection - 10 colours, 3 fonts. Every reusable style (.btn, .eyebrow, .h2-display, .section, .page-wrap, .footer-link) binds its colour and font properties to those variables.',
                        why: 'The whole point of choosing Webflow over React for this client is one-panel re-skinning: swap the terracotta accent and every CTA, price tick and active state restyles. The rejected path was per-class hex literals, faster to build but impossible to maintain. Variables also mean the agent and the human are editing the same source of truth, neither overwriting the other.',
                        screenshot: '/images/akti/webflow-builder.PNG',
                        caption: 'Webflow Designer, hero on canvas. The right-rail Variables panel is the single re-skin surface for the whole site.',
                    },
                    {
                        title: 'Native components over custom JS, on principle',
                        what: 'The horizontal-scroll lightbox gallery from the React app became a responsive 3-column grid of plain images. Same content density, no broken click affordances, zero JS.',
                        why: 'Starter blocks Custom Code and the MCP can\'t populate HtmlEmbed, so every interactive pattern had to either use a Webflow native component or downgrade gracefully. Shipping ugly is not the same as shipping broken. The rejected path was paying for Basic + a custom-code paste-in just to keep the lightbox; the simpler 3-col grid reads cleaner on mobile, where two-thirds of the audience is.',
                        screenshot: '/images/akti-webflow/gallery-grid.png',
                        caption: 'Webflow gallery: 3-col responsive grid, 4:3 cards. Replaced the React app\'s horizontal-scroll lightbox.',
                    },
                    {
                        title: 'One configurator, one source of truth - Webflow links to it',
                        what: 'All five "Configure yours" CTAs across the Webflow site open the original React configurator in a new tab. The marketing site lives in Webflow; the conversion engine stays in the React/Vite app where it was already shipping.',
                        why: 'The configurator is a five-step, real-time-pricing, render-swapping surface and the place every lead qualifies. Rebuilding it in Webflow would either water down the UX or fork the pricing logic into two codebases that drift the moment a model price changes. Keeping one configurator means one place to update prices, one analytics funnel to read, and the marketing team focuses on the editorial parts of the site. Webflow is the storefront; the configurator is the till.',
                        screenshot: '/images/akti-webflow/configure.png',
                        caption: 'Configure CTAs open the React configurator in a new tab. One conversion engine, one source of truth.',
                    },
                    {
                        title: 'CMS for posts, the right level of dynamism for the client\'s lifecycle',
                        what: 'A Blog Posts collection (Name, Slug, Summary, Body, Hero Image, Date, Author) wired to a /posts/[slug] template page. Three published posts, fully CMS-bound. The marketing team adds a new post via a form, the template page renders it.',
                        why: 'For a small marketing team, CMS-backed posts are the unlock that makes Webflow worth choosing over a static build: new content goes live without a developer in the loop. The journal teaser starts as three curated cards rather than an auto-updating Collection List, by design. Until the team has 5+ posts, hand-picking is a feature, not a limit; swapping cards for a Collection List later is one click in Designer.',
                        screenshot: '/images/akti-webflow/blog-teaser.png',
                        caption: 'Webflow journal teaser. CMS-backed posts at /posts/[slug], with curated homepage cards the team controls.',
                    },
                ],
                process: 'The hardest part of the port was not the build, it was the editorial triage of which interactions to reproduce in Webflow vs which to leave in the React app. The original is interaction-heavy (Framer Motion, drag-momentum gallery, custom lightbox, real-time-pricing configurator) and a 1:1 visual port does not mean a 1:1 behavioural port, especially when the brief is a maintainable site for a non-technical team. Modern coding tools accelerated the structural work; every "should we keep this interaction" call was a design judgment. The decisions documented above are the artefacts of that triage. Variables-bound design tokens, CMS-backed posts and editable section copy in Designer mean the marketing team can run it without me in the loop.',
                outcome: {
                    summary: '13 sections, 3 CMS posts and 1 collection page template shipped to a live *.webflow.io preview. The marketing team can re-skin the entire site from one Variables panel, publish posts from the CMS, and edit any section copy directly in Designer. The original React app stays live alongside it as the configurator host: two builds, one brand, two sources of truth for two parts of the funnel. Editorial in Webflow, conversion in React.',
                },
            },
        },
    ],
    images: {
        thumbnail: '/images/akti/akti-hero.jpg',
        hero: '/images/akti/akti-hero.jpg',
        gallery: {
            desktop: [
                '/images/akti/akti-hero.jpg',
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
