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
    body: {
        brief: {
            situation: 'A UK-to-Cyprus vehicle import business needed a public site that could carry the weight of a EUR 20,000+ purchasing decision without a phone call. Customs, VAT reclaim, and shipping logistics are the hard part of this business; the website is the part that has to make all of that legible to a tradesperson scrolling on a tea break. The previous presence buried the differentiators behind generic copy and never surfaced the actual savings number that wins the deal.',
            audience: 'Cypriot tradespeople and small-business owners who already know what vehicle they want, who are price-sensitive at the EUR 20k+ end, and who will compare against a local Cyprus dealer before committing. Many are non-native English readers, hence Greek, Russian and German alongside English.',
            what_made_it_hard: [
                'Communicating customs, VAT reclaim, and shipping logistics clearly enough that a buyer would commit to a EUR 20,000+ purchase without a phone call',
            ],
        },
        decisions: [
            {
                title: 'Calculator as the closing surface',
                what: 'An interactive import savings calculator front and centre. Inputs are vehicle class and rough budget; output is a real-time cost breakdown against a Cyprus dealer equivalent.',
                why: 'For a hesitant buyer at the EUR 20k mark, the question is always "how much do I actually save?" - and a static "save thousands" headline does not answer it. Putting a transparent number in front of them, calculated in the browser without an email gate, is what turns a curious visitor into one ready for a WhatsApp message. The calculator is the page that converts; everything else exists to get the visitor to it.',
                screenshot: '/images/uk-vehicles/calc.png',
                caption: 'Live savings calculator surfacing a verifiable number, not a vague claim.',
            },
            {
                title: 'WhatsApp over contact form',
                what: 'High-intent enquiry routes through WhatsApp first; a contact form exists as fallback rather than the default. Pricing and stock are visible without a form gate.',
                why: 'This audience messages on WhatsApp constantly - it is where business actually happens in this market. A traditional contact form imposes a delay and a power dynamic neither side wants. Letting the buyer ping a real number with a question about a specific vehicle they have already seen on the site shortens the gap between intent and conversation, which is what closes a high-ticket purchase.',
                screenshot: '/images/uk-vehicles/info.png',
                caption: 'Pricing transparent on listings; WhatsApp routed as primary enquiry channel.',
            },
        ],
        process: 'Next.js multi-language stack with English, Greek, Russian, and German on a shared content architecture. Live vehicle stock with filtering, detailed listings, and pricing transparency. Interactive import savings calculator runs entirely client-side. WhatsApp enquiry integration plus lead-capture flows for the buyers who want a written trail. Content architecture sequenced to address every stage of buyer hesitation across FAQ and process pages, with Core Web Vitals and SEO tuned for organic local searches.',
        outcome: {
            summary: 'Platform live at ukvehiclescyprus.com. The business has delivered hundreds of vehicles through the site, with the transparent pricing model and calculator converting hesitant buyers into high-ticket customers without the sales overhead the previous presence forced on them.',
        },
    },
    links: {
        live: 'https://ukvehiclescyprus.com/en',
    },
    images: {
        thumbnail: '/images/uk-vehicles/hero-4.png',
        hero: '/images/uk-vehicles/hero-3.png',
        gallery: [
            '/images/uk-vehicles/hero-3.png',
            '/images/uk-vehicles/calc.png',
            '/images/uk-vehicles/info.png',
        ],
    },
};

export default ukVehicles;
