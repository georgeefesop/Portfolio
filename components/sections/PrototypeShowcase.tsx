'use client';

import FadeIn from '../motion/FadeIn';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function PrototypeShowcase() {
    const handleOpen = () => {
        window.dispatchEvent(new CustomEvent('prototype:open'));
    };

    return (
        <section className="bg-bg-primary py-16 md:py-28 scroll-mt-20 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
                        <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
                            How I work, demonstrated
                        </span>
                        <h2 className="mt-4 text-3xl md:text-5xl font-bold text-text-primary tracking-tight text-balance">
                            Real prototypes,
                            <br />
                            not Figma frames.
                        </h2>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <button
                        type="button"
                        onClick={handleOpen}
                        aria-label="Open the prototype"
                        className="group relative block w-full max-w-5xl mx-auto bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden shadow-2xl shadow-black/40 hover:border-accent-primary/40 transition-all duration-500"
                    >
                        {/* Browser chrome */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-primary/60">
                            <div className="flex gap-1.5">
                                <span className="block w-2.5 h-2.5 rounded-full bg-border-medium" />
                                <span className="block w-2.5 h-2.5 rounded-full bg-border-medium" />
                                <span className="block w-2.5 h-2.5 rounded-full bg-border-medium" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-3 py-1 bg-bg-secondary rounded-md text-[11px] font-mono text-text-muted tracking-wide">
                                    prototype · pos demo
                                </div>
                            </div>
                            <span className="text-text-muted text-[11px] font-mono opacity-50">⌘</span>
                        </div>

                        {/* Screenshot */}
                        <div className="relative aspect-[1504/926] bg-bg-primary">
                            <ImageWithFallback
                                src="/images/prototype-showcase.png"
                                alt="POS prototype demo screenshot"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                            />

                            {/* Hover overlay with play pill */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-500">
                                <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-text-primary text-bg-primary text-sm font-semibold shadow-2xl">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                                        <path d="M4 2.5v11l10-5.5L4 2.5z" />
                                    </svg>
                                    Open the prototype
                                </div>
                            </div>
                        </div>
                    </button>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="mt-10 md:mt-14 max-w-2xl mx-auto space-y-5 text-center text-text-secondary text-base md:text-lg leading-relaxed">
                        <p>
                            Every project starts with a working prototype. AI-assisted dev lets me iterate live — swap a flow, test a variant, change a layout — in minutes instead of days.
                        </p>
                        <p>
                            Decisions get made on real product. No surprises at handoff, because there is no handoff.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
