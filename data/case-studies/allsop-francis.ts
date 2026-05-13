import type { CaseStudy } from './types';

const allsop: CaseStudy = {
    id: 'allsop-francis',
    title: 'Allsop & Francis',
    subtitle: 'AI art direction and a custom on-brand image library for a B2B commercial-laundry distributor, mapped across a seven-sector by nine-service matrix.',
    role: 'AI art director',
    period: '2025',
    tags: ['AI', 'Art Direction', 'Photography', 'Brand', 'B2B'],
    categories: ['ai-image'],
    aiBuilt: true,
    links: {
        live: 'https://www.allsopandfrancis.com/',
    },
    visual: {
        situation: 'Allsop & Francis distribute commercial laundry equipment across UK care homes, healthcare, schools, vet, equestrian, housing and charity sectors. Real product imagery in this niche either does not exist or looks like a stock catalogue from 2008.',
        audience: 'Procurement contacts at care homes, NHS trusts, vet practices and housing providers comparing distributors. They want to see equipment that looks like it belongs in a place like theirs, not a generic catalogue render.',
        what_made_it_hard: 'Seven target sectors by nine service lines is a matrix of scenes, not a single shoot. B2B AI imagery defaults to "stock laundry," not "Allsop & Francis" - the brand-correctness lift is the whole job.',
        process: 'Built a sectors-by-services matrix and worked it cell by cell. Reference plates from real installations anchored every prompt; brand-boundary PDFs (livery, uniform) set the rules even for peripheral scenes. Generated heavy, kept light: the delivered library is the surviving cut, not the raw output. Final images cleaned in Photoshop where the AI mishandled equipment detail.',
        outcome: 'Custom image library delivered, mapped to every sector and service line the client sells into. The imagery reads as Allsop & Francis (not as generic AI stock) and replaces a niche where real photography would have meant booking shoots across a dozen industries the client does not control access to.',
        links: [
            { href: 'https://www.allsopandfrancis.com/', label: 'Live site' },
        ],
        gallery: [
            {
                image: '/images/allsop-francis/1.png',
                title: 'Reference plates, not loose prompts.',
                description: 'Every prompt anchored to client installs - colour, livery, machine make and model - so the AI rendered the brand world rather than a generic one.',
            },
            {
                image: '/images/allsop-francis/2.png',
                title: 'Sector-specific scene, care home context.',
                description: 'The right machine on the right wall in the right uniform. Without reference anchoring, every fifth render drifts into generic.',
            },
            {
                image: '/images/allsop-francis/3.png',
                title: 'Treat each prompt as a brief.',
                description: 'Location, lighting, framing and brand artefacts written into every prompt. Brand-boundary documents kept even peripheral shots on-brand.',
            },
            {
                image: '/images/allsop-francis/4.png',
                title: 'Healthcare sector scene.',
                description: 'NHS-appropriate environment, correct equipment livery. The sector brief dictates the scene; the reference plates dictate the brand layer.',
            },
            {
                image: '/images/allsop-francis/5.png',
                title: 'Generate heavy, prune light.',
                description: 'Each matrix cell produced dozens of variants; only takes that survived selection went into the library. Photoshop cleanup on equipment detail is the final mile.',
            },
            {
                image: '/images/allsop-francis/6.png',
                title: 'Final library - sector coverage complete.',
                description: 'Delivered library covers every sector-by-service combination. Coherent across the matrix because the selection standard never moved.',
            },
        ],
    },
    images: {
        thumbnail: '/images/allsop-francis/2.png',
        hero: '/images/allsop-francis/hero.png',
        gallery: [
            '/images/allsop-francis/hero.png',
            '/images/allsop-francis/1.png',
            '/images/allsop-francis/2.png',
            '/images/allsop-francis/3.png',
            '/images/allsop-francis/4.png',
            '/images/allsop-francis/5.png',
            '/images/allsop-francis/6.png',
        ],
    },
};

export default allsop;
