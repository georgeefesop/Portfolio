import type { CaseStudy } from './types';

const pmuProfitSystem: CaseStudy = {
    id: 'pmu-profit-system',
    title: 'PMU Profit System',
    subtitle: "A conversion-focused landing page and membership platform for permanent-makeup artists, designed and built end to end: CRO, brand system, gated content and Stripe payments.",
    role: 'Design & build (solo)',
    period: '2024-2025',
    tags: ['Landing Page', 'CRO', 'Membership', 'Full-stack', 'Stripe', 'Next.js'],
    categories: ['design', 'nextjs'],
    links: {},
    stack: ['nextjs', 'supabase', 'stripe', 'tailwindcss', 'typescript'],
    visual: {
        situation: "PMU Profit System is a marketing system for permanent-makeup artists. I designed and built the whole web product: a conversion-focused landing page that turns cold Meta-ad traffic into buyers, wired to a gated members' area that delivers the training the moment they pay.",
        audience: "Working permanent-makeup artists, arriving cold from paid social and sceptical of one more 'grow your business' pitch, deciding in seconds whether to trust the numbers.",
        what_made_it_hard: "Winning a sceptical, cold audience on a single scroll, then carrying them from believing to buying to logged-in with no friction, all on a stack I designed and built end to end.",
        honest_note: "A self-initiated product, built launch-ready and shown here as a portfolio piece. No live revenue is claimed; the funnel numbers come from real campaigns I ran for a Cyprus PMU studio, not from this product's sales.",
        process: "CRO-led landing page (interactive ROI calculator, before/after booking proof, inbox-overload social proof, one repeated call to action), a frictionless Stripe checkout that provisions the account and drops the buyer straight into their content, and a 15-module members' area. Next.js front to back, Supabase for auth and entitlements, Stripe for payments.",
        outcome: "A complete, conversion-designed product: landing page, brand system, members' area and payment flow, designed, written and built by one person.",
        links: [],
        stack: ['nextjs', 'supabase', 'stripe', 'tailwindcss', 'typescript'],
        gallery: [
            { image: '/images/pmu-profit-system/deck/02.webp', title: 'What I built', description: "One product with two jobs: sell the program to a cold visitor, then hand the buyer their members' area with no seam. Next.js, Supabase and Stripe, designed and built solo." },
            { image: '/images/pmu-profit-system/deck/03.webp', title: 'Turn a stranger into a member', description: "The page has one job before any other: make a working artist believe the math in seconds. The edge: I ran the marketing for a Cyprus PMU studio, so I knew the funnel and the objections firsthand." },
            { image: '/images/pmu-profit-system/deck/04a.webp', title: 'A page built to convert', description: "The headline proof is an interactive ROI calculator: the visitor sets their own ad spend and the funnel math derives in front of them, so the number is theirs, not mine." },
            { image: '/images/pmu-profit-system/deck/04b.webp', title: 'Proof as a full diary', description: "A before/after booking calendar, down to a Thursday where ads pause because the studio is too busy. It makes 'more clients' concrete in the unit artists actually feel." },
            { image: '/images/pmu-profit-system/deck/04c.webp', title: 'Inbox overload, one clear action', description: "Social proof shown as an inbox flooded with inquiries, and a single clay call to action repeated down the page with the navigation stripped back." },
            { image: '/images/pmu-profit-system/deck/05.webp', title: 'The page, in full', description: "Hero, audience targeting shown as people not icons, social proof, the Inner Circle membership and the closing call to action." },
            { image: '/images/pmu-profit-system/deck/06.webp', title: 'From card to content, with no seam', description: "A Stripe payment creates the account and entitlement in one step; the buyer lands inside the members' area already logged in, the first lesson waiting. No 'check your email', no second signup." },
            { image: '/images/pmu-profit-system/deck/07a.webp', title: 'Everything behind one door', description: "Past checkout, the membership feels like a product, not a folder of videos. Access is gated by entitlement, so the content only exists for someone who bought it." },
            { image: '/images/pmu-profit-system/deck/07b.webp', title: "The members' area", description: "A dashboard, a 15-module video curriculum, and an AI Ad Generator that turns the course's theory into the artist's next campaign." },
            { image: '/images/pmu-profit-system/deck/08a.webp', title: 'One calm, clinical system', description: "A medspa palette (sage, clay, warm stone) and a display-plus-interface type pairing: premium enough to trust with a card, warm enough to never feel like cold SaaS." },
            { image: '/images/pmu-profit-system/deck/08b.webp', title: 'Components and one re-themeable system', description: "A small component kit with a single accent rule (clay means action), built on Tailwind with the palette remapped at the token level, so the whole product re-themes from one config." },
            { image: '/images/pmu-profit-system/deck/09.webp', title: 'Designed and built, not just mocked up', description: "A running product: Next.js front and back, Supabase for auth and gated content, Stripe for payments and webhooks. The conversion logic and the code never went through a translation layer." },
            { image: '/images/pmu-profit-system/deck/10.webp', title: 'The full loop', description: "Landing page, brand, members' area and payment flow, designed, written and built by one person." },
        ],
    },
    images: {
        thumbnail: '/images/pmu-profit-system/deck/thumb.webp',
        hero: '/images/pmu-profit-system/deck/01.webp',
        gallery: [
            '/images/pmu-profit-system/deck/01.webp',
            '/images/pmu-profit-system/deck/05.webp',
            '/images/pmu-profit-system/deck/04a.webp',
        ],
    },
};

export default pmuProfitSystem;
