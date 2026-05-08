import type { CaseStudy } from './types';

const kingfisher: CaseStudy = {
    id: 'kingfisher-mortgages',
    title: 'Kingfisher Mortgages',
    subtitle: 'A specialist UK mortgage broker built twice. Once on WordPress + Elementor for an editor-friendly client team, then rebuilt on Next.js + Sanity headless to demonstrate the same brand on a modern stack. Same visual system, same copy, two different ways to ship it.',
    role: 'Brand, design, build (WordPress and Next.js)',
    period: '2025',
    tags: ['WordPress', 'Elementor', 'Next.js', 'Sanity', 'Headless CMS', 'Brand', 'Schema / AEO', 'Financial services'],
    categories: ['wordpress', 'nextjs', 'design'],
    stack: ['nextjs', 'sanity', 'wordpress', 'elementor'],
    links: { live: '/kingfisher' },
    body: {
        honest_note: 'Fictional brand built as a portfolio piece, so the case figures, the lender quotes, and the live URL are illustrative. The judgement calls (positioning, content order, visual system, what to cut from the previous build) are the case study; performance numbers aren\'t.',
        brief: {
            situation: 'Reposition Kingfisher as the specialist UK mortgage broker for self-employed borrowers (freelancers, contractors, limited company directors) and rebuild the site to match. The previous build leaned on comparison-site cliche: rate tables, generic CTAs, stock keys-on-doormat photography. The remit was to make the site read as considered as a wealth manager and as direct as a friend who knows which lenders actually read accounts.',
            audience: 'Self-employed borrowers between 28 and 45 who have already been turned down by their bank or stitched up by a comparison site. Most arrive sceptical, tired of explaining contractor day rates and retained profits to algorithms, and ready to leave the second the page looks like another lead funnel.',
            what_made_it_hard: [
                'Visitors arrive after rejection, not curiosity. The first surface has to acknowledge that, not paper over it.',
            ],
        },
        decisions: [
            {
                title: 'Lead with rejection, not features',
                what: 'The hero splits one sentence across two type styles. Fraunces 380 in Ink reads "The bank said no.", italic Fraunces in Accent Deep coral reads "So we said fine." The same italic-coral motif paints the audience pain words underneath: self-employed, contractors, limited company directors. One coral pill CTA reads "Book a 15-min chat" with a sub-line: "Fifteen minutes. No application forms. No sales pressure."',
                why: 'Self-employed visitors arrive carrying rejection, not curiosity. Naming it in the hero lets the rest of the page do its job before any product feature has to be read. Italic-coral on the visitor\'s own job titles is the tell that the site was written for them, not at them. A generic "Specialist mortgages, made simple" headline above three USP icons is what every comparison site already does, and what the audience scrolled past before they landed here.',
                screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__desktop.png',
                caption: 'Hero pairs Fraunces serif with italic-coral on the audience pain words, naming rejection in the first three seconds.',
            },
            {
                title: 'Indicative number before email gate',
                what: 'A static "What could you actually afford?" preview, italic-coral on "actually". A cream Paper 3 panel sits on the right with three labelled rows (Annual income / Deposit / Term) and an italic-coral 44px "Indicative borrowing GBP 284,000" beneath. One coral pill CTA, one disclaimer line. No sliders, no email field, no multi-step.',
                why: 'The previous build collected three answers in an interactive calculator, then asked for an email before the number appeared. The audience has been email-trapped before. A static preview is a credibility surface, not a conversion mechanic. It shows the broker can give a realistic figure from self-employed inputs and trusts the visitor with it before asking anything in return. The CTA below is for a 15-minute chat, not a "see your full result" gate.',
                screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s3__what-could-you-actually-afford__desktop.png',
                caption: 'Static preview shows a realistic indicative figure without an email gate or multi-step form.',
            },
            {
                title: 'Process as named time, not vague journey',
                what: 'Three offset Paper cards on Teal Deep with a hard offset coral box-shadow (14px, 14px, 0), zigzag staggered so cards 01 and 03 lift and 02 drops. Each card carries a Fraunces numeral, an Inter wide-tracked "STEP ONE" label, a Fraunces 30px subheading, and a one-line body. A coral hairline runs through the vertical centre. Headline closes on italic-coral: "From stuck to keys in four to six weeks."',
                why: 'Every mortgage page promises "we will get you sorted." This one names a number. Pre-empting "but how long does it actually take?" is what the audience is scanning for, and the rest of the copy can do its work once that question is answered. The zigzag is cheaper than animation but reads as movement, and gives the editorial layout a beat between the calm hero and the denser persona section that follows.',
                screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s4__from-stuck-to-keys-in-four-to-six-weeks__desktop.png',
                caption: 'Zigzag-staggered process cards on Teal with offset coral shadow, headline ending in italic-coral on the time phrase.',
            },
            {
                title: 'Case study as property listing, not pull quote',
                what: 'Sarah\'s section runs a portrait of her at work on the left and the case body on the right: three short paragraphs of plain prose, then a four-column hard-numbers row (Borrowed / 5-yr fix / LTV / Time to offer) in italic coral, then a small Paper 3 quote card attributed to "Sarah, freelance illustrator, Bristol". No floating quote marks, no "transformative experience" line.',
                why: 'This audience reads property pages on Rightmove, not the testimonial wall on a SaaS site. Hard numbers in a single row mirror the way they already scan asking prices, fixed terms, and yields. The quote sits below the figures because credibility is built by the numbers first; the sentence is there to confirm tone, not carry the proof. A pull-quote without the figures would have read as marketing, not evidence.',
                screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s6__how-sarah-bought-her-first-flat-with-18-__desktop.png',
                caption: 'Case format with hard numbers in a four-column row, quote dropped to a subdued cream card below.',
            },
        ],
        process: 'Built twice. The original is WordPress + Elementor on the free tier, deliberately, so a small client team can edit copy and ship new product pages without my hands on the file. The visual ceiling comes from CSS in a single nav-widget style block: Fraunces variable + Inter, the italic-coral em rule, cream-on-cream panels, and the offset coral shadow that ties the process band to the rest of the system. Fraunces is loaded via the v2 Google Fonts URL because v1 silently strips the variable axes the headlines rely on. Schema markup (FinancialProduct, FAQPage, BreadcrumbList) runs sitewide so AEO answers can come from Kingfisher\'s pages. The rebuild ports the same visual system to Next.js 16 (App Router, ISR, server components) with Sanity as the headless CMS. Schemas mirror the section structure (hero, marquee, problemFrame, calculator, etc) so editors fill structured fields rather than dragging blocks. One GROQ query on the page fetches every section in a single round-trip, then renders to React; sliders on the calculator run client-side; the booking modal is a real React component. Same fonts, same colour tokens, same italic-coral em rule, ported to TypeScript.',
        comparison: {
            heading: 'Same brand, two stacks',
            intro: 'I shipped the same homepage on two different systems so the choice between them is visible, not theoretical. The WordPress build is what most small service businesses run; the headless build is what a team scales to once the visual ceiling and the editing workflow start fighting each other. The numbers below are real Lighthouse scores measured on production; click "View" on either card to load that build in a new tab and confirm. Headline differences: page weight drops from 7.2 MB to 860 KB, desktop performance climbs from 78 to 96, mobile performance from 56 to 67.',
            methodology: 'Numbers measured live via the Google PageSpeed Insights v5 API on 2026-05-03, desktop strategy, against /kingfisher and /kingfisher-sanity on production. Page weight, request count, and DOM tag count come from the same audit run plus a direct fetch of the rendered HTML. Lighthouse scores fluctuate run-to-run by a few points; values shown are from a single sample.',
            builds: [
                {
                    label: 'WordPress + Elementor',
                    href: '/kingfisher',
                    note: 'Free Elementor tier, all visual work done in CSS. Editor-friendly, plugin-heavy.',
                    lighthouse: { performance: 78, accessibility: 93, bestPractices: 96, seo: 83 },
                    extras: [
                        { label: 'Page weight', value: '7.2 MB' },
                        { label: 'Requests', value: '40' },
                        { label: 'DOM tags', value: '729' },
                        { label: 'Mobile perf', value: '56' },
                    ],
                },
                {
                    label: 'Next.js + Sanity',
                    href: '/kingfisher-sanity',
                    note: 'Headless CMS, ISR, server components. Single GROQ query per page.',
                    lighthouse: { performance: 96, accessibility: 88, bestPractices: 100, seo: 100 },
                    extras: [
                        { label: 'Page weight', value: '860 KB' },
                        { label: 'Requests', value: '26' },
                        { label: 'DOM tags', value: '430' },
                        { label: 'Mobile perf', value: '67' },
                    ],
                },
            ],
        },
        outcome: {
            summary: 'A homepage that positions immediately against the audience\'s biggest pain (rejection), surfaces an indicative borrowing figure before any contact form, and ships on either of two stacks the same client could plausibly choose. WordPress + Elementor for editor autonomy on the free tier; Next.js + Sanity when performance, type safety, and a structured content model start mattering more than drag-and-drop. The case format, the calculator preview, and the FAQ ordering carry the positioning on both, rather than depending on a tagline to do it.',
        },
    },
    images: {
        thumbnail: '/images/kingfisher-thumb.png',
        hero: '/images/kingfisher-thumb.png',
        gallery: {
            desktop: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s3__what-could-you-actually-afford__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s4__from-stuck-to-keys-in-four-to-six-weeks__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s6__how-sarah-bought-her-first-flat-with-18-__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s8__buy-to-let-that-counts-your-real-income__desktop.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s9__awkwardquestions-answered__desktop.png',
            ],
            tablet: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__tablet.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__tablet.png',
            ],
            mobile: [
                '/images/kingfisher-mortgages/kingfisher-mortgages__s1__the-bank-said-no__mobile.png',
                '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__mobile.png',
            ],
        },
    },
};

export default kingfisher;
