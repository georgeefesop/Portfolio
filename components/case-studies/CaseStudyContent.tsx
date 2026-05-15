'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
    BodyDesktopView,
    BodyIntro,
    CaseStudyData,
    CaseStudyLink,
    CompactComparison,
    ComparisonSection,
    Lightbox,
    LinkRow,
    PanelLabel,
    SubLabel,
    VisualGallery,
    VisualIntro,
} from '@/components/case-studies/parts';
import { StackLogos } from '@/components/ui/TechLogoMark';

interface Props {
    project: CaseStudyData;
}

export default function CaseStudyContent({ project }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [activeBuildId, setActiveBuildId] = useState<string | null>(
        project.builds && project.builds.length > 0 ? project.builds[0].id : null,
    );

    const galleryImages = useMemo(() => {
        return Array.isArray(project.images.gallery)
            ? project.images.gallery
            : project.images.gallery.desktop;
    }, [project]);

    const activeBuild = useMemo(() => {
        if (!project.builds || project.builds.length === 0) return null;
        return project.builds.find((b) => b.id === activeBuildId) ?? project.builds[0];
    }, [project, activeBuildId]);

    const resolvedBody = activeBuild?.body ?? project.body;
    const resolvedStack = project.stack ?? activeBuild?.stack ?? [];
    const resolvedLinks: CaseStudyLink[] = useMemo(() => {
        if (activeBuild?.links && activeBuild.links.length > 0) return activeBuild.links;
        const out: CaseStudyLink[] = [];
        if (project.links.live) out.push({ href: project.links.live, label: 'Open live site' });
        if (project.links.github) out.push({ href: project.links.github, label: 'Source', logo: 'github' });
        if (project.links.behance) out.push({ href: project.links.behance, label: 'Behance' });
        return out;
    }, [project, activeBuild]);

    const lightboxImages = useMemo(() => {
        if (project.visual) {
            return [project.images.hero, ...project.visual.gallery.map((g) => g.image)];
        }
        if (!resolvedBody) return galleryImages;
        const decisionShots = resolvedBody.decisions.map((d) => d.screenshot);
        const seen = new Set(decisionShots);
        const extras = galleryImages.filter((g) => !seen.has(g));
        return [...decisionShots, ...extras];
    }, [project, galleryImages, resolvedBody]);

    return (
        <div className="case-study-page-content relative bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.4),0_0_50px_-15px_rgba(171,123,98,0.2)]">
            {project.visual ? (
                <>
                    <VisualIntro project={project} visual={project.visual} />
                    {project.comparison && project.comparison.builds.length > 0 && (
                        <CompactComparison comparison={project.comparison} />
                    )}
                    <VisualGallery
                        heroImage={project.images.hero}
                        heroAlt={project.title}
                        items={project.visual.gallery}
                        onImageClick={(i) => setLightboxIndex(i)}
                    />
                </>
            ) : resolvedBody ? (
                <>
                    <BodyIntro
                        project={project}
                        links={resolvedLinks}
                        stack={resolvedStack}
                        builds={project.builds}
                        activeBuildId={activeBuild?.id ?? null}
                        onSelectBuild={setActiveBuildId}
                        activeBuildDescription={activeBuild?.description}
                        metrics={resolvedBody.outcome.metrics}
                    />
                    {project.comparison && project.comparison.builds.length > 0 && (
                        <ComparisonSection comparison={project.comparison} />
                    )}
                    <BodyDesktopView
                        body={resolvedBody}
                        briefLabel={activeBuild?.briefLabel}
                        onScreenshotClick={(i) => setLightboxIndex(i)}
                    />
                </>
            ) : project.description ? (
                <LegacyDescriptionView
                    project={project}
                    links={resolvedLinks}
                    stack={resolvedStack}
                    galleryImages={galleryImages}
                    onImageClick={(i) => setLightboxIndex(i)}
                />
            ) : null}

            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        images={lightboxImages}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                        onNext={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
                        onPrev={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function LegacyDescriptionView({
    project,
    links,
    stack,
    galleryImages,
    onImageClick,
}: {
    project: CaseStudyData;
    links: CaseStudyLink[];
    stack: string[];
    galleryImages: string[];
    onImageClick: (idx: number) => void;
}) {
    const description = project.description!;
    return (
        <>
            <section className="legacy-view-intro px-7 md:px-9 pt-7 pb-7 border-b border-border-subtle">
                <div className="legacy-view-eyebrow flex items-center gap-2 mb-5">
                    <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                        <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                        <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                        Case File {String.fromCodePoint(0xb7)} {project.id.toUpperCase().replace(/-/g, '_')}
                    </span>
                </div>
                <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-x-8 gap-y-6 items-start">
                    <div className="flex flex-col gap-5 order-2 md:order-1">
                        <h1 className="text-3xl md:text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight leading-[1.1] mb-3">
                            {project.title}
                        </h1>
                        <p className="text-text-muted text-base font-light leading-relaxed pt-3 pb-[7px] max-w-2xl">
                            {project.subtitle}
                        </p>
                        <div className="grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-xs text-text-muted max-w-md">
                            <div>
                                <SubLabel>Role</SubLabel>
                                <span className="block text-text-secondary mt-1">{project.role}</span>
                            </div>
                            <div>
                                <SubLabel>Period</SubLabel>
                                <span className="block text-text-secondary mt-1">{project.period}</span>
                            </div>
                        </div>
                        {stack.length > 0 && (
                            <div className="flex items-center gap-3 flex-wrap">
                                <SubLabel>Stack</SubLabel>
                                <StackLogos ids={stack} size={16} showLabels />
                            </div>
                        )}
                        {links.length > 0 && (
                            <div className="pt-1">
                                <LinkRow links={links} />
                            </div>
                        )}
                    </div>
                    {project.images.hero && (
                        <div className="relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2 self-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={project.images.hero} alt={project.title} className="block w-full h-auto" />
                        </div>
                    )}
                </div>
                {description.overview && (
                    <div className="mt-7">
                        <SubLabel>Overview</SubLabel>
                        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line mt-1.5 max-w-3xl">
                            {description.overview}
                        </p>
                    </div>
                )}
            </section>

            <section className="px-7 md:px-9 py-8 border-b border-border-subtle">
                <PanelLabel>The Challenge</PanelLabel>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line max-w-3xl">
                    {description.challenge}
                </p>
            </section>

            <section className="px-7 md:px-9 py-8 border-b border-border-subtle">
                <PanelLabel>The Work</PanelLabel>
                <ul className="space-y-2.5 max-w-3xl">
                    {description.work.map((item, i) => (
                        <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                            <span className="text-accent-primary flex-shrink-0">{String.fromCodePoint(0x25b8)}</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="px-7 md:px-9 py-8 border-b border-border-subtle">
                <PanelLabel>The Outcome</PanelLabel>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line max-w-3xl">
                    {description.outcome}
                </p>
            </section>

            {galleryImages.length > 0 && (
                <section className="px-7 md:px-9 py-8 bg-bg-tertiary/30">
                    <PanelLabel>Gallery</PanelLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => onImageClick(idx)}
                                className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </section>
            )}
        </>
    );
}
