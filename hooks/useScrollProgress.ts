'use client';

import { useEffect } from 'react';
import { useSpring, useMotionValue, MotionValue } from 'framer-motion';

export const useScrollProgress = (): MotionValue<number> => {
    const scrollProgress = useMotionValue(0);
    const smoothProgress = useSpring(scrollProgress, {
        stiffness: 200,
        damping: 30, // Slightly overdamped to preventing oscillating frames locally
        mass: 1,
        restDelta: 0.001 // Stop processing sooner
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate progress: 0 at top, 1 at component bottom (assuming 100vh hero)
            // Actually, we want to animate AS we scroll AWAY from hero?
            // "Animation Type: Scroll-linked"
            // "Scroll range: 0 to viewport height triggers animation"
            // So as we scroll from 0 to 100vh, the animation plays.

            if (windowHeight === 0) return;

            const rawProgress = scrollY / windowHeight;
            const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);

            scrollProgress.set(clampedProgress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        // Initial call
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [scrollProgress]);

    return smoothProgress;
};
