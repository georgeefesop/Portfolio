'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import FadeIn from '../motion/FadeIn';
import CaseStudyModal from '../ui/CaseStudyModal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

// Mock data assets (placeholders)
const PLACEHOLDER_IMG = "/placeholder.svg";

type CategoryId = 'design' | 'wordpress' | 'nextjs' | 'ai-image';

const FILTER_PILLS: { id: CategoryId | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'wordpress', label: 'WordPress' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'ai-image', label: 'AI Image & Video' },
];

const cases = [
    {
        id: 'realfi',
        title: 'RealFi',
        subtitle: 'Financial inclusion platform for emerging markets',
        role: 'Product Designer',
        period: '2023-2024 (Input Output)',
        tags: ['Web3', 'Fintech', 'Product Design'],
        categories: ['design'] as CategoryId[],
        description: {
            overview: 'RealFi is Input Output\'s blockchain-based initiative connecting underserved businesses in emerging markets with global capital. I designed the platform\'s core user experience, focusing on simplifying complex financial processes-KYC verification, credit assessment, and impact measurement-while remaining accessible for users in markets with limited digital infrastructure.\n\nThe platform serves two distinct user groups: businesses seeking capital and investors seeking impact-driven opportunities. Each required tailored workflows balancing regulatory compliance with ease of use.',
            challenge: 'Design a financial platform enabling 3 billion underbanked people to access credit, insurance, and identity services through blockchain infrastructure while addressing:\n\n• Digital literacy variance across global user base\n• Low-bandwidth and offline-first requirements\n• Complex regulatory compliance across jurisdictions\n• Cross-cultural UX for emerging and developed markets',
            work: [
                'Dual user journey design: capital seekers (businesses) and capital providers (investors)',
                'Complex lending workflows simplified for low-connectivity environments',
                'Impact measurement dashboard with real-time ESG metrics',
                'KYC/onboarding systems tailored to each user type with progressive disclosure',
                'Daily collaboration with product, engineering, and blockchain teams',
                'Portfolio dashboards with impact and financial performance metrics',
                'Risk assessment interfaces with regulatory compliance',
                'Multi-stage application and approval workflows'
            ],
            outcome: 'Platform launched 2024. Active lending to SMEs in East Africa. Part of Cardano\'s $80bn blockchain ecosystem.\n\nRealFi has been publicly identified by Cardano founder Charles Hoskinson as a cornerstone initiative for bringing real-world financial utility to blockchain technology, targeting billions in total value locked by 2026.'
        },
        links: {
            live: 'https://realfi.co'
        },
        images: {
            thumbnail: "/images/realfi/hero.png",
            hero: "/images/realfi/hero.png",
            gallery: [
                "/images/realfi/hero.png",
                "/images/realfi/2.png",
                "/images/realfi/3.png"
            ]
        }
    },
    {
        id: 'ai-tools',
        title: 'AI User Tools',
        subtitle: 'UI/UX product exploration + landing page',
        role: 'Product Designer',
        period: '2024',
        tags: ['UI/UX', 'AI', 'Miro', 'Landing Page'],
        categories: ['design'] as CategoryId[],
        description: {
            challenge: 'Open brief: figure out what a SaaS that aggregates scattered generative AI tools could actually feel like. Less "ship the product", more "find the shape before anything gets built".',
            work: [
                'Worked the problem in Miro across a series of mind maps and thinking boards - audience, jobs-to-be-done, flows, information architecture',
                'Iterated on product concepts on the canvas before pushing pixels, narrowing a wide exploratory space down to a defendable direction',
                'Designed a visually distinctive landing page in a bold style to give the concept a face and a tone'
            ],
            outcome: 'A clear product direction grounded in structured thinking, plus a landing page that communicates the positioning. The deliverable was the design vocabulary and product shape, not a shipped app.'
        },
        links: {},
        images: {
            thumbnail: "/images/ai-tools/AIUT-2.png",
            hero: "/images/ai-tools/AIUT-2.png",
            gallery: [
                "/images/ai-tools/AIUT-2.png",
                "/images/ai-tools/1.PNG",
                "/images/ai-tools/2.PNG",
                "/images/ai-tools/3.PNG",
                "/images/ai-tools/4.PNG",
                "/images/ai-tools/7.PNG",
                "/images/ai-tools/8.PNG",
                "/images/ai-tools/11.PNG"
            ]
        }
    },

    {
        id: 'stellar',
        title: 'Stellar Observatory',
        subtitle: 'Interactive Generative Art Console',
        role: 'Design Engineer',
        period: '2025',
        tags: ['Generative Art', 'React', 'Canvas', 'UI Design'],
        categories: ['design', 'nextjs'] as CategoryId[],
        aiBuilt: true,
        description: {
            challenge: 'Design a futuristic, immersive interface for manipulating generative cosmic visualizations in real-time, blending diegetic UI elements with performant web graphics.',
            work: [
                'Built a high-performance rendering engine using Canvas API & React',
                'Designed a comprehensive sci-fi design system with retro-futuristic aesthetics',
                'Implemented complex state management for real-time parameter tuning',
                'Created a "vault" system for users to save and catalog unique generative outputs'
            ],
            outcome: 'A highly engaging interactive playground that demonstrates the intersection of creative coding, complex state management, and thematic UI design.'
        },
        links: {
            live: 'https://playground-jet-omega.vercel.app/'
        },
        images: {
            thumbnail: "/images/stellar/so-1.png",
            hero: "/images/stellar/so-1.png",
            gallery: [
                "/images/stellar/so-1.png",
                "/images/stellar/so-2.png",
                "/images/stellar/so-3.png"
            ]
        }
    },
    {
        id: 'uk-vehicles',
        title: 'UK Vehicles Cyprus',
        subtitle: 'Vehicle import platform saving Cyprus businesses thousands per purchase',
        role: 'Full-Stack Developer',
        period: '2025',
        tags: ['Next.js', 'Web Development', 'E-Commerce'],
        categories: ['nextjs', 'design'] as CategoryId[],
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
            thumbnail: "/images/uk-vehicles/hero.png",
            hero: "/images/uk-vehicles/hero.png",
            gallery: [
                "/images/uk-vehicles/hero.png",
                "/images/uk-vehicles/calc.png",
                "/images/uk-vehicles/info.png"
            ]
        }
    },
    {
        id: 'kingfisher-mortgages',
        title: 'Kingfisher Mortgages',
        subtitle: 'Independent UK mortgage broker rebuild',
        role: 'Brand, design & WordPress build',
        period: '2025',
        tags: ['WordPress', 'Elementor', 'Brand', 'Schema / AEO', 'Financial services'],
        categories: ['wordpress', 'design'] as CategoryId[],
        description: {
            overview: 'Kingfisher is an established independent UK mortgage broker who\'d outgrown a templated site that read like every other mortgage broker\'s. I led the full rebuild - brand work, content architecture, and a WordPress/Elementor site engineered to feel premium and trust-led without the price tag of a bespoke agency engagement.\n\nThe remit ran end to end: positioning and palette, sitemap and copy hierarchy, page templates, schema markup, and a handover the client team can run themselves.',
            challenge: 'Reposition an established mortgage broker as premium and trust-led while addressing:\n\n• A category aesthetic that defaults to comparison-site cliché\n• A small team that needed to edit copy and add new product pages without me\n• AEO/GEO visibility - answers about UK mortgage products coming from this site, not a competitor\'s\n• Core Web Vitals targets that mortgage-broker stock-photo templates routinely fail',
            work: [
                'Brand-first design: a calm, paper-and-ink palette with serif headlines and an editorial hierarchy closer to wealth management than comparison',
                'WordPress + Elementor on a stripped-back theme so the client can edit copy and add product pages without me',
                'One mortgage-product page template with conditional fields rather than 14 hand-built pages - new products are a 5-minute job',
                'Schema.org markup wired across the site (FinancialProduct, FAQPage, BreadcrumbList) so AEO/GEO answers come from their site',
                'Sitemap and copy hierarchy rebuilt to match how UK borrowers actually research',
                'Core Web Vitals pass before launch: lazy-load below-the-fold, hand-cropped photography in place of stock, cookie-banner script dropped',
                'Documented handover (BRAND, SETUP, SITEMAP-COPY) so the client team owns the site post-launch'
            ],
            outcome: 'Live and replacing the previous templated build. A site that reads as premium and trust-led, ranks for the schema-friendly product queries, and stays maintainable in the client\'s hands. Schema work pays off disproportionately on financial-services briefs - clients almost never ask for it but it\'s the difference between Google understanding the page and not.'
        },
        links: {},
        images: {
            thumbnail: "/images/kingfisher/hero.png",
            hero: "/images/kingfisher/hero.png",
            gallery: [
                "/images/kingfisher/hero.png",
                "/images/kingfisher/1.png",
                "/images/kingfisher/2.png",
                "/images/kingfisher/3.png"
            ]
        }
    },
    {
        id: 'olympus-sports',
        title: 'Olympus Sports',
        subtitle: 'B2B gym equipment distributor - WordPress rebuild',
        role: 'WordPress build + design',
        period: '2024',
        tags: ['WordPress', 'Elementor', 'B2B', 'E-commerce'],
        categories: ['wordpress'] as CategoryId[],
        description: {
            overview: 'Olympus Sports is a UK distributor of commercial gym equipment selling into facility managers, independent gyms, and small chains. I rebuilt their public site from scratch as a catalogue-first WordPress build, replacing a tired template that was slow on mobile and buried products under marketing pages.\n\nThe work cuts straight at the trade buyer\'s mental model: see the catalogue, qualify the spec, request a quote - without three forms of friction in between.',
            challenge: 'Replace a slow, mobile-broken site with one that communicates a deep equipment catalogue and converts trade enquiries while addressing:\n\n• Buyers who arrive knowing what they want, not browsing for inspiration\n• Existing brand assets that mixed consumer fitness aesthetics with B2B copy\n• A long product taxonomy collapsed into one giant menu\n• Mobile parity for on-site facility manager research',
            work: [
                'Catalogue-first information architecture: hero links direct into equipment categories, not marketing pages',
                'WordPress + Elementor with a custom product taxonomy and clean structure',
                'Quote-request flows attached to each product card to capture intent at peak moment',
                'Photography reshoots where existing assets failed the brand',
                'Trimmed primary navigation: removed marketing-first hierarchy in favour of buyer-intent paths',
                'Mobile speed budget: stripped Elementor heavies, hand-tuned CSS for above-the-fold blocks',
                'Handover-friendly build so the client team can add new products without revisiting me'
            ],
            outcome: 'Live and replacing the previous build. Faster on mobile, cleaner taxonomy, quote-request flows that respect how trade buyers actually browse - credibility over cleverness, throughout.'
        },
        links: {
            live: 'https://olympus-sports.com'
        },
        images: {
            thumbnail: "/images/olympus-sports/hero.png",
            hero: "/images/olympus-sports/hero.png",
            gallery: [
                "/images/olympus-sports/hero.png",
                "/images/olympus-sports/2.png"
            ]
        }
    },
    {
        id: 'instant-access-locksmiths',
        title: 'Instant Access Locksmiths',
        subtitle: 'UK locksmith conversion site - Next.js rebuild',
        role: 'Design + build (Next.js)',
        period: '2025',
        tags: ['Next.js', 'Tailwind', 'Local SEO', 'Conversion'],
        categories: ['nextjs', 'design'] as CategoryId[],
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
    },
    {
        id: 'forecast',
        title: 'Forecast',
        subtitle: 'Events aggregator for Cyprus',
        role: 'Founder + sole designer/builder',
        period: '2026',
        tags: ['Next.js', 'Container Queries', 'Design Systems', 'Product Design'],
        categories: ['nextjs', 'design'] as CategoryId[],
        aiBuilt: true,
        description: {
            overview: 'Forecast is a modern aggregator for events on the island of Cyprus, built solo end to end. It replaces a fragmented landscape - Facebook event pages, poster walls in Limassol, three competing sites with cluttered UIs - with a calm, fast surface that just shows you what\'s on this weekend.\n\nThe hard problem was less the data and more the discipline: keep the surface dead simple while the aggregation pipeline does the messy work in the background.',
            challenge: 'Design and build an events aggregator for an island whose existing options look like 2009 while addressing:\n\n• Fragmented sources: Facebook events, venue sites, posters, and PDFs\n• Mobile-first audience that opens the site at a café table to decide a Saturday\n• A small, opinionated brief from a single user (me) that should generalise\n• A codebase a future contributor - or future-me in six months - won\'t drift away from',
            work: [
                'Next.js app router with container queries and fluid typography - zero traditional media queries, all responsive behaviour driven by CSS clamps and container queries',
                'Single source of truth in globals.css for design tokens, with DESIGN_SYSTEM.md and RESPONSIVE.md to anchor future work',
                'Calm UI: no carousels, no auto-play, no algorithmic recommendations - just dates, venues, clean cards',
                'Aggregation pipeline kept deliberately boring: scheduled fetch, normalize, dedupe - the interesting work is in the surface, not the plumbing',
                'Container-query-based components that compose cleanly when reused across pages',
                'Self-imposed performance budget: instant-feel filtering, near-zero CLS, image-perfect on slow Limassol 4G'
            ],
            outcome: 'Functional event aggregator covering the actual scene on the island. Calm interface, maintainable codebase, design system that survives contact with new pages - the kind of side project that actually gets used after the launch week.'
        },
        links: {},
        images: {
            thumbnail: "/images/forecast/hero.png",
            hero: "/images/forecast/hero.png",
            gallery: [
                "/images/forecast/hero.png"
            ]
        }
    },
    {
        id: 'la-hacienda',
        title: 'La Hacienda Cyprus',
        subtitle: 'WordPress build + Google Ads for a boutique hotel in Agios Athanasios',
        role: 'WordPress build + Google Ads',
        period: '2025',
        tags: ['WordPress', 'Elementor', 'Google Ads', 'Hospitality', 'Conversion'],
        categories: ['wordpress'] as CategoryId[],
        description: {
            overview: 'La Hacienda is an independent boutique hotel in Agios Athanasios, Limassol - sun-warmed stone, a leafy courtyard, and suites with kitchenettes and private spa baths. I rebuilt their public site on WordPress and ran the Google Ads spend that drives traffic into it. End-to-end ownership rather than design-only.\n\nThe brief was simple: replace a host-built page that wasn\'t converting, capture search traffic the hotel was missing, and make the booking path obvious to a holidaymaker who lands cold from a Google ad.',
            challenge: 'Convert search traffic into bookings for a small boutique hotel competing in a crowded Limassol market while addressing:\n\n• A host-managed WordPress stack with theme limitations and a tight asset pool\n• A generic prior page that buried the booking widget and the differentiators\n• Cold-traffic visitors arriving from Google Ads with no brand familiarity\n• Ad budget that couldn\'t survive a generic \'cyprus hotel\' bidding war',
            work: [
                'WordPress + Elementor on the host\'s existing stack - no fight worth picking there',
                'Restructured the IA around the rooms users actually book and the differentiators that matter (spa suite, pet-friendly, sunset views, courtyard)',
                'Pinned the booking widget visible from every page - single highest-impact change',
                'Google Ads campaigns built around long-tail intent - \'boutique hotel agios athanasios\', \'pet friendly hotel limassol\' - rather than the generic \'cyprus hotel\' that costs four times the click',
                'Ad campaigns segmented by traveller intent (couples, business, pet-owners) with tailored landing pages, not a generic homepage',
                'Conversion-focused copy direction throughout: room names lead with what makes them different, not the room number',
                'End-to-end ownership: build, ads, copy, conversion path - one operator, one accountability line'
            ],
            outcome: 'Live site running real ad spend through pages that convert. The WP/Ads pairing is the value here - a real hotel\'s booking funnel running end to end on tailored campaigns rather than the agency-default \'set up the campaign and hope\'. Honest note: not the prettiest site I\'ve built - the host stack and asset pool constrained the visual ceiling. For the next hotel I\'d start with brand and photography before touching the build.'
        },
        links: {
            live: 'https://lahacienda-cyprus.com/'
        },
        images: {
            thumbnail: "/images/la-hacienda/hero.png",
            hero: "/images/la-hacienda/hero.png",
            gallery: [
                "/images/la-hacienda/hero.png",
                "/images/la-hacienda/1.png"
            ]
        }
    },
    {
        id: 'allsop-francis',
        title: 'Allsop & Francis',
        subtitle: 'AI art direction & image generation for a B2B laundry distributor',
        role: 'AI art director',
        period: '2025',
        tags: ['AI', 'Art Direction', 'Photography', 'Brand', 'B2B'],
        categories: ['ai-image'] as CategoryId[],
        aiBuilt: true,
        description: {
            overview: 'Allsop & Francis distribute commercial laundry equipment into UK care homes, healthcare, schools, vet, equestrian, housing, and charity sectors. Real product imagery in this niche either doesn\'t exist or looks like a stock catalogue from 2008. I art-directed and generated a custom on-brand image library covering every sector × service-line combination they sell into.\n\nThe work treats AI as a directable medium, not a slot machine. Each scene is prompted with location, lighting, framing, and brand artefacts - never \'a laundry room\'.',
            challenge: 'Build a complete on-brand image library for a niche B2B distributor without commissioning a photography shoot in every NHS laundry in the country, while addressing:\n\n• Seven target sectors × nine service lines - a matrix of scenes, not a single shoot\n• Brand consistency across every generated frame: van livery, uniform, machine make/model\n• AI drift toward generic \'commercial laundry\' visuals when prompts are loose\n• Final-mile finish: AI mishandling of equipment detail that needed manual retouching',
            work: [
                'Built a sectors × services matrix and worked through it cell by cell',
                'Reference plates from the client\'s real installations anchored each prompt - colour, livery, machine make and model - so the AI didn\'t drift into generic territory',
                'Reference PDFs for van livery and uniform set the brand boundary so even \'staff in a van\' shots stayed on-brand',
                'Variant pruning: generated heavy, kept light - Sectors and Services folders show only takes that survived selection',
                'Final images cleaned in Photoshop where the AI mishandled equipment detail',
                'Treated each prompt as a brief: location, lighting, framing, brand artefacts - never \'a laundry room\'',
                'Delivered a usable image library mapped to the client\'s actual marketing content structure'
            ],
            outcome: 'Custom image library delivered, mapped to every sector and service line the client sells into. Imagery reads as Allsop & Francis - not as generic AI stock - and replaces a niche where real photography would have meant booking shoots across a dozen industries the client doesn\'t control access to.'
        },
        links: {
            live: 'https://www.allsopandfrancis.com/'
        },
        images: {
            thumbnail: "/images/allsop-francis/2.png",
            hero: "/images/allsop-francis/hero.png",
            gallery: [
                "/images/allsop-francis/hero.png",
                "/images/allsop-francis/1.png",
                "/images/allsop-francis/2.png",
                "/images/allsop-francis/3.png",
                "/images/allsop-francis/4.png",
                "/images/allsop-francis/5.png",
                "/images/allsop-francis/6.png"
            ]
        }
    },
    {
        id: 'saxseat',
        title: 'SaxSeat',
        subtitle: 'E-commerce product page for a Kickstarter-launched startup',
        role: 'UX & UI designer (sole)',
        period: '2020–2021',
        tags: ['Web Design', 'UX Strategy', 'E-commerce', 'Usability Testing'],
        categories: ['design'] as CategoryId[],
        description: {
            overview: 'SaxSeat is a Kickstarter-launched startup with a single, niche product: a seat that supports both saxophone player and instrument while practising - the first of its kind. As the sole UX/UI designer on a limited startup budget, I owned the direction of the launch site and the responsibility for whether it converted.\n\nThe brief wasn\'t \'design a beautiful page\'. It was \'turn a curious sax player into a paying customer on a single page\' - and prove every decision in front of management and shareholders.',
            challenge: 'Design and validate a high-converting product page for a niche startup with a single SKU while addressing:\n\n• A novel product category - buyers had never seen anything like it before\n• A small startup budget that left no room for second attempts\n• Stakeholder review of every design decision in regular meetings\n• Soft-launch validation pressure: prove the page works on real users before scaling spend',
            work: [
                'End-to-end ownership: research, information architecture, copy direction, visual design, prototyping',
                'Persona and journey mapping for the saxophone-player buyer',
                'Competitive analysis across adjacent niche-instrument-accessory markets',
                'Heuristic evaluation cycles before stakeholder review to anticipate pushback',
                'High-fidelity Figma comps with responsive breakpoints and interactive prototypes',
                'UX writing for product copy that anticipated common objections about a category-creating product',
                'Soft-launched the page in February 2021 with HotJar session recording to capture qualitative user behaviour',
                'Iterated based on heatmaps and session replays - surfaced and fixed the friction points causing pre-purchase exits'
            ],
            outcome: 'Page launched following the soft-launch test phase. HotJar recordings surfaced specific drop-off moments that were addressed before scaling marketing spend. The page anchored SaxSeat\'s direct-to-consumer launch beyond Kickstarter, converting curious-but-skeptical visitors into buyers for a category-creating product.'
        },
        links: {},
        images: {
            thumbnail: "/images/saxseat/hero.png",
            hero: "/images/saxseat/hero.png",
            gallery: [
                "/images/saxseat/hero.png",
                "/images/saxseat/1.png",
                "/images/saxseat/2.png"
            ]
        }
    },
    {
        id: 'sidechains',
        title: 'Sidechain Interoperability',
        subtitle: 'Developer infrastructure for blockchain crosschain protocols',
        role: 'Product Designer',
        period: '2022-2024 (Input Output)',
        tags: ['Blockchain', 'Dev Tools', 'Infrastructure'],
        categories: ['design'] as CategoryId[],
        description: {
            overview: 'Input Output\'s sidechain toolkit enables developers to build custom sidechains connected to the Cardano mainnet, expanding the ecosystem\'s capabilities without compromising the main chain\'s security. I helped to design the developer experience for the EVM sidechain. (Ethereum Virtual Machine) \n\nThe challenge was creating infrastructure that bridged two fundamentally different blockchain architectures: Cardano\'s UTXO model using Plutus/Haskell versus Ethereum\'s account-based model using Solidity. The solution needed to be technically robust while remaining accessible to developers from both ecosystems.',
            challenge: 'Design developer infrastructure enabling interoperability between Cardano and Ethereum ecosystems while addressing:\n\n• Incompatible smart contract environments (Plutus vs Solidity)\n• Different transaction models (UTXO vs account-based)\n• Asset transfer security between chains\n• Developer tooling compatibility across ecosystems',
            work: [
                'Cross-chain bridge interface design for secure asset transfers',
                'Developer documentation and onboarding flows for Solidity developers',
                'Testnet environment UX for validating sidechain functionality',
                'Stake pool operator dashboard for sidechain validation'
            ],
            outcome: 'EVM sidechain alpha launched 2022, mainnet deployment 2023.\nEnables Solidity developers to build on Cardano using familiar Ethereum tools.\nOpens Cardano ecosystem to billions in Ethereum development investment.\nBecomes framework for future specialized sidechains (privacy, gaming, DeFi).\nTransitions Cardano into multi-chain architecture with enhanced scalability.\nPublicly identified by CPO as expanding Cardano\'s feature set for niche applications.'
        },
        links: {},
        images: {
            thumbnail: "/images/sidechains/sidechain-thumbnail.png",
            hero: "/images/sidechains/hero.png",
            gallery: [
                "/images/sidechains/sidechain-thumbnail.png"
            ]
        }
    }
];

