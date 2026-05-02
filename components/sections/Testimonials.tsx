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
        quote: "The best design partner we've worked with. He speaks our language and doesn't just 'make things pretty' - he solves the core interaction problems.",
        source: "LinkedIn"
    }
];

export default function Testimonials() {
    return (
        <section className="testimonials-section bg-bg-primary py-12 pb-16 md:py-24 md:pb-32">
            <div className="testimonials-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="testimonials-header mb-16 md:text-center max-w-2xl md:mx-auto">
                        <h2 className="testimonials-heading font-serif text-h1 leading-[0.95] tracking-tight mb-5">
                            <span className="testimonials-heading-dim text-text-dim">Trusted by</span>{' '}
                            <span className="testimonials-heading-emphasis italic font-normal text-text-primary">founders</span>{' '}
                            <span className="testimonials-heading-dim text-text-dim">&amp; product leaders</span>
                        </h2>
                        <p className="testimonials-subheading text-text-secondary text-base md:text-lg">
                            I don&apos;t just deliver designs; I deliver confidence.
                        </p>
                    </div>
                </FadeIn>

                <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1} className={idx > 0 ? 'hidden md:block' : ''}>
                            <div className="testimonials-card bg-bg-secondary p-8 rounded-2xl border border-border-subtle relative h-full flex flex-col hover:border-accent-primary/30 transition-colors">
                                <Quote className="testimonials-card-quote-icon absolute top-8 right-8 text-bg-tertiary w-12 h-12 rotate-180" />

                                <div className="testimonials-card-stars mb-6 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className="testimonials-card-star text-accent-highlight fill-accent-highlight" />
                                    ))}
                                </div>

                                <p className="testimonials-card-quote text-text-secondary leading-relaxed mb-8 flex-1 relative z-10">
                                    &quot;{item.quote}&quot;
                                </p>

                                <div className="testimonials-card-author flex items-center gap-4 mt-auto">
                                    <div className="testimonials-card-avatar w-10 h-10 rounded-full bg-bg-tertiary border border-border-medium flex items-center justify-center font-bold text-text-muted">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div className="testimonials-card-author-meta">
                                        <div className="testimonials-card-author-name font-bold text-text-primary text-sm">{item.name}</div>
                                        <div className="testimonials-card-author-role text-xs text-text-muted">{item.role}, {item.company}</div>
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
