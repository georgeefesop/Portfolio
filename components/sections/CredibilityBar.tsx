'use client';

import FadeIn from '../motion/FadeIn';

export default function CredibilityBar() {
    return (
        <section className="bg-bg-primary py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 p-8 rounded-2xl bg-bg-secondary/30 border border-border-subtle/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <span className="text-4xl font-bold text-white mb-1">12+ Years</span>
                            <span className="text-text-muted text-sm uppercase tracking-widest font-mono">Multidisciplinary Craft</span>
                        </div>

                        <div className="hidden md:block w-px h-12 bg-border-medium/50"></div>

                        <div className="flex flex-col items-center text-center">
                            <span className="text-xl font-medium text-text-secondary mb-1">Product Designer @ <span className="text-white">Input Output</span></span>
                            <span className="text-text-muted text-sm font-mono">Cardano Blockchain Infrastructure</span>
                        </div>

                        <div className="hidden md:block w-px h-12 bg-border-medium/50"></div>

                        <div className="flex flex-col items-center md:items-end text-center md:text-right">
                            <span className="text-4xl font-bold text-white mb-1">16K+ Followers</span>
                            <span className="text-text-muted text-sm uppercase tracking-widest font-mono">across socials</span>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
