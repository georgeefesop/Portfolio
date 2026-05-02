import type { CaseStudy } from './types';

const instantAccessLocksmiths: CaseStudy = {
    id: 'instant-access-locksmiths',
    title: 'Instant Access Locksmiths',
    subtitle: 'Next.js rebuild for a Solihull locksmith, built phone-first for late-night visitors with programmatic local-SEO landing pages.',
    role: 'Design + build (Next.js)',
    period: '2025',
    tags: ['Next.js', 'Tailwind', 'Local SEO', 'Conversion'],
    categories: ['nextjs', 'design'],
    aiBuilt: true,
    links: { live: 'https://www.instantaccesslocksmiths.co.uk/' },
    body: {
        brief: {
            situation: 'James has run Instant Access Locksmiths for over 15 years and has been a client of mine for ten of them - I built his first site, then maintained and upgraded it as his business grew. By 2025 the WordPress build that had served him well for years was holding him back: slow on mobile, structurally incapable of competing for the long-tail local queries that drive locksmith demand, and increasingly expensive to keep patched. The brief for this rebuild was to migrate him off WordPress entirely onto a Next.js site engineered for local SEO - fast enough to win Core Web Vitals in a category where mobile speed is a direct ranking signal, and structured so each town in his service area has a page of its own to compete with.',
            audience: 'Two distinct visitor types with very different headspaces: someone locked out at 2am, phone in hand, needing one clear action immediately; and a homeowner researching security upgrades in daylight, comparing options, wanting to verify James is credible before committing to a call.',
            what_made_it_hard: [
                'Trust deficit in the trade - locksmith scams have made the category notorious for inflated call-out pricing, so every visitor arrives skeptical regardless of how good the operator actually is',
                'Long-tail local SEO requires a programmatic page structure the old template had no capacity for - "locksmith in Knowle" and "locksmith in Dorridge" are distinct queries that a single homepage cannot win',
                'No booking system or CRM - the solution had to generate qualified enquiries without adding workflow James does not have the overhead to run',
            ],
        },
        decisions: [
            {
                title: 'Call first, enquire second',
                what: 'The hero carries a single prominent gold call button and a secondary "Or send a message" text link. No contact form anywhere on the landing section.',
                why: 'A locksmith call at 2am is a single-action moment. A form between the visitor and a phone number costs real jobs - the person locked out of their house is not filling in fields, they are already reaching for the phone. Making the message option a plain text link rather than a button keeps it available for daytime researchers who prefer a written trail, without competing with the primary action in visual hierarchy. A modal contact form launched from the hero was the alternative considered; it added no qualification value for a one-person operation running on calls and WhatsApp, and would have introduced friction at exactly the moment the visitor needed to act.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s1__hero__desktop.png',
                caption: 'Gold call button as primary action, message link as secondary - hierarchy matched to visitor intent',
            },
            {
                title: 'Anxiety before credentials',
                what: 'The headline reads "Your local locksmith, on call day or night." The words "day or night" are set in italic gold, breaking the weight of the white heading. Sub-copy opens with "Hi, I\'m James" before listing any accreditations.',
                why: 'Competitor sites lead with credentials: MLA approved, DBS checked, fully insured. James has all of those and they appear further down the page. But the visitor at 2am is not wondering whether James is MLA registered - they are wondering whether anyone is awake to answer. The italic gold accent on "day or night" speaks directly to that anxiety in the first read, before any credential can begin its slower trust-building work. First-person "Hi, I\'m James" follows immediately. Locksmiths are a high-trust trade where anonymity reads as a red flag; putting a name before a badge is a deliberate humanisation call that credentials-first layouts routinely skip in favour of looking professional.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s4__break-ins__desktop.png',
                caption: 'Availability before accreditation - the italic accent speaks to the 2am visitor before credentials get a look-in',
            },
            {
                title: 'Radius map over postcode table',
                what: 'The contact section fills the right two-thirds of the screen with an interactive map showing James\'s service area as a drawn circle centred on Solihull, with the enquiry details in a column to the left.',
                why: 'A column of postcodes is what every local tradesperson defaults to because it is easy to maintain. It is also the wrong answer to the question a visitor actually has - nobody searches their postcode against a list; they think in terms of where they live relative to a place they know. The drawn radius answers "am I covered?" immediately and without reading. It also signals confidence: a large, clearly bounded circle reads as an established business with a defined patch, not a sole trader taking whatever turns up. The rejected version used a bulleted postcode list; accurate, but it put the mental work on the visitor rather than removing it.',
                screenshot: '/images/instant-access-locksmiths/instant-access-locksmiths__s8__contact-map__desktop.png',
                caption: 'Service radius as a drawn circle - geographic coverage answered without a postcode lookup',
            },
        ],
        process: 'Migrated off WordPress onto Next.js with Tailwind, deployed on Vercel. The whole site is statically generated where possible and edge-cached, which means cold mobile loads come in fast enough to clear Core Web Vitals comfortably - the single biggest local-SEO lever in this category. Service-area pages are generated programmatically from one content source: Solihull, Knowle, Dorridge, Shirley, Earlswood, Coleshill, Sheldon, Hall Green and the rest of his patch each get a dedicated page targeting their own long-tail query, rather than fighting for them all from a single homepage the way the WordPress build had to. Schema.org markup covers LocalBusiness, Service, FAQPage and Review so the rich-result eligibility is in place from day one. The live cost estimator emails a quote summary and writes a row to a Google Sheet - slotted around the call-first workflow James actually uses, not bolted on as a CRM he would never log into.',
        outcome: {
            summary: 'James has held a ThreeBestRated top-3 position for Solihull locksmiths every year since 2019 - seven consecutive years, currently ranked #1 ahead of Ko-Lock and CraftLock. The aggregate review picture matches: 4.9/5 on QuoteQuant across 57 reviews, 4.9/5 on Google, and active listings on Checkatrade and Yell with consistent five-star feedback. That track record is what the rebuild is designed to compound rather than replace. The Next.js rebuild gives the site the technical foundation to do that: a perfect Lighthouse score for SEO, accessibility and best practices, and 99/100 on desktop performance - the band where Google rewards local results. A programmatic town-by-town page generator is currently being added so each settlement in the service area has a dedicated page targeting its own long-tail query, rather than the old single-page template fighting for them all at once. Police-approved, MLA-affiliated, fifteen years in the trade - the credentials were already there; the site finally matches them.',
            metrics: [
                { value: '100', label: 'Lighthouse SEO' },
                { value: '100', label: 'Lighthouse Accessibility' },
                { value: '100', label: 'Best Practices' },
                { value: '99', label: 'Desktop Performance' },
            ],
        },
    },
    images: {
        thumbnail: '/images/instant-access-locksmiths/hero-thumb.png',
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
