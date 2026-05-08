'use client';

import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProductCanvas from '@/components/ui/ProductCanvas';
import HeroText from '@/components/ui/HeroText';
import FeaturedWorkStrip from '@/components/ui/FeaturedWorkStrip';
import HeroGrid from '@/components/ui/HeroGrid';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import MicroUpworkCard from '@/components/ui/MicroUpworkCard';
import { motion, AnimatePresence } from 'framer-motion';

// FEATURE FLAG: Set to true to re-enable carousel mode
// When false: Shows simple hero with modal button
// When true: Shows original 3-screen carousel
const ENABLE_CAROUSEL = false;

export type StepId = 0 | 1 | 2;

// Shared audio context for background transition sound
let sharedContext: AudioContext | null = null;
const getSharedContext = () => {
    if (typeof window === 'undefined') return null;
    if (!sharedContext) {
        sharedContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return sharedContext;
};

export default function ProductHeroSlider() {
    const scrollProgress = useScrollProgress();
    const [step, setStep] = useState<StepId>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Responsive state
    const [isMobile, setIsMobile] = useState(false);

    // Handle resize for responsive detection
    useEffect(() => {
        const checkResponsive = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
        };
        checkResponsive();
        window.addEventListener('resize', checkResponsive);
        return () => window.removeEventListener('resize', checkResponsive);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // ESC key handler for modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isModalOpen]);

    // "Carbon click" - short percussive transient on prototype open.
    // Restored from the old hero button; lives here now so any caller of
    // the prototype:open event gets the same haptic feedback.
    const playPrototypeSound = () => {
        try {
            const ctx = getSharedContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            const bufferSize = ctx.sampleRate * 0.02; // 20ms burst
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(3200, now);
            filter.Q.setValueAtTime(10, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.001);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.02);
        } catch (e) { }
    };

    // Listen for prototype:open from PrototypeShowcase section
    useEffect(() => {
        const handleOpen = () => {
            playPrototypeSound();
            setIsModalOpen(true);
        };
        window.addEventListener('prototype:open', handleOpen);
        return () => window.removeEventListener('prototype:open', handleOpen);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="product-hero-section relative h-[100svh] w-full overflow-hidden bg-bg-hero">
            {/* Background Grid - programmatic canvas with mouse trail. */}
            <motion.div
                className="product-hero-grid-wrap absolute inset-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
            >
                <HeroGrid />
            </motion.div>

            {/* ProductCanvas - Only in carousel mode */}
            {ENABLE_CAROUSEL && (
                <div className="product-hero-canvas-wrap absolute inset-0 z-0">
                    <ErrorBoundary>
                        <ProductCanvas step={step} setStep={setStep} />
                    </ErrorBoundary>
                </div>
            )}

            {/* Featured work strip - sits in the upper-middle of the hero, behind
                HeroText (which only occupies the bottom). md+ only. */}
            {!ENABLE_CAROUSEL && (
                <div className="product-hero-featured-strip product-hero-featured-strip-desktop hidden md:flex items-center absolute left-0 right-0 z-[18] pointer-events-none" style={{ top: '8%', bottom: '360px' }}>
                    <FeaturedWorkStrip />
                </div>
            )}

            {/* Vertical featured strip - mobile only. Cards scroll up off-screen,
                running from the top of the hero down to just above the signature. */}
            {!ENABLE_CAROUSEL && (
                <div className="product-hero-featured-strip product-hero-featured-strip-mobile md:hidden absolute left-0 right-0 z-[18] pointer-events-auto" style={{ top: '6%', bottom: '24%' }}>
                    <FeaturedWorkStrip orientation="vertical" />
                </div>
            )}

            {/* Hero Text Overlay */}
            <HeroText
                scrollProgress={scrollProgress}
                step={ENABLE_CAROUSEL ? step : undefined}
                isMobile={isMobile}
            />

            {/* Scroll Indicator + Upwork CTA - Only visible when modal is closed */}
            {!ENABLE_CAROUSEL && !isModalOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="product-hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
                >
                    <MicroUpworkCard className="hidden xl:block" />
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="product-hero-scroll-indicator-arrow text-text-muted transition-colors duration-500 pointer-events-none"
                    >
                        <svg className="product-hero-scroll-indicator-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                    </motion.div>
                </motion.div>
            )}

            {/* Fullscreen Demo Modal (New - only in simple mode) */}
            {!ENABLE_CAROUSEL && (
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="product-hero-modal-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12"
                            style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            }}
                            onClick={handleCloseModal}
                        >
                            {/* Modal Content - Maximized for fullscreen use */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="product-hero-modal-content relative w-full max-w-[95vw] lg:max-w-[1400px] flex-1 max-h-[88vh] flex items-center justify-center p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* POS Demo - Fills container */}
                                <div className="product-hero-modal-canvas-wrap w-full h-full flex items-center justify-center overflow-visible">
                                    <ErrorBoundary>
                                        <ProductCanvas step={2} setStep={setStep} isModalMode={true} />
                                    </ErrorBoundary>
                                </div>
                            </motion.div>

                            {/* Close Button - Reduced top margin to pull closer to terminal */}
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                                onClick={handleCloseModal}
                                className="product-hero-modal-close mt-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-md border border-white/20 font-medium z-50 shrink-0"
                            >
                                Close Prototype
                            </motion.button>
                        </motion.div>
                    )
                    }
                </AnimatePresence >
            )}
        </section >
    );
}
