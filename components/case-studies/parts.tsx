'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, X, ChevronLeft, ChevronRight, ArrowUpRight, Github } from 'lucide-react';
import TechLogoMark, { StackLogos } from '@/components/ui/TechLogoMark';
import MetricsCircles, { MetricsCirclesPlain } from '@/components/ui/MetricsCircles';

export interface CaseStudyBody {
    brief: {
        situation: string;
        audience: string;
        what_made_it_hard: string[];
    };
    honest_note?: string;
    decisions: Array<{
        title: string;
        what: string;
        why: string;
        screenshot: string;
        caption: string;
    }>;
    process?: string;
    comparison?: {
        heading?: string;
        intro?: string;
        methodology?: string;
        builds: Array<{
            label: string;
            href?: string;
            note?: string;
            lighthouse: {
                performance: number;
                accessibility: number;
                bestPractices: number;
                seo: number;
            };
            extras?: Array<{ label: string; value: string }>;
        }>;
    };
    outcome: {
        summary: string;
        metrics?: Array<{ label: string; value: string }>;
    };
}

export interface CaseStudyLink {
    href: string;
    label?: string;
    logo?: string;
}

export interface CaseStudyBuild {
    id: string;
    label: string;
    description?: string;
    links?: CaseStudyLink[];
    stack?: string[];
    briefLabel?: string;
    body: CaseStudyBody;
}

export type StackComparison = NonNullable<CaseStudyBody['comparison']>;

export interface CaseStudyVisual {
    situation: string;
    audience: string;
    what_made_it_hard: string;
    honest_note?: string;
    process?: string;
    outcome?: string;
    links: CaseStudyLink[];
    stack?: string[];
    gallery: Array<{ image: string; title: string; description: string }>;
}

export interface CaseStudyData {
    id: string;
    title: string;
    subtitle: string;
    role: string;
    period: string;
    tags: string[];
    aiBuilt?: boolean;
    stack?: string[];
    description?: {
        overview?: string;
        challenge: string;
        work: string[];
        outcome: string;
    };
    body?: CaseStudyBody;
    builds?: CaseStudyBuild[];
    comparison?: StackComparison;
    visual?: CaseStudyVisual;
    links: {
        live?: string;
        behance?: string;
        github?: string;
    };
    images: {
        thumbnail: string;
        hero: string;
        gallery: string[] | {
            desktop: string[];
            tablet?: string[];
            mobile?: string[];
        };
    };
}

// --- Body schema: intro block (replaces sidebar, sits at top of single-panel layout) ---

export function BodyIntro({
    project,
    links,
    stack,
    builds,
    activeBuildId,
    onSelectBuild,
    activeBuildDescription,
    metrics,
}: {
    project: CaseStudyData;
    links: CaseStudyLink[];
    stack: string[];
    builds?: CaseStudyBuild[];
    activeBuildId: string | null;
    onSelectBuild: (id: string) => void;
    activeBuildDescription?: string;
    metrics?: Array<{ label: string; value: string }>;
}) {
    const showTabs = !!builds && builds.length > 1;
    return (
        <section className="body-intro-root px-9 pt-7 pb-7 border-b border-border-subtle">
            <div className="body-intro-eyebrow flex items-center gap-2 mb-5">
                <span className="body-intro-eyebrow-dot relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                    <span className="body-intro-eyebrow-dot-ping absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                    <span className="body-intro-eyebrow-dot-core relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                </span>
                <span className="body-intro-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                    Case File {String.fromCodePoint(0xb7)} {project.id.toUpperCase().replace(/-/g, '_')}
                </span>
            </div>
            <div className="body-intro-grid grid md:grid-cols-[minmax(0,1fr)_minmax(0,340px)] gap-x-8 gap-y-6 items-start">
                <div className="body-intro-text-col flex flex-col gap-5 order-2 md:order-1">
                    <div className="body-intro-headline">
                        <h3 className="body-intro-title text-3xl md:text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight leading-[1.1] mb-3">
                            {project.title}
                        </h3>
                        <p className="body-intro-subtitle text-text-muted text-base font-light leading-relaxed pt-3 pb-[7px] max-w-2xl">
                            {project.subtitle}
                        </p>
                    </div>
                    <div className="body-intro-meta-grid grid grid-cols-2 gap-x-5 gap-y-3 font-mono text-xs text-text-muted max-w-md">
                        <div className="body-intro-meta-cell">
                            <span className="body-intro-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Role</span>
                            <span className="body-intro-meta-value text-text-secondary">{project.role}</span>
                        </div>
                        <div className="body-intro-meta-cell">
                            <span className="body-intro-meta-label block text-text-dim text-[10px] uppercase tracking-widest mb-1">Period</span>
                            <span className="body-intro-meta-value text-text-secondary">{project.period}</span>
                        </div>
                    </div>
                    {stack.length > 0 && (
                        <div className="body-intro-stack flex items-center gap-3">
                            <span className="body-intro-stack-label text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim">
                                Stack
                            </span>
                            <StackLogos ids={stack} size={16} showLabels />
                        </div>
                    )}
                    {!showTabs && links.length > 0 && (
                        <div className="body-intro-link-row pt-1">
                            <LinkRow links={links} />
                        </div>
                    )}
                </div>
                {project.links.live ? (
                    <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="body-intro-hero relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2 self-start group block hover:opacity-95 transition-opacity"
                        aria-label={`View ${project.title} live`}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.images.hero}
                            alt={project.title}
                            className="body-intro-hero-image block w-full h-auto"
                        />
                        <span className="absolute top-2 right-2 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.18em] bg-bg-tertiary/80 backdrop-blur-sm border border-border-subtle text-text-muted rounded-sm flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span>Visit live</span>
                            <span aria-hidden>{String.fromCodePoint(0x2197)}</span>
                        </span>
                    </a>
                ) : (
                    <div className="body-intro-hero relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2 self-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.images.hero}
                            alt={project.title}
                            className="body-intro-hero-image block w-full h-auto"
                        />
                    </div>
                )}
            </div>
            {showTabs && builds && (
                <div className="body-intro-tabs-wrap mt-6 pt-6 border-t border-border-subtle">
                    <div className="body-intro-tabs-eyebrow flex items-baseline gap-3 mb-3">
                        <span className="body-intro-tabs-eyebrow-rule block h-px w-6 bg-text-dim translate-y-[-0.35em]" />
                        <span className="body-intro-tabs-eyebrow-text font-serif italic font-normal text-text-primary text-base md:text-lg leading-none">
                            One website, {builds.length} builds
                        </span>
                    </div>
                    <BuildTabs
                        builds={builds}
                        activeId={activeBuildId ?? builds[0].id}
                        onChange={onSelectBuild}
                    />
                    {activeBuildDescription && (
                        <p className="body-intro-build-description text-sm text-text-muted leading-relaxed mt-3 max-w-3xl">
                            {activeBuildDescription}
                        </p>
                    )}
                    {links.length > 0 && (
                        <div className="body-intro-tabs-link-row mt-4">
                            <LinkRow links={links} />
                        </div>
                    )}
                </div>
            )}
            {metrics && metrics.length > 0 && (
                <div className="body-intro-metrics mt-7">
                    <MetricsCircles metrics={metrics} />
                </div>
            )}
        </section>
    );
}

