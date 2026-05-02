'use client';

import FadeIn from '../motion/FadeIn';
import { Zap, Layout, Globe, Sparkles, Search, Compass } from 'lucide-react';

const services = [
    {
        title: 'Product & UX Design',
        description: 'SaaS interfaces, dashboards, and mobile apps. Research, wireframes, hi-fi UI, and design systems your engineers can build from. Same person designs and ships - no handoff meetings.',
        icon: Layout
    },
    {
        title: 'WordPress, AI-supercharged',
        description: 'Microsites, portfolio sites, business websites, online shops - on WordPress, with custom themes built from scratch (no template bloat). Bring a Figma file, a brief, or a rough idea. AI-assisted dev means bespoke sites ship in days, not weeks. Schema-marked, performance-tuned, editable by you. Loom walkthrough on handover.',
        icon: Globe
    },
    {
        title: 'Custom Next.js Sites',
        description: 'Marketing sites, landing pages, microsites, and lightweight web apps on Next.js + Tailwind. Custom-coded when polish and performance matter. Green Core Web Vitals out of the box.',
        icon: Zap
    },
    {
        title: 'AI Image & Video Direction',
        description: 'Directed AI imagery for brand and marketing - image libraries, social content, product visuals. Briefed and art-directed, not slot-machined.',
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
        <section id="services" className="services-section bg-bg-primary py-10 md:py-16 scroll-mt-20">
            <div className="services-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="services-header mb-10">
                        <h2 className="services-heading font-serif text-h1 leading-[0.95] tracking-tight mb-4">
                            What I do
                        </h2>
                        <p className="services-subheading text-text-secondary text-base md:text-lg max-w-xl">Designed and built by one person. Choose your shape.</p>
                    </div>
                </FadeIn>

                <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.map((service, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <div className="services-card group h-full flex flex-col bg-bg-secondary p-5 rounded-lg border border-border-subtle hover:border-accent-primary/50 hover:shadow-lg hover:shadow-accent-primary/10 transition-all duration-300">
                                <div className="services-card-header mb-4 flex justify-between items-start">
                                    <h3 className="services-card-title text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors pr-2">
                                        {service.title}
                                    </h3>
                                    <div className="services-card-icon-wrapper w-8 h-8 rounded-md bg-bg-primary flex items-center justify-center border border-border-medium group-hover:border-accent-primary/30 transition-colors shrink-0">
                                        <service.icon className="services-card-icon text-accent-primary w-4 h-4" />
                                    </div>
                                </div>

                                <p className="services-card-description text-text-secondary text-sm leading-relaxed">
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
