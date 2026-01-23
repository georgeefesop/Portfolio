'use client';

import FadeIn from '../motion/FadeIn';
import { Zap, Layout, BarChart3, Sparkles, Code, Clock } from 'lucide-react';

const services = [
    {
        title: 'MVP Design + Development',
        description: 'Research → Prototype → Launch in 4-6 weeks. Full-stack execution with Next.js & Design Systems. Ideal for funded startups.',
        price: 'From €12k',
        timeline: '4–6 weeks',
        range: 'Typical €12–18k',
        scope: 'Includes: discovery, design, build, handoff',
        icon: Zap
    },
    {
        title: 'Landing Page Design + Build',
        description: 'High-converting pages for product launches. Custom animations and performance optimized. 1-2 week turnaround.',
        price: 'From €4k',
        timeline: '1–2 weeks',
        range: 'Typical €4–8k',
        scope: 'Includes: design, build, animation, performance',
        icon: Layout
    },
    {
        title: 'SaaS Dashboard Design',
        description: 'Turning complex data into intuitive interfaces. Specialized in Fintech, HealthTech, and Web3 platforms.',
        price: 'From €10k',
        timeline: '4–8 weeks',
        range: 'Typical €10–18k',
        scope: 'Includes: core flows, states, UI system',
        icon: BarChart3
    },
    {
        title: 'AI Integration & Workflows',
        description: 'Custom AI features, image generation pipelines, and automation. AI-native design process for faster timelines.',
        price: 'From €5k',
        timeline: '2–6 weeks',
        range: 'Typical €5–12k',
        scope: 'Includes: scoped workflow, prototype, plan',
        icon: Sparkles
    },
    {
        title: 'Design Systems & Components',
        description: 'Scalable component libraries and style guides. Figma to code handoff and documentation for growing teams.',
        price: 'From €8k',
        timeline: '3–6 weeks',
        range: 'Typical €8–15k',
        scope: 'Includes: components, tokens, documentation',
        icon: Code
    },
    {
        title: 'Hourly Consulting',
        description: 'Design audits, prototyping, and technical advisory. Flexible engagement for specific problem solving.',
        price: '€150/hour',
        timeline: 'Async-first • Min. 3h',
        range: 'Min. 3 hours',
        scope: 'Audits, prototypes, technical guidance',
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

                                <div className="mt-auto space-y-3">
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <span className="inline-block text-base font-bold text-accent-primary font-mono bg-accent-primary/10 px-2 py-1 rounded">
                                            {service.price}
                                        </span>
                                        <span className="inline-block text-xs font-medium text-text-muted bg-white/5 border border-white/5 px-2 py-1.5 rounded">
                                            {service.timeline}
                                        </span>
                                    </div>
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
