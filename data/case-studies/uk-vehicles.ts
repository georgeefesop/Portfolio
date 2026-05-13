import type { CaseStudy } from './types';

const ukVehicles: CaseStudy = {
    id: 'uk-vehicles',
    title: 'UK Vehicles Cyprus',
    subtitle: 'Multi-language Next.js platform for UK-to-Cyprus vehicle imports, with a savings calculator that closes high-ticket purchases without sales calls.',
    role: 'Full-Stack Developer',
    period: '2025',
    tags: ['Next.js', 'Web Development', 'E-Commerce'],
    categories: ['nextjs', 'design'],
    stack: ['nextjs'],
    aiBuilt: true,
    links: {
        live: 'https://ukvehiclescyprus.com/en',
    },
    visual: {
        situation: 'A UK-to-Cyprus vehicle import business needed a public site that could carry a EUR 20,000+ purchasing decision without a phone call, making customs, VAT reclaim, and shipping logistics legible to a tradesperson on a tea break.',
        audience: 'Cypriot tradespeople and small-business owners who are price-sensitive at the EUR 20k+ end and will compare against a local dealer before committing. Many are non-native English readers, hence Greek, Russian and German alongside English.',
        what_made_it_hard: 'Communicating customs, VAT reclaim, and shipping logistics clearly enough that a buyer would commit to a EUR 20,000+ purchase without a phone call.',
        process: 'Next.js multi-language stack (English, Greek, Russian, German) on a shared content architecture. Live vehicle stock with filtering, detailed listings, and pricing transparency. Interactive import savings calculator runs entirely client-side. WhatsApp enquiry integration plus lead-capture flows for buyers who want a written trail.',
        outcome: 'Platform live at ukvehiclescyprus.com. The business has delivered hundreds of vehicles through the site, with the transparent pricing model and calculator converting hesitant buyers into high-ticket customers without the sales overhead the previous presence forced on them.',
        stack: ['nextjs'],
        links: [
            { href: 'https://ukvehiclescyprus.com/en', label: 'Live site', logo: 'nextjs' },
        ],
        gallery: [
            {
                image: '/images/uk-vehicles/hero-3.png',
                title: 'Import made legible from the first scroll.',
                description: 'Hero positions the savings angle immediately, so a tradesperson knows within three seconds whether the numbers work for their budget.',
            },
            {
                image: '/images/uk-vehicles/calc.png',
                title: 'Calculator as the closing surface.',
                description: 'Live cost breakdown against a Cyprus dealer equivalent, calculated in the browser without an email gate - the transparent number that turns a curious visitor into a WhatsApp enquiry.',
            },
            {
                image: '/images/uk-vehicles/info.png',
                title: 'Pricing visible. WhatsApp primary.',
                description: 'Stock and pricing are transparent without a form gate; high-intent enquiries route through WhatsApp first, meeting buyers where business actually happens in this market.',
            },
        ],
    },
    images: {
        thumbnail: '/images/uk-vehicles/hero-4.jpg',
        hero: '/images/uk-vehicles/hero-3.png',
        gallery: [
            '/images/uk-vehicles/hero-3.png',
            '/images/uk-vehicles/calc.png',
            '/images/uk-vehicles/info.png',
        ],
    },
};

export default ukVehicles;
