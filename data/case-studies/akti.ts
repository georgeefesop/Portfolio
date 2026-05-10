import type { CaseStudy } from './types';

const akti: CaseStudy = {
    id: 'akti',
    title: 'Aktí',
    subtitle: 'Brand, design and build for a fictional Cyprus prefab studio - landing page plus a five-step configurator with real lead capture, then a second life as a Webflow port for a non-technical client.',
    role: 'Brand, art direction, design, build, Webflow port',
    period: '2026',
    tags: ['React', 'Vite', 'Webflow', 'Brand', 'Configurator', 'AI Image', 'Cyprus'],
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
        intro: 'Both builds ship the same homepage, with the React build hand-rolled and asset-tuned (PNG to WebP, JPG q85) and the Webflow build inheriting Webflow\'s vendor JS, CSS and font loader. Desktop scores are within two points; the more honest gap is mobile performance (88 vs 79), which is what Google ranks on. The trade for that gap: the marketing team can publish in Webflow without touching code or running a deploy. For a small brand publishing a couple of posts a month, that is the right tradeoff. For a high-traffic page where every Lighthouse point matters, the React build wins.',
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
                        screenshot: '/images/akti/akti-hero.jpg',
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
                    situation: 'I had Aktí running as a custom React/Vite app and wanted to see what the same site looks like if a non-technical marketing team had to maintain it. Webflow is the obvious answer for that audience, so I rebuilt the landing in Webflow using the official MCP - same visual fidelity, same copy, plus a CMS-backed blog and design tokens that let the team re-skin the brand from one panel.',
                    audience: 'A small marketing team that wants to swap colours, fonts and blog posts without filing tickets. Secondary audience: anyone evaluating whether Webflow\'s MCP server is ready to drive real production builds.',
                    what_made_it_hard: [
                        'The free Starter plan blocks site-level Custom Code, which kills any "10 lines of JS" pattern - modals, drag-scroll gallery, image lightbox - that would normally close the gap to a custom React reference.',
                        'Even on a paid plan, the MCP can\'t populate HtmlEmbed code via any setting key. Three sessions in I confirmed that set_text on an HtmlEmbed creates an empty shell in the published HTML; the embed\'s internal value is not exposed. Translation: agent-driven JS is not shippable, it has to land in the user\'s clipboard for a manual paste.',
                        'Matching a custom React reference (Framer Motion entrances, drag-momentum scroll, custom lightbox, 1440px design-token system) meant trading some interactions for native Webflow components and accepting the loss where it didn\'t damage the brand.',
                    ],
                },
                decisions: [
                    {
                        title: 'Variables-driven design tokens, client-editable from one panel',
                        what: 'Mirrored the React app\'s akti-tokens.css 1:1 into a Webflow Variable Collection - 10 colours, 3 fonts. Every reusable style (.btn, .eyebrow, .h2-display, .section, .page-wrap, .footer-link) binds its colour and font properties to those variables.',
                        why: 'The whole point of choosing Webflow over React for this client is that the marketing team can re-skin the entire site by changing one variable in the Designer panel - swap the terracotta accent and every CTA, every price tick, every active state restyles. The rejected path was per-class hex literals - faster to build, impossible to maintain. Variables also mean the agent and the human are editing the same source of truth: I can change a token via style_tool with variable_as_value, the client can change the same token in Designer, and neither blows away the other.',
                        screenshot: '/images/akti/webflow-builder.PNG',
                        caption: 'Webflow Designer, hero on canvas. The right-rail Variables panel is the single re-skin surface for the whole site.',
                    },
                    {
                        title: 'Native components over custom JS, on principle',
                        what: 'The horizontal-scroll lightbox gallery from the React app became a responsive 3-column grid of plain images. Same content density, no broken click affordances, zero JS.',
                        why: 'Starter blocks Custom Code AND the MCP can\'t populate HtmlEmbed code. So every interactive pattern had to either use a Webflow native component or get downgraded gracefully - shipping ugly is not the same as shipping broken. The rejected path was paying for Basic + a custom-code paste-in just to keep the lightbox; the simpler grid actually reads cleaner on mobile, where two-thirds of the audience is. Where a downgrade would have damaged the brand (the configurator), I shipped a different solution rather than a broken one.',
                        screenshot: '/images/akti-webflow/gallery-grid.png',
                        caption: 'Webflow gallery: 3-col responsive grid, 4:3 cards. Replaced the React app\'s horizontal-scroll lightbox.',
                    },
                    {
                        title: 'One configurator, one source of truth - Webflow links to it',
                        what: 'All five "Configure yours" CTAs across the Webflow site open the original React configurator in a new tab. The marketing site lives in Webflow; the conversion engine stays in the React/Vite app where it was already shipping.',
                        why: 'The configurator is a five-step, real-time-pricing, render-swapping interactive surface - the most complex piece of the original build, and the place where every lead actually qualifies. Rebuilding it in Webflow would either water down the UX or fork the pricing logic into two codebases that drift the moment a model price changes. Keeping one configurator and pointing every CTA at it means one place to update prices, one analytics funnel to read, and the marketing team gets to focus on the editorial parts of the site - copy, photos, blog posts - which is exactly where they add value. Webflow is the storefront; the configurator is the till. Better at different things.',
                        screenshot: '/images/akti-webflow/configure.png',
                        caption: 'Configure CTAs open the React configurator in a new tab. One conversion engine, one source of truth.',
                    },
                    {
                        title: 'CMS for posts, the right level of dynamism for the client\'s lifecycle',
                        what: 'A Blog Posts collection (Name, Slug, Summary, Body, Hero Image, Date, Author) wired to a /posts/[slug] template page. Three published posts, fully CMS-bound. The marketing team adds a new post via a form, the template page renders it.',
                        why: 'For a small marketing team, CMS-backed posts are the unlock that makes Webflow worth choosing over a static build - new content goes live without a developer in the loop. The homepage journal teaser starts as three curated cards rather than an auto-updating Collection List, and that is by design: until the team has 5+ posts, hand-picking the three that lead the page is a feature, not a limit. When they reach the volume where auto-update beats curation, swapping the cards for a Collection List is a one-click change in Designer - no rebuild, no developer. The CMS template is the load-bearing part; the teaser is a dial they control.',
                        screenshot: '/images/akti-webflow/blog-teaser.png',
                        caption: 'Webflow journal teaser. CMS-backed posts at /posts/[slug], with curated homepage cards the team controls.',
                    },
                ],
                process: 'The hardest part of the port was not the build, it was the editorial triage of which interactions to reproduce in Webflow vs which to leave in the React app. The original is interaction-heavy - Framer Motion entrances, drag-momentum gallery, custom lightbox, real-time-pricing configurator - and a 1:1 visual port does not mean a 1:1 behavioural port, especially when the brief is a maintainable site for a non-technical team. Modern coding tools accelerated the structural work; every "should we keep this interaction" call was a design judgment about what actually serves the buyer vs what just demonstrates engineering. The decisions documented above are the artefacts of that triage - where Webflow native components beat the React original, where the React app stays as the source of truth, where the medium-appropriate solution beats fighting the platform. The shape of the site (Variables-bound design tokens, CMS-backed posts, editable section copy in Designer) is built so the marketing team can run it without me in the loop.',
                outcome: {
                    summary: '13 sections, 3 CMS posts and 1 collection page template shipped to a live *.webflow.io preview. The marketing team can re-skin the entire site from one Variables panel, publish blog posts from the CMS, and edit any section copy directly in Designer\'s text inspector. The original React app stays live alongside it as the configurator host - two builds, one brand, one source of truth for each part of the funnel: editorial in Webflow, conversion in React. The honest tradeoffs (interactions simplified for the medium, teaser cards curated until the team hits Collection-List volume) are documented in the build log so the client knows what is static and what is dynamic.',
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
