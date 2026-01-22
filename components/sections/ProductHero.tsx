'use client';

import { useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProductCanvas from '@/components/ui/ProductCanvas';
import HeroText from '@/components/ui/HeroText';

export type StepId = 0 | 1 | 2;

export default function ProductHero() {
    const scrollProgress = useScrollProgress();
    const [step, setStep] = useState<StepId>(0);

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-black">
            <div className="absolute inset-0 z-0">
                <ProductCanvas step={step} setStep={setStep} />
            </div>

            <HeroText scrollProgress={scrollProgress} step={step} />
        </section>
    );
}
