'use client';

import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProductCanvas from '@/components/ui/ProductCanvas';
import HeroText from '@/components/ui/HeroText';
import FeaturedWorkStrip from '@/components/ui/FeaturedWorkStrip';
import HeroGrid from '@/components/ui/HeroGrid';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const UPWORK_URL = 'https://www.upwork.com/freelancers/~0192f6c9c9c1e1bf83';
const UPWORK_GREEN = '#14A800';

function UpworkWordmark({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 28" role="img" aria-label="Upwork" className={className} style={style}>
            <path fill="currentColor" d="M28.18,19.06A6.54,6.54,0,0,1,23,16c.67-5.34,2.62-7,5.2-7s4.54,2,4.54,5-2,5-4.54,5m0-13.34a7.77,7.77,0,0,0-7.9,6.08,26,26,0,0,1-1.93-5.62H12v7.9c0,2.87-1.3,5-3.85,5s-4-2.12-4-5l0-7.9H.49v7.9A8.61,8.61,0,0,0,2.6,20a7.27,7.27,0,0,0,5.54,2.35c4.41,0,7.5-3.39,7.5-8.24V8.77a25.87,25.87,0,0,0,3.66,8.05L17.34,28h3.72l1.29-7.92a11,11,0,0,0,1.36,1,8.32,8.32,0,0,0,4.14,1.28h.34A8.1,8.1,0,0,0,36.37,14a8.12,8.12,0,0,0-8.19-8.31" />
            <path fill="currentColor" d="M80.8,7.86V6.18H77.2V21.81h3.65V15.69c0-3.77.34-6.48,5.4-6.13V6c-2.36-.18-4.2.31-5.45,1.87" />
            <polygon fill="currentColor" points="55.51 6.17 52.87 17.11 50.05 6.17 45.41 6.17 42.59 17.11 39.95 6.17 36.26 6.17 40.31 21.82 44.69 21.82 47.73 10.71 50.74 21.82 55.12 21.82 59.4 6.17 55.51 6.17" />
            <path fill="currentColor" d="M67.42,19.07c-2.59,0-4.53-2.05-4.53-5s2-5,4.53-5S72,11,72,14s-2,5-4.54,5m0-13.35A8.1,8.1,0,0,0,59.25,14,8.18,8.18,0,1,0,75.6,14a8.11,8.11,0,0,0-8.18-8.31" />
            <path fill="currentColor" d="M91.47,14.13h.84l5.09,7.69h4.11l-5.85-8.53a7.66,7.66,0,0,0,4.74-7.11H96.77c0,3.37-2.66,4.65-5.3,4.65V0H87.82V21.82h3.64Z" />
        </svg>
    );
}

function MicroUpworkCard() {
    return (
        <a
            href={UPWORK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="micro-upwork-card group pointer-events-auto block w-fit rounded-xl bg-white px-4 py-3 transition-shadow duration-300 hover:shadow-lg"
        >
            <div className="flex items-center gap-2 mb-2.5">
                <UpworkWordmark className="h-4 w-auto" style={{ color: UPWORK_GREEN }} />
                <span className="text-[9px] font-bold tracking-wider text-white rounded-full px-1.5 py-0.5" style={{ backgroundColor: UPWORK_GREEN }}>
                    PRO
                </span>
            </div>
            <div className="flex items-center gap-3 mb-3 text-[11px] font-mono text-black/40">
                <span>100% Job Success</span>
                <span className="text-black/20">·</span>
                <span>5.0 ★</span>
                <span className="text-black/20">·</span>
                <span>0-4 hr response</span>
            </div>
            <div
                className="flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition-[filter] duration-200 group-hover:brightness-110"
                style={{ backgroundColor: UPWORK_GREEN }}
            >
                Hire me on Upwork
                <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
        </a>
    );
}

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

export default function ProductHero() {
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
                <div className="product-hero-featured-strip product-hero-featured-strip-desktop hidden md:block absolute left-0 right-0 z-[18] pointer-events-none" style={{ top: '26%' }}>
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
                    <MicroUpworkCard />
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
