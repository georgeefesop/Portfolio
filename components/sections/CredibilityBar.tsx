'use client';

import Image from 'next/image';
import FadeIn from '../motion/FadeIn';

const logos = [
    { name: 'Input Output (IOG)', src: '/logos/iog.svg', height: 22 },
    { name: 'Cardano', src: '/logos/cardano.svg', height: 18 },
    { name: 'Nike', src: '/logos/nike.svg', height: 18 },
];

export default function CredibilityBar() {
    return (
        <section className="bg-bg-primary py-10 md:py-14 border-y border-border-subtle/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col items-start gap-6">
                        <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
                            Past work and clients
                        </span>

                        <div className="w-full overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-8 md:gap-14 text-text-muted hover:text-white transition-colors duration-500 min-w-max">
                                {logos.map((logo) => (
                                    <div
                                        key={logo.name}
                                        className="flex items-center shrink-0"
                                        style={{ height: logo.height }}
                                        aria-label={logo.name}
                                    >
                                        <Image
                                            src={logo.src}
                                            alt={logo.name}
                                            width={0}
                                            height={logo.height}
                                            sizes="200px"
                                            style={{ width: 'auto', height: `${logo.height}px` }}
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                                <a
                                    href="#work"
                                    className="text-sm text-text-muted hover:text-accent-primary transition-colors whitespace-nowrap shrink-0 font-mono"
                                >
                                    View case studies →
                                </a>
                            </div>
                        </div>

                        <p className="text-sm text-text-muted font-mono">
                            2 yrs at IOG · Lead designer on RealFi (Cardano) · 12 yrs freelancing
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
