import type { CaseStudy } from './types';

const laHacienda: CaseStudy = {
    id: 'la-hacienda',
    title: 'La Hacienda Cyprus',
    subtitle: 'WordPress build and Google Ads campaigns for an independent boutique hotel in Limassol, owning the booking funnel end to end.',
    role: 'WordPress build + Google Ads',
    period: '2025',
    tags: ['WordPress', 'Elementor', 'Google Ads', 'Hospitality', 'Conversion'],
    categories: ['wordpress'],
    body: {
        honest_note: 'Not the prettiest site I have built. The host-managed stack and a tight asset pool capped the visual ceiling - for the next hotel I would start with brand and photography before touching the build.',
        brief: {
            situation: 'La Hacienda is an independent boutique hotel in Agios Athanasios, Limassol - sun-warmed stone, a leafy courtyard, suites with kitchenettes and private spa baths. The previous host-built page was not converting and was missing a chunk of the search traffic the hotel should have been winning. The brief was to rebuild on WordPress and run the Google Ads spend that drives traffic into it - end-to-end ownership rather than a design-only handoff.',
            audience: 'Cold traffic from Google Ads: holidaymakers looking for a Limassol stay who have never heard of the hotel and need the booking path obvious within the first scroll. A meaningful share of segmented intent, too - couples, business travellers, pet-owners - each of which deserved a tailored landing page rather than a generic homepage.',
            what_made_it_hard: [
                'A host-managed WordPress stack with theme limitations and a tight asset pool - no fight worth picking with the infrastructure, so the work had to live within it',
            ],
        },
        decisions: [
            {
                title: 'Booking widget pinned everywhere',
                what: 'The booking widget visible from every page, not buried behind a "rooms" tab. Differentiators (spa suite, pet-friendly, sunset views, courtyard) lead the IA - room number does not.',
                why: 'For a hotel converting cold ad traffic, the highest-impact change is making the booking action impossible to miss. The previous build buried it; the rebuild surfaced it. Restructuring the IA around what visitors actually book - the spa suite, the pet-friendly room, the courtyard view - rather than around an internal room-numbering convention turned the page into a sales surface instead of an inventory list.',
                screenshot: '/images/la-hacienda/hero.png',
                caption: 'Booking-first IA with differentiators leading every page.',
            },
            {
                title: 'Long-tail Google Ads, segmented by intent',
                what: 'Ad campaigns built around "boutique hotel agios athanasios" and "pet friendly hotel limassol" - rather than the generic "cyprus hotel" that costs four times the click. Each segment lands on a tailored page, not the homepage.',
                why: 'Generic hospitality keywords are a budget-burning trap for a small independent. Long-tail intent costs less per click and converts better, because the visitor already has a specific need. Segmenting by traveller intent (couples, business, pets) and matching each segment to a tailored landing page is the difference between an ad campaign that funds itself and one that quietly drains the marketing budget.',
                screenshot: '/images/la-hacienda/1.png',
                caption: 'Tailored landing surfaces for segmented ad campaigns - not a single generic homepage.',
            },
        ],
        process: 'WordPress + Elementor on the host\'s existing stack - no fight worth picking there. Restructured the IA around the rooms users actually book and the differentiators that matter. Booking widget pinned visible from every page. Conversion-focused copy direction throughout: room names lead with what makes them different, not the room number. Google Ads campaigns segmented by traveller intent, each routed to its own tailored landing page rather than a one-size-fits-all homepage. End-to-end ownership of build, ads, copy, and conversion path.',
        outcome: {
            summary: 'Live site running real ad spend through pages that convert. The WP/Ads pairing is the value here - a real hotel\'s booking funnel running end to end on tailored campaigns, rather than the agency-default "set up the campaign and hope". One operator, one accountability line, one funnel that pays for itself.',
        },
    },
    links: {
        live: 'https://lahacienda-cyprus.com/',
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
