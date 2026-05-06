import type { CaseStudy } from './types';

const aiTools: CaseStudy = {
    id: 'ai-tools',
    title: 'AI User Tools',
    subtitle: 'Product exploration and landing-page work for a SaaS aggregator of generative AI tools, defining its shape and tone before any code got written.',
    role: 'Product Designer',
    period: '2024',
    tags: ['UI/UX', 'AI', 'Miro', 'Landing Page'],
    categories: ['design'],
    links: {},
    body: {
        honest_note: 'Concept work, not a shipped product. The deliverable was a defendable direction and a landing page that could carry the positioning - the build never followed.',
        brief: {
            situation: 'Open brief on a generative-AI aggregator: figure out what the product could feel like before anything got built. The space was crowded with directories that all looked the same - a wall of cards, a search bar, no point of view. The remit was to find the shape first, then the surface, then a landing page that could test whether the positioning landed before any engineering time got spent.',
            audience: 'Curious-but-overwhelmed users who have heard about ten different AI tools, tried two, and want one place that tells them which one to use for the job in front of them. Not power users hunting for an obscure model - people who want a competent recommendation and a clear next step.',
            what_made_it_hard: [
                'Open brief with no fixed audience - the strategy work had to happen before any pixels could be defended',
                'A directory category where most competitors look identical, which made differentiation a copy-and-tone problem more than a feature problem',
                'Single-canvas thinking: the work needed to live in Miro long enough to narrow the space, before the temptation to push pixels took over',
            ],
        },
        decisions: [
            {
                title: 'Strategy on the canvas before pixels in Figma',
                what: 'Mind maps and IA boards in Miro covering audience, jobs-to-be-done, and product flows, before any visual design got opened.',
                why: 'A landing page for a directory product is mostly a positioning exercise. Jumping into Figma first would have produced a beautiful version of the same wall-of-cards everyone else ships. Working it on the canvas long enough to narrow the space meant the eventual landing-page brief was specific - a tone, an audience, a hook - not just a layout problem.',
                screenshot: '/images/ai-tools/1.PNG',
                caption: 'Miro thinking boards used to find the product shape before anything got designed.',
            },
            {
                title: 'Bold landing page, not another directory',
                what: 'A landing page with a strong visual identity - heavy type, saturated palette, big claims - rather than a sea of generic tool cards.',
                why: 'Directories live or die on whether the visitor remembers being there. A page that looks like every other AI directory is a page that gets bookmarked once and forgotten. Pushing the visual identity hard at the top of the funnel was the cheapest way to make the positioning stick.',
                screenshot: '/images/ai-tools/AIUT-2.png',
                caption: 'Landing page direction that takes a position rather than presenting a neutral catalogue.',
            },
        ],
        process: 'Miro for the strategy work - audience boards, jobs-to-be-done, IA, flows - until the space was narrow enough to defend. Then high-fidelity landing-page comps in the visual direction the strategy work pointed at. The output was the design vocabulary and the product shape, mapped to a landing page that could carry it. No build phase ever followed; the case study is the thinking, not the launch.',
        outcome: {
            summary: 'A clear product direction grounded in structured thinking, plus a landing page that communicates a defendable point of view in a category where most competitors blend together. The deliverable was the design vocabulary and the shape of the product, not a shipped app - which is what the brief actually asked for.',
        },
    },
    images: {
        thumbnail: '/images/ai-tools/AIUT-2.png',
        hero: '/images/ai-tools/AIUT-2.png',
        gallery: [
            '/images/ai-tools/AIUT-2.png',
            '/images/ai-tools/1.PNG',
            '/images/ai-tools/2.PNG',
            '/images/ai-tools/3.PNG',
            '/images/ai-tools/4.PNG',
            '/images/ai-tools/7.PNG',
            '/images/ai-tools/8.PNG',
            '/images/ai-tools/11.PNG',
        ],
    },
};

export default aiTools;
