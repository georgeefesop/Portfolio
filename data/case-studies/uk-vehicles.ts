import type { CaseStudy } from './types';

const ukVehicles: CaseStudy = {
    id: 'uk-vehicles',
    title: 'UK Vehicles Cyprus',
    subtitle: 'Multi-language Next.js platform for UK-to-Cyprus vehicle imports, with a savings calculator that closes high-ticket purchases without sales calls.',
    role: 'Full-Stack Developer',
    period: '2025',
    tags: ['Next.js', 'Web Development', 'E-Commerce'],
    categories: ['nextjs', 'design'],
    aiBuilt: true,
    description: {
        challenge: 'Build a professional web platform for a UK-to-Cyprus vehicle import business that communicates complex processes-customs, VAT reclaim, shipping logistics-clearly enough that tradespeople and small businesses could confidently make €20,000+ purchasing decisions without a single phone call.',
        work: [
            'Designed and built a full multi-language site (English, Greek, Russian, German) using Next.js',
            'Built an interactive import savings calculator showing real-time cost breakdowns vs. Cyprus dealers',
            'Developed a live vehicle stock system with filtering, detailed listings, and pricing transparency',
            'Implemented WhatsApp inquiry integration and lead capture flows for high-intent buyers',
            'Structured content architecture to address every stage of buyer hesitation across FAQ and process pages',
            'Optimised for Core Web Vitals and SEO to drive organic traffic from local business searches'
        ],
        outcome: 'Platform live at ukvehiclescyprus.com. Business has delivered hundreds of vehicles, generating €150k+ in cumulative client savings. The site\'s transparent pricing model and calculator convert hesitant buyers into high-ticket customers with minimal sales overhead.'
    },
    links: {
        live: 'https://ukvehiclescyprus.com/en'
    },
    images: {
        thumbnail: "/images/uk-vehicles/hero-2.png",
        hero: "/images/uk-vehicles/hero-2.png",
        gallery: [
            "/images/uk-vehicles/hero-2.png",
            "/images/uk-vehicles/calc.png",
            "/images/uk-vehicles/info.png"
        ]
    }
};

export default ukVehicles;
