'use client';

import FadeIn from '../motion/FadeIn';

export default function Intro() {
    return (
        <section className="intro-section bg-bg-primary pt-32 pb-24">
            <div className="intro-container max-w-6xl mx-auto px-6">
                <FadeIn>
                    <div className="intro-header flex flex-col lg:flex-row gap-16 items-start justify-between mb-24">
                        <h2 className="intro-heading text-4xl md:text-6xl font-bold tracking-tight leading-tight flex-1">
                            <span className="intro-heading-dim text-text-dim">Your technology is </span>
                            <span className="intro-heading-emphasis text-text-primary">complex.</span>
                            <br />
                            <span className="intro-heading-dim text-text-dim">Your product should be </span>
                            <span className="intro-heading-emphasis text-text-primary">simple.</span>
                        </h2>

                        <div className="intro-lede flex-1 max-w-lg pt-2">
                            <p className="intro-lede-body text-xl text-text-muted leading-relaxed mb-8 text-balance">
                                Great products deserve great design. I partner with founders, agencies, and small businesses to design and build the web, end to end.
                            </p>
                            <div className="intro-divider h-px w-24 bg-accent-primary mb-8" />
                            <p className="intro-lede-tags text-sm font-mono text-text-dim uppercase tracking-widest">
                                Design • Strategy • Development
                            </p>
                        </div>
                    </div>

                    <div className="intro-pillars grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border-subtle pt-12">
                        {[
                            {
                                title: "Systems Thinking",
                                desc: "I turn complex workflows into clear, shippable product structure - flows, states, edge cases, and component logic that engineers can build."
                            },
                            {
                                title: "Zero-to-One",
                                desc: "Rapid prototyping and strategic discovery to validate your core hypothesis before burning engineering cycles."
                            },
                            {
                                title: "Technical Fluency",
                                desc: "I speak your language. Git commits, component architecture, deployment pipelines. I bridge the divide between Figma and production."
                            }
                        ].map((item) => (
                            <div key={item.title} className="intro-pillar group">
                                <h3 className="intro-pillar-heading text-lg font-bold text-text-primary mb-3 group-hover:text-accent-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="intro-pillar-description text-text-secondary leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
