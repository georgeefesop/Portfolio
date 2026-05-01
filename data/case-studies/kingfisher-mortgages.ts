import type { CaseStudy } from './types';

const kingfisher: CaseStudy = {
    id: 'kingfisher-mortgages',
    title: 'Kingfisher Mortgages',
    subtitle: 'WordPress rebuild and brand positioning for a UK mortgage broker specialising in the self-employed - premium editorial design, an interactive borrowing calculator, and full schema markup for AEO.',
    role: 'Brand, design & WordPress build',
    period: '2025',
    tags: ['WordPress', 'Elementor', 'Brand', 'Schema / AEO', 'Financial services'],
    categories: ['wordpress', 'design'],
    description: {
        overview: 'Kingfisher is an independent UK mortgage broker specialising in borrowers the high street turns away - sole traders, contractors, limited company directors, and anyone with non-standard income. I led the full rebuild: brand and positioning, copy, a WordPress/Elementor site, an interactive borrowing calculator, and the schema layer that earns AEO visibility.\n\nThe remit ran end to end: positioning platform, palette and typography, sitemap and copy hierarchy, page templates, social proof architecture, schema markup, and a documented handover the client team can run themselves.',
        challenge: 'Reposition a specialist mortgage broker as premium and trust-led while solving:\n\n• A category that defaults to comparison-site cliché - rate tables, generic CTAs, stock photos of keys\n• An audience of self-employed borrowers who have already been rejected and arrive sceptical\n• A small team that needed to add and edit product pages without revisiting me\n• AEO/GEO visibility - mortgage answers from this site, not a competitor\'s\n• Core Web Vitals targets that stock-photo mortgage templates routinely miss',
        work: [
            'Positioning-first copy: "The bank said no. So we said fine." addresses the rejection pain every self-employed visitor carries and differentiates from comparison-site generalists before anything else loads',
            'Brand: a calm, paper-and-ink palette with dark green and terracotta accents, editorial serif headlines, and a visual hierarchy closer to wealth management than comparison - legible, warm, nothing clinical',
            'Interactive borrowing calculator: a three-question income-type wizard (sole trader, contractor, ltd director, umbrella) that returns realistic specialist lender estimates in under 60 seconds - no credit check, no email required before the number appears',
            'Social proof by case format: each client story carries a mortgage amount, LTV, rate, and time to offer - borrowers scan hard numbers the way house buyers read asking prices, not quote cards',
            'WordPress + Elementor on a stripped-back theme - one product page template with conditional fields covers all mortgage types, new products take five minutes to publish',
            'Schema.org markup across the site (FinancialProduct, FAQPage, BreadcrumbList) so AEO answers come from Kingfisher\'s pages, not a comparison site',
            'Documented handover (BRAND, SETUP, SITEMAP-COPY) so the client team owns the site from day one'
        ],
        outcome: 'Live and replacing the previous templated build. A site that positions immediately against the specialist audience\'s biggest pain, generates leads through the calculator before any contact form appears, and stays maintainable in the client\'s hands. Schema work pays off disproportionately in financial services - a category where AEO visibility is still largely unclaimed by independents.'
    },
    links: {},
    images: {
        thumbnail: "/images/kingfisher/1-thumb.jpg",
        hero: "/images/kingfisher/1-thumb.jpg",
        gallery: [
            "/images/kingfisher/1-thumb.jpg",
            "/images/kingfisher/1.png",
            "/images/kingfisher/2.png",
            "/images/kingfisher/3.png",
            "/images/kingfisher/4.png"
        ]
    }
};

export default kingfisher;
