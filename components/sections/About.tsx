'use client';

import FadeIn from '../motion/FadeIn';
import Image from 'next/image';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Linkedin, ExternalLink, Mail, Youtube, Phone } from 'lucide-react';

export default function About() {
    return (
        <section id="about" className="bg-bg-primary py-24 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="block md:grid md:grid-cols-12 md:gap-16 items-start clearfix">

                        {/* Image Column - Floated on Mobile */}
                        <div className="float-right w-[40%] md:w-full md:float-none md:col-span-5 lg:col-span-4 mb-6 ml-6 md:ml-0 md:mb-0">
                            <div className="relative aspect-square rounded-2xl overflow-hidden md:w-[60%] md:ml-auto">
                                {/* Replace with actual profile image */}
                                <ImageWithFallback
                                    src="/images/george-profile-new.png"
                                    alt="George Efesop"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="md:col-span-7 lg:col-span-8 space-y-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">About</h2>
                                <div className="space-y-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
                                    <p>
                                        I&apos;m George, a product designer based in Cyprus.
                                    </p>
                                    <p>
                                        Previously at <span className="text-white font-medium">Input Output</span>, I designed Cardano blockchain infrastructure, focusing on RealFi platforms and sidechain interoperability.
                                    </p>
                                    <p>
                                        I specialize in simplifying complex technical products, partnering with funded startups in Web3, fintech, and SaaS.
                                    </p>
                                </div>
                            </div>

                            {/* What I Bring - Mobile & Desktop (Hidden on Tablet) */}
                            <div className="py-8 border-t border-b border-white/10 block md:hidden lg:block">
                                <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-widest text-sm">What I bring</h3>
                                <ul className="space-y-4">
                                    {[
                                        'Experience designing at scale (Cardano\'s $80bn ecosystem)',
                                        'AI-native workflows (Cursor, generative tools, modern automation)',
                                        'Full-stack capability (design + Next.js/React development)',
                                        'Teaching mindset (16k designers follow my content on TikTok)'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-text-secondary text-base">
                                            <span className="text-accent-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0 block"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <p className="text-text-secondary">
                                    Currently taking on 1-2 projects per quarter to ensure quality and focus. If you&apos;re building something ambitious, let&apos;s talk.
                                </p>

                                <div className="flex flex-wrap gap-6 pt-4">
                                    {[
                                        { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/in/giorgoe' },
                                        { name: 'TikTok', icon: ExternalLink, href: 'https://www.tiktok.com/@georgeefesop' },
                                        { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@georgeefesop' },
                                        { name: 'Email', icon: Mail, href: 'mailto:george.efesop@gmail.com' },
                                        { name: 'Phone', icon: Phone, href: 'tel:+35797907137' },
                                    ].map((social) => (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-text-primary hover:text-accent-primary transition-colors font-medium group"
                                        >
                                            <social.icon size={20} className="group-hover:-translate-y-1 transition-transform" />
                                            {social.name}
                                        </a>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* What I Bring - Tablet Only (Full Width) */}
                        <div className="hidden md:block lg:hidden col-span-12 mt-12 py-8 border-t border-b border-white/10">
                            <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-widest text-sm">What I bring</h3>
                            <ul className="space-y-4">
                                {[
                                    'Experience designing at scale (Cardano\'s $80bn ecosystem)',
                                    'AI-native workflows (Cursor, generative tools, modern automation)',
                                    'Full-stack capability (design + Next.js/React development)',
                                    'Teaching mindset (16k designers follow my content on TikTok)'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-text-secondary text-base">
                                        <span className="text-accent-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0 block"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
