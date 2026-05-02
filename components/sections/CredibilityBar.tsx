'use client';

import FadeIn from '../motion/FadeIn';

// height: optical size; aspect: SVG viewBox aspect ratio (w / h);
// extraMl: additional left margin (Tailwind class) on top of the row gap, used to
// nudge logos that read tight to a heavy neighbour (e.g. Nike after Cardano).
const logos = [
    { name: 'Input Output (IOG)', src: '/logos/iog.svg', height: 22, aspect: 240 / 31, extraMl: '' },
    { name: 'Cardano', src: '/logos/cardano.svg', height: 28, aspect: 1250 / 251.17, extraMl: '' },
];

function Logo({ logo }: { logo: typeof logos[number] }) {
    return (
        <span
            role="img"
            aria-label={logo.name}
            className={`credibility-bar-logo block shrink-0 ${logo.extraMl}`}
            style={{
                width: `${logo.height * logo.aspect}px`,
                height: `${logo.height}px`,
                backgroundColor: 'currentColor',
                WebkitMaskImage: `url(${logo.src})`,
                maskImage: `url(${logo.src})`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
            }}
        />
    );
}

export default function CredibilityBar() {
    return (
        <section className="credibility-bar-section bg-bg-primary py-10 md:py-14 border-y border-border-subtle/50">
            <div className="credibility-bar-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="credibility-bar-stack flex flex-col items-start gap-6">
                        <span className="credibility-bar-eyebrow text-xs uppercase tracking-wider text-text-muted font-mono">
                            Past work and clients
                        </span>

                        <div className="credibility-bar-scroller w-full overflow-x-auto no-scrollbar">
                            <div className="credibility-bar-logo-row flex items-center gap-10 md:gap-16 text-text-muted hover:text-text-primary transition-colors duration-500 min-w-max">
                                {logos.map((logo) => (
                                    <Logo key={logo.name} logo={logo} />
                                ))}
                            </div>
                        </div>

                        <p className="credibility-bar-caption text-sm text-text-muted font-mono">
                            2 yrs at IOG · Lead designer on RealFi (Cardano $80bn ecosystem) · 12 yrs freelancing
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