// External-only projects: clicking a card opens the link directly (no drawer).
const externalCases: {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    categories: CategoryId[];
    thumbnail: string;
    externalLink: string;
}[] = [
    {
        id: 'shackle',
        title: 'Shackle App',
        subtitle: 'Mobile · Hospitality',
        tags: ['Mobile', 'Hospitality', 'Product Design'],
        categories: ['design'],
        thumbnail: '/images/gallery/shackle.jpg',
        externalLink: 'https://www.behance.net/gallery/126781545/Shackle',
    },
    {
        id: 'smartjobs',
        title: 'SmartJobs Platform',
        subtitle: 'SaaS · Job Board',
        tags: ['SaaS', 'Job Board', 'UX/UI'],
        categories: ['design'],
        thumbnail: '/images/gallery/smartjobs.png',
        externalLink: 'https://www.behance.net/gallery/126787469/SmartJobs-UX-UI-Design',
    },
    {
        id: 'bank-of-cyprus',
        title: 'Bank of Cyprus',
        subtitle: 'Web · Fintech · Page redesign',
        tags: ['Web', 'Fintech', 'Page Redesign'],
        categories: ['design'],
        thumbnail: '/images/gallery/bank-of-cyprus.jpg',
        externalLink: 'https://www.upwork.com/freelancers/georgeefesopoulos2?p=1437670522820513792',
    },
];

