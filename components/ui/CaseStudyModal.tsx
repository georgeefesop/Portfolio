'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

interface CaseStudyData {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    aiBuilt?: boolean;
    description: {
        overview?: string;
        challenge: string;
        work: string[];
        outcome: string;
    };
    links: {
        live?: string;
        behance?: string;
    };
    images: {
        thumbnail: string;
        hero: string;
        gallery: string[];
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
                    className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
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
                        {/* Soft fading trail */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    'linear-gradient(to bottom, transparent 0%, rgba(171,123,98,0.04) 35%, rgba(171,123,98,0.18) 70%, rgba(171,123,98,0.55) 92%, rgba(171,123,98,0.85) 100%)',
                            }}
                        />
                        {/* Bright leading edge with multi-layer glow */}
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
                        className="md:hidden relative z-[10] w-full max-h-[92vh] flex flex-col bg-zinc-950 border border-white/10 rounded-md overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-15px_rgba(171,123,98,0.4)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted bg-black/60 backdrop-blur-md border border-white/10"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>

                        <div className="overflow-y-auto hud-scroll flex-1">
                            {/* Hero image */}
                            <div className="relative aspect-[16/10] w-full bg-zinc-900">
                                <ImageWithFallback
                                    src={project.images.hero}
                                    alt={project.title}
                                    fill
                                    sizes="100vw"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                            </div>

                            {/* Title block */}
                            <div className="px-10 -mt-10 pb-5 relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="relative inline-flex w-1.5 h-1.5">
                                        <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                        <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    </span>
                                    <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                        Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-white tracking-tight mb-2 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-text-muted text-base font-light leading-snug mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono text-text-dim border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-white/5">
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

