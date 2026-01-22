'use client';

import FadeIn from '../motion/FadeIn';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
    {
        name: "Vignesh Sankaran",
        role: "Head of Product",
        company: "Input Output",
        image: "", // Placeholder or from screenshot if extracted
        quote: "George is one of those rare designers who understands the technical constraints as well as the user needs. He managed the entire UX for our RealFi platform, navigating complex blockchain requirements with ease.",
        source: "LinkedIn"
    },
    {
        name: "Upwork Client",
        role: "SaaS Founder",
        company: "HealthTech Startup",
        quote: "Absolutely fantastic work. George took our rough MVP concept and turned it into a professional, investable product design in record time.",
        source: "Upwork"
    },
    {
        name: "Alex Vasser",
        role: "CTO",
        company: "NexaFlow Protocol",
        quote: "The best design partner we've worked with. He speaks our language and doesn't just 'make things pretty' — he solves the core interaction problems.",
        source: "LinkedIn"
    }
];

export default function Testimonials() {
    return (
        <section className="bg-bg-primary py-24 pb-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="mb-16 md:text-center max-w-2xl md:mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Trusted by Founders & Product Leaders</h2>
                        <p className="text-text-secondary text-lg">
                            I don&apos;t just deliver designs; I deliver confidence.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1} className={idx > 0 ? 'hidden md:block' : ''}>
                            <div className="bg-bg-secondary p-8 rounded-2xl border border-border-subtle relative h-full flex flex-col hover:border-accent-primary/30 transition-colors">
                                <Quote className="absolute top-8 right-8 text-bg-tertiary w-12 h-12 rotate-180" />

                                <div className="mb-6 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="text-accent-highlight fill-accent-highlight" />
                                    ))}
                                </div>

                                <p className="text-text-secondary leading-relaxed mb-8 flex-1 relative z-10">
                                    &quot;{item.quote}&quot;
                                </p>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-bg-tertiary border border-border-medium flex items-center justify-center font-bold text-text-muted">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-text-primary text-sm">{item.name}</div>
                                        <div className="text-xs text-text-muted">{item.role}, {item.company}</div>
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
