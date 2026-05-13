import type { CaseStudy } from './types';

const saxseat: CaseStudy = {
    id: 'saxseat',
    title: 'SaxSeat',
    subtitle: 'Sole UX/UI hire on a Kickstarter saxophone-seat startup. End-to-end product page for a €250+ pre-order with no reviews, soft-launched and validated with HotJar before scaling marketing spend.',
    role: 'UX & UI designer (sole)',
    period: '2020-2021',
    tags: ['UX/UI', 'E-commerce', 'Conversion', 'HotJar', 'Kickstarter'],
    categories: ['design'],
    links: {},
    visual: {
        situation: 'Sole UX/UI designer on a Kickstarter startup selling a first-of-its-kind saxophone practice seat for €250+. The brief was not "design a beautiful page" but "turn a curious sax player into a paying customer on a single page," with every decision defended in front of management and shareholders before the build.',
        audience: 'Primarily men 45+ with a saxophone interest (from Facebook ad data), plus women 40+ buying as a gift. Both groups had never seen a product like this, and pre-orders meant committing money before the seat existed.',
        what_made_it_hard: 'A €250+ pre-order from a brand nobody had heard of, no reviews, months from delivery, in a category with no direct competitors - the page had to teach and sell at the same time.',
        process: 'Research, IA, copy direction, visual design, prototyping. Persona work from Facebook ad data, competitive analysis from adjacent niches (no direct competitors), heuristic evaluations before each stakeholder review, high-fidelity Figma comps with responsive breakpoints. Soft-launched February 2021 with HotJar, iterated on recordings before scaling spend.',
        outcome: 'HotJar recordings surfaced the key drop-off: visitors adding to cart only to see the shipping cost, then bailing. Shipping cost surfaced earlier, drop-off addressed before any meaningful budget got committed. The page anchored SaxSeat\'s direct-to-consumer launch beyond Kickstarter.',
        stack: [],
        links: [],
        gallery: [
            {
                image: '/images/saxseat/behance-02.png',
                title: 'Primary and secondary personas from Facebook ad data.',
                description: 'Men 45+ as the primary buyer, women 40+ as the gift-giver. Two copy registers on one page, each speaking to the moment the objection fires.',
            },
            {
                image: '/images/saxseat/behance-03.png',
                title: 'Information architecture: one page, one action.',
                description: 'Every section mapped to a buying stage. No FAQ collecting leftovers - objections answered at the point they surface.',
            },
            {
                image: '/images/saxseat/behance-04.png',
                title: 'Wireframes with conversion intent per section.',
                description: 'Low-fidelity layout with rationale per block. Each section assigned a job: educate, build trust, remove doubt, or close.',
            },
            {
                image: '/images/saxseat/behance-05.png',
                title: 'Competitive analysis from outside the category.',
                description: 'SecretLab as the closest reference: borrowed their cinematic photography, review structure and feature callouts. Skipped their cluttered checkout.',
            },
            {
                image: '/images/saxseat/behance-06.png',
                title: 'To-be scenario map: objections by buying step.',
                description: 'Sticky-note objections (delivery time, no reviews, refund process, fit) mapped per stage, then answered in the section where they actually fire.',
            },
            {
                image: '/images/saxseat/behance-07.png',
                title: 'High-fidelity visual design, desktop.',
                description: 'Cinematic product photography, feature callouts reading top-down, trust signals placed at the moment of doubt rather than buried in a footer.',
            },
            {
                image: '/images/saxseat/behance-09.png',
                title: 'HotJar behaviour flow from the soft-launch period.',
                description: 'Drop-off pattern surfaced: users adding to cart to see shipping cost, then bailing. Fix shipped before any marketing budget got committed.',
            },
        ],
    },
    images: {
        thumbnail: '/images/saxseat/hero.png',
        hero: '/images/saxseat/behance-01.png',
        gallery: [
            '/images/saxseat/behance-01.png',
            '/images/saxseat/behance-02.png',
            '/images/saxseat/behance-03.png',
            '/images/saxseat/behance-04.png',
            '/images/saxseat/behance-05.png',
            '/images/saxseat/behance-06.png',
            '/images/saxseat/behance-07.png',
            '/images/saxseat/behance-08.png',
            '/images/saxseat/behance-09.png',
            '/images/saxseat/behance-10.png',
        ],
    },
};

export default saxseat;
