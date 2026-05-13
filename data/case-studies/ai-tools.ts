import type { CaseStudy } from './types';

const aiTools: CaseStudy = {
    id: 'ai-tools',
    title: 'AI User Tools',
    subtitle: 'A self-initiated product exploration for an AI-powered audience simulation tool that lets early-stage founders validate ideas against synthetic personas before spending real money on real users.',
    role: 'Product Designer',
    period: '2024',
    tags: ['UI/UX', 'Product Strategy', 'AI', 'Miro', 'Landing Page'],
    categories: ['design'],
    links: {},
    visual: {
        situation: 'Early-stage founders waste months on things nobody wants because real user research is slow, expensive, and gated by recruiting. This was an exploration of what a GPT-powered audience simulation product could look like: strategy on the canvas, MVP scope, a working no-code proof of concept, and a landing page direction.',
        audience: 'Solopreneurs, indie hackers, and small product teams in the pre-validation phase who would not commission a real research project but would pay a small monthly fee for a fast, directionally correct sanity check before committing hundreds of build hours.',
        what_made_it_hard: 'Open self-set brief with no client to push back, a product category that barely existed (requiring invented vocabulary: audiences, modes, synthetic surveys, idea score), and messaging that had to be honest about synthetic-vs-real without undercutting the value.',
        honest_note: 'Self-initiated concept work. The output was a defended product shape, an MVP scope, a working no-code proof of concept, and a landing page direction. Engineering never followed; the case study is the thinking, not a launch.',
        process: 'Strategy first (mission, market sizing, JTBD mapping, problem-vision-use-cases), then product shape (core loop diagram, feature brainstorm, MVP cut, modes system, wireframes, 12-month roadmap), then a Webflow + Zapier + ChatGPT POC to confirm the loop works, then a landing page with multiple hero variants ready to A/B.',
        outcome: 'A complete product exploration end to end: market thesis, JTBD-grounded feature set, MVP scope, working proof of concept, and a landing page with a defended point of view. The artefact set demonstrates moving from an open brief to a buildable product without skipping the strategy.',
        stack: [],
        links: [],
        gallery: [
            {
                image: '/images/ai-tools/1.PNG',
                title: 'Market and mission before pixels.',
                description: 'Company overview, mission, vision, and market sizing on the canvas before any UI work, with a numeric target (2,000 paid users in year one) to negotiate scope against.',
            },
            {
                image: '/images/ai-tools/5.PNG',
                title: 'JTBD mapping before features.',
                description: 'Personas to jobs, pains, expected outcomes, and output formats. The pass revealed founders want a go/no-go in plain language, not more dashboards.',
            },
            {
                image: '/images/ai-tools/3.PNG',
                title: 'Two-panel vision sketch of the core loop.',
                description: 'Generic Audience mode (free-tier hook) and Real Customer Clone mode (paid-tier moat) named at the strategy stage, so the landing page could lead with the cheaper promise.',
            },
            {
                image: '/images/ai-tools/6.PNG',
                title: 'Possible features, then a brutal MVP cut.',
                description: 'Brainstorm on the left, three-phase MVP architecture on the right. Pro Personas library, white-label exports and ten other ideas became roadmap, not scope.',
            },
            {
                image: '/images/ai-tools/7.PNG',
                title: 'Modes as the long-term shape.',
                description: 'Survey, JTBD, Recession, Pitch Testing, Empathy, Analysis: six reframings of the same engine, each hired for a different job, making the subscription economics plausible.',
            },
            {
                image: '/images/ai-tools/8.PNG',
                title: 'No-code proof of concept before designing the real UI.',
                description: 'Webflow + Zapier + ChatGPT rig confirmed the core loop works. Latency forced a "generating..." state; GPT formatting forced a strict output schema; both reshaped the wireframes.',
            },
            {
                image: '/images/ai-tools/AIUT-2.png',
                title: 'Landing page that takes a position.',
                description: 'Dark, type-led hero with saturated yellow CTA and a 3D AI-generated persona: the cheapest way to make the "simulate target customers" claim feel concrete rather than abstract.',
            },
        ],
    },
    images: {
        thumbnail: '/images/ai-tools/AIUT-2.png',
        hero: '/images/ai-tools/AIUT-2.png',
        gallery: [
            '/images/ai-tools/AIUT-2.png',
            '/images/ai-tools/11.PNG',
            '/images/ai-tools/1.PNG',
            '/images/ai-tools/3.PNG',
            '/images/ai-tools/5.PNG',
            '/images/ai-tools/6.PNG',
            '/images/ai-tools/7.PNG',
            '/images/ai-tools/8.PNG',
            '/images/ai-tools/9.PNG',
            '/images/ai-tools/2.PNG',
            '/images/ai-tools/10.PNG',
            '/images/ai-tools/12.PNG',
            '/images/ai-tools/4.PNG',
        ],
    },
};

export default aiTools;
