'use client';

import FadeIn from '../motion/FadeIn';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function PrototypeShowcase() {
    const handleOpen = () => {
        window.dispatchEvent(new CustomEvent('prototype:open'));
    };

    return (
        <section className="bg-bg-primary py-12 md:py-24 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                        <span className="text-xs uppercase tracking-wider text-text-muted font-mono mb-4">
                            How I work, demonstrated
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                            Vibe-coded prototypes
                        </h2>
                        <p className="text-text-secondary text-base md:text-lg mb-10">
                            Real, clickable, tweak-able. Not Figma frames.
                        </p>

                        <div className="w-full max-w-3xl mb-10">
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="group relative block w-full aspect-video overflow-hidden bg-bg-secondary rounded-xl border border-border-subtle hover:border-accent-primary/50 transition-all"
                                aria-label="Open the prototype"
                            >
                                <ImageWithFallback
                                    src="/images/prototype-showcase.png"
                                    alt="Interactive POS prototype preview"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="px-6 py-3 rounded-full bg-bg-secondary/90 backdrop-blur-md border border-border-medium text-text-primary text-sm font-medium">
                                        Open the prototype →
                                    </span>
                                </div>
                            </button>
                        </div>

                        <div className="space-y-5 text-text-secondary text-base md:text-lg leading-relaxed text-left max-w-2xl">
                            <p>
                                Every project starts with a working prototype, not a static mockup. AI-assisted development lets us iterate live — swap a flow, test a variant, change a layout — in minutes instead of days.
                            </p>
                            <p>
                                Decisions get made on real product. Feedback loops shorten. Surprises at handoff don&apos;t happen, because there&apos;s no handoff.
                            </p>
                            <p className="text-sm text-text-muted">
                                Click the screen above to play with one I built.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpen}
                            className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-bg-secondary border border-border-subtle hover:border-accent-primary/50 text-text-primary text-sm font-medium transition-all"
                        >
                            Open the prototype →
                        </button>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
