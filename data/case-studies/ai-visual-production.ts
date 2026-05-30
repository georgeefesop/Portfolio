import type { CaseStudy } from './types';

const aiVisualProduction: CaseStudy = {
    id: 'ai-visual-production',
    title: 'AI Visual Production',
    subtitle:
        "A premium visual capability woven through my client work: striking, realistic imagery - product, brand heroes, founder portraits, architectural renders and video - created with AI to a standard that lifts the whole build.",
    role: 'Art direction, visual production',
    period: '2026',
    tags: ['AI Image', 'Art Direction', 'Product Photography', 'Brand Imagery', 'Founder Portraits', 'Video'],
    categories: ['ai-image', 'design'],
    aiBuilt: true,
    links: {
        live: 'https://efesop.com/akti/',
    },
    visual: {
        situation:
            "Across more than a dozen client and concept projects I produce the visual layer with AI: product photography, brand heroes, architectural renders, configurator imagery, founder portraits and video. It sits under builds like Akti, Kingfisher and Living Form, and is a large part of why they look the way they do.",
        audience:
            "Brands that need a distinctive, cohesive visual world - product, lifestyle, hero, portraits - usually pre-launch with nothing to shoot yet, and for whom generic stock would quietly undercut the positioning.",
        what_made_it_hard:
            "Making images that never trip the AI-render alarm: believable materials and light, a human likeness that holds across a whole site, type that stays legible, brand marks that survive scrutiny. Then holding it all consistent across a brand, so a set reads as one shoot rather than a folder of lucky frames.",
        honest_note:
            "A couple of these are concept brands (Movu, and parts of Akti, are fictional); the rest are live client work.",
        process:
            "Each brand gets its own visual language, art-directed and held to a consistent standard across every asset. The difference is in the direction and the finish: the patient removal of anything that reads as artificial.",
        outcome:
            "The imagery carries real, shipped work - Akti, Kingfisher, Estia, La Hacienda - and is the full visual identity behind the Living Form storefront launching next. It is a core part of how I make a young brand look established.",
        links: [{ href: 'https://efesop.com/akti/', label: 'See it in production: Akti', logo: 'react' }],
        gallery: [
            {
                image: '/images/ai-visual-production/akti-interior-lush-landscape.webp',
                title: 'A six-figure prefab, shot in a landscape that does not exist.',
                description:
                    "An exterior convincing enough to anchor a six-figure decision, with none of the tells that usually give a render away.",
            },
            {
                image: '/images/ai-visual-production/akti-interior-your-landscape.webp',
                title: 'The same model, at home in a different setting.',
                description:
                    "Re-placed into another Cypriot landscape while staying perfectly on-brand. Holding that consistency across a set is the hard part.",
            },
            {
                image: '/images/ai-visual-production/living-form-taupe-cube-hand.webp',
                title: 'Product photography with no product and no studio.',
                description:
                    "A hand-cast concrete planter, held in-frame. The weight, the matte surface, the shadow: exactly where most AI product shots fall apart, and where this is made to survive a close look.",
            },
            {
                image: '/images/ai-visual-production/living-form-studio-workbench.webp',
                title: 'The making-of shot, conjured.',
                description:
                    "A workshop scene that lends craft credibility to a brand yet to photograph its own studio. The same world as the product shots.",
            },
            {
                image: '/images/ai-visual-production/kingfisher-hero-portrait.webp',
                title: 'A founder portrait for a brand with no photographs.',
                description:
                    "Human likeness is the hardest thing to fake well. This holds up at hero size for a mortgage-brand campaign.",
            },
            {
                image: '/images/ai-visual-production/kingfisher-sarah-portrait.webp',
                title: 'One consistent face across the funnel.',
                description:
                    "The same person, recognisable from page to page, so the brand reads cast-and-shot rather than stock-and-scattered.",
            },
            {
                image: '/images/ai-visual-production/estia-hero.webp',
                title: 'A kitchen showroom, rendered not photographed.',
                description:
                    "Cabinetry, worktops and reflections that read as a real showroom rather than a 3D model.",
            },
            {
                image: '/images/ai-visual-production/estia-kitchen-cost-limassol.webp',
                title: 'Editorial imagery, set in the right place.',
                description:
                    "A lead image in a recognisably Cypriot kitchen, so the visual matches the locale of the story instead of generic stock.",
            },
            {
                image: '/images/ai-visual-production/akti-workshop-limassol.webp',
                title: 'The factory floor, before the price.',
                description:
                    "Workshop imagery placed ahead of pricing, so the buyer sees where a unit is made before they see the number.",
            },
            {
                image: '/images/la-hacienda-rebrand/deck/07.webp',
                title: 'A view that sells the stay.',
                description:
                    "Golden-hour rooftops over old-town Limassol for the La Hacienda rebrand: environmental photography that sets a mood, generated rather than scouted and shot.",
            },
            {
                image: '/images/la-hacienda-rebrand/deck/08.webp',
                title: 'Brand in the world, before the world exists.',
                description:
                    "A guest-room door hanger on weathered oak for La Hacienda. Product-in-context shots like this usually need the product and the location; here neither existed yet.",
            },
            {
                image: '/images/ai-visual-production/command-center-mission-control.webp',
                title: 'Even the internal tools get the treatment.',
                description:
                    "A concept render for my own operations dashboard: the same standard applied inward, not only to client work.",
            },
        ],
    },
    images: {
        thumbnail: '/images/ai-visual-production/living-form-cube-ivy-hands.webp',
        hero: '/images/ai-visual-production/living-form-cube-ivy-hands.webp',
        gallery: [
            '/images/ai-visual-production/living-form-cube-ivy-hands.webp',
            '/images/ai-visual-production/akti-interior-lush-landscape.webp',
            '/images/ai-visual-production/kingfisher-hero-portrait.webp',
            '/images/ai-visual-production/living-form-taupe-cube-hand.webp',
        ],
    },
};

export default aiVisualProduction;
