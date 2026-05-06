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
    body: {
        brief: {
            situation: 'Allsop & Francis distribute commercial laundry equipment into UK care homes, healthcare, schools, vet, equestrian, housing, and charity sectors. Real product imagery in this niche either does not exist or looks like a stock catalogue from 2008. The brief was to art-direct and generate a custom on-brand image library covering every sector by service-line combination they sell into - without commissioning a shoot in every NHS laundry in the country.',
            audience: 'Procurement contacts at care homes, NHS trusts, vet practices, and housing providers comparing distributors. They want to see equipment that looks like it belongs in a place like theirs - not a generic catalogue render or a smiling stock model in scrubs.',
            what_made_it_hard: [
                'Seven target sectors by nine service lines is a matrix of scenes, not a single shoot - each cell needs its own brand-correct visual language',
                'AI drift toward generic "commercial laundry" visuals whenever prompts loosen even slightly, which collapses the brand back into stock-catalogue territory',
                'Final-mile finish: the AI mishandles equipment detail (machine fascia, livery, model badges) in ways that would be embarrassing in a B2B context if shipped raw',
            ],
        },
        decisions: [
            {
                title: 'Reference plates, not loose prompts',
                what: 'Every prompt anchored to reference plates from the client\'s real installations - colour, livery, machine make and model - so the AI rendered the brand world rather than a generic one.',
                why: 'The default failure mode of AI image generation in a B2B niche is the slot-machine output - close-enough scenes that read as "stock laundry", not as Allsop & Francis. Reference plates from real installs force the model into the client\'s visual world: the right machine on the right wall in the right uniform. Without them, every fifth render drifts into generic and the library loses coherence.',
                screenshot: '/images/allsop-francis/1.png',
                caption: 'Sector-specific scene anchored to client reference plates, not a loose prompt.',
            },
            {
                title: 'Treat each prompt as a brief',
                what: 'Location, lighting, framing, brand artefacts - written into every prompt. Never "a laundry room". Brand boundaries (van livery, uniform) set from reference PDFs so even peripheral shots stayed on-brand.',
                why: 'A prompt is just a creative brief written in plainer language. Treating it that way - location, lighting, framing, brand artefacts - is how the output graduates from "AI image" to "art direction with AI as the medium". The brand boundary documents matter because the staff-in-a-van shots are exactly where AI default-renders would have undermined the rest of the library.',
                screenshot: '/images/allsop-francis/3.png',
                caption: 'Brief-led prompt with explicit framing and brand artefacts, not a generic descriptor.',
            },
            {
                title: 'Generate heavy, prune light',
                what: 'Each cell in the matrix generated dozens of variants; only the takes that survived selection went into the Sectors and Services folders. Final images cleaned in Photoshop where the AI mishandled equipment detail.',
                why: 'AI image generation is a casting process, not a delivery process. Any single render is one of thirty plausible versions; the work is in the selection, not the prompt. Photoshop cleanup on the equipment detail is the final mile that turns a "good enough" render into something a B2B client can actually use on their site without flinching at the machine fascia.',
                screenshot: '/images/allsop-francis/5.png',
                caption: 'Final, retouched image - one of many variants that survived selection.',
            },
        ],
        process: 'Built a sectors by services matrix and worked it cell by cell. Reference plates from real installations anchored every prompt; brand-boundary PDFs (livery, uniform) set the rules even for peripheral scenes. Generated heavy, kept light - the delivered library is the surviving cut, not the raw output. Final images cleaned in Photoshop where the AI mishandled equipment detail. Each prompt treated as a brief with location, lighting, framing, and brand artefacts written explicitly - never the loose "a laundry room" type that produces generic output.',
        outcome: {
            summary: 'Custom image library delivered, mapped to every sector and service line the client sells into. The imagery reads as Allsop & Francis - not as generic AI stock - and replaces a niche where real photography would have meant booking shoots across a dozen industries the client does not control access to.',
        },
    },
    links: {
        live: 'https://www.allsopandfrancis.com/',
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
