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
    description: {
        overview: 'Forecast is a modern aggregator for events on the island of Cyprus, built solo end to end. It replaces a fragmented landscape - Facebook event pages, poster walls in Limassol, three competing sites with cluttered UIs - with a calm, fast surface that just shows you what\'s on this weekend.\n\nThe hard problem was less the data and more the discipline: keep the surface dead simple while the aggregation pipeline does the messy work in the background.',
        challenge: 'Design and build an events aggregator for an island whose existing options look like 2009 while addressing:\n\n• Fragmented sources: Facebook events, venue sites, posters, and PDFs\n• Mobile-first audience that opens the site at a café table to decide a Saturday\n• A small, opinionated brief from a single user (me) that should generalise\n• A codebase a future contributor - or future-me in six months - won\'t drift away from',
        work: [
            'Next.js app router with container queries and fluid typography - zero traditional media queries, all responsive behaviour driven by CSS clamps and container queries',
            'Single source of truth in globals.css for design tokens, with DESIGN_SYSTEM.md and RESPONSIVE.md to anchor future work',
            'Calm UI: no carousels, no auto-play, no algorithmic recommendations - just dates, venues, clean cards',
            'Aggregation pipeline kept deliberately boring: scheduled fetch, normalize, dedupe - the interesting work is in the surface, not the plumbing',
            'Container-query-based components that compose cleanly when reused across pages',
            'Self-imposed performance budget: instant-feel filtering, near-zero CLS, image-perfect on slow Limassol 4G'
        ],
        outcome: 'Functional event aggregator covering the actual scene on the island. Calm interface, maintainable codebase, design system that survives contact with new pages - the kind of side project that actually gets used after the launch week.'
    },
    links: {},
    images: {
        thumbnail: "/images/forecast/hero.png",
        hero: "/images/forecast/hero.png",
        gallery: [
            "/images/forecast/hero.png"
        ]
    }
};

export default forecast;