// --- Link buttons ---

export function LinkRow({ links, className = '' }: { links: CaseStudyLink[]; className?: string }) {
    return (
        <div className={`link-row flex flex-wrap items-center gap-2 ${className}`}>
            {links.map((link) => (
                <BuildLinkButton key={link.href} link={link} />
            ))}
        </div>
    );
}

export function BuildLinkButton({ link }: { link: CaseStudyLink }) {
    let domain = link.href;
    try {
        domain = new URL(link.href).hostname.replace(/^www\./, '');
    } catch {}
    const isGithub = link.logo === 'github';
    return (
        <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="build-link-button live-site-cta group relative inline-flex items-center gap-3 px-4 py-2.5 [background-color:var(--cta-bg)] [color:var(--cta-fg)] hover:brightness-110 [border-color:var(--cta-bg)] border-2 rounded-sm transition-all text-[11px] font-mono uppercase tracking-[0.2em] shadow-[0_1px_0_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.08)]"
        >
            {link.logo && !isGithub && (
                <span className="build-link-button-logo inline-flex items-center justify-center" aria-hidden>
                    <TechLogoMark id={link.logo} size={14} />
                </span>
            )}
            {isGithub && (
                <Github size={14} className="build-link-button-github" aria-hidden />
            )}
            {!link.logo && (
                <span className="build-link-button-dot w-1.5 h-1.5 rounded-full opacity-70 [background-color:var(--cta-fg)]" aria-hidden />
            )}
            <span className="build-link-button-label">{link.label ?? 'Open'}</span>
            <span className="build-link-button-divider w-px h-3 opacity-30 [background-color:var(--cta-fg)]" aria-hidden />
            <span className="build-link-button-domain normal-case tracking-normal opacity-70">{domain}</span>
            <ArrowUpRight size={14} className="build-link-button-arrow opacity-90 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </a>
    );
}

// --- Build tab strip (only shown when project has builds[]) ---

export function BuildTabs({
    builds,
    activeId,
    onChange,
}: {
    builds: CaseStudyBuild[];
    activeId: string;
    onChange: (id: string) => void;
}) {
    return (
        <div className="build-tabs-root inline-flex flex-wrap items-stretch gap-1 p-1 rounded-md bg-bg-tertiary/40 border border-border-subtle" role="tablist" aria-label="Build variants">
            {builds.map((build) => {
                const isActive = build.id === activeId;
                const primaryLogo = build.stack?.[0] ?? build.links?.find((l) => l.logo)?.logo;
                return (
                    <button
                        key={build.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(build.id)}
                        className={`build-tabs-button inline-flex items-center gap-2 px-3.5 py-2 rounded-sm text-[12px] font-mono uppercase tracking-[0.14em] transition-colors ${
                            isActive
                                ? 'build-tabs-button-active bg-bg-secondary text-text-primary border border-accent-primary/45 shadow-[0_1px_0_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.08)]'
                                : 'build-tabs-button-inactive border border-transparent text-text-muted hover:text-text-primary hover:bg-bg-secondary/60'
                        }`}
                    >
                        {primaryLogo && (
                            <span className={isActive ? 'text-accent-primary' : 'text-text-muted'} aria-hidden>
                                <TechLogoMark id={primaryLogo} size={14} />
                            </span>
                        )}
                        <span className="build-tabs-button-label">{build.label}</span>
                    </button>
                );
            })}
        </div>
    );
}

