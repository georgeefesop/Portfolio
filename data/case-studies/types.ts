// data/case-studies/types.ts
// Schema for portfolio case studies. Backwards-compatible:
// - Legacy entries use the `description` block.
// - New entries (from case-study-generator skill) use the rich `body` block.
// - At least one of `description` or `body` must be present.

export type CategoryId = 'design' | 'wordpress' | 'nextjs' | 'ai-image';

export type ExternalCase = {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    categories: CategoryId[];
    thumbnail: string;
    externalLink: string;
    duration?: string;
};

export type LegacyDescription = {
    overview?: string;
    challenge: string;
    work: string[];
    outcome: string;
};

export type StackBuild = {
    /** Short label for the stack, e.g. "WordPress + Elementor" or "Next.js + Sanity" */
    label: string;
    /** Public URL where this build can be viewed. Optional in case one is offline. */
    href?: string;
    /** Optional one-line note shown under the label, e.g. "Free Elementor tier, no Pro plugins" */
    note?: string;
    /** Lighthouse scores for THIS build, 0-100. Render as ringed circles via the existing MetricsCircles. */
    lighthouse: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    /** Optional extra stats - page weight, DOM nodes, TTI, etc. Free-form so we can mix units. */
    extras?: Array<{ label: string; value: string }>;
};

/** Side-by-side stack comparison. Renders one column per build with Lighthouse
 *  rings + extras, then a delta table summarising the differences. */
export type StackComparison = {
    heading?: string;
    intro?: string;
    /** Methodology footnote shown beneath the diff table, e.g. "Measured live via Google PageSpeed Insights API on 2026-05-03." */
    methodology?: string;
    builds: StackBuild[];
};

export type CaseStudyBody = {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[]; // 2-3 short points; the modal renders them as a vertical numbered list
    };
    /** Honest constraint or caveat. Renders at the top of the modal under the tag pills. */
    honest_note?: string;
    decisions: Array<{
        title: string;
        /** The screenshot does the "what". Keep this for writers' reference; the modal does not render it. */
        what: string;
        /** Single rationale paragraph rendered under the screenshot caption. */
        why: string;
        screenshot: string;
        caption: string;
    }>;
    process?: string;
    /** Optional comparison nested inside the body. Used by single-build cases
     *  like Kingfisher where the comparison is part of the active narrative.
     *  Tabbed cases prefer the top-level `CaseStudy.comparison` so the block
     *  renders once regardless of which tab is active. */
    comparison?: StackComparison;
    outcome: {
        summary: string;
        /** Only include if real and verifiable. Fictional / illustrative numbers belong nowhere on the site. */
        metrics?: Array<{ label: string; value: string }>;
    };
};

export type CaseStudyImages = {
    thumbnail: string;
    hero: string;
    gallery: string[] | {
        desktop: string[];
        tablet?: string[];
        mobile?: string[];
    };
};

/** Link entry with optional tech-logo id (from data/tech-logos.ts) so the
 *  button can render a brand mark instead of the generic globe. */
export type CaseStudyLink = {
    href: string;
    label?: string;
    /** Logo id from `data/tech-logos.ts` (e.g. 'react', 'webflow'). Optional. */
    logo?: string;
};

/** A single build within a case study. Tabs render one button per build at
 *  the top of the modal; selecting a tab swaps the brief/decisions/process/
 *  outcome to that build's body. */
export type CaseStudyBuild = {
    /** URL-safe id, e.g. 'react' or 'webflow'. Used as React key + tab anchor. */
    id: string;
    /** Tab button label, e.g. "Original design & build". */
    label: string;
    /** One-line note shown under the tab strip when this build is active. */
    description?: string;
    /** Build-specific links. Rendered as a row of buttons next to the tabs. */
    links?: CaseStudyLink[];
    /** Build-specific tech stack - logo ids from `data/tech-logos.ts`. */
    stack?: string[];
    /** Override for the "Brief" panel label when this build is active.
     *  e.g. "Design Brief" vs "Site Rebuild Brief". Defaults to "Brief". */
    briefLabel?: string;
    body: CaseStudyBody;
};

export type CaseStudy = {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    categories: CategoryId[];
    aiBuilt?: boolean;
    links: { live?: string; behance?: string; github?: string };
    /** Tech stack logo ids for the thumbnail overlay + modal logo strip.
     *  When `builds` is present, each build defines its own `stack`; this
     *  top-level value is used for the work-grid thumbnail and as a default. */
    stack?: string[];
    description?: LegacyDescription;
    body?: CaseStudyBody;
    /** When present, the modal renders a tab strip and switches `body` per
     *  selected build. `body` (top-level) is ignored if `builds` exists. */
    builds?: CaseStudyBuild[];
    /** Top-level comparison block. Shown once regardless of active build,
     *  positioned just under the build link buttons. Use this when the
     *  comparison is between the case's own builds (Akti React vs Webflow);
     *  use `body.comparison` when the comparison is part of a single-body
     *  narrative (Kingfisher's WP-vs-headless walkthrough). */
    comparison?: StackComparison;
    images: CaseStudyImages;
};
