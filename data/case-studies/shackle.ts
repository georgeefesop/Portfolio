import type { CaseStudy } from './types';

const shackle: CaseStudy = {
    id: 'shackle',
    title: 'Shackle',
    subtitle: 'Pre-launch B2B marketing site for a hotel-tech SaaS, positioned as the last integration the hotel needs and seeded with partner credibility (Oracle Gold, Park Regis, London & Partners) instead of customer logos.',
    role: 'UX/UI design (freelance)',
    period: '2020-2021',
    tags: ['UX/UI', 'B2B', 'SaaS', 'Marketing site', 'Hospitality'],
    categories: ['design'],
    body: {
        honest_note: 'Freelance work from 2020-2021 on Shackle\'s pre-launch marketing site. The company\'s status beyond the version documented here is outside what this case claims; the design choices and the partner-credibility positioning shipped to a public site at the time.',
        brief: {
            situation: 'Shackle is a hotel-tech SaaS pitching a single integrated guest-facing app: keyless check-in/out, in-app food and beverage ordering, on-demand room upgrades, and PMS integration on the back end. The freelance brief was a marketing website for the pre-launch period, with one job: convince hospitality decision-makers that one integration could replace a stack of five, and seed a waiting list of qualified leads while the product itself was still being built.',
            audience: 'Hospitality industry buyers: hotel general managers, owners, and operations directors who already manage a sprawl of legacy systems (PMS, F&B ordering, housekeeping, reception software). The audience is sceptical of yet another platform pitch but receptive to one that promises to consolidate the integration mess rather than add to it.',
            what_made_it_hard: [
                'Pre-launch B2B SaaS sites have to look credible without a customer base to point to.',
                'Hotel buyers are sceptical of platform promises after years of integration sprawl; the page had to position Shackle as relief from that fatigue, not another addition to it.',
            ],
        },
        decisions: [
            {
                title: 'Partner credibility instead of customer logos',
                what: 'Oracle Gold Partner badge, Park Regis hotel logo, London & Partners business growth programme, and Local Enterprise Office shown prominently on the page, alongside a founder Vimeo video. No customer logos because there were none yet.',
                why: 'B2B SaaS marketing sites typically lean on a customer logo row for trust. A pre-launch product has no such row, so the partner-and-accreditation set has to do that work instead. Oracle Gold Partner specifically anchors the technical credibility (PMS integration claims become believable when Oracle has signed off on the technology partnership), the hotel partner gives industry credibility, and the public-sector growth programme gives institutional credibility. Three different kinds of trust signal stacked, none of which require a customer base.',
                screenshot: '/images/shackle/03.jpg',
                caption: 'Founder Vimeo + partner row. Oracle Gold, Park Regis, London & Partners, Local Enterprise Office doing the work a customer logo row would normally do.',
            },
            {
                title: 'Position as the last integration, not another one',
                what: '"Shackle is the last integration your hotel will ever need" as the lead positioning line, paired with a four-pillar feature row showing what one integration unlocks: keyless check-in/out, in-app F&B, room upgrades, and seamless integration to existing systems.',
                why: 'A hotel buyer\'s prior, after years of platform-stack fatigue, is "another thing to integrate." Inverting that frame in the lead headline is the whole positioning bet of the site: Shackle as relief from integration sprawl rather than an addition to it. The four-pillar grid does the consolidation case visually: one app replacing what the buyer currently runs across multiple vendor relationships. Without this frame, the page reads as Yet Another Hotel SaaS; with it, the page reads as a category answer.',
                screenshot: '/images/shackle/02.jpg',
                caption: '"The last integration your hotel will ever need" + four-pillar feature row, doing the consolidation case visually.',
            },
            {
                title: 'Industry content marketing as parallel credibility',
                what: 'A "Welcome to the Lobby" blog and podcast section with hospitality industry guests (Robin Sheppard, Robert Richardson FIH, Nick Naunov, James Lemon) and a topical NHS gratitude post during COVID. Visible thought leadership baked into the marketing site, not parked on a separate domain.',
                why: 'Pre-launch SaaS founders are unknown by definition, but their guests and conversations can borrow industry credibility. Having a published podcast with FIH-credentialled hospitality figures inside the site means a sceptical hotel GM scrolling the page sees Shackle\'s leadership inside the industry conversation, not pitching to it from outside. The COVID NHS post is timely-correct: hospitality was hammered by lockdown, and a small public gesture from a hotel-tech company reads as in-the-room rather than tone-deaf.',
                screenshot: '/images/shackle/06.png',
                caption: '"Welcome to the Lobby" blog and podcast grid. Industry guests doing the credibility work pre-launch SaaS founders cannot do alone.',
            },
        ],
        process: 'Visual identity work first (logo, teal accent, brand voice), then marketing-site IA: hero (positioning), introduction (problem framing as integration fatigue), founder video and partners (credibility row), what-we-do (problem in plainer terms with illustrated guest scenes), the-solution (four feature pillars), Welcome to the Lobby (blog and podcast for industry-side thought leadership), and a waiting-list capture in the footer. Brand boundaries set early so the partner badges, feature illustrations and product mockups all share the same visual register. Built and shipped during 2020, with the founder running parallel content marketing through the podcast.',
        outcome: {
            summary: 'Marketing site shipped with a working waiting-list capture, a partner-credibility row standing in for the customer logos a pre-launch SaaS does not have, a founder Vimeo above the fold, and a blog and podcast doing parallel industry credibility work. The positioning bet ("last integration, not first") anchors the site against the buyer\'s prior of integration fatigue. What happened to Shackle beyond the version documented here is outside what this case claims; the design itself shipped to a public site that ran during 2020-2021.',
        },
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