// --- Body schema desktop view ---

export function BodyDesktopView({ body, briefLabel = 'Brief', onScreenshotClick }: { body: CaseStudyBody; briefLabel?: string; onScreenshotClick: (idx: number) => void }) {
    const decisions = body.decisions;
    return (
        <>
            {/* BRIEF */}
            <section className="body-desktop-brief px-9 pt-8 pb-9 border-b border-border-subtle">
                <PanelLabel>{briefLabel}</PanelLabel>
                <div className="body-desktop-brief-grid grid lg:grid-cols-2 gap-x-10 gap-y-5 mb-6">
                    <BriefCol label="Situation" body={body.brief.situation} />
                    <BriefCol label="Audience" body={body.brief.audience} />
                </div>
                <div className="body-desktop-brief-bottom grid lg:grid-cols-2 gap-x-10 gap-y-5">
                    {body.honest_note && (
                        <div className="body-desktop-honest-note">
                            <SubLabel>Honest note</SubLabel>
                            <p className="body-desktop-honest-note-text text-text-muted text-sm italic leading-relaxed mt-1.5">{body.honest_note}</p>
                        </div>
                    )}
                    <div className="body-desktop-brief-hard">
                        <SubLabel>What made it hard</SubLabel>
                        <ul className="body-desktop-brief-hard-list mt-1.5">
                            {body.brief.what_made_it_hard.map((item, i) => (
                                <li key={i} className="body-desktop-brief-hard-item text-text-secondary text-sm leading-relaxed">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* COMPARISON */}
            {body.comparison && body.comparison.builds.length > 0 && (
                <section className="body-desktop-comparison px-9 py-8 border-b border-border-subtle">
                    <PanelLabel>{body.comparison.heading || 'Comparison'}</PanelLabel>
                    {body.comparison.intro && (
                        <p className="body-desktop-comparison-intro text-text-secondary text-[15px] leading-relaxed max-w-3xl mb-7">
                            {body.comparison.intro}
                        </p>
                    )}
                    <ComparisonGrid builds={body.comparison.builds} />
                    <ComparisonDiffTable builds={body.comparison.builds} />
                    {body.comparison.methodology && (
                        <p className="body-desktop-comparison-methodology text-text-muted text-[12px] leading-relaxed max-w-3xl mt-4 italic">
                            {body.comparison.methodology}
                        </p>
                    )}
                </section>
            )}

            {/* DECISIONS */}
            <section className="body-desktop-decisions px-9 py-8 border-b border-border-subtle">
                <div className="body-desktop-decisions-header flex items-center gap-3 mb-7">
                    <span className="body-desktop-decisions-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                    <span className="body-desktop-decisions-label text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                        Decisions
                    </span>
                    <span className="body-desktop-decisions-count text-xs font-mono text-accent-primary/60">// {decisions.length}</span>
                </div>
                <div className="body-desktop-decisions-list space-y-9">
                    {decisions.map((d, i) => (
                        <DecisionRow
                            key={i}
                            index={i}
                            total={decisions.length}
                            decision={d}
                            onScreenshotClick={() => onScreenshotClick(i)}
                        />
                    ))}
                </div>
            </section>

            {/* PROCESS */}
            {body.process && (
                <section className="body-desktop-process px-9 py-7 border-b border-border-subtle">
                    <PanelLabel>Process</PanelLabel>
                    <p className="body-desktop-process-text text-text-secondary text-sm leading-relaxed max-w-3xl">
                        {body.process}
                    </p>
                </section>
            )}

            {/* OUTCOME */}
            <section className="body-desktop-outcome px-9 py-8">
                <PanelLabel>Outcome</PanelLabel>
                <p className="body-desktop-outcome-text text-text-secondary text-[15px] leading-relaxed max-w-3xl">
                    {body.outcome.summary}
                </p>
            </section>
        </>
    );
}

export function BodyMobileView({ body, briefLabel = 'Brief', onScreenshotClick }: { body: CaseStudyBody; briefLabel?: string; onScreenshotClick: (idx: number) => void }) {
    return (
        <>
            <MobileSection label={briefLabel}>
                <div className="body-mobile-brief space-y-4">
                    <div className="body-mobile-brief-block">
                        <SubLabel>Situation</SubLabel>
                        <p className="body-mobile-brief-text text-text-secondary mt-1">{body.brief.situation}</p>
                    </div>
                    <div className="body-mobile-brief-block">
                        <SubLabel>Audience</SubLabel>
                        <p className="body-mobile-brief-text text-text-secondary mt-1">{body.brief.audience}</p>
                    </div>
                    <div className="body-mobile-brief-bottom grid grid-cols-2 gap-x-5 gap-y-4">
                        {body.honest_note && (
                            <div className="body-mobile-honest-note">
                                <SubLabel>Honest note</SubLabel>
                                <p className="text-text-muted text-sm italic leading-relaxed mt-1.5">{body.honest_note}</p>
                            </div>
                        )}
                        <div className="body-mobile-brief-hard">
                            <SubLabel>What made it hard</SubLabel>
                            <p className="text-text-secondary text-sm leading-relaxed mt-1.5">{body.brief.what_made_it_hard[0]}</p>
                        </div>
                    </div>
                </div>
            </MobileSection>

            {body.comparison && body.comparison.builds.length > 0 && (
                <MobileSection label={body.comparison.heading || 'Comparison'}>
                    {body.comparison.intro && (
                        <p className="body-mobile-comparison-intro text-text-secondary mb-5">{body.comparison.intro}</p>
                    )}
                    <ComparisonGrid builds={body.comparison.builds} stacked />
                    <ComparisonDiffTable builds={body.comparison.builds} />
                    {body.comparison.methodology && (
                        <p className="body-mobile-comparison-methodology text-text-muted text-[12px] leading-relaxed mt-4 italic">
                            {body.comparison.methodology}
                        </p>
                    )}
                </MobileSection>
            )}

            <MobileSection label={`Decisions // ${body.decisions.length}`}>
                <div className="body-mobile-decisions-list space-y-7">
                    {body.decisions.map((d, i) => (
                        <DecisionRow
                            key={i}
                            index={i}
                            total={body.decisions.length}
                            decision={d}
                            onScreenshotClick={() => onScreenshotClick(i)}
                            stacked
                        />
                    ))}
                </div>
            </MobileSection>

            {body.process && (
                <MobileSection label="Process">
                    <p className="body-mobile-process-text text-text-secondary">{body.process}</p>
                </MobileSection>
            )}

            <MobileSection label="Outcome">
                <p className="body-mobile-outcome-text text-text-secondary">{body.outcome.summary}</p>
            </MobileSection>
        </>
    );
}

export function DecisionRow({
    index,
    total,
    decision,
    onScreenshotClick,
    stacked,
}: {
    index: number;
    total: number;
    decision: CaseStudyBody['decisions'][number];
    onScreenshotClick: () => void;
    stacked?: boolean;
}) {
    const num = String(index + 1).padStart(2, '0');
    const totalStr = String(total).padStart(2, '0');
    return (
        <article className={`decision-row-root ${stacked ? 'flex flex-col gap-4' : 'grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-x-8 gap-y-4 items-start'}`}>
            <figure className="decision-row-figure flex flex-col">
                <button
                    onClick={onScreenshotClick}
                    className="decision-row-screenshot-button group relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in block"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={decision.screenshot}
                        alt={decision.caption || decision.title}
                        className="decision-row-screenshot-image w-full h-auto block group-hover:brightness-110 transition-all"
                    />
                </button>
                {decision.caption && (
                    <figcaption className="decision-row-caption mt-2.5 text-xs font-mono text-text-muted leading-relaxed">
                        <span className="decision-row-caption-index text-accent-primary/70 mr-1.5">{num}</span>
                        {decision.caption}
                    </figcaption>
                )}
            </figure>

            <div className="decision-row-text-col">
                <div className="decision-row-eyebrow flex items-center gap-2 mb-2.5">
                    <span className="decision-row-eyebrow-label text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary">
                        Decision {num}
                    </span>
                    <span className="decision-row-eyebrow-total text-[11px] font-mono text-accent-primary/50">/ {totalStr}</span>
                </div>
                <h4 className="decision-row-title text-[19px] md:text-xl font-semibold text-text-primary leading-snug mb-3 tracking-tight">
                    {decision.title}
                </h4>
                <p className="decision-row-rationale text-text-secondary text-sm leading-relaxed">
                    {decision.why}
                </p>
            </div>
        </article>
    );
}

export function BriefCol({ label, body }: { label: string; body: string }) {
    return (
        <div className="brief-col-root">
            <SubLabel>{label}</SubLabel>
            <p className="brief-col-text text-text-secondary text-sm leading-relaxed mt-1.5">{body}</p>
        </div>
    );
}

function parseNumeric(value: string): { num: number; unit: string } | null {
    const match = value.trim().match(/^([0-9]+(?:[.,][0-9]+)?)\s*([A-Za-z%]*)$/);
    if (!match) return null;
    const num = parseFloat(match[1].replace(',', ''));
    if (!Number.isFinite(num)) return null;
    return { num, unit: match[2] };
}

function deltaForExtra(a: string, b: string): { display: string; better: 'a' | 'b' | 'same' } | null {
    const pa = parseNumeric(a);
    const pb = parseNumeric(b);
    if (!pa || !pb || pa.unit !== pb.unit) return null;
    if (pa.num === pb.num) return { display: 'same', better: 'same' };
    const lowerUnitA = pa.unit.toLowerCase();
    const lowerUnitB = pb.unit.toLowerCase();
    let ax = pa.num;
    let bx = pb.num;
    if (lowerUnitA === 'mb') ax *= 1024;
    if (lowerUnitB === 'mb') bx *= 1024;
    if (ax === bx) return { display: 'same', better: 'same' };
    const ratio = bx / ax;
    const better = bx < ax ? 'b' : 'a';
    if (better === 'b') {
        return { display: `${(ratio < 1 ? 1 / ratio : ratio).toFixed(ratio < 0.5 || ratio > 2 ? 1 : 2)}× lighter`, better };
    }
    return { display: `${(1 / ratio).toFixed(2)}× heavier`, better };
}

export function ComparisonSection({ comparison, mobile = false }: { comparison: StackComparison; mobile?: boolean }) {
    if (!comparison.builds.length) return null;
    if (mobile) {
        return (
            <div className="comparison-section-mobile px-7 py-5 border-t border-border-subtle">
                <div className="comparison-section-mobile-header flex items-baseline gap-3 mb-4">
                    <span className="block h-px w-6 bg-text-dim translate-y-[-0.35em]" />
                    <span className="font-serif italic font-normal text-text-primary text-lg leading-none">
                        {comparison.heading || 'Comparison'}
                    </span>
                </div>
                {comparison.intro && (
                    <p className="comparison-section-intro text-text-secondary text-base leading-relaxed mb-5">
                        {comparison.intro}
                    </p>
                )}
                <ComparisonGrid builds={comparison.builds} stacked />
                <ComparisonDiffTable builds={comparison.builds} />
                {comparison.methodology && (
                    <p className="comparison-section-methodology text-text-muted text-[12px] leading-relaxed mt-4 italic">
                        {comparison.methodology}
                    </p>
                )}
            </div>
        );
    }
    return (
        <section className="comparison-section-desktop px-9 py-8 border-b border-border-subtle">
            <PanelLabel>{comparison.heading || 'Comparison'}</PanelLabel>
            {comparison.intro && (
                <p className="comparison-section-intro text-text-secondary text-[15px] leading-relaxed max-w-3xl mb-7">
                    {comparison.intro}
                </p>
            )}
            <ComparisonGrid builds={comparison.builds} />
            <ComparisonDiffTable builds={comparison.builds} />
            {comparison.methodology && (
                <p className="comparison-section-methodology text-text-muted text-[12px] leading-relaxed max-w-3xl mt-4 italic">
                    {comparison.methodology}
                </p>
            )}
        </section>
    );
}

export function ComparisonDiffTable({
    builds,
}: {
    builds: NonNullable<CaseStudyBody['comparison']>['builds'];
}) {
    if (builds.length < 2) return null;
    const [a, b] = builds;
    const lhRows: Array<{ label: string; key: 'performance' | 'accessibility' | 'bestPractices' | 'seo' }> = [
        { label: 'Performance', key: 'performance' },
        { label: 'Accessibility', key: 'accessibility' },
        { label: 'Best Practices', key: 'bestPractices' },
        { label: 'SEO', key: 'seo' },
    ];

    const extraLabels = Array.from(new Set([...(a.extras || []).map(e => e.label), ...(b.extras || []).map(e => e.label)]));
    const aExtra = (label: string) => a.extras?.find(e => e.label === label)?.value;
    const bExtra = (label: string) => b.extras?.find(e => e.label === label)?.value;

    const headerCell = 'comparison-diff-th text-text-muted text-[11px] font-mono uppercase tracking-[0.14em] py-2.5 px-3 text-left';
    const cell = 'comparison-diff-td text-text-primary text-[13px] py-2.5 px-3 tabular-nums';

    return (
        <div className="comparison-diff-wrap mt-7 border border-border-subtle rounded-xl overflow-hidden bg-bg-elevated">
            <table className="comparison-diff-table w-full border-collapse text-left">
                <thead>
                    <tr className="bg-bg-elevated-alt">
                        <th className={headerCell}>Metric</th>
                        <th className={headerCell}>{a.label}</th>
                        <th className={headerCell}>{b.label}</th>
                        <th className={headerCell}>Improvement</th>
                    </tr>
                </thead>
                <tbody>
                    {lhRows.map((row, i) => {
                        const av = a.lighthouse[row.key];
                        const bv = b.lighthouse[row.key];
                        const diff = bv - av;
                        const better = diff === 0 ? 'same' : diff > 0 ? 'b' : 'a';
                        const zebra = i % 2 === 1 ? 'bg-bg-elevated-alt/60' : '';
                        return (
                            <tr key={row.key} className={`border-t border-border-subtle ${zebra}`}>
                                <td className={`${cell} text-text-secondary`}>{row.label}</td>
                                <td className={`${cell} ${better === 'a' ? 'text-accent-primary font-medium' : ''}`}>{av}</td>
                                <td className={`${cell} ${better === 'b' ? 'text-accent-primary font-medium' : ''}`}>{bv}</td>
                                <td className={`${cell} text-text-muted`}>
                                    {diff === 0 ? '-' : `${diff > 0 ? '+' : ''}${diff} pts`}
                                </td>
                            </tr>
                        );
                    })}
                    {extraLabels.map((label, i) => {
                        const av = aExtra(label);
                        const bv = bExtra(label);
                        if (!av || !bv) return null;
                        const d = deltaForExtra(av, bv);
                        const zebra = (lhRows.length + i) % 2 === 1 ? 'bg-bg-elevated-alt/60' : '';
                        return (
                            <tr key={`extra-${label}`} className={`border-t border-border-subtle ${zebra}`}>
                                <td className={`${cell} text-text-secondary`}>{label}</td>
                                <td className={`${cell} ${d?.better === 'a' ? 'text-accent-primary font-medium' : ''}`}>{av}</td>
                                <td className={`${cell} ${d?.better === 'b' ? 'text-accent-primary font-medium' : ''}`}>{bv}</td>
                                <td className={`${cell} text-text-muted`}>{d ? d.display : '-'}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function ComparisonGrid({
    builds,
    stacked = false,
}: {
    builds: NonNullable<CaseStudyBody['comparison']>['builds'];
    stacked?: boolean;
}) {
    const gridClass = stacked
        ? 'comparison-grid grid grid-cols-1 gap-7'
        : 'comparison-grid grid grid-cols-1 lg:grid-cols-2 gap-7 lg:grid-rows-[auto_auto_auto]';
    return (
        <div className={gridClass}>
            {builds.map((b, i) => {
                const lh = [
                    { label: 'Performance', value: String(b.lighthouse.performance) },
                    { label: 'Accessibility', value: String(b.lighthouse.accessibility) },
                    { label: 'Best Practices', value: String(b.lighthouse.bestPractices) },
                    { label: 'SEO', value: String(b.lighthouse.seo) },
                ];
                return (
                    <div
                        key={i}
                        className="comparison-card relative border border-border-subtle rounded-xl bg-bg-elevated shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)] grid grid-rows-[auto_auto_auto] lg:grid-rows-subgrid lg:row-span-3 overflow-hidden"
                    >
                        {b.href && (
                            <a
                                href={b.href}
                                target={b.href.startsWith('http') ? '_blank' : undefined}
                                rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                className="comparison-card-link absolute top-5 right-5 md:top-6 md:right-6 inline-flex items-center gap-2 px-3.5 py-2 [background-color:var(--cta-bg)] [color:var(--cta-fg)] hover:brightness-110 [border-color:var(--cta-bg)] border rounded-sm font-semibold uppercase tracking-[0.08em] transition-all text-sm font-karla-ui whitespace-nowrap z-[2]"
                            >
                                View <ExternalLink size={12} />
                            </a>
                        )}
                        <header className="comparison-card-head px-5 md:px-6 pt-5 md:pt-6 pb-5 pr-24 border-b border-border-subtle">
                            <h4 className="comparison-card-label text-text-primary text-base md:text-lg font-semibold tracking-tight">
                                {b.label}
                            </h4>
                            {b.note && (
                                <p className="comparison-card-note text-text-muted text-[13px] leading-relaxed mt-1.5 max-w-md">
                                    {b.note}
                                </p>
                            )}
                        </header>
                        <div className="comparison-card-body px-5 md:px-6 py-6 bg-bg-elevated-alt/60 flex items-center">
                            <div className="w-full">
                                <MetricsCirclesPlain metrics={lh} />
                            </div>
                        </div>
                        <footer className="comparison-card-foot px-5 md:px-6 py-5 border-t border-border-subtle">
                            {b.extras && b.extras.length > 0 ? (
                                <dl className="comparison-card-extras grid grid-cols-2 gap-x-4 gap-y-2.5">
                                    {b.extras.map((e, j) => (
                                        <div key={j} className="comparison-card-extras-row flex items-baseline justify-between gap-3">
                                            <dt className="comparison-card-extras-label text-text-muted text-[11px] font-mono uppercase tracking-[0.14em]">
                                                {e.label}
                                            </dt>
                                            <dd className="comparison-card-extras-value text-text-primary text-[13px] font-medium tabular-nums">
                                                {e.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            ) : (
                                <span className="text-text-muted text-[12px] font-mono uppercase tracking-[0.14em]">No extras</span>
                            )}
                        </footer>
                    </div>
                );
            })}
        </div>
    );
}

export function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="sub-label-root text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim block">
            {children}
        </span>
    );
}

export function ConsolePanel({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="console-panel-root flex flex-col md:min-h-0 bg-bg-secondary/40">
            <div className="console-panel-header flex-shrink-0 px-7 py-3.5 border-b border-border-subtle flex items-center gap-2">
                <span className="console-panel-dot w-1.5 h-1.5 rounded-full bg-accent-primary" />
                <span className="console-panel-label text-sm font-mono uppercase tracking-[0.18em] text-accent-primary">
                    {label}
                </span>
            </div>
            <div className="console-panel-body md:flex-1 md:min-h-0 md:overflow-y-auto px-7 py-5 hud-scroll">
                {children}
            </div>
        </div>
    );
}

export function MobileSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mobile-section-root px-7 py-5 border-t border-border-subtle">
            <div className="mobile-section-header flex items-baseline gap-3 mb-4">
                <span className="mobile-section-rule block h-px w-6 bg-text-dim translate-y-[-0.35em]" />
                <span className="mobile-section-label font-serif italic font-normal text-text-primary text-lg leading-none">
                    {label}
                </span>
            </div>
            <div className="mobile-section-body text-text-secondary text-base leading-relaxed">{children}</div>
        </div>
    );
}

export function PanelLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="panel-label-root flex items-baseline gap-3 mb-5">
            <span className="panel-label-rule block h-px w-8 bg-text-dim translate-y-[-0.35em]" />
            <span className="panel-label-text font-serif italic font-normal text-text-primary text-xl md:text-2xl leading-none">
                {children}
            </span>
        </div>
    );
}

// --- Lightbox ---

export function Lightbox({
    images,
    currentIndex,
    onClose,
    onNext,
    onPrev,
}: {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}) {
    const [scale, setScale] = useState(1);
    const src = images[currentIndex];

    const handleWheel = (e: React.WheelEvent) => {
        e.stopPropagation();
        const delta = -e.deltaY;
        const speed = 0.002;
        const newScale = scale + delta * speed;
        setScale(Math.min(Math.max(1, newScale), 4));
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScale((prev) => (prev > 1 ? 1 : 2.5));
    };

    const dragTransition: { type: 'spring'; damping: number; stiffness: number } = { type: 'spring', damping: 30, stiffness: 200 };
    const onDragEndList = (
        _e: MouseEvent | TouchEvent | PointerEvent,
        { offset, velocity }: { offset: { x: number; y: number }; velocity: { x: number; y: number } },
    ) => {
        if (scale > 1) return;
        const swipe = Math.abs(offset.x) > 50 && Math.abs(velocity.x) > 500;
        if (swipe) {
            if (offset.x > 0) onPrev();
            else onNext();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-root fixed inset-0 z-[140] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden touch-none"
            onClick={onClose}
            onWheel={handleWheel}
        >
            <button
                className="lightbox-close-button absolute top-6 right-6 z-[150] text-white/50 hover:text-white transition-colors bg-black/20 p-2 rounded-full backdrop-blur-md"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <button
                className="lightbox-prev-button hidden md:block absolute left-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                    setScale(1);
                }}
            >
                <ChevronLeft size={24} />
            </button>
            <button
                className="lightbox-next-button hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-[150] p-4 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md border border-white/10 hover:border-white/20"
                onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                    setScale(1);
                }}
            >
                <ChevronRight size={24} />
            </button>

            <div className="lightbox-counter absolute bottom-8 left-1/2 -translate-x-1/2 z-[150] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 text-white/70 text-sm font-mono tracking-widest">
                {currentIndex + 1} / {images.length}
            </div>

            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lightbox-stage relative w-full h-full flex items-center justify-center"
                drag={scale === 1 ? 'x' : true}
                dragConstraints={
                    scale === 1
                        ? { left: 0, right: 0 }
                        : { left: -1000 * scale, right: 1000 * scale, top: -800 * scale, bottom: 800 * scale }
                }
                dragElastic={scale === 1 ? 0.2 : 0.1}
                onDragEnd={scale === 1 ? onDragEndList : undefined}
                style={{ scale }}
                transition={dragTransition}
                onDoubleClick={handleDoubleClick}
            >
                <div className="lightbox-frame relative w-full max-w-7xl h-full p-4 flex items-center justify-center pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt="Project Gallery"
                        className="lightbox-image max-w-full max-h-[80vh] object-contain select-none shadow-2xl drop-shadow-2xl pointer-events-auto rounded-lg"
                        draggable={false}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Visual-led layout (image-first case studies) ---

export function VisualIntro({ project, visual }: { project: CaseStudyData; visual: CaseStudyVisual }) {
    const briefCells: Array<{ label: string; value: string }> = [
        { label: 'Situation', value: visual.situation },
        { label: 'Audience', value: visual.audience },
        { label: 'What made it hard', value: visual.what_made_it_hard },
    ];
    if (visual.honest_note) briefCells.push({ label: 'Honest note', value: visual.honest_note });
    if (visual.process) briefCells.push({ label: 'Process', value: visual.process });
    if (visual.outcome) briefCells.push({ label: 'Outcome', value: visual.outcome });
    const stack = visual.stack ?? project.stack ?? [];

    return (
        <section className="visual-intro-root px-7 md:px-9 pt-7 pb-7 border-b border-border-subtle">
            <div className="visual-intro-eyebrow flex items-center gap-2 mb-5">
                <span className="visual-intro-eyebrow-dot relative inline-flex w-1.5 h-1.5 flex-shrink-0">
                    <span className="absolute inset-0 rounded-full bg-accent-primary animate-ping opacity-60" />
                    <span className="relative inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" />
                </span>
                <span className="visual-intro-eyebrow-text text-[11px] font-mono uppercase tracking-[0.22em] text-accent-primary truncate">
                    Case File {String.fromCodePoint(0xb7)} {project.id.toUpperCase().replace(/-/g, '_')}
                </span>
            </div>

            <div className="visual-intro-identity grid md:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-x-8 gap-y-6 items-start mb-7">
                <div className="visual-intro-text-col flex flex-col gap-5 order-2 md:order-1">
                    <div className="visual-intro-headline">
                        <h3 className="visual-intro-title text-3xl md:text-[36px] font-fraunces-display font-medium text-text-primary tracking-tight leading-[1.1] mb-3">
                            {project.title}
                        </h3>
                        <p className="visual-intro-subtitle text-text-muted text-base font-light leading-relaxed pt-1 max-w-2xl">
                            {project.subtitle}
                        </p>
                    </div>
                    <div className="visual-intro-meta-grid grid grid-cols-2 gap-x-5 gap-y-3 max-w-md">
                        <div className="visual-intro-meta-cell">
                            <SubLabel>Role</SubLabel>
                            <span className="text-text-secondary text-sm mt-1.5 block">{project.role}</span>
                        </div>
                        <div className="visual-intro-meta-cell">
                            <SubLabel>Period</SubLabel>
                            <span className="text-text-secondary text-sm mt-1.5 block">{project.period}</span>
                        </div>
                    </div>
                    {stack.length > 0 && (
                        <div className="visual-intro-stack flex items-center gap-3 flex-wrap">
                            <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-text-dim">Stack</span>
                            <StackLogos ids={stack} size={16} showLabels />
                        </div>
                    )}
                </div>
                {project.images.hero && (
                    <div className="visual-intro-hero relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle order-1 md:order-2 self-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={project.images.hero}
                            alt={project.title}
                            className="visual-intro-hero-image block w-full h-auto"
                        />
                    </div>
                )}
            </div>

            <div className="visual-intro-brief grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {briefCells.map((cell) => (
                    <div key={cell.label} className="visual-intro-brief-cell">
                        <SubLabel>{cell.label}</SubLabel>
                        <p className="visual-intro-brief-text text-text-secondary text-sm leading-relaxed mt-1.5">
                            {cell.value}
                        </p>
                    </div>
                ))}
            </div>

            {visual.links.length > 0 && (
                <div className="visual-intro-link-row mt-7">
                    <LinkRow links={visual.links} />
                </div>
            )}
        </section>
    );
}

export function CompactComparison({ comparison }: { comparison: StackComparison }) {
    if (!comparison.builds.length) return null;
    return (
        <section className="compact-comparison-root px-7 md:px-9 py-7 border-b border-border-subtle">
            <div className="compact-comparison-header flex items-baseline gap-3 mb-5">
                <span className="block h-px w-6 bg-text-dim translate-y-[-0.35em]" />
                <span className="compact-comparison-heading font-serif italic font-normal text-text-primary text-xl leading-none">
                    {comparison.heading || 'Comparison'}
                </span>
            </div>
            <div className="compact-comparison-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparison.builds.map((b, i) => {
                    const lh = [
                        { label: 'Performance', value: String(b.lighthouse.performance) },
                        { label: 'Accessibility', value: String(b.lighthouse.accessibility) },
                        { label: 'Best Practices', value: String(b.lighthouse.bestPractices) },
                        { label: 'SEO', value: String(b.lighthouse.seo) },
                    ];
                    return (
                        <div key={i} className="compact-comparison-card relative border border-border-subtle rounded-xl bg-bg-elevated overflow-hidden">
                            {b.href && (
                                <a
                                    href={b.href}
                                    target={b.href.startsWith('http') ? '_blank' : undefined}
                                    rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                    className="compact-comparison-card-link absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 [background-color:var(--cta-bg)] [color:var(--cta-fg)] hover:brightness-110 [border-color:var(--cta-bg)] border rounded-sm font-semibold uppercase tracking-[0.08em] transition-all text-[11px] font-karla-ui z-[2]"
                                >
                                    View <ExternalLink size={11} />
                                </a>
                            )}
                            <header className="compact-comparison-card-head px-4 pt-4 pb-3 pr-20">
                                <h4 className="compact-comparison-card-label text-text-primary text-sm font-semibold tracking-tight">
                                    {b.label}
                                </h4>
                            </header>
                            <div className="compact-comparison-card-body px-4 py-3 bg-bg-elevated-alt/60">
                                <MetricsCirclesPlain metrics={lh} />
                            </div>
                            {b.extras && b.extras.length > 0 && (
                                <footer className="compact-comparison-card-foot px-4 py-3 border-t border-border-subtle">
                                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                                        {b.extras.slice(0, 4).map((e, j) => (
                                            <div key={j} className="flex items-baseline justify-between gap-2">
                                                <dt className="text-text-muted text-[10px] font-mono uppercase tracking-[0.14em]">
                                                    {e.label}
                                                </dt>
                                                <dd className="text-text-primary text-[12px] font-medium tabular-nums">
                                                    {e.value}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </footer>
                            )}
                        </div>
                    );
                })}
            </div>
            {comparison.methodology && (
                <p className="compact-comparison-methodology text-text-muted text-[11px] leading-relaxed mt-3 italic max-w-3xl">
                    {comparison.methodology}
                </p>
            )}
        </section>
    );
}

export function VisualGallery({
    heroImage,
    heroAlt,
    items,
    onImageClick,
}: {
    heroImage: string;
    heroAlt: string;
    items: CaseStudyVisual['gallery'];
    onImageClick: (idx: number) => void;
}) {
    return (
        <section className="visual-gallery-root px-7 md:px-9 py-8 flex flex-col gap-10">
            <button
                onClick={() => onImageClick(0)}
                className="visual-gallery-hero group relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in block"
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={heroImage}
                    alt={heroAlt}
                    className="visual-gallery-hero-image block w-full h-auto group-hover:brightness-105 transition-all"
                />
            </button>
            {items.map((item, i) => {
                const idx = i + 1;
                const num = String(i + 1).padStart(2, '0');
                return (
                    <article key={i} className="visual-gallery-item flex flex-col gap-3">
                        <button
                            onClick={() => onImageClick(idx)}
                            className="visual-gallery-item-button group relative w-full rounded-sm overflow-hidden bg-bg-tertiary border border-border-subtle hover:border-accent-primary/40 transition-colors cursor-zoom-in block"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="visual-gallery-item-image block w-full h-auto group-hover:brightness-105 transition-all"
                            />
                        </button>
                        <div className="visual-gallery-item-meta flex flex-col gap-1.5">
                            <div className="visual-gallery-item-title-row flex items-baseline gap-2.5">
                                <span className="visual-gallery-item-index text-[11px] font-mono text-accent-primary/70 tabular-nums">{num}</span>
                                <h4 className="visual-gallery-item-title text-base md:text-lg font-semibold text-text-primary tracking-tight leading-snug">
                                    {item.title}
                                </h4>
                            </div>
                            <p className="visual-gallery-item-description text-text-muted text-sm leading-relaxed pl-7">
                                {item.description}
                            </p>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
