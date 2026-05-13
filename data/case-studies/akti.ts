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
    stack: ['react', 'vite', 'webflow'],
    links: {
        live: 'https://efesop.com/akti/',
    },
    comparison: {
        heading: 'Same site, two stacks',
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
    visual: {
        situation: 'Fictional backyard-studio prefab brand in Limassol, priced 115k to 225k euro. Two pages (landing + five-step configurator), shipped end-to-end on React + Vite, then rebuilt in Webflow so a non-technical team could maintain it.',
        audience: 'Cold Instagram visitors making a six-figure decision, around 60% on mobile. Couples, retirees and families looking at a guest house, home office or starter home, not architecture students. Success bar: understand the product within eight seconds.',
        what_made_it_hard: 'Cypriot prefab is dominated by shipping containers with bad windows, so the buyer\'s reference points work against the work. AI-generated photography had to read as a real product, not a render that trips the AI-image alarm.',
        honest_note: 'Fictional brand, outcomes are qualitative. Render coverage is uneven (Aktí 60 has the full style/exterior/add-on set; the other three models fall back to A60 imagery in the configurator preview). The Webflow rebuild is a portfolio engagement and links out to the original React configurator rather than reproducing it.',
        process: 'Samara teardown, paper IA, brand fiction (name, voice, pricing) before any visual direction. Around 60 product renders via Nano Banana Pro from a locked architectural-DNA prompt block. Static HTML prototype, then React + Vite, then a Webflow rebuild driven by the official Webflow MCP with Variables-bound design tokens.',
        outcome: 'Live at efesop.com/akti as a React app plus a Webflow rebuild at akti-e65d14.webflow.io. The marketing team can re-skin the Webflow site from one Variables panel and publish CMS posts without filing tickets; the React app stays live as the configurator host.',
        stack: ['react', 'vite', 'webflow'],
        links: [
            { href: 'https://efesop.com/akti/', label: 'React build', logo: 'react' },
            { href: 'https://akti-e65d14.webflow.io', label: 'Webflow build', logo: 'webflow' },
        ],
        gallery: [
            {
                image: '/images/akti/akti__s1__product-grid-four-models__desktop.png',
                title: 'Four models, four photographs.',
                description: 'The catalogue is the navigation: oblique shots, terse labels, no spec lists, prices pushed below the fold to one strip.',
            },
            {
                image: '/images/akti/akti__s4__how-it-works__desktop.png',
                title: 'Workshop to doorstep, before the price strip.',
                description: 'Factory and install photography placed ahead of pricing, so the buyer reads the number after seeing the factory rather than the other way around.',
            },
            {
                image: '/images/akti/akti__s6__configure-preview__desktop.png',
                title: 'One CTA across the entire site: Configure yours.',
                description: 'Configurator-first conversion path. No newsletter signup, no contact form, no quote request, no "Talk to a specialist" detour.',
            },
            {
                image: '/images/akti/akti__configurator__configurator-desktop__desktop.png',
                title: 'Five steps, render swap on every selection.',
                description: 'Step 1 of 5 (Model). The hero render swaps before the user moves on, and the price ticks in real time at the bottom of the preview pane.',
            },
            {
                image: '/images/akti/akti__configurator__step2-style__desktop.png',
                title: 'Incremental pricing, no reveal at checkout.',
                description: 'Step 2 of 5 (Style). Each option shows its delta against the base; the running subtotal builds through the buyer\'s own choices.',
            },
            {
                image: '/images/akti/webflow-builder.PNG',
                title: 'Variables panel as the re-skin surface.',
                description: '10 colours and 3 fonts mirrored from akti-tokens.css into a Webflow Variable Collection; every reusable style binds to it. One panel re-skins the entire site.',
            },
            {
                image: '/images/akti-webflow/gallery-grid.png',
                title: 'Native components over custom JS, on principle.',
                description: 'Webflow Starter blocks Custom Code, so the React app\'s drag-momentum lightbox became a 3-column responsive grid. Zero JS, no broken click affordances.',
            },
            {
                image: '/images/akti-webflow/blog-teaser.png',
                title: 'CMS-backed journal, the right level of dynamism.',
                description: 'Blog Posts collection (Name, Slug, Summary, Body, Hero, Date, Author) wired to /posts/[slug]. The marketing team adds posts via a form, no developer in the loop.',
            },
        ],
    },
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
