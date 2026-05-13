import type { CaseStudy } from './types';

const instantAccessLocksmiths: CaseStudy = {
    id: 'instant-access-locksmiths',
    title: 'Instant Access Locksmiths',
    subtitle: 'Ten-year client. Next.js rebuild for a Solihull locksmith, phone-first for the 2am moment with programmatic local-SEO landing pages for daytime researchers.',
    role: 'Design + build (Next.js)',
    period: '2025',
    tags: ['Next.js', 'Tailwind', 'Local SEO', 'Conversion'],
    categories: ['nextjs', 'design'],
    stack: ['nextjs', 'tailwindcss'],
    aiBuilt: true,
    links: { live: 'https://www.instantaccesslocksmiths.co.uk/' },
    visual: {
        situation: 'Long-time client James has run Instant Access Locksmiths for over 15 years; I have designed each iteration of his site for ten of them. The 2025 brief was to migrate from a slow WordPress build onto Next.js, engineered for local SEO with programmatic town-by-town landing pages.',
        audience: 'Two distinct visitors: someone locked out at 2am, phone in hand, needing one clear action immediately; and a daytime homeowner researching security upgrades, comparing options, wanting to verify James is credible before calling.',
        what_made_it_hard: 'The locksmith trade is notorious for inflated call-out scams, so every visitor arrives skeptical regardless of how good the operator is. Two visitor headspaces on one homepage: the 2am lockout reaching for a phone, and the daytime researcher comparing options.',
        process: 'Migrated off WordPress onto Next.js + Tailwind on Vercel. Static generation and edge caching land cold mobile loads inside Core Web Vitals. Service-area pages generated programmatically (Solihull, Knowle, Dorridge, Shirley, Earlswood, Coleshill, Sheldon, Hall Green) so each settlement targets its own long-tail query. Schema.org markup (LocalBusiness, Service, FAQPage, Review) for rich-result eligibility from day one.',
        outcome: 'James has held a ThreeBestRated top-3 position for Solihull locksmiths every year since 2019, currently ranked #1 ahead of Ko-Lock and CraftLock. 4.9/5 on QuoteQuant across 57 reviews, 4.9/5 on Google. Lighthouse 100 SEO, 100 accessibility, 100 best practices, 99 desktop performance.',
        stack: ['nextjs', 'tailwindcss'],
        links: [
            { href: 'https://www.instantaccesslocksmiths.co.uk/', label: 'Live site', logo: 'nextjs' },
        ],
        gallery: [
            {
                image: '/images/instant-access-locksmiths/1.png',
                title: 'Six services, plain English.',
                description: 'Emergency, residential, commercial, uPVC, quality parts and security upgrades. The daytime researcher gets the scope in one scan, no jargon.',
            },
            {
                image: '/images/instant-access-locksmiths/instant-access-locksmiths__s4__break-ins__desktop.png',
                title: 'Day or night, before any credential badge.',
                description: 'Italic gold accent on "day or night" speaks to the 2am anxiety; "Hi, I\'m James" lands before MLA, DBS or insurance, because a name reads as a person, not a brochure.',
            },
            {
                image: '/images/instant-access-locksmiths/2.png',
                title: 'Complete home security, six locks deep.',
                description: 'Maximum security, anti-snap, uPVC specialist, BS3621 standards, entry point security and insurance compliance. The researcher\'s checklist answered in one section.',
            },
            {
                image: '/images/instant-access-locksmiths/3.png',
                title: 'What customers actually say.',
                description: '9.97/10 average across 186+ reviews, 98% five-star, 99% would recommend. Real names, real towns (Solihull, Birmingham, Knowle), no curated quote walls.',
            },
            {
                image: '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__desktop.png',
                title: 'Service radius as a drawn circle.',
                description: 'Geographic coverage answered without a postcode lookup. Reads as an established business with a defined patch, not a sole trader taking whatever turns up.',
            },
        ],
    },
    images: {
        thumbnail: '/images/instant-access-locksmiths/hero-thumb.jpg',
        hero: '/images/instant-access-locksmiths/instant-access-locksmiths-hero.png',
        gallery: {
            desktop: [
                '/images/instant-access-locksmiths/instant-access-locksmiths__s1__hero__desktop.png',
                '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__desktop.png',
            ],
            tablet: [
                '/images/instant-access-locksmiths/instant-access-locksmiths__s1__hero__tablet.png',
                '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__tablet.png',
            ],
            mobile: [
                '/images/instant-access-locksmiths/instant-access-locksmiths__s1__hero__mobile.png',
                '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__mobile.png',
            ],
        },
    },
};

export default instantAccessLocksmiths;
