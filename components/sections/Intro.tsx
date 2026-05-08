'use client';

import FadeIn from '../motion/FadeIn';

export default function Intro() {
    return (
        <section className="intro-section bg-bg-primary pt-32 pb-24">
            <div className="intro-container max-w-6xl mx-auto px-6">
                <FadeIn>
                    <div className="intro-header flex flex-col lg:flex-row gap-16 items-start justify-between">
                        <h2 className="intro-heading text-3xl md:text-5xl font-bold tracking-tight leading-tight flex-1">
                            <span className="intro-heading-dim text-text-dim">Your customers decide in </span>
                            <span className="intro-heading-emphasis text-text-primary">seconds.</span>
                            <br />
                            <span className="intro-heading-dim text-text-dim">Your website should make it </span>
                            <span className="intro-heading-emphasis text-text-primary">easy.</span>
                        </h2>

                        <div className="intro-lede flex-1 max-w-lg pt-2">
                            <p className="intro-lede-body text-xl text-text-muted leading-relaxed mb-8 text-balance">
                                Ex-big-tech product designer who now partners with small businesses, founders, and agencies. I design and build sites that hit your numbers - UI/UX that converts, SEO that ranks, and CRO baked in from the first wireframe.
                            </p>
                            <div className="intro-divider h-px w-24 bg-accent-primary mb-8" />
                            <p className="intro-lede-tags text-sm font-mono text-text-dim uppercase tracking-widest">
                                UI / UX • Web Design • Development
                            </p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
