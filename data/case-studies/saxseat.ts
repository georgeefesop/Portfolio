import type { CaseStudy } from './types';

const saxseat: CaseStudy = {
    id: 'saxseat',
    title: 'SaxSeat',
    subtitle: 'Sole UX/UI hire on a Kickstarter saxophone-seat startup. End-to-end product page for a €250+ pre-order with no reviews, soft-launched and validated with HotJar before scaling marketing spend.',
    role: 'UX & UI designer (sole)',
    period: '2020-2021',
    tags: ['UX/UI', 'E-commerce', 'Conversion', 'HotJar', 'Kickstarter'],
    categories: ['design'],
    body: {
        brief: {
            situation: 'SaxSeat is a Kickstarter-launched startup with a single niche product: a seat that supports both saxophone player and instrument while practising, the first of its kind. As the sole UX/UI designer on a limited startup budget, I owned the direction of the launch site and the responsibility for whether it converted. The brief was not "design a beautiful page," it was "turn a curious sax player into a paying customer on a single page," with every decision defended in front of management and shareholders before the build.',
            audience: 'Mostly men 45+ with a saxophone interest, going off the Facebook ad data. A second segment: women 40+ buying it as a gift for a saxophonist relative, which changed the copy register on parts of the page. Both groups had never seen a product like this before, and pre-orders meant they had to commit money before the seat existed.',
            what_made_it_hard: [
                'Pre-launch trust without reviews: a €250+ product months from delivery, from a company nobody had heard of.',
                'A new product category with no direct competitors meant the page had to teach and sell at the same time.',
            ],
        },
        decisions: [
            {
                title: 'Bake objections into the buying flow, not the FAQ',
                what: 'Scenario maps with sticky-note objections per buying step, then page sections written to answer the objection at the moment it surfaces. No FAQ at the bottom collecting the leftovers.',
                why: 'A category-creating product gets bought when the visitor stops thinking "but what about..." and an FAQ is exactly where that thought goes to die. Mapping the to-be scenarios first surfaced which objections recur (delivery time, no reviews, refund process, fit for body shape) and let the page answer each one in the section where it actually fires. The page treats a sceptical adult as a sceptical adult, not a curious tourist.',
                screenshot: '/images/saxseat/behance-06.png',
                caption: 'To-be scenario map. Sticky-note objections by buying step, then answers written into the page where they fire.',
            },
            {
                title: 'Borrow from outside the category',
                what: 'No direct competitors meant the closest reference point was SecretLab, a gaming-chair brand. Pulled their strengths (clear customer reviews, cinematic product photography, feature callouts that read top-down) and their weaknesses (cluttered checkout, hard-to-find materials info) into the brief.',
                why: 'A first-of-its-kind product has nobody to compare against, so the obvious next move is to look at adjacent niches that solved similar trust problems. SecretLab nailed the conversion mechanics on cinematic photography, customer reviews and clear feature breakdowns; we borrowed those moves rather than reinventing them, and skipped their cluttered checkout rather than copying it.',
                screenshot: '/images/saxseat/behance-05.png',
                caption: 'Competitive analysis from outside the category. SecretLab as the closest reference for a category-creating product.',
            },
            {
                title: 'Soft-launch with HotJar before any meaningful spend',
                what: 'Soft-launched February 2021 with HotJar session recording. Heatmaps and replays surfaced a specific drop-off: users adding the seat to cart just to see shipping cost, then bailing at checkout. Page updated to show shipping costs upfront before the marketing budget got committed.',
                why: 'Scaling spend on an unvalidated page is how a startup budget disappears. Hundreds of recordings beat any stakeholder slide deck: "this is where they drop off" cannot be argued with. The shipping-cost finding alone changed conversion enough to justify the soft-launch period; the alternative (going wide on day one) would have burned the budget on a leaky page.',
                screenshot: '/images/saxseat/behance-09.png',
                caption: 'HotJar behaviour flow from the soft-launch period. Drop-off patterns surfaced specific fixes before any marketing spend got committed.',
            },
        ],
        process: 'End-to-end: research, IA, copy direction, visual design, prototyping. Persona work using Facebook ad data identified the primary segment (men 45+) and the secondary one (women 40+ buying gifts). Competitive analysis pulled patterns from outside the category since there were no direct competitors. Heuristic evaluation cycles before stakeholder review to anticipate management and shareholder pushback. High-fidelity Figma comps with responsive breakpoints and interactive prototypes. Soft-launched February 2021 with HotJar, iterated on the recordings before scaling spend.',
        outcome: {
            summary: 'Page launched following the soft-launch test phase. HotJar recordings surfaced specific drop-off moments (most notably users adding to cart only to see the shipping cost) that were addressed before any meaningful spend got committed. The page anchored SaxSeat\'s direct-to-consumer launch beyond Kickstarter, converting curious-but-sceptical visitors into buyers for a category-creating product on a budget that left no room for a second go.',
        },
    },
    links: {},
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
