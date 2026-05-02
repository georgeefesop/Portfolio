'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

    // Lock body scroll while modal is open
    useEffect(() => {
        if (!project) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
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
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md"
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Faint grid texture overlay (HUD vibe) */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.06]"
                        style={{
                            backgroundImage:
                                'linear-gradient(to right, rgba(171,123,98,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(171,123,98,0.6) 1px, transparent 1px)',
                            backgroundSize: '48px 48px',
                        }}
                    />

                    {/* Scan beam - smooth glowing sweep on open */}
                    <motion.div
                        initial={{ y: '-25vh', opacity: 0 }}
                        animate={{ y: '125vh', opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            y: { duration: 0.55, ease: 'linear', delay: 0.05 },
                            opacity: { duration: 0.15, delay: 0.05 },
                        }}
                        className="pointer-events-none absolute left-0 right-0 z-[5] will-change-transform"
                        style={{ height: '220px', top: 0 }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to bottom, transparent 0%, rgba(171,123,98,0.04) 35%, rgba(171,123,98,0.18) 70%, rgba(171,123,98,0.55) 92%, rgba(171,123,98,0.85) 100%)',
                            }}
                        />
                        <div
                            className="absolute left-0 right-0 bottom-0 h-[2px]"
                            style={{
                                background: 'var(--accent-primary)',
                                boxShadow:
                                    '0 0 8px 1px rgba(171,123,98,0.9), 0 0 22px 3px rgba(171,123,98,0.55), 0 0 50px 8px rgba(171,123,98,0.25)',
                            }}
                        />
                    </motion.div>

                    {/* MOBILE: dedicated single-column readable layout */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden relative z-[10] w-full max-h-[92vh] flex flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-15px_rgba(171,123,98,0.4)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted bg-bg-tertiary/60 backdrop-blur-md border border-border-subtle"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>

                        <div className="overflow-y-auto hud-scroll flex-1">
                            {/* Hero image */}
                            <div className="relative aspect-[16/10] w-full bg-bg-secondary">
                                <ImageWithFallback
                                    src={project.images.hero}
                                    alt={project.title}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary via-bg-secondary/40 to-transparent" />
                            </div>

                            {/* Title block */}
                            <div className="px-7 -mt-10 pb-5 relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="relative inline-flex w-1.5 h-1.5">
                                        <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                        <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    </span>
                                    <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                        Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-2 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-text-muted text-base font-light leading-snug mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="bg-bg-tertiary/40 px-2 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-border-subtle">
                                    <div>
                                        <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                                        <span className="text-text-secondary">{project.role}</span>
                                    </div>
                                    <div>
                                        <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                                        <span className="text-text-secondary">{project.period}</span>
                                    </div>
                                </div>
                                {project.body?.honest_note && (
                                    <div className="mt-4">
                                        <SubLabel>Honest note</SubLabel>
                                        <p className="text-text-muted text-sm italic leading-relaxed mt-2">
                                            {project.body.honest_note}
                                        </p>
                                    </div>
                                )}
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
                                        <ul className="space-y-3">
                                            {project.description.work.map((item, i) => (
                                                <li key={i} className="flex gap-2.5">
                                                    <span className="text-accent-primary flex-shrink-0">▸</span>
                                                    <span>{item}</span>
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
                                <div className="px-7 pb-5">
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-sm font-semibold transition-colors text-xs uppercase tracking-widest font-mono"
                                    >
                                        View live <ExternalLink size={12} />
                                    </a>
                                </div>
                            )}

                            {/* Legacy gallery only when no body schema */}
                            {!project.body && (
                                <div className="border-t border-border-subtle bg-bg-tertiary/30">
                                    <div className="px-7 py-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                        <span>Gallery</span>
                                        <span className="text-accent-primary/60">// {galleryImages.length}</span>
                                    </div>
                                    <div className="px-7 pb-6 flex flex-col gap-3">
                                        {galleryImages.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-bg-tertiary border border-border-subtle"
                                            >
                                                <ImageWithFallback
                                                    src={img}
                                                    alt={`${project.title} screenshot ${idx + 1}`}
                                                    fill
                                                    sizes="100vw"
                                                    className="object-cover"
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
                            className="hidden md:flex relative z-[10] w-full max-w-[1280px] md:max-h-[92vh] lg:h-[88vh] lg:max-h-none flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-text-primary bg-bg-tertiary/50 hover:bg-bg-tertiary/70 backdrop-blur-md border border-border-subtle transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                            <div className="flex-1 min-h-0 overflow-y-auto hud-scroll">
                                <BodyIntro project={project} />
                                <BodyDesktopView
                                    body={project.body}
                                    onScreenshotClick={(i) => setLightboxIndex(i)}
                                />
                            </div>
                        </motion.div>
                    ) : (
                    <div
                        className="hidden md:flex relative z-[10] w-full max-w-[1500px] md:flex-col md:max-h-[92vh] md:gap-4 md:overflow-y-auto lg:flex-row lg:h-[88vh] lg:max-h-none lg:gap-0 lg:overflow-visible md:items-stretch hud-scroll"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Floating identity panel */}
                        <motion.aside
                            initial={{ opacity: 0, x: -28, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.97 }}
                            transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="md:w-full lg:w-[360px] lg:flex-shrink-0 bg-bg-secondary/95 backdrop-blur-md border border-border-subtle rounded-md flex flex-col overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.45)]"
                        >
                            <div className="flex-shrink-0 px-7 pt-5 pb-3.5 border-b border-border-subtle flex items-center gap-2 bg-bg-tertiary/40">
                                <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                                    <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                    <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                </span>
                                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                    Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                </span>
                            </div>

                            <div className="flex-shrink-0 px-7 pt-5 pb-5">
                                <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-1.5 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-text-muted text-sm font-light leading-snug mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="bg-bg-tertiary/40 px-2 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-border-subtle">
                                    <div>
                                        <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                                        <span className="text-text-secondary">{project.role}</span>
                                    </div>
                                    <div>
                                        <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                                        <span className="text-text-secondary">{project.period}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Identity-card scroll body: legacy overview only.
                                Body-mode entries carry the brief in the main reading panel,
                                so the identity card stays sparse. */}
                            {project.description?.overview ? (
                                <div className="md:flex-1 md:min-h-0 md:overflow-y-auto px-7 pb-6 hud-scroll">
                                    <PanelLabel>Overview</PanelLabel>
                                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                        {project.description.overview}
                                    </div>
                                </div>
                            ) : (
                                <div className="md:flex-1 md:min-h-0" />
                            )}

                            {project.links.live && (
                                <div className="flex-shrink-0 px-7 py-4 border-t border-border-subtle bg-bg-tertiary/30">
                                    <a
                                        href={project.links.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-sm font-semibold transition-colors text-xs uppercase tracking-widest font-mono"
                                    >
                                        View live <ExternalLink size={12} />
                                    </a>
                                </div>
                            )}
                        </motion.aside>

                        {/* Main reading panel */}
                        <motion.div
                            initial={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.97 }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1 }}
                            exit={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex-1 min-w-0 flex flex-col bg-bg-secondary border border-border-subtle rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-text-primary bg-bg-tertiary/50 hover:bg-bg-tertiary/70 backdrop-blur-md border border-border-subtle transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>

                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.35 }}
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                {project.description ? (
                                    <>
                                        <div className="flex-1 min-h-0 grid md:grid-cols-3 grid-rows-[auto] divide-y md:divide-y-0 md:divide-x divide-border-subtle">
                                            <ConsolePanel label="The Challenge">
                                                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                                    {project.description.challenge}
                                                </p>
                                            </ConsolePanel>
                                            <ConsolePanel label="The Work">
                                                <ul className="space-y-2.5">
                                                    {project.description.work.map((item, i) => (
                                                        <li key={i} className="text-text-secondary text-sm leading-relaxed flex gap-2">
                                                            <span className="text-accent-primary flex-shrink-0">▸</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </ConsolePanel>
                                            <ConsolePanel label="The Outcome">
                                                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                                    {project.description.outcome}
                                                </p>
                                            </ConsolePanel>
                                        </div>

                                        {/* Bottom gallery strip - legacy only */}
                                        <div className="flex-shrink-0 border-t border-border-subtle bg-bg-tertiary/30">
                                            <div className="px-7 py-2.5 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                                <span>Gallery</span>
                                                <span className="text-accent-primary/60">// {galleryImages.length}</span>
                                            </div>
                                            <div
                                                className="px-7 pb-5 flex gap-3 overflow-x-auto overflow-y-hidden hud-scroll"
                                                style={{
                                                    maskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                                    WebkitMaskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                                }}
                                            >
                                                {galleryImages.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setLightboxIndex(idx)}
                                                        className="relative flex-shrink-0 w-[232px] aspect-[4/3] rounded-sm overflow-hidden bg-bg-tertiary cursor-zoom-in hover:brightness-110 transition-all border border-border-subtle hover:border-accent-primary/40"
                                                    >
                                                        <ImageWithFallback
                                                            src={img}
                                                            alt={`${project.title} screenshot ${idx + 1}`}
                                                            fill
                                                            sizes="232px"
                                                            className="object-cover"
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
        <section className="px-9 pt-7 pb-7 border-b border-border-subtle">
            <div className="flex items-center gap-2 mb-5">
                <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                    <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                    <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                    Case File · {project.id.toUpperCase().replace(/-/g, '_')}
                </span>
            </div>
            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-x-8 gap-y-6 items-start">
                <div className="flex flex-col gap-5 order-2 md:order-1">
                    <div>
                        <h3 className="text-3xl md:text-[34px] font-semibold text-text-primary tracking-tight leading-[1.1] mb-3">
                            {project.title}
                        </h3>
                        <p className="text-text-muted text-[15px] font-light leading-relaxed max-w-2xl">
                            {project.subtitle}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-xs text-text-muted max-w-md">
                        <div>
                            <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                            <span className="text-text-secondary">{project.role}</span>
                        </div>
                        <div>
                            <span className="block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                            <span className="text-text-secondary">{project.period}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 pt-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            {project.tags.map((tag) => (
                                <span key={tag} className="bg-bg-tertiary/40 px-2 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-subtle">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {project.links.live && (
                            <a
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary rounded-sm font-semibold transition-colors text-xs uppercase tracking-widest font-mono"
                            >
                                View live <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                </div>
                <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2">
                    <ImageWithFallback
                        src={project.images.hero}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 340px, 100vw"
                        className="object-cover"
                    />
                </div>
            </div>
            {project.body?.outcome?.metrics && project.body.outcome.metrics.length > 0 && (
                <div className="mt-7">
                    <MetricsCircles metrics={project.body.outcome.metrics} />
                </div>
            )}
            {project.body?.honest_note && (
                <div className="mt-6 pt-5 border-t border-border-subtle">
                    <SubLabel>Honest note</SubLabel>
                    <p className="text-text-muted text-sm italic leading-relaxed mt-2 max-w-3xl">
                        {project.body.honest_note}
                    </p>
                </div>
            )}
        </section>
    );
}

// --- Body schema desktop view ---

function BodyDesktopView({ body, onScreenshotClick }: { body: CaseStudyBody; onScreenshotClick: (idx: number) => void }) {
    const decisions = body.decisions;
    return (
        <>
            {/* BRIEF */}
            <section className="px-9 pt-8 pb-9 border-b border-border-subtle">
                <PanelLabel>Brief</PanelLabel>
                <div className="grid lg:grid-cols-2 gap-x-10 gap-y-5 mb-6">
                    <BriefCol label="Situation" body={body.brief.situation} />
                    <BriefCol label="Audience" body={body.brief.audience} />
                </div>
                <div>
                    <SubLabel>What made it hard</SubLabel>
                    <ul className="mt-3 max-w-3xl">
                        {body.brief.what_made_it_hard.map((item, i) => (
                            <li key={i} className="flex gap-3 text-text-secondary text-sm leading-relaxed py-2.5 border-t border-border-subtle/60 first:border-t">
                                <span className="text-accent-primary/80 font-mono text-[11px] pt-1 select-none">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* DECISIONS */}
            <section className="px-9 py-8 border-b border-border-subtle">
                <div className="flex items-center gap-3 mb-7">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    <span className="text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                        Decisions
                    </span>
                    <span className="text-xs font-mono text-accent-primary/60">// {decisions.length}</span>
                </div>
                <div className="space-y-9">
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
                <section className="px-9 py-7 border-b border-border-subtle">
                    <PanelLabel>Process</PanelLabel>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
                        {body.process}
                    </p>
                </section>
            )}

            {/* OUTCOME */}
            <section className="px-9 py-8">
                <PanelLabel>Outcome</PanelLabel>
                <p className="text-text-secondary text-[15px] leading-relaxed max-w-3xl">
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
                <div className="space-y-4">
                    <div>
                        <SubLabel>Situation</SubLabel>
                        <p className="text-text-secondary mt-1">{body.brief.situation}</p>
                    </div>
                    <div>
                        <SubLabel>Audience</SubLabel>
                        <p className="text-text-secondary mt-1">{body.brief.audience}</p>
                    </div>
                    <div>
                        <SubLabel>What made it hard</SubLabel>
                        <ul className="mt-2 space-y-2">
                            {body.brief.what_made_it_hard.map((item, i) => (
                                <li key={i} className="flex gap-2.5 text-text-secondary text-sm leading-relaxed py-1.5 border-t border-border-subtle/60">
                                    <span className="text-accent-primary/80 font-mono text-[11px] pt-0.5">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </MobileSection>

            <MobileSection label={`Decisions // ${body.decisions.length}`}>
                <div className="space-y-7">
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
                    <p className="text-text-secondary">{body.process}</p>
                </MobileSection>
            )}

            <MobileSection label="Outcome">
                <p className="text-text-secondary">{body.outcome.summary}</p>
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
        <article className={stacked ? 'flex flex-col gap-4' : 'grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-x-8 gap-y-4 items-start'}>
            {/* Screenshot + caption (left column on desktop, top on mobile) */}
            <figure className="flex flex-col">
                <button
                    onClick={onScreenshotClick}
                    className="group relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in"
                >
                    <ImageWithFallback
                        src={decision.screenshot}
                        alt={decision.caption || decision.title}
                        fill
                        sizes="(min-width: 1024px) 760px, 100vw"
                        className="object-cover group-hover:brightness-110 transition-all"
                    />
                </button>
                {decision.caption && (
                    <figcaption className="mt-2.5 text-xs font-mono text-text-muted leading-relaxed">
                        <span className="text-accent-primary/70 mr-1.5">{num}</span>
                        {decision.caption}
                    </figcaption>
                )}
            </figure>

            {/* Title + single rationale paragraph */}
            <div>
                <div className="flex items-baseline gap-2 mb-2.5">
                    <span className="font-serif italic font-normal text-accent-primary text-base md:text-lg leading-none">
                        {num}
                    </span>
                    <span className="text-text-dim text-xs font-mono">/ {totalStr}</span>
                </div>
                <h4 className="font-serif italic font-normal text-text-primary text-2xl md:text-3xl leading-tight mb-3 tracking-tight">
                    {decision.title}
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                    {decision.why}
                </p>
            </div>
        </article>
    );
}

function BriefCol({ label, body }: { label: string; body: string }) {
    return (
        <div>
            <SubLabel>{label}</SubLabel>
            <p className="text-text-secondary text-sm leading-relaxed mt-1.5">{body}</p>
        </div>
    );
}

function MetricsCircles({ metrics }: { metrics: Array<{ label: string; value: string }> }) {
    // Treat numeric values 0-100 as a fill percentage. Anything that doesn't parse
    // cleanly falls back to a full ring so the visual still reads.
    const RADIUS = 38;
    const CIRC = 2 * Math.PI * RADIUS;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-5 border-t border-border-subtle pt-5">
            {metrics.map((m, i) => {
                const num = parseFloat(m.value);
                const pct = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 100;
                const offset = CIRC * (1 - pct / 100);
                return (
                    <div key={i} className="flex flex-col items-center text-center gap-2.5">
                        <div className="relative w-[88px] h-[88px]">
                            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
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
                            <span className="absolute inset-0 flex items-center justify-center text-text-primary text-2xl md:text-[26px] font-semibold tracking-tight tabular-nums">
                                {m.value}
                            </span>
                        </div>
                        <span className="text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-text-muted leading-tight max-w-[14ch]">
                            {m.label}
                        </span>
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
        <div className={`grid ${colsClass} gap-y-5 gap-x-6 border-t border-border-subtle pt-5`}>
            {metrics.map((m, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                    <span className="text-text-primary text-3xl md:text-[34px] font-semibold tracking-tight leading-none">
                        {m.value}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
                        {m.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim block">
            {children}
        </span>
    );
}

// --- Console panel (legacy 3-col layout) ---

function ConsolePanel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:min-h-0 bg-bg-secondary/40">
            <div className="flex-shrink-0 px-7 py-3.5 border-b border-border-subtle flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                    {label}
                </span>
            </div>
            <div className="md:flex-1 md:min-h-0 md:overflow-y-auto px-7 py-5 hud-scroll">
                {children}
            </div>
        </div>
    );
}

function MobileSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="px-7 py-5 border-t border-border-subtle">
            <div className="flex items-baseline gap-3 mb-4">
                <span className="block h-px w-6 bg-accent-primary translate-y-[-0.35em]" />
                <span className="font-serif italic font-normal text-accent-primary text-lg leading-none">
                    {label}
                </span>
            </div>
            <div className="text-text-secondary text-base leading-relaxed">{children}</div>
        </div>
    );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-baseline gap-3 mb-5">
            <span className="block h-px w-8 bg-accent-primary translate-y-[-0.35em]" />
            <span className="font-serif italic font-normal text-accent-primary text-xl md:text-2xl leading-none">
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
            className="fixed inset-0 z-[140] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden touch-none"
            onClick={onClose}
            onWheel={handleWheel}
        >
            <button
                className="absolute top-6 right-6 z-[150] text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <button
                className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                    setScale(1);
                }}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                    setScale(1);
                }}
            >
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[150] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-white/70 text-sm font-mono tracking-widest">
                {currentIndex + 1} / {images.length}
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="relative w-full h-full flex items-center justify-center"
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
                <div className="relative w-full max-w-7xl h-full p-4 flex items-center justify-center pointer-events-none">
                    <img
                        src={src}
                        alt="Project Gallery"
                        className="max-w-full max-h-[80vh] object-contain select-none shadow-2xl drop-shadow-2xl pointer-events-auto rounded-lg"
                        draggable={false}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}
