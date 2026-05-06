import type { CaseStudy } from './types';

const saxseat: CaseStudy = {
    id: 'saxseat',
    title: 'SaxSeat',
    subtitle: 'End-to-end product-page design for a Kickstarter-launched saxophone-seat startup, validated with HotJar recordings before scaling marketing spend.',
    role: 'UX & UI designer (sole)',
    period: '2020-2021',
    tags: ['Web Design', 'UX Strategy', 'E-commerce', 'Usability Testing'],
    categories: ['design'],
    body: {
        brief: {
            situation: 'SaxSeat is a Kickstarter-launched startup with a single, niche product: a seat that supports both saxophone player and instrument while practising - the first of its kind. As the sole UX/UI designer on a limited startup budget, I owned the direction of the launch site and the responsibility for whether it converted. The brief was not "design a beautiful page" - it was "turn a curious sax player into a paying customer on a single page", with every decision defended in front of management and shareholders before the build.',
            audience: 'Saxophone players who had never seen a product like this before. Curious enough to click an ad or follow a Kickstarter link, sceptical enough to need every objection answered before committing money to a category that did not exist yesterday.',
            what_made_it_hard: [
                'A novel product category - buyers had never seen anything like it, so the page had to teach and sell at the same time without slipping into either lecture or hard pitch',
            ],
        },
        decisions: [
            {
                title: 'Anticipate objections in the copy, not the FAQ',
                what: 'Product copy written to surface and answer the recurring objections about a category-creating product directly in the buying flow, rather than parking them in an FAQ at the bottom.',
                why: 'A category-creating product gets bought when the visitor stops thinking "but what about..." and an FAQ is exactly where that thought goes to die. Folding the answers into the main flow - heuristic evaluation surfaced which objections kept coming up - meant the page treated the visitor as a sceptical adult rather than a curious tourist, which is what closed the sale on a niche product.',
                screenshot: '/images/saxseat/1.png',
                caption: 'Objection-led copy folded into the buying flow, not parked in an FAQ.',
            },
            {
                title: 'Soft-launch with HotJar before scaling spend',
                what: 'Soft-launched the page in February 2021 with HotJar session recording. Heatmaps and replays surfaced specific drop-off moments that were addressed before any meaningful marketing budget got committed.',
                why: 'On a startup budget, scaling spend on an unvalidated page is how money disappears. HotJar recordings turn qualitative behaviour into something stakeholders can watch instead of debate - "this is where they drop off" beats any slide deck. Using the soft-launch to find the friction points and ship the fixes before scaling spend was the move that protected the marketing budget.',
                screenshot: '/images/saxseat/2.png',
                caption: 'Iterations driven by HotJar replays, not stakeholder opinion.',
            },
        ],
        process: 'End-to-end ownership: research, information architecture, copy direction, visual design, prototyping. Persona and journey mapping for the saxophone-player buyer; competitive analysis across adjacent niche-instrument-accessory markets. Heuristic evaluation cycles before stakeholder review to anticipate pushback. High-fidelity Figma comps with responsive breakpoints and interactive prototypes. Soft-launched with HotJar in Feb 2021; iterated on heatmaps and session replays before scaling marketing spend.',
        outcome: {
            summary: 'Page launched following the soft-launch test phase. HotJar recordings surfaced specific drop-off moments that were addressed before scaling spend. The page anchored SaxSeat\'s direct-to-consumer launch beyond Kickstarter, converting curious-but-sceptical visitors into buyers for a category-creating product on a budget that left no room for a second go.',
        },
    },
    links: {},
    images: {
        thumbnail: '/images/saxseat/hero.png',
        hero: '/images/saxseat/hero.png',
        gallery: [
            '/images/saxseat/hero.png',
            '/images/saxseat/1.png',
            '/images/saxseat/2.png',
        ],
    },
};

export default saxseat;
