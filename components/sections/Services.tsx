'use client';

import FadeIn from '../motion/FadeIn';
import { Zap, Layout, Globe, Sparkles, Search, Compass } from 'lucide-react';

const services = [
    {
        title: 'Product & UX Design',
        description: 'SaaS interfaces, dashboards, and mobile apps. Research, wireframes, hi-fi UI, and design systems your engineers can build from. Same person designs and ships — no handoff meetings.',
        icon: Layout
    },
    {
        title: 'WordPress, AI-supercharged',
        description: 'Bring a Figma file, a brief, or a rough idea. I build custom themes from scratch — no template bloat, schema-marked, performance-tuned. AI-assisted dev means bespoke sites in days, not weeks. Local-first workflow, staged, merged clean. Loom walkthrough on handover.',
        icon: Globe
    },
    {
        title: 'Custom Next.js Builds',
        description: 'Bespoke marketing sites, conversion pages, and lightweight web apps on Next.js + Tailwind. Green Core Web Vitals out of the box.',
        icon: Zap
    },
    {
        title: 'AI Image & Video Direction',
        description: 'Directed AI imagery for brand and marketing — image libraries, social content, product visuals. Briefed and art-directed, not slot-machined.',
        icon: Sparkles
    },
    {
        title: 'SEO, AEO & Schema',
        description: 'Schema.org markup, local SEO, and AEO so Google (and AI assistants) understand the page. Plus Google Ads when you need traffic this week.',
        icon: Search
    },
    {
        title: 'Brand, Strategy & Audits',
        description: 'Positioning, copy direction, palette, and async audits. Useful when the build is fine but the message isn\'t landing.',
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
                        <p className="text-text-secondary text-sm md:text-base">Designed and built by one person. Choose your shape.</p>
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

                                <p className="text-text-secondary text-sm leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
