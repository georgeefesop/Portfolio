'use client';

import FadeIn from '../motion/FadeIn';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

const bringList = [
    'Experience designing at scale - Cardano\'s $80bn ecosystem',
    'AI-native workflows - Cursor, generative tools, modern automation',
    'Full-stack capability - design and Next.js/React development',
    'Teaching mindset - 15K designers follow my content on TikTok',
];

export default function About() {
    return (
        <section id="about" className="bg-bg-primary py-12 md:py-24 scroll-mt-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="block md:grid md:grid-cols-12 md:gap-16 items-start clearfix">

                        {/* Image Column - Floated on Mobile */}
                        <div className="float-right w-[40%] md:w-full md:float-none md:col-span-5 lg:col-span-4 mb-6 ml-6 md:ml-0 md:mb-0">
                            <div className="relative aspect-square rounded-2xl overflow-hidden">
                                <ImageWithFallback
                                    src="/images/george-about.jpg"
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
                                        I&apos;m George - a product designer and developer based in Cyprus. I&apos;ve been freelancing for 12 years and spent two of those leading design at <span className="text-text-primary font-medium">Input Output</span>, the engineering company behind Cardano.
                                    </p>
                                    <p>
                                        I designed and shipped <span className="text-text-primary font-medium">RealFi</span> - a financial inclusion platform now serving SMEs in East Africa, part of Cardano&apos;s $80bn ecosystem. Before that, design work for Nike Training Club, Bournemouth University, and startups across fintech, hospitality, ecommerce, and healthtech.
                                    </p>
                                    <p>
                                        What I do now is rare on Upwork: I design <em>and</em> build. Next.js front-end, WordPress, AI image direction, SEO, marketing automation. One person, one workflow, one person responsible.
                                    </p>
                                </div>
                            </div>

                            {/* What I Bring - Mobile & Desktop (Hidden on Tablet) */}
                            <div className="py-8 border-t border-b border-border-subtle block md:hidden lg:block">
                                <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-widest text-sm">What I bring</h3>
                                <ul className="space-y-4">
                                    {bringList.map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-text-secondary text-base">
                                            <span className="text-accent-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary shrink-0 block"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        {/* What I Bring - Tablet Only (Full Width) */}
                        <div className="hidden md:block lg:hidden col-span-12 mt-12 py-8 border-t border-b border-border-subtle">
                            <h3 className="text-lg font-bold text-text-primary mb-6 uppercase tracking-widest text-sm">What I bring</h3>
                            <ul className="space-y-4">
                                {bringList.map((item, i) => (
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
