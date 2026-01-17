'use client';

import FadeIn from '../motion/FadeIn';

export default function Intro() {
    return (
        <section className="bg-bg-primary pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-6">
                <FadeIn>
                    <div className="flex flex-col lg:flex-row gap-16 items-start justify-between mb-24">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight flex-1">
                            <span className="text-text-dim">Your technology is </span>
                            <span className="text-white">complex.</span>
                            <br />
                            <span className="text-text-dim">Your product should be </span>
                            <span className="text-white">simple.</span>
                        </h2>

                        <div className="flex-1 max-w-lg pt-2">
                            <p className="text-xl text-text-muted leading-relaxed mb-8 text-balance">
                                Great engineering deserves great design. I partner with technical founders to help bridge the gap between heavy-duty backend logic and the human on the other side of the screen.
                            </p>
                            <div className="h-px w-24 bg-accent-primary mb-8" />
                            <p className="text-sm font-mono text-text-dim uppercase tracking-widest">
                                Design • Strategy • Development
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border-subtle pt-12">
                        {[
                            {
                                title: "Systemic Thinking",
                                desc: "Design that mirrors your data structures. I build scalable design systems that map directly to your component architecture."
                            },
                            {
                                title: "Zero-to-One",
                                desc: "Rapid prototyping and strategic discovery to validate your core hypothesis before burning engineering cycles."
                            },
                            {
                                title: "Technical Fluency",
                                desc: "I speak your language. From git commits to CSS architecture, I bridge the divide between Figma and production."
                            }
                        ].map((item) => (
                            <div key={item.title} className="group">
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-accent-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary leading-relaxed text-sm">
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
