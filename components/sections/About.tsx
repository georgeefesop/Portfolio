'use client';

import FadeIn from '../motion/FadeIn';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function About() {
    return (
        <section id="about" className="about-section bg-bg-primary py-12 md:py-24 scroll-mt-20">
            <div className="about-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <div className="about-v2-top grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                        <div className="about-v2-content lg:col-span-7 order-2 lg:order-1">
                            <h2 className="about-v2-heading font-serif text-h1 leading-[0.95] tracking-tight mb-8 text-text-primary">
                                Big-tech{' '}
                                <span className="italic font-normal text-accent-highlight">rigor.</span>
                                <br />
                                Small-biz{' '}
                                <span className="italic font-normal text-accent-highlight">focus.</span>
                            </h2>
                            <div className="about-v2-body space-y-6 text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
                                <p>
                                    I&apos;m George, a UI / UX product designer &amp; developer based in Cyprus. Twelve years freelance. Two of those leading the design team behind <span className="text-text-primary font-medium">RealFi</span> at <span className="text-text-primary font-medium">Input Output</span>, the engineering company behind Cardano.
                                </p>
                                <p>
                                    RealFi is a financial inclusion platform now serving SMEs in East Africa, part of Cardano&apos;s $80bn ecosystem. Same rigor, focused on the website your business actually runs on.
                                </p>
                            </div>
                        </div>

                        <div className="about-v2-photo lg:col-span-5 order-1 lg:order-2">
                            <div className="relative aspect-square rounded-2xl overflow-hidden max-w-[420px] lg:max-w-none lg:ml-auto">
                                <ImageWithFallback
                                    src="/images/george-about.jpg"
                                    alt="George Efesopoulos"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
