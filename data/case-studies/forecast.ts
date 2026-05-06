import type { CaseStudy } from './types';

const forecast: CaseStudy = {
    id: 'forecast',
    title: 'Forecast',
    subtitle: 'Solo-built events aggregator for Cyprus, replacing scattered Facebook pages and cluttered listing sites with a calm, fast Saturday-deciding surface.',
    role: 'Founder + sole designer/builder',
    period: '2026',
    tags: ['Next.js', 'Container Queries', 'Design Systems', 'Product Design'],
    categories: ['nextjs', 'design'],
    aiBuilt: true,
    body: {
        brief: {
            situation: 'Cyprus has a real events scene and no decent way to find it. The discovery surface is fragmented across Facebook event pages, posters tied to lampposts in Limassol, and three competing listing sites that look like 2009. Forecast is a solo end-to-end build that replaces that landscape with one calm, fast page that just shows what is on this weekend - the kind of Saturday-deciding surface I personally wanted and could not find.',
            audience: 'Mobile-first locals and visitors opening the site at a cafe table at 3pm, deciding what to do that evening. Not power users planning a season; people answering one question - what is on tonight - in less time than it takes their coffee to arrive.',
            what_made_it_hard: [
                'A fragmented data picture - Facebook events, venue sites, posters, PDFs - that had to be normalised behind the scenes without leaking that mess into the surface',
                'A small, opinionated brief from a single user (me) that needed to generalise enough to be useful to anyone else who lives here',
                'A codebase a future contributor - or future-me in six months - would not drift away from, which meant the design system mattered more than any single screen',
            ],
        },
        decisions: [
            {
                title: 'Calm surface, boring pipeline',
                what: 'No carousels, no auto-play, no algorithmic recommendations - just dates, venues, clean cards. The aggregation pipeline does the messy normalising and dedupe work in the background; the surface stays disciplined.',
                why: 'Every other listing site in this market reaches for the same shiny features and ends up cluttered. The hard problem here was discipline, not novelty. A calm surface is what makes the site usable on a 4G connection at a cafe table in Limassol; the interesting work is in the editorial restraint, not in another carousel.',
                screenshot: '/images/forecast/hero.png',
                caption: 'Editorial-feeling surface that prioritises scanability over engagement metrics.',
            },
            {
                title: 'Container queries over breakpoints',
                what: 'Zero traditional media queries. All responsive behaviour driven by CSS clamps and container queries, with components that compose cleanly when reused across pages.',
                why: 'A side project that gets a second page in six months should not need a responsive audit. Container queries make components portable - they react to their container, not the viewport - which is the only realistic way to keep a single-developer codebase consistent as it grows. Anchored in DESIGN_SYSTEM.md and RESPONSIVE.md so future-me has the rules in one place.',
                screenshot: '/images/forecast/hero.png',
                caption: 'Same components reused across pages without breakpoint-by-breakpoint rework.',
            },
        ],
        process: 'Next.js app router with container queries and fluid typography throughout. Single source of truth for design tokens in globals.css, anchored by DESIGN_SYSTEM.md and RESPONSIVE.md as the contract for future work. Aggregation pipeline kept deliberately boring: scheduled fetch, normalise, dedupe - no clever ranking, no engagement loops. Self-imposed performance budget around instant-feel filtering, near-zero CLS, and image-perfect on slow Limassol 4G.',
        outcome: {
            summary: 'A functional event aggregator covering the actual scene on the island. Calm interface, maintainable codebase, design system that survives contact with new pages - the kind of side project that actually gets used after the launch week, rather than another half-finished portfolio piece.',
        },
    },
    links: {},
    images: {
        thumbnail: '/images/forecast/hero.png',
        hero: '/images/forecast/hero.png',
        gallery: ['/images/forecast/hero.png'],
    },
};

export default forecast;
