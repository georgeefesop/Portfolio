'use client';

import { useState, useEffect, useMemo } from 'react';
import HeroCanvas from '@/components/ui/HeroCanvas';
import HeroText from '@/components/ui/HeroText';
import { useImagePreloader } from '@/hooks/useImagePreloader';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import Loading from '@/components/ui/Loading';



// Helper to generate frame URLs
const generateFrameUrls = (count: number, isMobile: boolean) => {
    const urls: string[] = [];
    const step = isMobile ? 2 : 1;

    for (let i = 0; i <= count; i += step) {
        const frameNumber = i.toString().padStart(3, '0');
        urls.push(`/frames/kinetic-sculpture/frame-${frameNumber}.jpg?v=3`);
    }
    return urls;
};

export default function Hero() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Check on mount
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Generate frames based on device
    const frameUrls = useMemo(() => {
        if (isMobile === null) return []; // Don't load until we know device
        return generateFrameUrls(79, isMobile);
    }, [isMobile]);

    // Preload images
    const { images, progress, isLoaded } = useImagePreloader(frameUrls);

    // Scroll progress
    const scrollProgress = useScrollProgress();

    if (!isLoaded || isMobile === null) {
        return <Loading progress={progress} />;
    }

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <HeroCanvas
                frames={frameUrls}
                scrollProgress={scrollProgress}
                images={images}
            />

            <HeroText scrollProgress={scrollProgress} />
        </section>
    );
}
