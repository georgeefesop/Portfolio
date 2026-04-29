'use client';

import FadeIn from '../motion/FadeIn';

// height: optical size; aspect: SVG viewBox aspect ratio (w / h)
const logos = [
    { name: 'Input Output (IOG)', src: '/logos/iog.svg', height: 22, aspect: 240 / 31 },
    { name: 'Cardano', src: '/logos/cardano.svg', height: 28, aspect: 1250 / 251.17 },
    { name: 'Nike', src: '/logos/nike.svg', height: 26, aspect: 1000 / 356.39 },
];

function Logo({ logo }: { logo: typeof logos[number] }) {
    return (
        <span
            role="img"
            aria-label={logo.name}
            className="block shrink-0"
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
        <section className="bg-bg-primary py-10 md:py-14 border-y border-border-subtle/50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="flex flex-col items-start gap-6">
                        <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
                            Past work and clients
                        </span>

                        <div className="w-full overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-10 md:gap-16 text-text-muted hover:text-text-primary transition-colors duration-500 min-w-max">
                                {logos.map((logo) => (
                                    <Logo key={logo.name} logo={logo} />
                                ))}
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
