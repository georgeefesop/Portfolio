'use client';

import Image from 'next/image';
import FadeIn from '../motion/FadeIn';
import MetricsCircles from '../ui/MetricsCircles';
import TechLogoMark from '../ui/TechLogoMark';
import { cases } from '@/data/case-studies';
import type { CaseStudy, StackComparison } from '@/data/case-studies/types';

function getComparison(c: CaseStudy | undefined): StackComparison | null {
    if (!c) return null;
    if (c.comparison) return c.comparison;
    if (!Array.isArray(c.body) && c.body?.comparison) return c.body.comparison;
    return null;
}

const aktiComparison = getComparison(cases.find((c) => c.id === 'akti'));

type Build = {
    label: string;
    href?: string;
    note?: string;
    lighthouse: { performance: number; accessibility: number; bestPractices: number; seo: number };
};

function logoIdsForLabel(label: string): string[] {
    if (label === 'React + Vite') return ['react', 'vite'];
    if (label === 'Webflow') return ['webflow'];
    if (label === 'WordPress + Elementor') return ['wordpress', 'elementor'];
    if (label === 'Next.js + Sanity') return ['nextjs', 'sanity'];
    return [];
}

function buildToMetrics(b: Build): Array<{ label: string; value: string }> {
    return [
        { label: 'Performance', value: String(b.lighthouse.performance) },
        { label: 'SEO', value: String(b.lighthouse.seo) },
    ];
}

function openCase(id: string) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('featured:open', { detail: { id } }));
}

function BuildCard({ build }: { build: Build }) {
    const parts = build.label.split(' + ');
    const logoIds = logoIdsForLabel(build.label);
    return (
        <div className="speed-proof-build-card flex flex-col items-center text-center gap-6 px-2 md:px-6">
            <h4 className="speed-proof-build-label text-base md:text-lg font-semibold text-text-primary flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                {parts.map((part, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5">
                        {idx > 0 && <span className="text-text-dim font-normal mr-1">+</span>}
                        {logoIds[idx] && <TechLogoMark id={logoIds[idx]} size={20} />}
                        <span>{part}</span>
                    </span>
                ))}
            </h4>
            <MetricsCircles
                metrics={buildToMetrics(build)}
                bordered={false}
                size={84}
                columns={2}
            />
        </div>
    );
}

export default function SpeedProof() {
    if (!aktiComparison) return null;

    const builds = aktiComparison.builds;
    const reactBuild = builds.find((b) => b.label === 'React + Vite');
    const webflowBuild = builds.find((b) => b.label === 'Webflow');

    return (
        <section className="speed-proof-section bg-bg-primary py-16 md:py-24">
            <div className="speed-proof-container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <figure className="speed-proof-feature mb-12 md:mb-16">
                        <div className="speed-proof-feature-frame relative rounded-lg overflow-hidden border border-border-subtle bg-bg-secondary aspect-[16/9]">
                            <Image
                                src="/images/akti/webflow-builder.PNG"
                                alt="Webflow Designer with the Aktí homepage on canvas, Variables panel open on the right"
                                fill
                                sizes="(max-width: 768px) 100vw, 1100px"
                                className="object-cover"
                                priority={false}
                            />
                        </div>
                        <figcaption className="speed-proof-feature-caption text-text-muted text-sm md:text-base mt-4 text-center max-w-2xl mx-auto">
                            This is what editing your site looks like once it&apos;s done. <span className="text-text-dim">Aktí, in the Webflow Designer.</span>
                        </figcaption>
                    </figure>
                </FadeIn>

                <FadeIn>
                    <div className="speed-proof-feature-card max-w-4xl mx-auto">
                        <header className="speed-proof-card-head text-center mb-10 md:mb-12">
                            <h3 className="speed-proof-card-title text-3xl md:text-4xl font-serif tracking-tight text-text-primary mb-3">
                                Aktí
                            </h3>
                            <p className="speed-proof-card-story text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                                I built Aktí twice: first as a custom React app, then rebuilt in Webflow, to benchmark each stack against Google PageSpeed Insights. Those scores feed directly into SEO rankings, which is what moves organic traffic for the business.
                            </p>
                        </header>

                        <div className="speed-proof-builds-grid grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6">
                            {reactBuild && <BuildCard build={reactBuild} />}
                            {webflowBuild && <BuildCard build={webflowBuild} />}
                        </div>

                        <div className="speed-proof-actions flex flex-wrap items-center justify-center gap-x-6 gap-y-4 mt-12 md:mt-14">
                            <button
                                type="button"
                                onClick={() => openCase('akti')}
                                className="speed-proof-cta-primary inline-flex items-center gap-2 px-5 py-2.5 border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-bg-primary text-xs md:text-sm font-mono uppercase tracking-[0.18em] transition-colors rounded"
                            >
                                View case study →
                            </button>
                            {reactBuild?.href && (
                                <a
                                    href={reactBuild.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="speed-proof-cta-secondary inline-flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-[0.18em] text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <TechLogoMark id="react" size={14} />
                                    <span>React build ↗</span>
                                </a>
                            )}
                            {webflowBuild?.href && (
                                <a
                                    href={webflowBuild.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="speed-proof-cta-secondary inline-flex items-center gap-2 text-xs md:text-sm font-mono uppercase tracking-[0.18em] text-text-muted hover:text-text-primary transition-colors"
                                >
                                    <TechLogoMark id="webflow" size={14} />
                                    <span>Webflow build ↗</span>
                                </a>
                            )}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
