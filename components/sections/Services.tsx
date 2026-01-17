'use client';

import FadeIn from '../motion/FadeIn';
import { Zap, Layout, BarChart3, Sparkles, Code, Clock } from 'lucide-react';

const services = [
    {
        title: 'MVP Design + Development',
        description: 'Research → Prototype → Launch in 4-6 weeks. Full-stack execution with Next.js & Design Systems. Ideal for funded startups.',
        price: '€10-18k',
        icon: Zap
    },
    {
        title: 'Landing Page Design + Build',
        description: 'High-converting pages for product launches. Custom animations and performance optimized. 1-2 week turnaround.',
        price: '€4-8k',
        icon: Layout
    },
    {
        title: 'SaaS Dashboard Design',
        description: 'Turning complex data into intuitive interfaces. Specialized in Fintech, HealthTech, and Web3 platforms.',
        price: '€10-18k',
        icon: BarChart3
    },
    {
        title: 'AI Integration & Workflows',
        description: 'Custom AI features, image generation pipelines, and automation. AI-native design process for faster timelines.',
        price: '€5k+ or consulting',
        icon: Sparkles
    },
    {
        title: 'Design Systems & Components',
        description: 'Scalable component libraries and style guides. Figma to code handoff and documentation for growing teams.',
        price: '€8-15k',
        icon: Code
    },
    {
        title: 'Hourly Consulting',
        description: 'Design audits, prototyping, and technical advisory. Flexible engagement for specific problem solving.',
        price: '€150/hour',
        icon: Clock
    }
];

export default function Services() {
    return (
        <section id="services" className="bg-bg-primary py-16 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Services</h2>
                        <p className="text-text-secondary text-sm md:text-base">Typical timeline: 6-8 weeks for full projects. Currently available: 1-2 projects per quarter.</p>
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

                                <div className="mt-auto pt-4 border-t border-border-subtle">
                                    <span className="text-lg font-bold text-accent-primary font-mono bg-accent-primary/10 px-2 py-1 rounded">
                                        {service.price}
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
