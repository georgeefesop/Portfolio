'use client';

import FadeIn from '../motion/FadeIn';
import { Zap, Layout, Globe, Sparkles, Search, Compass } from 'lucide-react';

const services = [
    {
        title: 'Product & UX Design',
        description: 'Apps, dashboards, and SaaS interfaces. Research, prototyping, and design systems your engineers can build.',
        timeline: '2–8 weeks',
        scope: 'Includes: discovery, design, prototypes, handover',
        icon: Layout
    },
    {
        title: 'WordPress + Elementor',
        description: 'Brand-led WordPress builds for small businesses. Schema-marked, performance-tuned, editable by a non-technical team.',
        timeline: '1–3 weeks',
        scope: 'Includes: build, content, schema, handover',
        icon: Globe
    },
    {
        title: 'Custom Next.js Builds',
        description: 'Bespoke marketing sites, conversion pages, and lightweight web apps on Next.js, Tailwind, and Vercel - fast cold-starts and clean Core Web Vitals.',
        timeline: '1–4 weeks',
        scope: 'Includes: design, build, deploy, performance',
        icon: Zap
    },
    {
        title: 'AI Image & Video Direction',
        description: 'Directed AI imagery for brand and marketing - image libraries, social content, and product visuals. Briefed, not slot-machined.',
        timeline: '1–3 weeks',
        scope: 'Includes: art direction, generation, retouch, library',
        icon: Sparkles
    },
    {
        title: 'SEO, AEO & Schema',
        description: 'Schema.org markup, local SEO, and AEO so Google understands the page and serves it up. Plus Google Ads management.',
        timeline: '1–2 weeks',
        scope: 'Includes: audit, schema, copy, ads setup',
        icon: Search
    },
    {
        title: 'Brand, Strategy & Audits',
        description: 'Positioning, copy, palette, and brand-first direction. Plus async audits and design advisory.',
        timeline: 'Async / hourly',
        scope: 'Includes: audit, advisory, brand work',
        icon: Compass
    }
];

export default function Services() {
    return (
        <section id="services" className="bg-bg-primary py-10 md:py-16 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Services</h2>
                        <p className="text-text-secondary text-sm md:text-base">Fixed-price or hourly - from one-page builds to full products.</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <div className="group h-full flex flex-col bg-bg-secondary p-5 rounded-lg border border-border-subtle hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300">
                                <div className="mb-4 flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors pr-2">
                                        {service.title}
                                    </h3>
                                    <div className="w-8 h-8 rounded-md bg-bg-primary flex items-center justify-center border border-border-medium group-hover:border-accent-primary/30 transition-colors shrink-0">
                                        <service.icon className="text-accent-primary w-4 h-4" />
                                    </div>
                                </div>

                                <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="mt-auto space-y-3">
                                    <span className="inline-block text-base font-bold text-accent-primary font-mono bg-accent-primary/10 px-2 py-1 rounded">
                                        {service.timeline}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-xs text-text-muted block">
                                            {service.scope}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
