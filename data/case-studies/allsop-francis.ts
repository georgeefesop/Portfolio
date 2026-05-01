import type { CaseStudy } from './types';

const allsop: CaseStudy = {
    id: 'allsop-francis',
    title: 'Allsop & Francis',
    subtitle: 'AI art direction and a custom on-brand image library for a B2B commercial-laundry distributor, across seven sectors and nine service lines.',
    role: 'AI art director',
    period: '2025',
    tags: ['AI', 'Art Direction', 'Photography', 'Brand', 'B2B'],
    categories: ['ai-image'],
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
};

export default allsop;
