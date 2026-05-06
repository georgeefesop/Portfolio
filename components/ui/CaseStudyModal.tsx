'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface CaseStudyBody {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[];
    };
    honest_note?: string;
    decisions: Array<{
        title: string;
        what: string;
        why: string;
        screenshot: string;
        caption: string;
    }>;
    process?: string;
    comparison?: {
        heading?: string;
        intro?: string;
        methodology?: string;
        builds: Array<{
            label: string;
            href?: string;
            note?: string;
            lighthouse: {
                performance: number;
                accessibility: number;
                bestPractices: number;
                seo: number;
            };
            extras?: Array<{ label: string; value: string }>;
        }>;
    };
    outcome: {
        summary: string;
        metrics?: Array<{ label: string; value: string }>;
    };
}

interface CaseStudyData {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    aiBuilt?: boolean;
    description?: {
        overview?: string;
        challenge: string;
        work: string[];
        outcome: string;
    };
    body?: CaseStudyBody;
    links: {
        live?: string;
        behance?: string;
        github?: string;
    };
    images: {
        thumbnail: string;
        hero: string;
        gallery: string[] | {
            desktop: string[];
            tablet?: string[];
            mobile?: string[];
        };
    };
}

interface CaseStudyModalProps {
    project: CaseStudyData | null;
    onClose: () => void;
}

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Lock body scroll + flag <html> so heavy hero animations can pause
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

    // Esc to close (lightbox first, then modal)
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

    // For body-mode, the lightbox cycles through decision screenshots first,
    // then any leftover gallery shots that weren't used inline.
    const lightboxImages = useMemo(() => {
        if (!project) return [] as string[];
        if (!project.body) return galleryImages;
        const decisionShots = project.body.decisions.map((d) => d.screenshot);
        const seen = new Set(decisionShots);
        const extras = galleryImages.filter((g) => !seen.has(g));
        return [...decisionShots, ...extras];
    }, [project, galleryImages]);

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
                    {/* Faint grid texture overlay (HUD vibe) */}
                    <div
                        className="case-study-modal-grid-overlay pointer-events-none absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, rgba(171,123,98,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(171,123,98,0.6) 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />

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

                            {/* Title block */}
                            <div className="case-study-modal-mobile-title-block px-7 -mt-10 pb-5 relative z-10">
                                <div className="case-study-modal-mobile-eyebrow flex items-center gap-2 mb-3">
                                    <span className="case-study-modal-mobile-eyebrow-dot relative inline-flex w-1.5 h-1.5">
                                        <span className="case-study-modal-mobile-eyebrow-dot-ping absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                        <span className="case-study-modal-mobile-eyebrow-dot-core relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    </span>
                                    <span className="case-study-modal-mobile-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                        Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                    </span>
                                </div>
                                <h3 className="case-study-modal-mobile-title text-3xl font-fraunces-display font-medium text-text-primary tracking-tight mb-2 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="case-study-modal-mobile-subtitle text-text-muted text-base font-light leading-snug pt-3 pb-[7px] mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="case-study-modal-mobile-tag-list flex flex-wrap items-center gap-1.5 mb-4">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="case-study-modal-mobile-tag bg-bg-primary px-2 py-0.5 rounded text-[12px] font-karla-ui text-text-muted border border-bg-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
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

                            {project.body ? (
                                <BodyMobileView body={project.body} onScreenshotClick={(i) => setLightboxIndex(i)} />
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
                                                    <span className="case-study-modal-mobile-work-bullet text-accent-primary flex-shrink-0">▸</span>
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

                            {project.links.live && (
                                <div className="case-study-modal-mobile-cta-wrap px-7 pb-5">
                                    <LiveSiteButton href={project.links.live} />
                                </div>
                            )}

                            {/* Legacy gallery only when no body schema */}
                            {!project.body && (
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
                    {project.body ? (
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
                                <BodyIntro project={project} />
                                <BodyDesktopView
                                    body={project.body}
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
                                    Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                </span>
                            </div>

                            <div className="case-study-modal-aside-identity flex-shrink-0 px-7 pt-5 pb-5">
                                <h3 className="case-study-modal-aside-title text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight mb-1.5 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="case-study-modal-aside-subtitle text-text-muted text-base font-light leading-snug pt-3 pb-[7px] mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="case-study-modal-aside-tag-list flex flex-wrap items-center gap-1.5 mb-5">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="case-study-modal-aside-tag bg-bg-primary px-2 py-0.5 rounded text-[12px] font-karla-ui text-text-muted border border-bg-primary">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
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

                            {/* Identity-card scroll body: legacy overview only.
                                Body-mode entries carry the brief in the main reading panel,
                                so the identity card stays sparse. */}
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

                            {project.links.live && (
                                <div className="case-study-modal-aside-cta-wrap flex-shrink-0 px-7 py-4 border-t border-border-subtle bg-bg-tertiary/30">
                                    <LiveSiteButton href={project.links.live} />
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
                                                            <span className="case-study-modal-main-work-bullet text-accent-primary flex-shrink-0">▸</span>
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

                                        {/* Bottom gallery strip - legacy only */}
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

// --- Body schema: intro block (replaces sidebar, sits at top of single-panel layout) ---

function BodyIntro({ project }: { project: CaseStudyData }) {
    return (
        <section className="body-intro-root px-9 pt-7 pb-7 border-b border-border-subtle">
            <div className="body-intro-eyebrow flex items-center gap-2 mb-5">
                <span className="body-intro-eyebrow-dot relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                    <span className="body-intro-eyebrow-dot-ping absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                    <span className="body-intro-eyebrow-dot-core relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                </span>
                <span className="body-intro-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                    Case File · {project.id.toUpperCase().replace(/-/g, '_')}
                </span>
            </div>
            <div className="body-intro-grid grid md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-x-8 gap-y-6 items-start">
                <div className="body-intro-text-col flex flex-col gap-5 order-2 md:order-1">
                    <div className="body-intro-headline">
                        <h3 className="body-intro-title text-3xl md:text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight leading-[1.1] mb-3">
                            {project.title}
                        </h3>
                        <p className="body-intro-subtitle text-text-muted text-base font-light leading-relaxed pt-3 pb-[7px] max-w-2xl">
                            {project.subtitle}
                        </p>
                    </div>
                    <div className="body-intro-meta-grid grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-xs text-text-muted max-w-md">
                        <div className="body-intro-meta-cell">
                            <span className="body-intro-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                            <span className="body-intro-meta-value text-text-secondary">{project.role}</span>
                        </div>
                        <div className="body-intro-meta-cell">
                            <span className="body-intro-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                            <span className="body-intro-meta-value text-text-secondary">{project.period}</span>
                        </div>
                    </div>
                    <div className="body-intro-tag-row flex flex-wrap items-center gap-x-3 gap-y-2.5 pt-1">
                        <div className="body-intro-tag-list flex flex-wrap items-center gap-1.5">
                            {project.tags.map((tag) => (
                                <span key={tag} className="body-intro-tag bg-bg-primary px-2 py-0.5 rounded text-[12px] font-karla-ui text-text-muted border border-bg-primary">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {project.links.live && (
                            <LiveSiteButton href={project.links.live} />
                        )}
                    </div>
                </div>
                <div className="body-intro-hero relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2">
                    <ImageWithFallback
                        src={project.images.hero}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 340px, 100vw"
                        className="body-intro-hero-image object-cover"
                    />
                </div>
            </div>
            {project.body?.outcome?.metrics && project.body.outcome.metrics.length > 0 && (
                <div className="body-intro-metrics mt-7">
                    <MetricsCircles metrics={project.body.outcome.metrics} />
                </div>
            )}
        </section>
    );
}

// --- Live site button ---

function LiveSiteButton({ href, className = '' }: { href: string; className?: string }) {
    let domain = href;
    try {
        domain = new URL(href).hostname.replace(/^www\./, '');
    } catch {}
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`live-site-cta group relative inline-flex items-center gap-3 px-4 py-2.5 bg-[#cbcdb7] hover:bg-[#bfc1ab] text-text-primary border-2 border-accent-primary/30 hover:border-accent-primary/55 rounded-sm transition-colors text-[11px] font-mono uppercase tracking-[0.2em] shadow-[0_1px_0_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.08)] ${className}`}
        >
            <span className="live-site-cta-dot w-1.5 h-1.5 rounded-full bg-accent-primary" aria-hidden />
            <span className="live-site-cta-label">Open live site</span>
            <span className="live-site-cta-divider w-px h-3 bg-border-medium" aria-hidden />
            <span className="live-site-cta-domain normal-case tracking-normal text-text-muted">{domain}</span>
            <ArrowUpRight size={14} className="live-site-cta-arrow text-accent-primary transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </a>
    );
}

// --- Body schema desktop view ---

function BodyDesktopView({ body, onScreenshotClick }: { body: CaseStudyBody; onScreenshotClick: (idx: number) => void }) {
    const decisions = body.decisions;
    return (
        <>
            {/* BRIEF */}
            <section className="body-desktop-brief px-9 pt-8 pb-9 border-b border-border-subtle">
                <PanelLabel>Brief</PanelLabel>
                <div className="body-desktop-brief-grid grid lg:grid-cols-2 gap-x-10 gap-y-5 mb-6">
                    <BriefCol label="Situation" body={body.brief.situation} />
                    <BriefCol label="Audience" body={body.brief.audience} />
                </div>
                <div className="body-desktop-brief-bottom grid lg:grid-cols-2 gap-x-10 gap-y-5">
                    {body.honest_note && (
                        <div className="body-desktop-honest-note">
                            <SubLabel>Honest note</SubLabel>
                            <p className="body-desktop-honest-note-text text-text-muted text-sm italic leading-relaxed mt-1.5">{body.honest_note}</p>
                        </div>
                    )}
                    <div className="body-desktop-brief-hard">
                        <SubLabel>What made it hard</SubLabel>
                        <ul className="body-desktop-brief-hard-list mt-1.5">
                            {body.brief.what_made_it_hard.map((item, i) => (
                                <li key={i} className="body-desktop-brief-hard-item text-text-secondary text-sm leading-relaxed">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* COMPARISON */}
            {body.comparison && body.comparison.builds.length > 0 && (
                <section className="body-desktop-comparison px-9 py-8 border-b border-border-subtle">
                    <PanelLabel>{body.comparison.heading || 'Comparison'}</PanelLabel>
                    {body.comparison.intro && (
                        <p className="body-desktop-comparison-intro text-text-secondary text-[15px] leading-relaxed max-w-3xl mb-7">
                            {body.comparison.intro}
                        </p>
                    )}
                    <ComparisonGrid builds={body.comparison.builds} />
                    <ComparisonDiffTable builds={body.comparison.builds} />
                    {body.comparison.methodology && (
                        <p className="body-desktop-comparison-methodology text-text-muted text-[12px] leading-relaxed max-w-3xl mt-4 italic">
                            {body.comparison.methodology}
                        </p>
                    )}
                </section>
            )}

            {/* DECISIONS */}
            <section className="body-desktop-decisions px-9 py-8 border-b border-border-subtle">
                <div className="body-desktop-decisions-header flex items-center gap-3 mb-7">
                    <span className="body-desktop-decisions-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    <span className="body-desktop-decisions-label text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                        Decisions
                    </span>
                    <span className="body-desktop-decisions-count text-xs font-mono text-accent-primary/60">// {decisions.length}</span>
                </div>
                <div className="body-desktop-decisions-list space-y-9">
                    {decisions.map((d, i) => (
                        <DecisionRow
                            key={i}
                            index={i}
                            total={decisions.length}
                            decision={d}
                            onScreenshotClick={() => onScreenshotClick(i)}
                        />
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            {body.process && (
                <section className="body-desktop-process px-9 py-7 border-b border-border-subtle">
                    <PanelLabel>Process</PanelLabel>
                    <p className="body-desktop-process-text text-text-secondary text-sm leading-relaxed max-w-3xl">
                        {body.process}
                    </p>
                </section>
            )}

            {/* OUTCOME */}
            <section className="body-desktop-outcome px-9 py-8">
                <PanelLabel>Outcome</PanelLabel>
                <p className="body-desktop-outcome-text text-text-secondary text-[15px] leading-relaxed max-w-3xl">
                    {body.outcome.summary}
                </p>
            </section>
        </>
    );
}

function BodyMobileView({ body, onScreenshotClick }: { body: CaseStudyBody; onScreenshotClick: (idx: number) => void }) {
    return (
        <>
            <MobileSection label="Brief">
                <div className="body-mobile-brief space-y-4">
                    <div className="body-mobile-brief-block">
                        <SubLabel>Situation</SubLabel>
                        <p className="body-mobile-brief-text text-text-secondary mt-1">{body.brief.situation}</p>
                    </div>
                    <div className="body-mobile-brief-block">
                        <SubLabel>Audience</SubLabel>
                        <p className="body-mobile-brief-text text-text-secondary mt-1">{body.brief.audience}</p>
                    </div>
                    <div className="body-mobile-brief-bottom grid grid-cols-2 gap-x-5 gap-y-4">
                        {body.honest_note && (
                            <div className="body-mobile-honest-note">
                                <SubLabel>Honest note</SubLabel>
                                <p className="text-text-muted text-sm italic leading-relaxed mt-1.5">{body.honest_note}</p>
                            </div>
                        )}
                        <div className="body-mobile-brief-hard">
                            <SubLabel>What made it hard</SubLabel>
                            <p className="text-text-secondary text-sm leading-relaxed mt-1.5">{body.brief.what_made_it_hard[0]}</p>
                        </div>
                    </div>
                </div>
            </MobileSection>

            {body.comparison && body.comparison.builds.length > 0 && (
                <MobileSection label={body.comparison.heading || 'Comparison'}>
                    {body.comparison.intro && (
                        <p className="body-mobile-comparison-intro text-text-secondary mb-5">{body.comparison.intro}</p>
                    )}
                    <ComparisonGrid builds={body.comparison.builds} stacked />
                    <ComparisonDiffTable builds={body.comparison.builds} />
                    {body.comparison.methodology && (
                        <p className="body-mobile-comparison-methodology text-text-muted text-[12px] leading-relaxed mt-4 italic">
                            {body.comparison.methodology}
                        </p>
                    )}
                </MobileSection>
            )}

            <MobileSection label={`Decisions // ${body.decisions.length}`}>
                <div className="body-mobile-decisions-list space-y-7">
                    {body.decisions.map((d, i) => (
                        <DecisionRow
                            key={i}
                            index={i}
                            total={body.decisions.length}
                            decision={d}
                            onScreenshotClick={() => onScreenshotClick(i)}
                            stacked
                        />
                    ))}
                </div>
            </MobileSection>

            {body.process && (
                <MobileSection label="Process">
                    <p className="body-mobile-process-text text-text-secondary">{body.process}</p>
                </MobileSection>
            )}

            <MobileSection label="Outcome">
                <p className="body-mobile-outcome-text text-text-secondary">{body.outcome.summary}</p>
            </MobileSection>
        </>
    );
}

function DecisionRow({
    index,
    total,
    decision,
    onScreenshotClick,
    stacked,
}: {
    index: number;
    total: number;
    decision: CaseStudyBody['decisions'][number];
    onScreenshotClick: () => void;
    stacked?: boolean;
}) {
    const num = String(index + 1).padStart(2, '0');
    const totalStr = String(total).padStart(2, '0');
    return (
        <article className={`decision-row-root ${stacked ? 'flex flex-col gap-4' : 'grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-x-8 gap-y-4 items-start'}`}>
            {/* Screenshot + caption (left column on desktop, top on mobile) */}
            <figure className="decision-row-figure flex flex-col">
                <button
                    onClick={onScreenshotClick}
                    className="decision-row-screenshot-button group relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in block"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={decision.screenshot}
                        alt={decision.caption || decision.title}
                        className="decision-row-screenshot-image w-full h-auto block group-hover:brightness-110 transition-all"
                    />
                </button>
                {decision.caption && (
                    <figcaption className="decision-row-caption mt-2.5 text-xs font-mono text-text-muted leading-relaxed">
                        <span className="decision-row-caption-index text-accent-primary/70 mr-1.5">{num}</span>
                        {decision.caption}
                    </figcaption>
                )}
            </figure>

            {/* Title + single rationale paragraph */}
            <div className="decision-row-text-col">
                <div className="decision-row-eyebrow flex items-center gap-2 mb-2.5">
                    <span className="decision-row-eyebrow-label text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary">
                        Decision {num}
                    </span>
                    <span className="decision-row-eyebrow-total text-[11px] font-mono text-accent-primary/50">/ {totalStr}</span>
                </div>
                <h4 className="decision-row-title text-[19px] md:text-xl font-semibold text-text-primary leading-snug mb-3 tracking-tight">
                    {decision.title}
                </h4>
                <p className="decision-row-rationale text-text-secondary text-sm leading-relaxed">
                    {decision.why}
                </p>
            </div>
        </article>
    );
}

function BriefCol({ label, body }: { label: string; body: string }) {
    return (
        <div className="brief-col-root">
            <SubLabel>{label}</SubLabel>
            <p className="brief-col-text text-text-secondary text-sm leading-relaxed mt-1.5">{body}</p>
        </div>
    );
}

function MetricsCirclesPlain({ metrics }: { metrics: Array<{ label: string; value: string }> }) {
    return <MetricsCircles metrics={metrics} bordered={false} />;
}

function MetricsCircles({ metrics, bordered = true }: { metrics: Array<{ label: string; value: string }>; bordered?: boolean }) {
    // Treat numeric values 0-100 as a fill percentage. Anything that doesn't parse
    // cleanly falls back to a full ring so the visual still reads.
    const RADIUS = 38;
    const CIRC = 2 * Math.PI * RADIUS;
    const wrapperClass = bordered
        ? 'metrics-circles-root grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5 border-t border-border-subtle pt-5'
        : 'metrics-circles-root grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5';
    return (
        <div className={wrapperClass}>
            {metrics.map((m, i) => {
                const num = parseFloat(m.value);
                const pct = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 100;
                const offset = CIRC * (1 - pct / 100);
                return (
                    <div key={i} className="metrics-circles-item flex flex-col items-center text-center gap-2.5">
                        <div className="metrics-circles-ring relative w-[88px] h-[88px]">
                            <svg viewBox="0 0 100 100" className="metrics-circles-svg w-full h-full -rotate-90">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--color-border-subtle, rgba(255,255,255,0.08))"
                                    strokeWidth="6"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--color-accent-primary, #AB7B62)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRC}
                                    initial={{ strokeDashoffset: CIRC }}
                                    whileInView={{ strokeDashoffset: offset }}
                                    viewport={{ once: true, margin: '-10% 0px' }}
                                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </svg>
                            <span className="metrics-circles-value absolute inset-0 flex items-center justify-center text-text-primary text-2xl md:text-[26px] font-semibold tracking-tight tabular-nums">
                                {m.value}
                            </span>
                        </div>
                        <span className="metrics-circles-label text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-text-muted leading-tight max-w-[14ch]">
                            {m.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function parseNumeric(value: string): { num: number; unit: string } | null {
    const match = value.trim().match(/^([0-9]+(?:[.,][0-9]+)?)\s*([A-Za-z%]*)$/);
    if (!match) return null;
    const num = parseFloat(match[1].replace(',', ''));
    if (!Number.isFinite(num)) return null;
    return { num, unit: match[2] };
}

function deltaForExtra(a: string, b: string): { display: string; better: 'a' | 'b' | 'same' } | null {
    const pa = parseNumeric(a);
    const pb = parseNumeric(b);
    if (!pa || !pb || pa.unit !== pb.unit) return null;
    if (pa.num === pb.num) return { display: 'same', better: 'same' };
    // Convert to KB if comparing MB / KB mixed
    const lowerUnitA = pa.unit.toLowerCase();
    const lowerUnitB = pb.unit.toLowerCase();
    let ax = pa.num;
    let bx = pb.num;
    if (lowerUnitA === 'mb') ax *= 1024;
    if (lowerUnitB === 'mb') bx *= 1024;
    if (ax === bx) return { display: 'same', better: 'same' };
    const ratio = bx / ax;
    const better = bx < ax ? 'b' : 'a';
    if (better === 'b') {
        return { display: `${(ratio < 1 ? 1 / ratio : ratio).toFixed(ratio < 0.5 || ratio > 2 ? 1 : 2)}× lighter`, better };
    }
    return { display: `${(1 / ratio).toFixed(2)}× heavier`, better };
}

function ComparisonDiffTable({
    builds,
}: {
    builds: NonNullable<CaseStudyBody['comparison']>['builds'];
}) {
    if (builds.length < 2) return null;
    const [a, b] = builds;
    const lhRows: Array<{ label: string; key: 'performance' | 'accessibility' | 'bestPractices' | 'seo' }> = [
        { label: 'Performance', key: 'performance' },
        { label: 'Accessibility', key: 'accessibility' },
        { label: 'Best Practices', key: 'bestPractices' },
        { label: 'SEO', key: 'seo' },
    ];

    const extraLabels = Array.from(new Set([...(a.extras || []).map(e => e.label), ...(b.extras || []).map(e => e.label)]));
    const aExtra = (label: string) => a.extras?.find(e => e.label === label)?.value;
    const bExtra = (label: string) => b.extras?.find(e => e.label === label)?.value;

    const headerCell = 'comparison-diff-th text-text-muted text-[11px] font-mono uppercase tracking-[0.14em] py-2.5 px-3 text-left';
    const cell = 'comparison-diff-td text-text-primary text-[13px] py-2.5 px-3 tabular-nums';

    return (
        <div className="comparison-diff-wrap mt-7 border border-border-subtle rounded-xl overflow-hidden bg-bg-elevated">
            <table className="comparison-diff-table w-full border-collapse text-left">
                <thead>
                    <tr className="bg-bg-elevated-alt">
                        <th className={headerCell}>Metric</th>
                        <th className={headerCell}>{a.label}</th>
                        <th className={headerCell}>{b.label}</th>
                        <th className={headerCell}>Improvement</th>
                    </tr>
                </thead>
                <tbody>
                    {lhRows.map((row, i) => {
                        const av = a.lighthouse[row.key];
                        const bv = b.lighthouse[row.key];
                        const diff = bv - av;
                        const better = diff === 0 ? 'same' : diff > 0 ? 'b' : 'a';
                        const zebra = i % 2 === 1 ? 'bg-bg-elevated-alt/60' : '';
                        return (
                            <tr key={row.key} className={`border-t border-border-subtle ${zebra}`}>
                                <td className={`${cell} text-text-secondary`}>{row.label}</td>
                                <td className={`${cell} ${better === 'a' ? 'text-accent-primary font-medium' : ''}`}>{av}</td>
                                <td className={`${cell} ${better === 'b' ? 'text-accent-primary font-medium' : ''}`}>{bv}</td>
                                <td className={`${cell} text-text-muted`}>
                                    {diff === 0 ? '-' : `${diff > 0 ? '+' : ''}${diff} pts`}
                                </td>
                            </tr>
                        );
                    })}
                    {extraLabels.map((label, i) => {
                        const av = aExtra(label);
                        const bv = bExtra(label);
                        if (!av || !bv) return null;
                        const d = deltaForExtra(av, bv);
                        const zebra = (lhRows.length + i) % 2 === 1 ? 'bg-bg-elevated-alt/60' : '';
                        return (
                            <tr key={`extra-${label}`} className={`border-t border-border-subtle ${zebra}`}>
                                <td className={`${cell} text-text-secondary`}>{label}</td>
                                <td className={`${cell} ${d?.better === 'a' ? 'text-accent-primary font-medium' : ''}`}>{av}</td>
                                <td className={`${cell} ${d?.better === 'b' ? 'text-accent-primary font-medium' : ''}`}>{bv}</td>
                                <td className={`${cell} text-text-muted`}>{d ? d.display : '-'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function ComparisonGrid({
    builds,
    stacked = false,
}: {
    builds: NonNullable<CaseStudyBody['comparison']>['builds'];
    stacked?: boolean;
}) {
    const gridClass = stacked
        ? 'comparison-grid grid grid-cols-1 gap-7'
        : 'comparison-grid grid grid-cols-1 lg:grid-cols-2 gap-7 lg:grid-rows-[auto_auto_auto]';
    return (
        <div className={gridClass}>
            {builds.map((b, i) => {
                const lh = [
                    { label: 'Performance', value: String(b.lighthouse.performance) },
                    { label: 'Accessibility', value: String(b.lighthouse.accessibility) },
                    { label: 'Best Practices', value: String(b.lighthouse.bestPractices) },
                    { label: 'SEO', value: String(b.lighthouse.seo) },
                ];
                return (
                    <div
                        key={i}
                        className="comparison-card relative border border-border-subtle rounded-xl bg-bg-elevated shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] grid grid-rows-[auto_auto_auto] lg:grid-rows-subgrid lg:row-span-3 overflow-hidden"
                    >
                        {b.href && (
                            <a
                                href={b.href}
                                target={b.href.startsWith('http') ? '_blank' : undefined}
                                rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="comparison-card-link absolute top-5 right-5 md:top-6 md:right-6 inline-flex items-center gap-2 px-3.5 py-2 [background-color:var(--cta-bg)] [color:var(--cta-fg)] hover:brightness-110 [border-color:var(--cta-bg)] border rounded-sm font-semibold uppercase tracking-[0.08em] transition-all text-sm font-karla-ui whitespace-nowrap z-[2]"
                            >
                                View <ExternalLink size={12} />
                            </a>
                        )}
                        <header className="comparison-card-head px-5 md:px-6 pt-5 md:pt-6 pb-5 pr-24 border-b border-border-subtle">
                            <h4 className="comparison-card-label text-text-primary text-base md:text-lg font-semibold tracking-tight">
                                {b.label}
                            </h4>
                            {b.note && (
                                <p className="comparison-card-note text-text-muted text-[13px] leading-relaxed mt-1.5 max-w-md">
                                    {b.note}
                                </p>
                            )}
                        </header>
                        <div className="comparison-card-body px-5 md:px-6 py-6 bg-bg-elevated-alt/60 flex items-center">
                            <div className="w-full">
                                <MetricsCirclesPlain metrics={lh} />
                            </div>
                        </div>
                        <footer className="comparison-card-foot px-5 md:px-6 py-5 border-t border-border-subtle">
                            {b.extras && b.extras.length > 0 ? (
                                <dl className="comparison-card-extras grid grid-cols-2 gap-x-4 gap-y-2.5">
                                    {b.extras.map((e, j) => (
                                        <div key={j} className="comparison-card-extras-row flex items-baseline justify-between gap-3">
                                            <dt className="comparison-card-extras-label text-text-muted text-[11px] font-mono uppercase tracking-[0.14em]">
                                                {e.label}
                                            </dt>
                                            <dd className="comparison-card-extras-value text-text-primary text-[13px] font-medium tabular-nums">
                                                {e.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            ) : (
                                <span className="text-text-muted text-[12px] font-mono uppercase tracking-[0.14em]">No extras</span>
                            )}
                        </footer>
                    </div>
                );
            })}
        </div>
    );
}

function MetricsRow({ metrics }: { metrics: Array<{ label: string; value: string }> }) {
    const cols = Math.min(metrics.length, 4);
    const colsClass =
        cols === 1 ? 'grid-cols-1'
        : cols === 2 ? 'grid-cols-2'
        : cols === 3 ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-2 sm:grid-cols-4';
    return (
        <div className={`metrics-row-root grid ${colsClass} gap-y-5 gap-x-6 border-t border-border-subtle pt-5`}>
            {metrics.map((m, i) => (
                <div key={i} className="metrics-row-item flex flex-col gap-1.5">
                    <span className="metrics-row-value text-text-primary text-3xl md:text-[34px] font-semibold tracking-tight leading-none">
                        {m.value}
                    </span>
                    <span className="metrics-row-label text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
                        {m.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="sub-label-root text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim block">
            {children}
        </span>
    );
}

// --- Console panel (legacy 3-col layout) ---

function ConsolePanel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="console-panel-root flex flex-col md:min-h-0 bg-bg-secondary/40">
            <div className="console-panel-header flex-shrink-0 px-7 py-3.5 border-b border-border-subtle flex items-center gap-2">
                <span className="console-panel-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="console-panel-label text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                    {label}
                </span>
            </div>
            <div className="console-panel-body md:flex-1 md:min-h-0 md:overflow-y-auto px-7 py-5 hud-scroll">
                {children}
            </div>
        </div>
    );
}

function MobileSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mobile-section-root px-7 py-5 border-t border-border-subtle">
            <div className="mobile-section-header flex items-baseline gap-3 mb-4">
                <span className="mobile-section-rule block h-px w-6 bg-text-dim translate-y-[-0.35em]" />
                <span className="mobile-section-label font-serif italic font-normal text-text-primary text-lg leading-none">
                    {label}
                </span>
            </div>
            <div className="mobile-section-body text-text-secondary text-base leading-relaxed">{children}</div>
        </div>
    );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="panel-label-root flex items-baseline gap-3 mb-5">
            <span className="panel-label-rule block h-px w-8 bg-text-dim translate-y-[-0.35em]" />
            <span className="panel-label-text font-serif italic font-normal text-text-primary text-xl md:text-2xl leading-none">
                {children}
            </span>
        </div>
    );
}

// --- Lightbox ---

function Lightbox({
    images,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}: {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    const [scale, setScale] = useState(1);
    const src = images[currentIndex];

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = -e.deltaY;
        const speed = 0.002;
        const newScale = scale + delta * speed;
        setScale(Math.min(Math.max(1, newScale), 4));
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale((prev) => (prev > 1 ? 1 : 2.5));
    };

    const dragTransition: any = { type: 'spring', damping: 30, stiffness: 200 };
    const onDragEndList = (_e: any, { offset, velocity }: any) => {
        if (scale > 1) return;
        const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
        if (swipe) {
            if (offset.x > 0) onPrev();
            else onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-root fixed inset-0 z-[140] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden touch-none"
            onClick={onClose}
            onWheel={handleWheel}
        >
            <button
                className="lightbox-close-button absolute top-6 right-6 z-[150] text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <button
                className="lightbox-prev-button hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                    setScale(1);
                }}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="lightbox-next-button hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                    setScale(1);
                }}
            >
                <ChevronRight size={24} />
            </button>

            <div className="lightbox-counter absolute bottom-8 left-1/2 -translate-x-1/2 z-[150] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-white/70 text-sm font-mono tracking-widest">
                {currentIndex + 1} / {images.length}
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lightbox-stage relative w-full h-full flex items-center justify-center"
                drag={scale === 1 ? 'x' : true}
                dragConstraints={
                    scale === 1
                        ? { left: 0, right: 0 }
                        : { left: -1000 * scale, right: 1000 * scale, top: -800 * scale, bottom: 800 * scale }
                }
                dragElastic={scale === 1 ? 0.2 : 0.1}
                onDragEnd={scale === 1 ? onDragEndList : undefined}
                style={{ scale }}
                transition={dragTransition}
                onDoubleClick={handleDoubleClick}
            >
                <div className="lightbox-frame relative w-full max-w-7xl h-full p-4 flex items-center justify-center pointer-events-none">
                    <img
                        src={src}
                        alt="Project Gallery"
                        className="lightbox-image max-w-full max-h-[80vh] object-contain select-none shadow-2xl drop-shadow-2xl pointer-events-auto rounded-lg"
                        draggable={false}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
