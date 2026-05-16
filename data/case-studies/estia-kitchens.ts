import type { CaseStudy } from './types';

const estiaKitchens: CaseStudy = {
    id: 'estia-kitchens',
    title: 'Estia Kitchens',
    subtitle: 'Fictional Cyprus kitchen studio. Conversion-first build with a five-step estimator that drops into WhatsApp, AI photography across the gallery, and tracked auto-reply emails behind every form.',
    role: 'Brand, design, build, lead pipeline',
    period: '2026',
    tags: ['React', 'Vite', 'Conversion', 'AI Image', 'Lead pipeline'],
    categories: ['design', 'nextjs', 'ai-image'],
    aiBuilt: true,
    stack: ['react', 'vite'],
    links: {
        live: 'https://estia-kitchens.vercel.app',
    },
    visual: {
        situation: 'Fictional mid-market kitchen studio in Limassol. Seven pages, one primary action, fixed price floor of 4,500 euro and a 14-day install promise. Brand, copy, design, build, AI photography and the full lead pipeline shipped end to end.',
        audience: '38-year-old Cypriot homeowner renovating a 1995 flat. Fixed budget, gets three quotes before signing, trusts WhatsApp over Google reviews. Mobile-first persona - the majority of sessions land on phone, so every page has to clear a 3-second test on a phone.',
        what_made_it_hard: 'Cyprus kitchen sites bury price and reply in days, but the trust ceiling is set by a 25,000 euro Italian importer. The buyer prefers WhatsApp to email, and AI renders kill credibility on a six-figure purchase if their provenance is hidden.',
        honest_note: 'Fictional brand. Phone, WhatsApp and Google review counts are placeholders that swap in on a real client deploy. The lead pipeline (Resend auto-reply, Attio sync, PostHog + GA4 + Meta events) is live and tested against the demo URL.',
        process: 'Brand, persona and copy locked in three markdown files before any code shipped. Hand-rolled CSS tokens keyed off a per-brand file (no Tailwind, no shadcn); a serverless handler validates the payload and fans out to Resend, Attio, PostHog, GA4 and Meta in one round-trip.',
        outcome: 'Seven pages live at estia-kitchens.vercel.app. Lighthouse audited at launch - mobile 90+, accessibility 100, best practices 100, SEO 100. Lead pipeline (form to Resend to Attio to PostHog) runs end-to-end against the demo URL and is the asset most directly portable to a real Cyprus kitchen client.',
        stack: ['react', 'vite'],
        links: [
            { href: 'https://estia-kitchens.vercel.app', label: 'Live site', logo: 'react' },
        ],
        gallery: [
            {
                image: '/images/estia-kitchens/estia__s01__commitments__desktop.png',
                title: 'Three commitments. No fine print.',
                description: 'Designed in our studio, pricing visible before you call, fourteen days from sign to install. The three claims the rest of the page has to back up.',
            },
            {
                image: '/images/estia-kitchens/estia__s02__pricing__desktop.png',
                title: 'Know your range before you call.',
                description: 'Essential, Signature, Bespoke tiers surfaced before the calculator, so a visitor can rule the brand in or out without investing five minutes.',
            },
            {
                image: '/images/estia-kitchens/estia__s07__reviews__desktop.png',
                title: 'What people post when nobody asks.',
                description: 'Placeholder: 4.9 across 180 Google reviews at build time, three pulled in verbatim. Proof from a channel Cypriot buyers trust over a curated testimonial wall.',
            },
            {
                image: '/images/estia-kitchens/estia__s10__calculator-cta__desktop.png',
                title: 'Leave with a price in four minutes.',
                description: 'Home-page CTA for the calculator framed as the value the visitor walks away with, not a lead magnet that costs them an email.',
            },
            {
                image: '/images/estia-kitchens/estia__calculator-v2__desktop.png',
                title: 'Five-step estimator with a live euro range.',
                description: 'Size, finish, appliances, extras, estimate. The range on the right updates after every choice, so the number lands before any contact gate.',
            },
            {
                image: '/images/estia-kitchens/estia__gallery-v2__desktop.png',
                title: 'Made in Limassol. Installed across Cyprus.',
                description: 'Every install named after the property (Mesa Geitonia Flat, Tsiflikoudia Villa, Engomi Townhouse, Kapsalos Flat) with floor plan, finish spec and timeline behind each card.',
            },
            {
                image: '/images/estia-kitchens/estia__team__desktop.png',
                title: 'The people you will work with.',
                description: 'Three named team members, the same three from day 1 to day 14. Trust through specificity, not a glass-walled office stock shot.',
            },
        ],
    },
    images: {
        thumbnail: '/images/estia-kitchens/estia__s00__hero__desktop.png',
        hero: '/images/estia-kitchens/estia__s00__hero__desktop.png',
        gallery: {
            desktop: [
                '/images/estia-kitchens/estia__s01__commitments__desktop.png',
                '/images/estia-kitchens/estia__s02__pricing__desktop.png',
                '/images/estia-kitchens/estia__s07__reviews__desktop.png',
                '/images/estia-kitchens/estia__s10__calculator-cta__desktop.png',
                '/images/estia-kitchens/estia__calculator-v2__desktop.png',
                '/images/estia-kitchens/estia__gallery-v2__desktop.png',
                '/images/estia-kitchens/estia__team__desktop.png',
            ],
        },
    },
};

export default estiaKitchens;
