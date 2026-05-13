import type { CaseStudy } from './types';

const kingfisher: CaseStudy = {
    id: 'kingfisher-mortgages',
    title: 'Kingfisher Mortgages',
    subtitle: 'A specialist UK mortgage broker, built twice for comparison. WordPress + Elementor (AI-driven build via Elementor MCP) then rebuilt on Next.js + Sanity headless. Same brand, same copy, real numbers on both.',
    role: 'Brand, design, build (WordPress and Next.js)',
    period: '2025',
    tags: ['Elementor MCP', 'WordPress', 'Next.js', 'Sanity', 'Brand'],
    categories: ['wordpress', 'nextjs', 'design'],
    aiBuilt: true,
    stack: ['wordpress', 'elementor', 'nextjs', 'sanity'],
    links: { live: '/kingfisher' },
    comparison: {
        heading: 'Same brand, two stacks',
        methodology: 'Numbers measured live via the Google PageSpeed Insights v5 API on 2026-05-03, desktop strategy, against /kingfisher and /kingfisher-sanity on production. Lighthouse scores fluctuate run-to-run by a few points; values shown are from a single sample.',
        builds: [
            {
                label: 'WordPress + Elementor',
                href: '/kingfisher',
                note: 'Free Elementor tier, built via Elementor MCP.',
                lighthouse: { performance: 78, accessibility: 93, bestPractices: 96, seo: 83 },
                extras: [
                    { label: 'Page weight', value: '7.2 MB' },
                    { label: 'Requests', value: '40' },
                    { label: 'DOM tags', value: '729' },
                    { label: 'Mobile perf', value: '56' },
                ],
            },
            {
                label: 'Next.js + Sanity',
                href: '/kingfisher-sanity',
                note: 'Headless CMS, ISR, server components.',
                lighthouse: { performance: 96, accessibility: 88, bestPractices: 100, seo: 100 },
                extras: [
                    { label: 'Page weight', value: '860 KB' },
                    { label: 'Requests', value: '26' },
                    { label: 'DOM tags', value: '430' },
                    { label: 'Mobile perf', value: '67' },
                ],
            },
        ],
    },
    visual: {
        situation: 'Reposition a fictional UK mortgage broker for self-employed borrowers, then ship the same homepage on two stacks (WordPress + Elementor MCP, then Next.js + Sanity) so the choice between them is visible rather than theoretical.',
        audience: 'Self-employed borrowers (freelancers, contractors, limited company directors) who arrived after being turned down by a bank or stitched up by a comparison site.',
        what_made_it_hard: 'Visitors land carrying rejection, not curiosity, so the first surface had to acknowledge that before any feature copy ran.',
        honest_note: 'Fictional brand. The judgement calls are the case study; the Lighthouse numbers below are real, the lender quotes and URLs are illustrative.',
        process: 'Brand fiction first, then a one-block visual system (Fraunces + Inter, italic-coral em rule, cream panels, offset coral shadow), then built end-to-end via Elementor MCP, then ported to Next.js + Sanity for the comparison.',
        outcome: 'Two production homepages, same brand, same copy. The headless rebuild drops page weight from 7.2 MB to 860 KB and lifts desktop Lighthouse performance from 78 to 96.',
        stack: ['wordpress', 'elementor', 'nextjs', 'sanity'],
        links: [
            { href: '/kingfisher', label: 'WordPress build', logo: 'wordpress' },
            { href: '/kingfisher-sanity', label: 'Next.js + Sanity', logo: 'sanity' },
        ],
        gallery: [
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__desktop.png',
                title: 'The bank said no, so we said fine.',
                description: 'Hero pairs Fraunces serif with italic-coral on the audience\'s job titles, naming rejection in the first three seconds.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s3__what-could-you-actually-afford__desktop.png',
                title: 'What could you actually afford?',
                description: 'Static indicative borrowing figure on a cream panel. No email gate, no multi-step form.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s4__from-stuck-to-keys-in-four-to-six-weeks__desktop.png',
                title: 'From stuck to keys in four to six weeks.',
                description: 'Zigzag-staggered process cards on teal with hard offset coral shadow, headline closing on italic-coral.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__desktop.png',
                title: 'Whatever self-employed looks like for you.',
                description: 'Personas section addressing freelancers, contractors and limited company directors directly, not at them.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s6__how-sarah-bought-her-first-flat-with-18-__desktop.png',
                title: 'How Sarah bought her first flat with 18% deposit.',
                description: 'Case styled like a Rightmove listing: hard numbers in a four-column row, quote dropped to a subdued cream card beneath.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s8__buy-to-let-that-counts-your-real-income__desktop.png',
                title: 'Buy-to-let that counts your real income.',
                description: 'The same homepage on the headless build: one GROQ query per page, server-rendered, hydration only where needed.',
            },
            {
                image: '/images/kingfisher-mortgages/kingfisher-mortgages__s9__awkwardquestions-answered__desktop.png',
                title: 'Awkward questions, answered.',
                description: 'FAQ on the Sanity rebuild, design tokens ported from CSS variables to TypeScript so the system survives refactors.',
            },
        ],
    },
    images: {
        thumbnail: '/images/kingfisher-thumb.jpg',
        hero: '/images/kingfisher-thumb.jpg',
        gallery: {
            desktop: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s3__what-could-you-actually-afford__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s4__from-stuck-to-keys-in-four-to-six-weeks__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s6__how-sarah-bought-her-first-flat-with-18-__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s8__buy-to-let-that-counts-your-real-income__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s9__awkwardquestions-answered__desktop.png',
            ],
            tablet: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__tablet.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__tablet.png',
            ],
            mobile: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__mobile.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__mobile.png',
            ],
        },
    },
};

export default kingfisher;
