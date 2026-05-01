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
};

export type LegacyDescription = {
    overview?: string;
    challenge: string;
    work: string[];
    outcome: string;
};

export type CaseStudyBody = {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[];
    };
    decisions: Array<{
        title: string;
        what: string;
        why: string;
        rejected_alternative?: string;
        screenshot: string;
        caption: string;
    }>;
    process?: string;
    outcome: {
        summary: string;
        metrics?: Array<{ label: string; value: string }>;
        honest_note?: string;
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
