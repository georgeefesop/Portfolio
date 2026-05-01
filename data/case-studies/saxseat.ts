import type { CaseStudy } from './types';

const saxseat: CaseStudy = {
    id: 'saxseat',
    title: 'SaxSeat',
    subtitle: 'End-to-end product-page design for a Kickstarter-launched saxophone-seat startup, validated with HotJar recordings before scaling marketing spend.',
    role: 'UX & UI designer (sole)',
    period: '2020-2021',
    tags: ['Web Design', 'UX Strategy', 'E-commerce', 'Usability Testing'],
    categories: ['design'],
    description: {
        overview: 'SaxSeat is a Kickstarter-launched startup with a single, niche product: a seat that supports both saxophone player and instrument while practising - the first of its kind. As the sole UX/UI designer on a limited startup budget, I owned the direction of the launch site and the responsibility for whether it converted.\n\nThe brief wasn\'t \'design a beautiful page\'. It was \'turn a curious sax player into a paying customer on a single page\' - and prove every decision in front of management and shareholders.',
        challenge: 'Design and validate a high-converting product page for a niche startup with a single SKU while addressing:\n\n• A novel product category - buyers had never seen anything like it before\n• A small startup budget that left no room for second attempts\n• Stakeholder review of every design decision in regular meetings\n• Soft-launch validation pressure: prove the page works on real users before scaling spend',
        work: [
            'End-to-end ownership: research, information architecture, copy direction, visual design, prototyping',
            'Persona and journey mapping for the saxophone-player buyer',
            'Competitive analysis across adjacent niche-instrument-accessory markets',
            'Heuristic evaluation cycles before stakeholder review to anticipate pushback',
            'High-fidelity Figma comps with responsive breakpoints and interactive prototypes',
            'UX writing for product copy that anticipated common objections about a category-creating product',
            'Soft-launched the page in February 2021 with HotJar session recording to capture qualitative user behaviour',
            'Iterated based on heatmaps and session replays - surfaced and fixed the friction points causing pre-purchase exits'
        ],
        outcome: 'Page launched following the soft-launch test phase. HotJar recordings surfaced specific drop-off moments that were addressed before scaling marketing spend. The page anchored SaxSeat\'s direct-to-consumer launch beyond Kickstarter, converting curious-but-skeptical visitors into buyers for a category-creating product.'
    },
    links: {},
    images: {
        thumbnail: "/images/saxseat/hero.png",
        hero: "/images/saxseat/hero.png",
        gallery: [
            "/images/saxseat/hero.png",
            "/images/saxseat/1.png",
            "/images/saxseat/2.png"
        ]
    }
};

export default saxseat;
