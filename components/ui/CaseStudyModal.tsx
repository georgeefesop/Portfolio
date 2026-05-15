'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { StackLogos } from '@/components/ui/TechLogoMark';
import {
    BodyDesktopView,
    BodyIntro,
    BodyMobileView,
    BuildTabs,
    CaseStudyData,
    CaseStudyLink,
    ComparisonSection,
    CompactComparison,
    ConsolePanel,
    Lightbox,
    LinkRow,
    MobileSection,
    PanelLabel,
    VisualGallery,
    VisualIntro,
} from '@/components/case-studies/parts';

interface CaseStudyModalProps {
    project: CaseStudyData | null;
    onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const [activeBuildId, setActiveBuildId] = useState<string | null>(null);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (project?.builds && project.builds.length > 0) {
            setActiveBuildId(project.builds[0].id);
        } else {
            setActiveBuildId(null);
        }
    }, [project?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!project) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.dataset.modalOpen = 'true';
        return () => {
            document.body.style.overflow = prev;
            delete document.documentElement.dataset.modalOpen;
        };
    }, [project]);

    useEffect(() => {
        if (!project) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            if (lightboxIndex !== null) setLightboxIndex(null);
            else onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [project, onClose, lightboxIndex]);

    const galleryImages = useMemo(() => {
        if (!project) return [] as string[];
        return Array.isArray(project.images.gallery)
            ? project.images.gallery
            : project.images.gallery.desktop;
    }, [project]);

    const activeBuild = useMemo(() => {
        if (!project?.builds || project.builds.length === 0) return null;
        return project.builds.find((b) => b.id === activeBuildId) ?? project.builds[0];
    }, [project, activeBuildId]);

    const resolvedBody = activeBuild?.body ?? project?.body;
    const resolvedStack = project?.stack ?? activeBuild?.stack ?? [];
    const resolvedLinks: CaseStudyLink[] = useMemo(() => {
        if (!project) return [];
        if (activeBuild?.links && activeBuild.links.length > 0) return activeBuild.links;
        const out: CaseStudyLink[] = [];
        if (project.links.live) out.push({ href: project.links.live, label: 'Open live site' });
        if (project.links.github) out.push({ href: project.links.github, label: 'Source', logo: 'github' });
        if (project.links.behance) out.push({ href: project.links.behance, label: 'Behance' });
        return out;
    }, [project, activeBuild]);

    const lightboxImages = useMemo(() => {
        if (!project) return [] as string[];
        if (project.visual) {
            return [project.images.hero, ...project.visual.gallery.map((g) => g.image)];
        }
        if (!resolvedBody) return galleryImages;
        const decisionShots = resolvedBody.decisions.map((d) => d.screenshot);
        const seen = new Set(decisionShots);
        const extras = galleryImages.filter((g) => !seen.has(g));
        return [...decisionShots, ...extras];
    }, [project, galleryImages, resolvedBody]);

    if (!mounted) return null;

    const content = (
        <AnimatePresence>
            {project && (
                <motion.div
                    key="modal-root"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="case-study-modal-root fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/95"
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    <div
                        className="case-study-modal-grid-overlay pointer-events-none absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, rgba(171,123,98,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(171,123,98,0.6) 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />

                    {project.visual ? (
                        <motion.div
                            initial={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.97 }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1 }}
                            exit={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="case-study-modal-visual-panel relative z-[10] w-full max-w-[1280px] max-h-[92vh] lg:max-h-[88vh] flex flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="case-study-modal-visual-close absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-text-primary bg-bg-tertiary/50 hover:bg-bg-tertiary/70 backdrop-blur-md border border-border-subtle transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                            <div className="case-study-modal-visual-scroll flex-1 min-h-0 overflow-y-auto hud-scroll">
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
                            </div>
                        </motion.div>
                    ) : (
                    <>
                    {/* MOBILE: dedicated single-column readable layout */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="case-study-modal-mobile-panel md:hidden relative z-[10] w-full max-h-[92vh] flex flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-15px_rgba(171,123,98,0.4)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="case-study-modal-close-button absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted bg-bg-tertiary/60 backdrop-blur-md border border-border-subtle"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>

                        <div className="case-study-modal-mobile-scroll overflow-y-auto hud-scroll flex-1">
                            {/* Hero image */}
                            {project.links.live ? (
                                <a
                                    href={project.links.live}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="case-study-modal-mobile-hero relative aspect-[16/10] w-full bg-bg-secondary block"
                                    aria-label={`View ${project.title} live`}
                                >
                                    <ImageWithFallback
                                        src={project.images.hero}
                                        alt={project.title}
                                        fill
                                        sizes="100vw"
                                        className="case-study-modal-mobile-hero-image object-cover"
                                    />
                                    <div className="case-study-modal-mobile-hero-gradient absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/40 to-transparent" />
                                    <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] bg-bg-tertiary/80 backdrop-blur-sm border border-border-subtle text-text-muted rounded-sm flex items-center gap-1">
                                        <span>Visit live</span>
                                        <span aria-hidden>{String.fromCodePoint(0x2197)}</span>
                                    </span>
                                </a>
                            ) : (
                                <div className="case-study-modal-mobile-hero relative aspect-[16/10] w-full bg-bg-secondary">
                                    <ImageWithFallback
                                        src={project.images.hero}
                                        alt={project.title}
                                        fill
                                        sizes="100vw"
                                        className="case-study-modal-mobile-hero-image object-cover"
                                    />
                                    <div className="case-study-modal-mobile-hero-gradient absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/40 to-transparent" />
                                </div>
                            )}

                            {/* Title block */}
                            <div className="case-study-modal-mobile-title-block px-7 -mt-10 pb-5 relative z-10">
                                <div className="case-study-modal-mobile-eyebrow flex items-center gap-2 mb-3">
                                    <span className="case-study-modal-mobile-eyebrow-dot relative inline-flex w-1.5 h-1.5">
                                        <span className="case-study-modal-mobile-eyebrow-dot-ping absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                        <span className="case-study-modal-mobile-eyebrow-dot-core relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    </span>
                                    <span className="case-study-modal-mobile-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                        Case File {String.fromCodePoint(0xb7)} {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                    </span>
                                </div>
                                <h3 className="case-study-modal-mobile-title text-3xl font-fraunces-display font-medium text-text-primary tracking-tight mb-2 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="case-study-modal-mobile-subtitle text-text-muted text-base font-light leading-snug pt-3 pb-[7px] mb-4">
                                    {project.subtitle}
                                </p>
                                {resolvedStack.length > 0 && (
                                    <div className="case-study-modal-mobile-stack flex items-center gap-3 flex-wrap mb-4">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim">
                                            Stack
                                        </span>
                                        <StackLogos ids={resolvedStack} size={16} showLabels />
                                    </div>
                                )}
                                <div className="case-study-modal-mobile-meta-grid grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-border-subtle">
                                    <div className="case-study-modal-mobile-meta-cell">
                                        <span className="case-study-modal-mobile-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                                        <span className="case-study-modal-mobile-meta-value text-text-secondary">{project.role}</span>
                                    </div>
                                    <div className="case-study-modal-mobile-meta-cell">
                                        <span className="case-study-modal-mobile-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                                        <span className="case-study-modal-mobile-meta-value text-text-secondary">{project.period}</span>
                                    </div>
                                </div>
                            </div>

                            {project.builds && project.builds.length > 1 && (
                                <div className="case-study-modal-mobile-tabs px-7 pb-5">
                                    <div className="case-study-modal-mobile-tabs-eyebrow flex items-baseline gap-2 mb-3">
                                        <span className="block h-px w-5 bg-text-dim translate-y-[-0.3em]" />
                                        <span className="font-serif italic font-normal text-text-primary text-base leading-none">
                                            One website, {project.builds.length} builds
                                        </span>
                                    </div>
                                    <BuildTabs
                                        builds={project.builds}
                                        activeId={activeBuild?.id ?? project.builds[0].id}
                                        onChange={setActiveBuildId}
                                    />
                                    {activeBuild?.description && (
                                        <p className="case-study-modal-mobile-build-description text-xs text-text-muted leading-relaxed mt-3">
                                            {activeBuild.description}
                                        </p>
                                    )}
                                    {resolvedLinks.length > 0 && (
                                        <div className="case-study-modal-mobile-tabs-link-row mt-4">
                                            <LinkRow links={resolvedLinks} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.comparison && project.comparison.builds.length > 0 && (
                                <ComparisonSection comparison={project.comparison} mobile />
                            )}

                            {resolvedBody ? (
                                <BodyMobileView body={resolvedBody} briefLabel={activeBuild?.briefLabel} onScreenshotClick={(i) => setLightboxIndex(i)} />
                            ) : project.description ? (
                                <>
                                    {project.description.overview && (
                                        <MobileSection label="Overview">
                                            <p className="whitespace-pre-line">{project.description.overview}</p>
                                        </MobileSection>
                                    )}
                                    <MobileSection label="The Challenge">
                                        <p className="whitespace-pre-line">{project.description.challenge}</p>
                                    </MobileSection>
                                    <MobileSection label="The Work">
                                        <ul className="case-study-modal-mobile-work-list space-y-3">
                                            {project.description.work.map((item, i) => (
                                                <li key={i} className="case-study-modal-mobile-work-item flex gap-2.5">
                                                    <span className="case-study-modal-mobile-work-bullet text-accent-primary flex-shrink-0">{String.fromCodePoint(0x25b8)}</span>
                                                    <span className="case-study-modal-mobile-work-text">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </MobileSection>
                                    <MobileSection label="The Outcome">
                                        <p className="whitespace-pre-line">{project.description.outcome}</p>
                                    </MobileSection>
                                </>
                            ) : null}

                            {(!project.builds || project.builds.length <= 1) && resolvedLinks.length > 0 && (
                                <div className="case-study-modal-mobile-cta-wrap px-7 pb-5">
                                    <LinkRow links={resolvedLinks} />
                                </div>
                            )}

                            {!resolvedBody && (
                                <div className="case-study-modal-mobile-gallery border-t border-border-subtle bg-bg-tertiary/30">
                                    <div className="case-study-modal-mobile-gallery-header px-7 py-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                        <span className="case-study-modal-mobile-gallery-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                        <span className="case-study-modal-mobile-gallery-label">Gallery</span>
                                        <span className="case-study-modal-mobile-gallery-count text-accent-primary/60">// {galleryImages.length}</span>
                                    </div>
                                    <div className="case-study-modal-mobile-gallery-list px-7 pb-6 flex flex-col gap-3">
                                        {galleryImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="case-study-modal-mobile-gallery-item relative w-full aspect-[16/10] rounded-md overflow-hidden bg-bg-tertiary border border-border-subtle"
                                            >
                                                <ImageWithFallback
                                                    src={img}
                                                    alt={`${project.title} screenshot ${idx + 1}`}
                                                    fill
                                                    sizes="100vw"
                                                    className="case-study-modal-mobile-gallery-image object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* DESKTOP: body-mode renders a single full-bleed reading panel.
                        Legacy description-mode keeps the original aside + main 3-col layout. */}
                    {resolvedBody ? (
                        <motion.div
                            initial={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.97 }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1 }}
                            exit={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="case-study-modal-desktop-panel hidden md:flex relative z-[10] w-full max-w-[1280px] md:max-h-[92vh] lg:h-[88vh] lg:max-h-none flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="case-study-modal-desktop-close-button absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-text-primary bg-bg-tertiary/50 hover:bg-bg-tertiary/70 backdrop-blur-md border border-border-subtle transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                            <div className="case-study-modal-desktop-scroll flex-1 min-h-0 overflow-y-auto hud-scroll">
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
                            </div>
                        </motion.div>
                    ) : (
                    <div
                        className="case-study-modal-legacy-shell hidden md:flex relative z-[10] w-full max-w-[1500px] md:flex-col md:max-h-[92vh] md:gap-4 md:overflow-y-auto lg:flex-row lg:h-[88vh] lg:max-h-none lg:gap-0 lg:overflow-visible md:items-stretch hud-scroll"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Floating identity panel */}
                        <motion.aside
                            initial={{ opacity: 0, x: -28, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.97 }}
                            transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="case-study-modal-aside md:w-full lg:w-[360px] lg:flex-shrink-0 bg-bg-secondary/95 backdrop-blur-md border border-border-subtle rounded-md flex flex-col overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.45)]"
                        >
                            <div className="case-study-modal-aside-header flex-shrink-0 px-7 pt-5 pb-3.5 border-b border-border-subtle flex items-center gap-2 bg-bg-tertiary/40">
                                <span className="case-study-modal-aside-eyebrow-dot relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                                    <span className="case-study-modal-aside-eyebrow-dot-ping absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                    <span className="case-study-modal-aside-eyebrow-dot-core relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                </span>
                                <span className="case-study-modal-aside-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                    Case File {String.fromCodePoint(0xb7)} {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                </span>
                            </div>

                            <div className="case-study-modal-aside-identity flex-shrink-0 px-7 pt-5 pb-5">
                                <h3 className="case-study-modal-aside-title text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight mb-1.5 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="case-study-modal-aside-subtitle text-text-muted text-base font-light leading-snug pt-3 pb-[7px] mb-4">
                                    {project.subtitle}
                                </p>
                                {resolvedStack.length > 0 && (
                                    <div className="case-study-modal-aside-stack flex items-center gap-3 flex-wrap mb-5">
                                        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim">
                                            Stack
                                        </span>
                                        <StackLogos ids={resolvedStack} size={16} showLabels />
                                    </div>
                                )}
                                <div className="case-study-modal-aside-meta-grid grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-border-subtle">
                                    <div className="case-study-modal-aside-meta-cell">
                                        <span className="case-study-modal-aside-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                                        <span className="case-study-modal-aside-meta-value text-text-secondary">{project.role}</span>
                                    </div>
                                    <div className="case-study-modal-aside-meta-cell">
                                        <span className="case-study-modal-aside-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                                        <span className="case-study-modal-aside-meta-value text-text-secondary">{project.period}</span>
                                    </div>
                                </div>
                            </div>

                            {project.description?.overview ? (
                                <div className="case-study-modal-aside-overview md:flex-1 md:min-h-0 md:overflow-y-auto px-7 pb-6 hud-scroll">
                                    <PanelLabel>Overview</PanelLabel>
                                    <div className="case-study-modal-aside-overview-text text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                        {project.description.overview}
                                    </div>
                                </div>
                            ) : (
                                <div className="case-study-modal-aside-spacer md:flex-1 md:min-h-0" />
                            )}

                            {resolvedLinks.length > 0 && (
                                <div className="case-study-modal-aside-cta-wrap flex-shrink-0 px-7 py-4 border-t border-border-subtle bg-bg-tertiary/30">
                                    <LinkRow links={resolvedLinks} />
                                </div>
                            )}
                        </motion.aside>

                        {/* Main reading panel */}
                        <motion.div
                            initial={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.97 }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1 }}
                            exit={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="case-study-modal-main relative flex-1 min-w-0 flex flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                        >
                            <button
                                onClick={onClose}
                                className="case-study-modal-main-close-button absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-text-primary bg-bg-tertiary/50 hover:bg-bg-tertiary/70 backdrop-blur-md border border-border-subtle transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.35 }}
                                className="case-study-modal-main-inner flex-1 min-h-0 flex flex-col"
                            >
                                {project.description ? (
                                    <>
                                        <div className="case-study-modal-main-grid flex-1 min-h-0 grid md:grid-cols-3 grid-rows-[auto] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
                                            <ConsolePanel label="The Challenge">
                                                <p className="case-study-modal-main-text text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                                    {project.description.challenge}
                                                </p>
                                            </ConsolePanel>
                                            <ConsolePanel label="The Work">
                                                <ul className="case-study-modal-main-work-list space-y-2.5">
                                                    {project.description.work.map((item, i) => (
                                                        <li key={i} className="case-study-modal-main-work-item text-text-secondary text-sm leading-relaxed flex gap-2">
                                                            <span className="case-study-modal-main-work-bullet text-accent-primary flex-shrink-0">{String.fromCodePoint(0x25b8)}</span>
                                                            <span className="case-study-modal-main-work-text">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </ConsolePanel>
                                            <ConsolePanel label="The Outcome">
                                                <p className="case-study-modal-main-text text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                                    {project.description.outcome}
                                                </p>
                                            </ConsolePanel>
                                        </div>

                                        <div className="case-study-modal-gallery-strip flex-shrink-0 border-t border-border-subtle bg-bg-tertiary/30">
                                            <div className="case-study-modal-gallery-strip-header px-7 py-2.5 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                                <span className="case-study-modal-gallery-strip-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                                <span className="case-study-modal-gallery-strip-label">Gallery</span>
                                                <span className="case-study-modal-gallery-strip-count text-accent-primary/60">// {galleryImages.length}</span>
                                            </div>
                                            <div
                                                className="case-study-modal-gallery-strip-list px-7 pb-5 flex gap-3 overflow-x-auto overflow-y-hidden hud-scroll"
                                                style={{
                                                    maskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                                    WebkitMaskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                                }}
                                            >
                                                {galleryImages.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setLightboxIndex(idx)}
                                                        className="case-study-modal-gallery-strip-item relative flex-shrink-0 w-[232px] aspect-[4/3] rounded-sm overflow-hidden bg-bg-tertiary cursor-zoom-in hover:brightness-110 transition-all border border-border-subtle hover:border-accent-primary/40"
                                                    >
                                                        <ImageWithFallback
                                                            src={img}
                                                            alt={`${project.title} screenshot ${idx + 1}`}
                                                            fill
                                                            sizes="232px"
                                                            className="case-study-modal-gallery-strip-image object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </motion.div>
                        </motion.div>
                    </div>
                    )}
                    </>
                    )}

                    <AnimatePresence>
                        {lightboxIndex !== null && project && (
                            <Lightbox
                                images={lightboxImages}
                                currentIndex={lightboxIndex}
                                onClose={() => setLightboxIndex(null)}
                                onNext={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
                                onPrev={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}
