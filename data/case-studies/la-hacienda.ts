import type { CaseStudy } from './types';

const laHacienda: CaseStudy = {
    id: 'la-hacienda',
    title: 'La Hacienda Cyprus',
    subtitle: 'WordPress build and Google Ads campaigns for an independent boutique hotel in Limassol, owning the booking funnel end to end.',
    role: 'WordPress build + Google Ads',
    period: '2025',
    tags: ['WordPress', 'Elementor', 'Google Ads', 'Hospitality', 'Conversion'],
    categories: ['wordpress'],
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
};

export default laHacienda;
