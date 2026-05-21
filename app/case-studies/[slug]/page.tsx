import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { cases } from '@/data/case-studies';
import CaseStudyContent from '@/components/case-studies/CaseStudyContent';
import CtaLink from '@/components/analytics/CtaLink';
import Footer from '@/components/ui/Footer';

const SITE_URL = 'https://efesop.com';
const UPWORK_PROFILE_URL = 'https://www.upwork.com/freelancers/~0192f6c9c9c1e1bf83';
const AUTHOR_NAME = 'George Efesopoulos';

export async function generateStaticParams() {
    return cases.map((c) => ({ slug: c.id }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
    const { slug } = await params;
    const project = cases.find((c) => c.id === slug);
    if (!project) return { title: 'Case study not found' };

    const title = `${project.title} - Case Study`;
    const description = project.subtitle;
    const url = `${SITE_URL}/case-studies/${project.id}`;
    const heroAbsolute = project.images.hero.startsWith('http')
        ? project.images.hero
        : `${SITE_URL}${project.images.hero}`;

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            url,
            type: 'article',
            images: [{ url: heroAbsolute, alt: project.title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [heroAbsolute],
        },
    };
}

export default async function CaseStudyPage(
    { params }: { params: Promise<{ slug: string }> },
) {
    const { slug } = await params;
    const project = cases.find((c) => c.id === slug);
    if (!project) notFound();

    const heroAbsolute = project.images.hero.startsWith('http')
        ? project.images.hero
        : `${SITE_URL}${project.images.hero}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: project.title,
        description: project.subtitle,
        url: `${SITE_URL}/case-studies/${project.id}`,
        image: heroAbsolute,
        author: {
            '@type': 'Person',
            name: AUTHOR_NAME,
            url: SITE_URL,
        },
        creator: {
            '@type': 'Person',
            name: AUTHOR_NAME,
            url: SITE_URL,
        },
        keywords: project.tags.join(', '),
        ...(project.period ? { datePublished: project.period } : {}),
        ...(project.links.live ? { sameAs: [project.links.live] } : {}),
    };

    return (
        <main className="case-study-page flex flex-col min-h-screen bg-bg-primary">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="case-study-page-shell w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
                <Breadcrumb title={project.title} />
                <CaseStudyContent project={project} />
                <CaseStudyUpworkCta />
            </div>

            <Footer />
        </main>
    );
}

function Breadcrumb({ title }: { title: string }) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="case-study-breadcrumb flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-text-muted mb-5"
        >
            <Link
                href="/#case-studies"
                className="case-study-breadcrumb-back inline-flex items-center gap-1.5 hover:text-text-primary transition-colors"
            >
                <ArrowLeft size={12} aria-hidden />
                <span>All case studies</span>
            </Link>
            <span aria-hidden className="text-text-dim">/</span>
            <span className="text-text-secondary truncate normal-case tracking-normal text-sm">
                {title}
            </span>
        </nav>
    );
}

function CaseStudyUpworkCta() {
    return (
        <section className="case-study-upwork-cta mt-12 rounded-2xl border border-border-subtle bg-bg-secondary p-7 md:p-10 shadow-sm">
            <div className="case-study-upwork-cta-inner flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="case-study-upwork-cta-text">
                    <p className="case-study-upwork-cta-eyebrow font-serif italic text-text-muted text-base md:text-lg mb-2">
                        Liked what you saw?
                    </p>
                    <h2 className="case-study-upwork-cta-heading font-serif text-2xl md:text-3xl leading-tight tracking-tight text-text-primary">
                        <span className="text-text-dim">Work with me on</span>{' '}
                        <span className="italic font-normal">Upwork</span>
                    </h2>
                    <p className="case-study-upwork-cta-blurb text-text-secondary text-sm md:text-base leading-relaxed mt-3 max-w-xl">
                        Escrow protection, verified reviews, no invoices to chase. The cleanest path for both of us.
                    </p>
                    <ul className="case-study-upwork-cta-valueprops mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs md:text-sm text-text-muted">
                        <li className="inline-flex items-center gap-1.5">
                            <Shield size={14} className="text-accent-primary" aria-hidden />
                            <span>Escrow-protected</span>
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <Star size={14} className="text-accent-primary" aria-hidden />
                            <span>100% job success</span>
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                            <Zap size={14} className="text-accent-primary" aria-hidden />
                            <span>Replies in 0-4 hours</span>
                        </li>
                    </ul>
                </div>
                <div className="case-study-upwork-cta-actions flex flex-col gap-2 md:items-end md:shrink-0">
                    <CtaLink
                        destination="upwork"
                        ctaLocation="case_study_page"
                        href={UPWORK_PROFILE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="case-study-upwork-cta-button inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-4 rounded-lg transition-colors bg-[#14A800] hover:bg-[#108300] text-sm md:text-base"
                    >
                        Hire me on Upwork
                        <ArrowRight size={18} aria-hidden />
                    </CtaLink>
                    <Link
                        href="/#contact"
                        className="case-study-upwork-cta-secondary text-xs text-text-muted hover:text-text-primary transition-colors text-center md:text-right"
                    >
                        Or see other ways to get in touch
                    </Link>
                </div>
            </div>
        </section>
    );
}
