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

export type CaseStudyBody = {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[]; // exactly 3 points; the modal renders them as a vertical numbered list
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
    /** Optional side-by-side stack comparison. When present, the modal renders a section with one column per build, each showing Lighthouse rings + extras, then a delta table summarising the differences. */
    comparison?: {
        /** Heading shown above the comparison block. */
        heading?: string;
        /** Short intro paragraph. */
        intro?: string;
        /** Methodology footnote shown beneath the diff table, e.g. "Measured live via Google PageSpeed Insights API on 2026-05-03." */
        methodology?: string;
        builds: StackBuild[];
    };
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
    description?: LegacyDescription;
    body?: CaseStudyBody;
    images: CaseStudyImages;
};
