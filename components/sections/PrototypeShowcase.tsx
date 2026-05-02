'use client';

import FadeIn from '../motion/FadeIn';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function PrototypeShowcase() {
    const handleOpen = () => {
        window.dispatchEvent(new CustomEvent('prototype:open'));
    };

    return (
        <section className="prototype-showcase-section bg-bg-primary py-16 md:py-28 scroll-mt-20 overflow-hidden">
            <div className="prototype-showcase-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="prototype-showcase-grid grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Info card - left on lg+, on top on smaller screens */}
                    <FadeIn className="prototype-showcase-info-col lg:col-span-5">
                        <div className="prototype-showcase-info-card bg-bg-secondary p-7 md:p-10 rounded-2xl border border-border-subtle">
                            <span className="prototype-showcase-eyebrow font-serif italic text-text-muted text-lg md:text-xl">
                                Interactive preview
                            </span>
                            <h2 className="prototype-showcase-heading mt-3 font-serif text-h1 leading-[0.95] tracking-tight text-balance">
                                <span className="prototype-showcase-heading-prefix text-text-dim">Try a</span>{' '}
                                <span className="prototype-showcase-heading-accent italic font-normal text-text-primary">real</span>{' '}
                                <span className="prototype-showcase-heading-suffix text-text-dim">prototype.</span>
                            </h2>
                            <div className="prototype-showcase-body mt-6 space-y-4 text-text-secondary text-base leading-relaxed">
                                <p className="prototype-showcase-paragraph">
                                    Prototypes let us test usability before we ship - click flows, swap variants, iterate in days instead of weeks. Decisions get made on real product, not static frames.
                                </p>
                                <p className="prototype-showcase-paragraph">
                                    Start from a Figma file, a brief, or a rough idea. We end up with something you can actually use.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="prototype-showcase-cta mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-primary border border-border-medium hover:border-accent-primary/50 hover:bg-bg-tertiary text-text-primary text-sm font-semibold transition-all"
                            >
                                Open the prototype →
                            </button>
                        </div>
                    </FadeIn>

                    {/* Prototype frame - right on lg+, below on smaller screens */}
                    <FadeIn delay={0.15} className="prototype-showcase-frame-col lg:col-span-7">
                        <button
                            type="button"
                            onClick={handleOpen}
                            aria-label="Open the prototype"
                            className="prototype-showcase-frame group relative block w-full bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden shadow-2xl shadow-black/40 hover:border-accent-primary/40 transition-all duration-500"
                        >
                            {/* Browser chrome */}
                            <div className="prototype-showcase-chrome flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-primary/60">
                                <div className="prototype-showcase-chrome-dots flex gap-1.5">
                                    <span className="prototype-showcase-chrome-dot block w-2.5 h-2.5 rounded-full bg-border-medium" />
                                    <span className="prototype-showcase-chrome-dot block w-2.5 h-2.5 rounded-full bg-border-medium" />
                                    <span className="prototype-showcase-chrome-dot block w-2.5 h-2.5 rounded-full bg-border-medium" />
                                </div>
                                <div className="prototype-showcase-chrome-address-wrap flex-1 flex justify-center">
                                    <div className="prototype-showcase-chrome-address px-3 py-1 bg-bg-secondary rounded-md text-[11px] font-mono text-text-muted tracking-wide">
                                        prototype · pos demo
                                    </div>
                                </div>
                                <span className="prototype-showcase-chrome-key text-text-muted text-[11px] font-mono opacity-50">⌘</span>
                            </div>

                            {/* Screenshot - swaps per theme via .theme-only-{dark,light} */}
                            <div className="prototype-showcase-screenshot-wrap relative aspect-[1504/926] bg-bg-primary">
                                <ImageWithFallback
                                    src="/images/prototype-showcase.png"
                                    alt="POS prototype demo screenshot"
                                    fill
                                    className="prototype-showcase-screenshot prototype-showcase-screenshot-dark theme-only-dark object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                                    sizes="(max-width: 1024px) 100vw, 700px"
                                />
                                <ImageWithFallback
                                    src="/images/light-mode-mvp.png"
                                    alt="POS prototype demo screenshot (light mode)"
                                    fill
                                    className="prototype-showcase-screenshot prototype-showcase-screenshot-light theme-only-light object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                                    sizes="(max-width: 1024px) 100vw, 700px"
                                />

                                {/* Hover overlay with play pill */}
                                <div className="prototype-showcase-hover-overlay absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-500">
                                    <div className="prototype-showcase-play-pill opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-text-primary text-bg-primary text-sm font-semibold shadow-2xl">
                                        <svg className="prototype-showcase-play-icon" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                            <path d="M4 2.5v11l10-5.5L4 2.5z" />
                                        </svg>
                                        Open the prototype
                                    </div>
                                </div>
                            </div>
                        </button>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
