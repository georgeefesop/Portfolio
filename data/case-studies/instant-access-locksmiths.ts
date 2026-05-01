import type { CaseStudy } from './types';

const instantAccess: CaseStudy = {
    id: 'instant-access-locksmiths',
    title: 'Instant Access Locksmiths',
    subtitle: 'Next.js rebuild for a Solihull locksmith service, built phone-first for late-night visitors with programmatic local-SEO landing pages.',
    role: 'Design + build (Next.js)',
    period: '2025',
    tags: ['Next.js', 'Tailwind', 'Local SEO', 'Conversion'],
    categories: ['nextjs', 'design'],
    aiBuilt: true,
    description: {
        overview: 'Instant Access Locksmiths is a Solihull-based UK locksmith service. I replaced a generic locksmith template with a fast, trust-led Next.js site built around three jobs: convert a panicked late-night visitor into a phone call, win local SEO across multiple service areas, and let the team talk pricing transparently without lengthy form back-and-forth.\n\nThe site has to feel calm at 2am. Everything else is downstream of that.',
        challenge: 'Design and build a locksmith site that converts under stress while addressing:\n\n• The panicked-visitor moment: phone-first design, never a hidden CTA\n• Long-tail local search: \'<service> in <town>\' for dozens of villages around Solihull and Birmingham\n• A trust gap that templated locksmith sites widen rather than close\n• A pricing transparency expectation the trade industry has historically dodged',
        work: [
            'Next.js + Tailwind on Vercel for fast cold-starts and clean Core Web Vitals',
            'Phone-first design: persistent, prominent call CTA above the fold throughout',
            'Live cost estimator wired to a small backend that emails a quote and posts to a Google Sheet - fits the team\'s existing workflow',
            'Programmatic service-area landing pages from a single content source for the long tail',
            'Full schema.org markup: LocalBusiness, Service, FAQPage, Review',
            'Honest estimator UX: shows ranges, not magic-number quotes - clients don\'t trust precision they didn\'t ask for',
            'Review and trust signals embedded into the booking flow, not buried on a separate page'
        ],
        outcome: 'Live and ranking. The estimator now intercepts a meaningful share of phone-only enquiries and reduces clarifying calls before a job is booked. Service-area pages have started to win the long-tail queries the previous template never touched.'
    },
    links: {
        live: 'https://www.instantaccesslocksmiths.co.uk/'
    },
    images: {
        thumbnail: "/images/instant-access-locksmiths/hero.png",
        hero: "/images/instant-access-locksmiths/hero.png",
        gallery: [
            "/images/instant-access-locksmiths/hero.png",
            "/images/instant-access-locksmiths/1.png",
            "/images/instant-access-locksmiths/2.png",
            "/images/instant-access-locksmiths/3.png"
        ]
    }
};

export default instantAccess;
