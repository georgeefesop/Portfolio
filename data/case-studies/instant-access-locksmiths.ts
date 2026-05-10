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
    body: {
        brief: {
            situation: 'James has run Instant Access Locksmiths for over 15 years; I have been his designer for ten of them, starting with his first site and maintaining each iteration as the business grew. By 2025 the WordPress build was holding him back: slow on mobile, structurally incapable of competing for long-tail local queries, increasingly expensive to keep patched. The brief was to migrate him onto a Next.js site engineered for local SEO, fast enough to win Core Web Vitals and structured so each town in his service area gets a page of its own.',
            audience: 'Two distinct visitor types with very different headspaces: someone locked out at 2am, phone in hand, needing one clear action immediately; and a homeowner researching security upgrades in daylight, comparing options, wanting to verify James is credible before committing to a call.',
            what_made_it_hard: [
                'The locksmith trade is notorious for inflated call-out scams, so every visitor arrives skeptical regardless of how good the operator actually is.',
                'Two visitor headspaces on one homepage: the 2am lockout reaching for a phone, and the daytime researcher comparing options.',
            ],
        },
        decisions: [
            {
                title: 'Call first, enquire second',
                what: 'The hero carries a single prominent gold call button and a secondary "Or send a message" text link. No contact form anywhere on the landing section.',
                why: 'A locksmith call at 2am is a single-action moment. A form between the visitor and a phone number costs real jobs; the person locked out is not filling in fields, they are already reaching for the phone. The message link stays as a plain text link so the daytime researcher who prefers a written trail still has the option, without competing with the primary action.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s1__hero__desktop.png',
                caption: 'Gold call button as primary action, message link as secondary - hierarchy matched to visitor intent',
            },
            {
                title: 'Anxiety before credentials',
                what: 'The headline reads "Your local locksmith, on call day or night." The words "day or night" are set in italic gold, breaking the weight of the white heading. Sub-copy opens with "Hi, I\'m James" before listing any accreditations.',
                why: 'Competitor sites lead with credentials: MLA approved, DBS checked, fully insured. James has all of those, but the visitor at 2am is not wondering whether James is MLA registered, they are wondering whether anyone is awake. "Day or night" in italic gold speaks to that anxiety first; "Hi, I\'m James" follows immediately because in a high-trust trade, a name before a badge reads as a person rather than a brochure.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s4__break-ins__desktop.png',
                caption: 'Availability before accreditation - the italic accent speaks to the 2am visitor before credentials get a look-in',
            },
            {
                title: 'Radius map over postcode table',
                what: 'The contact section fills the right two-thirds of the screen with an interactive map showing James\'s service area as a drawn circle centred on Solihull, with the enquiry details in a column to the left.',
                why: 'A column of postcodes is what every local tradesperson defaults to because it is easy to maintain, but it is the wrong answer to the question the visitor actually has: nobody searches their postcode against a list, they think in terms of where they live relative to a place they know. The drawn radius answers "am I covered?" without reading, and a large clearly-bounded circle reads as an established business with a defined patch, not a sole trader taking whatever turns up. The rejected version was a postcode list, accurate but it put the mental work on the visitor rather than removing it.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__desktop.png',
                caption: 'Service radius as a drawn circle - geographic coverage answered without a postcode lookup',
            },
        ],
        process: 'Migrated off WordPress onto Next.js + Tailwind, deployed on Vercel. Static generation and edge caching land cold mobile loads inside Core Web Vitals, which is the single biggest local-SEO lever in this category. Service-area pages are generated programmatically from one content source: Solihull, Knowle, Dorridge, Shirley, Earlswood, Coleshill, Sheldon and Hall Green each get a dedicated page targeting their own long-tail query. Schema.org markup (LocalBusiness, Service, FAQPage, Review) for rich-result eligibility from day one. The live cost estimator emails a quote summary and writes a row to a Google Sheet, slotted around the call-first workflow James actually uses rather than bolted on as a CRM he would never log into.',
        outcome: {
            summary: 'James has held a ThreeBestRated top-3 position for Solihull locksmiths every year since 2019, currently ranked #1 ahead of Ko-Lock and CraftLock. The review picture matches: 4.9/5 on QuoteQuant across 57 reviews, 4.9/5 on Google, active listings on Checkatrade and Yell with consistent five-star feedback. That track record is what the rebuild is designed to compound, not replace. A programmatic town-by-town page generator is currently being added so each settlement in the service area has a page targeting its own long-tail query, rather than the old single-page template fighting for them all at once. Police-approved, MLA-affiliated, fifteen years in the trade: the credentials were already there, the site finally matches them.',
            metrics: [
                { value: '100', label: 'SEO' },
                { value: '100', label: 'Accessibility' },
                { value: '100', label: 'Best practices' },
                { value: '99', label: 'Desktop perf' },
            ],
        },
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
