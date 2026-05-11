import type { CaseStudy } from './types';

const kingfisher: CaseStudy = {
    id: 'kingfisher-mortgages',
    title: 'Kingfisher Mortgages',
    subtitle: 'A specialist UK mortgage broker, built twice for comparison. WordPress + Elementor (AI-driven build via Elementor MCP) then rebuilt on Next.js + Sanity headless. Same brand, same copy, real numbers on both.',
    role: 'Brand, design, build (WordPress and Next.js)',
    period: '2025',
    tags: ['Elementor MCP', 'WordPress', 'Next.js', 'Sanity', 'Brand'],
    categories: ['wordpress', 'nextjs', 'design'],
    aiBuilt: true,
    stack: ['wordpress', 'elementor', 'nextjs', 'sanity'],
    links: { live: '/kingfisher' },
    comparison: {
        heading: 'Same brand, two stacks',
        intro: 'I shipped the same homepage on two different systems so the choice between them is visible, not theoretical. The WordPress build is what most small service businesses run; the headless build is what a team scales to once the visual ceiling and the editing workflow start fighting each other. The numbers below are real Lighthouse scores measured on production; click "View" on either card to load that build in a new tab and confirm. Headline differences: page weight drops from 7.2 MB to 860 KB, desktop performance climbs from 78 to 96, mobile performance from 56 to 67.',
        methodology: 'Numbers measured live via the Google PageSpeed Insights v5 API on 2026-05-03, desktop strategy, against /kingfisher and /kingfisher-sanity on production. Page weight, request count, and DOM tag count come from the same audit run plus a direct fetch of the rendered HTML. Lighthouse scores fluctuate run-to-run by a few points; values shown are from a single sample.',
        builds: [
            {
                label: 'WordPress + Elementor',
                href: '/kingfisher',
                note: 'Free Elementor tier, built via Elementor MCP. Editor-friendly, plugin-heavy.',
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
    builds: [
        {
            id: 'wordpress',
            label: 'Original build (WordPress + Elementor MCP)',
            description: 'Brand designed first, then built on WordPress + Elementor using Elementor MCP, a test of how far agent-driven page building can go on a free Elementor tier.',
            stack: ['wordpress', 'elementor'],
            briefLabel: 'Original Build Brief',
            links: [
                { href: '/kingfisher', label: 'Live (WordPress)', logo: 'wordpress' },
            ],
            body: {
                honest_note: 'Fictional brand built as a portfolio piece. The judgement calls (positioning, content order, visual system, what to cut from the previous build) are the case study; the performance numbers in the comparison are real, but the lender quotes and the URL are illustrative.',
                brief: {
                    situation: 'Reposition Kingfisher as the specialist UK mortgage broker for self-employed borrowers (freelancers, contractors, limited company directors), and build the site to match. The previous build leaned on comparison-site cliche: rate tables, generic CTAs, stock keys-on-doormat photography. The remit was to make the site read as considered as a wealth manager and as direct as a friend who knows which lenders actually read accounts. Then ship it on WordPress + Elementor via Elementor MCP, so a small client team can edit copy and add product pages without me in the loop.',
                    audience: 'Self-employed borrowers between 28 and 45 who have already been turned down by their bank or stitched up by a comparison site. Most arrive sceptical, tired of explaining contractor day rates and retained profits to algorithms, and ready to leave the second the page looks like another lead funnel.',
                    what_made_it_hard: [
                        'Visitors arrive after rejection, not curiosity. The first surface has to acknowledge that.',
                        'Elementor MCP was a new tool; driving page edits via agent meant treating every change as a verified diff, not a screenshot check.',
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
                    {
                        title: 'Elementor MCP as the build tool',
                        what: 'Pages loaded as JSON, sections defined as widget trees, edits applied as batch transactions via Elementor MCP with computed-style verification on the rendered output. No point-and-click in the Elementor canvas; every change landed as a verified diff. Free Elementor tier throughout: no Pro plugins, no third-party builder bridges.',
                        why: 'The reason most agencies still hand-build WordPress sites is the assumption that AI cannot drive a visual builder reliably. Elementor MCP closes that gap if you treat it as a batch-edit pipeline rather than a chat: load the page state, plan the diff, flush as a transaction, verify by computed style rather than by screenshot. The build proved the loop works at production fidelity. The trade-offs that bite (single-quote HTML attributes, _css_classes vs css_classes, .e-con-inner grid trap, typography_typography not applying tokens) are lessons that go in the next agent\'s context, not blockers on whether the approach works.',
                        screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s5__whatever-self-employed-looks-like-for-yo__desktop.png',
                        caption: 'Every Elementor section landed via agent-driven batch edits with computed-style verification, on the free Elementor tier.',
                    },
                ],
                process: 'Brand fiction (name, voice, market positioning) before any visual direction. Visual ceiling defined in one CSS block: Fraunces variable + Inter, italic-coral em rule, cream-on-cream panels, offset coral shadow. Then built via Elementor MCP: pages loaded as JSON, sections defined as widget trees, edits applied as batch transactions with computed-style verification on the rendered output. Fraunces loaded via the v2 Google Fonts URL because v1 silently strips the variable axes the headlines rely on. Schema markup (FinancialProduct, FAQPage, BreadcrumbList) runs sitewide so AEO answers can come from Kingfisher\'s pages.',
                outcome: {
                    summary: 'A homepage that positions immediately against the audience\'s biggest pain (rejection), surfaces an indicative borrowing figure before any contact form, and ships on a stack a small client team can edit without me in the loop. Built end-to-end via Elementor MCP on the free Elementor tier, with no Pro plugins or third-party builder bridges. Proof that AI-driven page building works at production fidelity on a real visual builder.',
                    metrics: [
                        { value: '78', label: 'Desktop perf' },
                        { value: '93', label: 'Accessibility' },
                        { value: '96', label: 'Best practices' },
                    ],
                },
            },
        },
        {
            id: 'sanity',
            label: 'Headless rebuild (Next.js + Sanity)',
            description: 'Same brand and copy ported to Next.js + Sanity, same visual system, structured content model in place of drag-and-drop.',
            stack: ['nextjs', 'sanity'],
            briefLabel: 'Headless Rebuild Brief',
            links: [
                { href: '/kingfisher-sanity', label: 'Live (Headless)', logo: 'sanity' },
            ],
            body: {
                brief: {
                    situation: 'A second build of the same homepage, this time on Next.js 16 with Sanity as the headless CMS. The brand, the copy, and the section structure stay identical; the goal was to see what the same case looks like when performance and a structured content model start mattering more than drag-and-drop.',
                    audience: 'For the rebuild, the secondary audience matters: technical decision-makers (CTOs, freelance devs, in-house teams) evaluating whether headless is worth the lift over Elementor. The primary audience (self-employed borrowers) sees the same site regardless of stack.',
                    what_made_it_hard: [
                        'Porting the visual system to TypeScript without losing fidelity meant rebuilding the italic-coral em rule, font loading and tokens from CSS to TS.',
                        'Sanity schemas had to mirror the section structure so editors fill structured fields rather than dragging blocks, without re-architecting the design.',
                    ],
                },
                decisions: [
                    {
                        title: 'Schemas mirror sections, not free-form blocks',
                        what: 'Sanity content schemas mirror the marketing page structure 1:1: a hero schema, a problem-frame schema, a calculator schema, a marquee schema, a case-study schema, an FAQ schema. Editors fill structured fields per section rather than dragging blocks onto a canvas.',
                        why: 'Free-form blocks in a CMS look flexible but produce maintenance debt: every block can be misused and every page can drift from the brand. Schemas tied to specific marketing sections trade some flexibility for guaranteed brand fidelity. The editor cannot ship an off-brand hero because the hero schema only accepts hero-shaped content. The trade-off is fewer "creative" layouts; the upside is a content team that can publish a new product page in fifteen minutes without a designer in the loop.',
                        screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s3__what-could-you-actually-afford__desktop.png',
                        caption: 'Section-specific Sanity schemas guarantee brand fidelity at the cost of layout freedom.',
                    },
                    {
                        title: 'One GROQ query per page, server-rendered',
                        what: 'Every section on the page comes from a single GROQ query fetched server-side and rendered to React, with hydration reserved for the few elements that actually need user input (calculator sliders, the booking modal).',
                        why: 'The naive headless pattern is one fetch per component, which kills both performance and editorial coherence. One query per page, on the server, means the page renders as one document with one cache key, and the editor sees the page in the same shape they edit it. Hydration is reserved for the few elements that actually need to react to user input, so the static surface stays static and the perf numbers in the comparison block reflect a single round-trip per visitor.',
                        screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s8__buy-to-let-that-counts-your-real-income__desktop.png',
                        caption: 'One GROQ query per page, server-rendered, hydration only where interactivity needs it.',
                    },
                    {
                        title: 'Design tokens ported from CSS to TypeScript',
                        what: 'The italic-coral em rule, the Fraunces + Inter pairing, the cream-on-cream panels and the offset coral shadow all ported from CSS variables to TypeScript design tokens. Same visual system, type-checked.',
                        why: 'A CSS variable can be misnamed silently; a TypeScript token gets a compile error if a section references an undefined accent. Porting the system to TS catches the drift that creeps in over a year of edits, and means future case-study pages reference the same tokens rather than diverging. The visual fidelity matches the WordPress build; the design system now survives contact with refactors.',
                        screenshot: '/images/kingfisher-mortgages/kingfisher-mortgages__s9__awkwardquestions-answered__desktop.png',
                        caption: 'TypeScript design tokens catch the visual drift CSS variables let through.',
                    },
                ],
                process: 'The rebuild ports the WordPress visual system to Next.js 16 (App Router, ISR, server components) with Sanity as the headless CMS. Schemas mirror the section structure (hero, marquee, problemFrame, calculator, caseStudy, faq) so editors fill structured fields rather than dragging blocks. One GROQ query on the page fetches every section in a single round-trip, then renders to React; sliders on the calculator run client-side; the booking modal is a real React component. Same fonts, same colour tokens, same italic-coral rule, ported to TypeScript.',
                outcome: {
                    summary: 'A headless rebuild that lands the same homepage at 96 desktop Lighthouse performance (vs 78 on the WordPress build), with page weight dropping from 7.2 MB to 860 KB and DOM nodes from 729 to 430. The visual system survives the port intact; the editing workflow changes shape entirely from drag-and-drop to structured-content. Whether that trade is worth it depends on whether the client team prefers editor autonomy or developer-shipped quality; the comparison block above makes that choice visible rather than theoretical.',
                    metrics: [
                        { value: '96', label: 'Desktop perf' },
                        { value: '100', label: 'Best practices' },
                        { value: '100', label: 'SEO' },
                    ],
                },
            },
        },
    ],
    images: {
        thumbnail: '/images/kingfisher-thumb.jpg',
        hero: '/images/kingfisher-thumb.jpg',
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
