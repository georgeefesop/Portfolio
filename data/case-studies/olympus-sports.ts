import type { CaseStudy } from './types';

const olympus: CaseStudy = {
    id: 'olympus-sports',
    title: 'Olympus Sports',
    subtitle: 'Catalogue-first WordPress rebuild for a UK B2B distributor of commercial gym equipment, designed for trade buyers who arrive ready to buy.',
    role: 'WordPress build + design',
    period: '2024',
    tags: ['WordPress', 'Elementor', 'B2B', 'E-commerce'],
    categories: ['wordpress'],
    body: {
        brief: {
            situation: 'Olympus Sports is a UK distributor of commercial gym equipment selling into facility managers, independent gyms, and small chains. The previous site was a tired template: slow on mobile, marketing-pages-first, products buried under three layers of hierarchy. The brief was a catalogue-first rebuild on WordPress that cut straight at the trade buyer\'s mental model - see the catalogue, qualify the spec, request a quote - without three forms of friction in between.',
            audience: 'B2B trade buyers - facility managers, independent gym owners, small chain operators - who arrive knowing what they want and have no patience for marketing storytelling. Mobile is a real surface here: site visits during walk-throughs and supplier comparisons.',
            what_made_it_hard: [
                'Buyers who arrive knowing what they want, not browsing for inspiration - which means any "discover our story" detour is friction, not engagement',
                'Existing brand assets that mixed consumer fitness aesthetics with B2B copy, leaving the site reading like neither one nor the other',
                'A long product taxonomy collapsed into one giant menu on the previous build, plus mobile parity that the old template never delivered for facility managers researching on site',
            ],
        },
        decisions: [
            {
                title: 'Catalogue links from the hero',
                what: 'Hero section links direct into equipment categories, not into "About us" or "Why Olympus". Quote-request flows attached to each product card to capture intent at peak moment.',
                why: 'A trade buyer who clicks a category from the hero is one click closer to a quote than they were on the previous site. Marketing storytelling is what you read when you are evaluating a brand at leisure; trade buyers are not at leisure. Putting the catalogue at the top of the funnel - and the quote button on every card - matches the actual sequence of intent rather than fighting it.',
                screenshot: '/images/olympus-sports/hero.png',
                caption: 'Hero links direct into categories rather than marketing pages.',
            },
            {
                title: 'Mobile speed budget over Elementor convenience',
                what: 'Stripped Elementor heavies. Hand-tuned CSS for above-the-fold blocks. The build prioritises mobile loading speed over the editor convenience the platform usually leans into.',
                why: 'A facility manager pulling up the site during a supplier walk-through has no patience for an Elementor mega-build that takes four seconds to render. The convenience of drag-and-drop widgets is real for the editor but invisible to the buyer; the mobile speed is invisible to the editor but front-and-centre for the buyer. The trade-off goes in the buyer\'s direction every time.',
                screenshot: '/images/olympus-sports/2.png',
                caption: 'Mobile-first layout with Elementor heavies stripped and above-the-fold CSS hand-tuned.',
            },
        ],
        process: 'Catalogue-first information architecture from the hero down. WordPress + Elementor with a custom product taxonomy and clean structure that the client team can maintain without revisiting me. Quote-request flows attached to each product card. Photography reshoots where existing brand assets failed the B2B register. Mobile speed budget enforced by stripping Elementor heavies and hand-tuning CSS for above-the-fold blocks. Trimmed primary navigation: removed marketing-first hierarchy in favour of buyer-intent paths.',
        outcome: {
            summary: 'Live and replacing the previous build. Faster on mobile, cleaner taxonomy, quote-request flows that respect how trade buyers actually browse - credibility over cleverness, throughout. The handover-friendly build means the client team can add new products without revisiting me, which is the only kind of WordPress site that ages well.',
        },
    },
    links: {
        live: 'https://olympus-sports.com',
    },
    images: {
        thumbnail: '/images/olympus-sports/hero.png',
        hero: '/images/olympus-sports/hero.png',
        gallery: [
            '/images/olympus-sports/hero.png',
            '/images/olympus-sports/2.png',
        ],
    },
};

export default olympus;
