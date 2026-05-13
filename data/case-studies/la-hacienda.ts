import type { CaseStudy } from './types';

const laHacienda: CaseStudy = {
    id: 'la-hacienda',
    title: 'La Hacienda Cyprus',
    subtitle: 'WordPress build and Google Ads campaigns for an independent boutique hotel in Limassol, owning the booking funnel end to end.',
    role: 'WordPress build + Google Ads',
    period: '2025',
    tags: ['WordPress', 'Elementor', 'Google Ads', 'Hospitality', 'Conversion'],
    categories: ['wordpress'],
    stack: ['wordpress', 'elementor'],
    links: {
        live: 'https://lahacienda-cyprus.com/',
    },
    visual: {
        situation: 'Independent boutique hotel in Limassol with a host-built page that was not converting and was missing search traffic it should have been winning. Brief: rebuild on WordPress and own the Google Ads spend that drives traffic into it.',
        audience: 'Cold traffic from Google Ads - holidaymakers who have never heard of the hotel and need the booking path obvious within the first scroll, plus segmented intent (couples, business travellers, pet-owners) each deserving a tailored landing page.',
        what_made_it_hard: 'A host-managed WordPress stack with theme limitations and a tight asset pool - no fight worth picking with the infrastructure, so all the conversion lift had to come from IA, copy and campaign structure.',
        honest_note: 'Not the prettiest site I have built. The host-managed stack and a tight asset pool capped the visual ceiling - for the next hotel I would start with brand and photography before touching the build.',
        process: 'Restructured the IA around the rooms users actually book and the differentiators that matter. Booking widget pinned visible from every page. Conversion-focused copy direction throughout. Google Ads campaigns segmented by traveller intent, each routed to its own tailored landing page. End-to-end ownership of build, ads, copy, and conversion path.',
        outcome: 'Live site running real ad spend through pages that convert. The WP/Ads pairing is the value: a real hotel booking funnel running end to end on tailored campaigns, rather than the agency-default "set up the campaign and hope".',
        stack: ['wordpress', 'elementor'],
        links: [
            { href: 'https://lahacienda-cyprus.com/', label: 'Live site', logo: 'wordpress' },
        ],
        gallery: [
            {
                image: '/images/la-hacienda/1.png',
                title: 'Long-tail Google Ads, segmented by intent.',
                description: 'Campaigns built around "boutique hotel agios athanasios" and "pet friendly hotel limassol" - each segment landing on its own tailored page, not the homepage.',
            },
        ],
    },
    images: {
        thumbnail: '/images/la-hacienda/hero.png',
        hero: '/images/la-hacienda/hero.png',
        gallery: [
            '/images/la-hacienda/hero.png',
            '/images/la-hacienda/1.png',
        ],
    },
};

export default laHacienda;
