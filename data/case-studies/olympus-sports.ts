import type { CaseStudy } from './types';

const olympus: CaseStudy = {
    id: 'olympus-sports',
    title: 'Olympus Sports',
    subtitle: 'Catalogue-first WordPress rebuild for a UK B2B distributor of commercial gym equipment, designed for trade buyers who arrive ready to buy.',
    role: 'WordPress build + design',
    period: '2024',
    tags: ['WordPress', 'Elementor', 'B2B', 'E-commerce'],
    categories: ['wordpress'],
    description: {
        overview: 'Olympus Sports is a UK distributor of commercial gym equipment selling into facility managers, independent gyms, and small chains. I rebuilt their public site from scratch as a catalogue-first WordPress build, replacing a tired template that was slow on mobile and buried products under marketing pages.\n\nThe work cuts straight at the trade buyer\'s mental model: see the catalogue, qualify the spec, request a quote - without three forms of friction in between.',
        challenge: 'Replace a slow, mobile-broken site with one that communicates a deep equipment catalogue and converts trade enquiries while addressing:\n\n• Buyers who arrive knowing what they want, not browsing for inspiration\n• Existing brand assets that mixed consumer fitness aesthetics with B2B copy\n• A long product taxonomy collapsed into one giant menu\n• Mobile parity for on-site facility manager research',
        work: [
            'Catalogue-first information architecture: hero links direct into equipment categories, not marketing pages',
            'WordPress + Elementor with a custom product taxonomy and clean structure',
            'Quote-request flows attached to each product card to capture intent at peak moment',
            'Photography reshoots where existing assets failed the brand',
            'Trimmed primary navigation: removed marketing-first hierarchy in favour of buyer-intent paths',
            'Mobile speed budget: stripped Elementor heavies, hand-tuned CSS for above-the-fold blocks',
            'Handover-friendly build so the client team can add new products without revisiting me'
        ],
        outcome: 'Live and replacing the previous build. Faster on mobile, cleaner taxonomy, quote-request flows that respect how trade buyers actually browse - credibility over cleverness, throughout.'
    },
    links: {
        live: 'https://olympus-sports.com'
    },
    images: {
        thumbnail: "/images/olympus-sports/hero.png",
        hero: "/images/olympus-sports/hero.png",
        gallery: [
            "/images/olympus-sports/hero.png",
            "/images/olympus-sports/2.png"
        ]
    }
};

export default olympus;
