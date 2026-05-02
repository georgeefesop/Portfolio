'use client';

import FadeIn from '../motion/FadeIn';
import Link from 'next/link';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const projects = [
    {
        title: 'Shackle App',
        category: 'Mobile • Hospitality',
        image: '/images/gallery/shackle.jpg',
        link: 'https://www.behance.net/gallery/126781545/Shackle'
    },
    {
        title: 'SmartJobs Platform',
        category: 'SaaS • Job Board',
        image: '/images/gallery/smartjobs.png',
        link: 'https://www.behance.net/gallery/126787469/SmartJobs-UX-UI-Design'
    },
    {
        title: 'Bank of Cyprus App',
        category: 'Mobile • Fintech',
        image: '/images/gallery/bank-of-cyprus.jpg',
        link: 'https://www.behance.net/gallery/125867375/Travel-App-Concept' // Keeping link or placeholder if unknown? User didn't provide new link.
    },
    {
        title: 'Labline Health Dashboard',
        category: 'SaaS • HealthTech',
        image: '/images/gallery/labline-new.jpg',
        link: 'https://www.behance.net/gallery/228295245/Labline-Health-Tracking-Biomarker-Dashboard'
    }
];

export default function Gallery() {
    return (
        <section className="gallery-section bg-bg-primary py-12 md:py-24">
            <div className="gallery-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="gallery-header flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                        <div className="gallery-header-text text-left">
                            <h2 className="gallery-heading text-3xl md:text-4xl font-bold text-text-primary mb-2">More Projects</h2>
                            <p className="gallery-subheading text-text-secondary">Explorations, concepts, and smaller builds.</p>
                        </div>
                        <Link href="https://behance.net/georgeefesop" target="_blank" className="gallery-archive-link text-accent-primary hover:text-text-primary transition-colors mt-4 md:mt-0 font-medium text-left">
                            View all on Behance →
                        </Link>
                    </div>

                    <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.slice(0, 3).map((project, idx) => (
                            <a
                                key={idx}
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="gallery-card group relative aspect-[4/3] rounded-xl overflow-hidden bg-bg-tertiary block border border-border-subtle hover:border-accent-primary/50 transition-colors max-w-[85%] mx-auto md:max-w-none"
                            >
                                <ImageWithFallback
                                    src={project.image}
                                    alt={project.title}
                                    width={492}
                                    height={369}
                                    quality={100}
                                    priority={idx < 4}
                                    className="gallery-card-image w-full h-full object-cover transition-opacity duration-700"
                                    style={{
                                        imageRendering: 'auto',
                                        WebkitImageRendering: '-webkit-optimize-contrast'
                                    } as any}
                                />

                                {/* Overlay */}
                                <div className="gallery-card-overlay absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                    <h3 className="gallery-card-title text-xl font-bold text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="gallery-card-category text-text-muted text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {project.category}
                                    </p>
                                    <span className="gallery-card-cta mt-4 text-accent-primary text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                        View on Behance →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
