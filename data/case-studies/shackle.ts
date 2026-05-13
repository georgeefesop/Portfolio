import type { CaseStudy } from './types';

const shackle: CaseStudy = {
    id: 'shackle',
    title: 'Shackle',
    subtitle: 'Pre-launch B2B marketing site for a hotel-tech SaaS, positioned as the last integration the hotel needs and seeded with partner credibility (Oracle Gold, Park Regis, London & Partners) instead of customer logos.',
    role: 'UX/UI design (freelance)',
    period: '2020-2021',
    tags: ['UX/UI', 'B2B', 'SaaS', 'Marketing site', 'Hospitality'],
    categories: ['design'],
    visual: {
        situation: 'Pre-launch hotel-tech SaaS. One integration replacing five: keyless check-in/out, in-app F&B ordering, room upgrades, and PMS sync. Brief was a marketing site with one job: convince hospitality decision-makers and seed a waiting list before the product shipped.',
        audience: 'Hotel GMs, owners, and operations directors managing a sprawl of legacy systems. Sceptical of another platform pitch, receptive to one that promises to consolidate the mess rather than add to it.',
        what_made_it_hard: 'Pre-launch B2B SaaS has no customer logos to point to, and hotel buyers carry a prior of integration fatigue - the page had to position Shackle as relief from that fatigue, not another addition to it.',
        honest_note: 'Freelance work from 2020-2021. The site is no longer live.',
        process: 'Visual identity first (logo, teal accent, brand voice), then IA: hero, introduction, founder video and partners, what-we-do, the solution, Welcome to the Lobby blog and podcast, waiting-list capture in the footer.',
        outcome: 'Marketing site shipped with a working waiting-list capture, partner-credibility row standing in for customer logos, founder Vimeo above the fold, and a blog and podcast doing parallel industry credibility work.',
        links: [],
        gallery: [
            {
                image: '/images/shackle/02.jpg',
                title: 'The last integration your hotel will ever need.',
                description: 'Lead positioning line inverting the buyer\'s prior of integration fatigue, paired with four-pillar icons: keyless check-in, F&B ordering, room upgrades, PMS integration.',
            },
            {
                image: '/images/shackle/03.jpg',
                title: 'Founder video + partner row in place of customer logos.',
                description: 'Oracle Gold Partner, Park Regis, London & Partners, Local Enterprise Office stacking three kinds of trust (technical, industry, institutional) without a single customer reference.',
            },
            {
                image: '/images/shackle/04.jpg',
                title: 'Guest satisfaction framed as the product argument.',
                description: '"We increase guest satisfaction through technology" above illustrated airport scenes, then an in-app F&B mockup showing room service ordered from a phone.',
            },
            {
                image: '/images/shackle/05.jpg',
                title: 'Four pillars, one app.',
                description: 'The Solution section: automated check-in/out, revenue generation, data analytics, and F&B laid around a centred product screenshot - consolidation made visual.',
            },
            {
                image: '/images/shackle/06.png',
                title: 'Welcome to the Lobby: industry guests doing the credibility work.',
                description: 'Blog and podcast grid with FIH-credentialled hospitality figures (Robin Sheppard, Robert Richardson FIH) inside the site, not parked on a separate domain.',
            },
            {
                image: '/images/shackle/07.jpg',
                title: 'Waiting-list capture capturing qualified leads pre-launch.',
                description: 'Name, email, company, job title form on a dark panel. Company and job title fields qualify the lead at point of sign-up, not at first sales call.',
            },
        ],
    },
    links: {},
    images: {
        thumbnail: '/images/shackle/01.jpg',
        hero: '/images/shackle/01.jpg',
        gallery: [
            '/images/shackle/01.jpg',
            '/images/shackle/02.jpg',
            '/images/shackle/03.jpg',
            '/images/shackle/04.jpg',
            '/images/shackle/05.jpg',
            '/images/shackle/06.png',
            '/images/shackle/07.jpg',
        ],
    },
};

export default shackle;