                            {project.links.live && (
                                <div className="px-10 pb-5">
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

                            <div className="border-t border-white/5 bg-black/30">
                                <div className="px-10 py-3 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                    <span>Gallery</span>
                                    <span className="text-accent-primary/60">// {project.images.gallery.length}</span>
                                </div>
                                <div className="px-10 pb-6 flex flex-col gap-3">
                                    {project.images.gallery.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setLightboxIndex(idx)}
                                            className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-bg-tertiary border border-white/5"
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
                        </div>
                    </motion.div>

                    {/* DESKTOP: floating identity card (sibling, outside the modal) + main modal */}
                    <div
                        className="hidden md:flex relative z-[10] w-full max-w-[1500px] md:h-[88vh] md:flex-row md:gap-5 md:items-stretch"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Floating identity panel - distinct card outside the modal */}
                        <motion.aside
                            initial={{ opacity: 0, x: -28, scale: 0.97 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.97 }}
                            transition={{ duration: 0.55, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            className="md:w-[360px] md:flex-shrink-0 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-md flex flex-col overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.45)]"
                        >
                            {/* Identity HUD strip */}
                            <div className="flex-shrink-0 px-7 pt-5 pb-3.5 border-b border-white/5 flex items-center gap-2 bg-black/40">
                                <span className="relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                                    <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                                    <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                </span>
                                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                                    Case File · {project.id.toUpperCase().replace(/-/g, '_').slice(0, 14)}
                                </span>
                            </div>

                            {/* Title block */}
                            <div className="flex-shrink-0 px-7 pt-5 pb-5">
                                <h3 className="text-2xl font-bold text-white tracking-tight mb-1.5 leading-tight">
                                    {project.title}
                                </h3>
                                <p className="text-text-muted text-sm font-light leading-snug mb-4">
                                    {project.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono text-text-dim border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-3 font-mono text-xs text-text-muted pb-4 border-b border-white/5">
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

                            {/* Overview scroll region */}
                            {project.description.overview && (
                                <div className="md:flex-1 md:min-h-0 md:overflow-y-auto px-7 pb-6 hud-scroll">
                                    <PanelLabel>Overview</PanelLabel>
                                    <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                                        {project.description.overview}
                                    </div>
                                </div>
                            )}

                            {project.links.live && (
                                <div className="flex-shrink-0 px-7 py-4 border-t border-white/5 bg-black/30">
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

                        {/* Main modal panel */}
                        <motion.div
                            initial={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.97 }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 6px)', opacity: 1, scale: 1 }}
                            exit={{ clipPath: 'inset(48% 2% 48% 2% round 6px)', opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="relative flex-1 min-w-0 flex flex-col bg-zinc-950 border border-white/10 rounded-md overflow-hidden shadow-[0_24px_70px_-15px_rgba(0,0,0,0.7),0_0_50px_-15px_rgba(171,123,98,0.4)]"
                        >
                            <CornerBrackets />

                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 z-30 p-2 rounded-sm text-text-muted hover:text-white bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>

                            {/* Body */}
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.35 }}
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                {/* 3-col grid: Challenge / Work / Outcome */}
                                <div className="flex-1 min-h-0 grid md:grid-cols-3 grid-rows-[auto] divide-y md:divide-y-0 md:divide-x divide-white/5">
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

                                {/* Gallery - full width across the bottom of the modal panel */}
                                <div className="flex-shrink-0 border-t border-white/5 bg-black/30">
                                    <div className="px-7 py-2.5 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-text-muted">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                                        <span>Gallery</span>
                                        <span className="text-accent-primary/60">// {project.images.gallery.length}</span>
                                    </div>
                                    <div
                                        className="px-7 pb-5 flex gap-3 overflow-x-auto overflow-y-hidden hud-scroll"
                                        style={{
                                            maskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                            WebkitMaskImage: 'linear-gradient(to right, black 0, black 92%, transparent 100%)',
                                        }}
                                    >
                                        {project.images.gallery.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setLightboxIndex(idx)}
                                                className="relative flex-shrink-0 w-[232px] aspect-[4/3] rounded-sm overflow-hidden bg-bg-tertiary cursor-zoom-in hover:brightness-110 transition-all border border-white/5 hover:border-accent-primary/40"
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
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Lightbox stays inside the same portal so Esc handler is shared */}
                    <AnimatePresence>
                        {lightboxIndex !== null && project && (
                            <Lightbox
                                images={project.images.gallery}
                                currentIndex={lightboxIndex}
                                onClose={() => setLightboxIndex(null)}
                                onNext={() => setLightboxIndex((lightboxIndex + 1) % project.images.gallery.length)}
                                onPrev={() => setLightboxIndex((lightboxIndex - 1 + project.images.gallery.length) % project.images.gallery.length)}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(content, document.body);
}

// --- Console panel: subtle copper label + scrollable body ---

function ConsolePanel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:min-h-0 bg-zinc-950/40">
            <div className="flex-shrink-0 px-7 py-3.5 border-b border-white/5 flex items-center gap-2">
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
        <div className="px-10 py-5 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                    {label}
                </span>
            </div>
            <div className="text-text-secondary text-base leading-relaxed">{children}</div>
        </div>
    );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
            <span className="text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                {children}
            </span>
        </div>
    );
}

// --- HUD corner brackets that draw in after the panel reveals ---

function CornerBrackets() {
    const corners = [
        { pos: 'top-0 left-0', edges: 'border-t border-l', origin: 'origin-top-left' },
        { pos: 'top-0 right-0', edges: 'border-t border-r', origin: 'origin-top-right' },
        { pos: 'bottom-0 left-0', edges: 'border-b border-l', origin: 'origin-bottom-left' },
        { pos: 'bottom-0 right-0', edges: 'border-b border-r', origin: 'origin-bottom-right' },
    ];
    return (
        <>
            {corners.map((c, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
                    className={`pointer-events-none absolute ${c.pos} ${c.edges} ${c.origin} w-5 h-5 border-accent-primary z-10`}
                />
            ))}
        </>
    );
}


// --- Lightbox (lifted from previous drawer, unchanged behaviour) ---

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