type DrawerItem = (typeof cases)[number] & { kind: 'drawer' };
type ExternalItem = (typeof externalCases)[number] & { kind: 'external' };
type Item = DrawerItem | ExternalItem;

const allItems: Item[] = [
    ...cases.map((c) => ({ ...c, kind: 'drawer' as const })),
    ...externalCases.map((c) => ({ ...c, kind: 'external' as const })),
];

const PINNED_IDS = ['realfi', 'kingfisher-mortgages'];
const ALL_VIEW_INITIAL_COUNT = 4;

export default function CaseStudies() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
    const [showAllInAllView, setShowAllInAllView] = useState(false);
    // null on SSR / first client render → deterministic source order.
    // Set once on mount → shuffled order persists across category changes.
    const [shuffledAllOrderIds, setShuffledAllOrderIds] = useState<string[] | null>(null);

    useEffect(() => {
        const restIds = allItems.filter((i) => !PINNED_IDS.includes(i.id)).map((i) => i.id);
        for (let i = restIds.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restIds[i], restIds[j]] = [restIds[j], restIds[i]];
        }
        setShuffledAllOrderIds([...PINNED_IDS, ...restIds]);
    }, []);

    // Open a specific project modal when the featured-work strip in the hero is clicked.
    useEffect(() => {
        const handler = (e: Event) => {
            const id = (e as CustomEvent<{ id?: string }>).detail?.id;
            if (!id) return;
            setActiveCategory('all');
            setShowAllInAllView(true);
            setActiveId(id);
        };
        window.addEventListener('featured:open', handler);
        return () => window.removeEventListener('featured:open', handler);
    }, []);

    const handlePillClick = (id: CategoryId | 'all') => {
        setActiveCategory(id);
        setShowAllInAllView(false);
    };

    const activeProject = activeId
        ? cases.find((c) => c.id === activeId) ?? null
        : null;

    const ordered = useMemo<Item[]>(() => {
        if (activeCategory === 'all') {
            if (shuffledAllOrderIds) {
                return shuffledAllOrderIds
                    .map((id) => allItems.find((i) => i.id === id))
                    .filter(Boolean) as Item[];
            }
            const pinned = PINNED_IDS.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as Item[];
            const rest = allItems.filter((i) => !PINNED_IDS.includes(i.id));
            return [...pinned, ...rest];
        }
        // Category view: drawer cards first, externals after, source order
        const drawer = allItems.filter((i) => i.kind === 'drawer' && i.categories.includes(activeCategory));
        const ext = allItems.filter((i) => i.kind === 'external' && i.categories.includes(activeCategory));
        return [...drawer, ...ext];
    }, [activeCategory, shuffledAllOrderIds]);

    const visible = useMemo<Item[]>(() => {
        if (activeCategory === 'all' && !showAllInAllView) return ordered.slice(0, ALL_VIEW_INITIAL_COUNT);
        return ordered;
    }, [ordered, activeCategory, showAllInAllView]);

    const getCount = (id: CategoryId | 'all') =>
        id === 'all' ? allItems.length : allItems.filter((i) => i.categories.includes(id as CategoryId)).length;

    return (
        <section id="work" className="bg-bg-primary py-12 md:py-32 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Selected Projects</h2>
                            <p className="text-text-muted text-lg max-w-xl">
                                Product, web, AI, and brand work - across fintech, hospitality, trades, and Web3.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {FILTER_PILLS.map((pill) => {
                            const isActive = activeCategory === pill.id;
                            const count = getCount(pill.id);
                            return (
                                <button
                                    key={pill.id}
                                    onClick={() => handlePillClick(pill.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isActive
                                        ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/50'
                                        : 'bg-white/[0.03] text-text-muted border-white/10 hover:bg-white/[0.06] hover:text-white hover:border-white/20'
                                        }`}
                                    aria-pressed={isActive}
                                >
                                    {pill.label} <span className="opacity-60 font-normal tabular-nums">({count})</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {visible.map((item, idx) =>
                            item.kind === 'drawer' ? (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveId(item.id)}
                                    className="group block w-full text-left border border-white/10 rounded-xl overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent-primary/30 transition-all duration-300 focus:outline-none focus-visible:border-accent-primary/60"
                                    aria-haspopup="dialog"
                                >
                                    <div className="p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="relative w-full md:w-64 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                            <ImageWithFallback
                                                src={item.images.thumbnail}
                                                alt={item.title}
                                                fill
                                                quality={100}
                                                priority={idx < 2}
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${item.id === 'realfi' ? 'scale-[1.03]' : ''} ${item.id === 'instant-access-locksmiths' ? 'scale-[1.12]' : ['kingfisher-mortgages', 'olympus-sports', 'la-hacienda', 'saxseat'].includes(item.id) ? 'scale-[1.10]' : ''}`}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-1 h-1 rounded-full bg-accent-primary" />
                                                <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-accent-primary">
                                                    {item.role}
                                                </span>
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 group-hover:text-accent-primary transition-colors tracking-tight leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-text-muted text-sm md:text-base mb-3 max-w-xl font-light leading-snug">
                                                {item.subtitle}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-text-dim border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ) : (
                                <a
                                    key={item.id}
                                    href={item.externalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block border border-white/10 rounded-xl overflow-hidden bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent-primary/30 transition-all duration-300"
                                >
                                    <div className="w-full text-left p-6 flex flex-col md:flex-row gap-6 md:items-center">
                                        <div className="relative w-full md:w-64 aspect-[4/3] rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                            <ImageWithFallback
                                                src={item.thumbnail}
                                                alt={item.title}
                                                fill
                                                quality={100}
                                                sizes="(max-width: 768px) 100vw, 300px"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 group-hover:text-accent-primary transition-colors tracking-tight">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-text-muted text-sm md:text-base mb-3 max-w-xl font-light">
                                                        {item.subtitle}
                                                    </p>
                                                </div>
                                                <div className="hidden md:flex items-center justify-center p-2 rounded-full border border-white/10 text-text-muted group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                                                    <ExternalLink size={18} />
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {item.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-text-dim border border-white/5">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ),
                        )}
                        {visible.length === 0 && (
                            <p className="text-text-muted text-center py-12 lg:col-span-2">No projects in this category yet.</p>
                        )}
                    </div>

                    {activeCategory === 'all' && !showAllInAllView && ordered.length > ALL_VIEW_INITIAL_COUNT && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setShowAllInAllView(true)}
                                className="px-6 py-3 rounded-full text-sm font-medium border bg-white/[0.03] text-text-muted border-white/10 hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-colors"
                            >
                                Show {ordered.length - ALL_VIEW_INITIAL_COUNT} more
                            </button>
                        </div>
                    )}
                </FadeIn>
            </div>

            <CaseStudyModal project={activeProject} onClose={() => setActiveId(null)} />
        </section>
    );
}
