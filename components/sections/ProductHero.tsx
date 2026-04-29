'use client';

import { useState, useEffect, useMemo } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProductCanvas from '@/components/ui/ProductCanvas';
import HeroText from '@/components/ui/HeroText';
import BackgroundToggle from '@/components/ui/BackgroundToggle';
import FeaturedWorkStrip from '@/components/ui/FeaturedWorkStrip';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
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

export default function ProductHero() {
    const scrollProgress = useScrollProgress();
    const [step, setStep] = useState<StepId>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVibrantMode, setIsVibrantMode] = useState(false);
    const [isVibrantDelayed, setIsVibrantDelayed] = useState(false);

    // Responsive state
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Deterministic initial order for hydration match
    const [colorOrder, setColorOrder] = useState([...Array(12)].keys().toArray());

    // Deterministic initial positions for hydration match
    const initialPositions = [...Array(12)].map((_, i) => ({
        left: (i * 13 + 7) % 100,
        top: (i * 29 + 11) % 100
    }));
    const [blobPositions, setBlobPositions] = useState(initialPositions);

    // Handle resize for responsive detection
    useEffect(() => {
        const checkResponsive = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };
        checkResponsive();
        window.addEventListener('resize', checkResponsive);
        return () => window.removeEventListener('resize', checkResponsive);
    }, []);

    // Shuffle colors and randomize positions when vibrant mode is toggled on
    useEffect(() => {
        if (isVibrantMode) {
            // Shuffle colors
            setColorOrder(prev => {
                const newOrder = [...prev];
                for (let i = newOrder.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
                }
                return newOrder;
            });

            // Randomize positions
            setBlobPositions([...Array(12)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100
            })));
        }
    }, [isVibrantMode]);

    const blobCount = isMobile ? 6 : (isTablet ? 8 : 10);

    // Unified delay for UI elements (300ms lag)
    useEffect(() => {
        if (isVibrantMode) {
            const timer = setTimeout(() => setIsVibrantDelayed(true), 300);
            return () => clearTimeout(timer);
        } else {
            setIsVibrantDelayed(false);
        }
    }, [isVibrantMode]);

    // Toggle body/html class for global effects (scrollbar, nav button)
    useEffect(() => {
        if (isVibrantDelayed) {
            document.body.classList.add('vibrant-mode');
            document.documentElement.classList.add('vibrant-mode');
        } else {
            document.body.classList.remove('vibrant-mode');
            document.documentElement.classList.remove('vibrant-mode');
        }
    }, [isVibrantDelayed]);

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

    // "Carbon click" — short percussive transient on prototype open.
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

    // Play lightsaber-style "VRRM" sound when background transitions
    const playBackgroundTransitionSound = (isVibrant: boolean) => {
        try {
            const ctx = getSharedContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            if (isVibrant) {
                // Soft, glowy ignition: gentle frequency sweep with sine waves
                const osc1 = ctx.createOscillator();
                const osc2 = ctx.createOscillator();
                const gain = ctx.createGain();

                osc1.type = 'sine';
                osc2.type = 'sine';

                // Gentle frequency sweep: low to mid
                osc1.frequency.setValueAtTime(120, now);
                osc1.frequency.exponentialRampToValueAtTime(240, now + 0.5);

                osc2.frequency.setValueAtTime(240, now);
                osc2.frequency.exponentialRampToValueAtTime(480, now + 0.5);

                // Soft volume envelope
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
                gain.gain.linearRampToValueAtTime(0.025, now + 0.5);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(ctx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.7);
                osc2.stop(now + 0.7);
            } else {
                // Soft power down: gentle fade
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(240, now);
                osc.frequency.exponentialRampToValueAtTime(120, now + 0.3);

                gain.gain.setValueAtTime(0.025, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(now);
                osc.stop(now + 0.3);
            }
        } catch (e) { }
    };

    // Trigger sound when vibrant mode changes
    useEffect(() => {
        if (isVibrantMode) {
            // Delay ignition sound by 300ms to sync with visual bloom
            const timer = setTimeout(() => {
                playBackgroundTransitionSound(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            // Play power-down sound immediately
            playBackgroundTransitionSound(false);
        }
    }, [isVibrantMode]);

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-[#05050A]">
            {/* Animated Background Layers */}
            <AnimatePresence mode="wait">
                {isVibrantMode ? (
                    <motion.div
                        key="vibrant"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0"
                        style={{ filter: 'blur(110px)', transform: 'translateZ(0)' }}
                    >
                        {/* Fluid Blob System */}
                        {[...Array(blobCount)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full mix-blend-hard-light"
                                style={{
                                    backgroundColor: [
                                        // Mixed Palette for Contrast (Warm/Cool Alternating)
                                        '#FF006E', // Hot Magenta
                                        '#00E5FF', // Cyan
                                        '#FF1744', // Vibrant Red
                                        '#304FFE', // Royal Blue
                                        '#FF9100', // Golden Orange
                                        '#AA00FF', // Vivid Violet
                                        '#FFB74D', // Light Orange
                                        '#6200EA', // Deep Purple
                                        '#F50057', // Deep Pink
                                        '#00B0FF', // Sky Blue
                                        '#FF6D00', // Bright Orange
                                        '#E040FB', // Bright Purple
                                        '#C51162', // Magenta-Red
                                        '#1DE9B6', // Turquoise
                                        '#FF4081', // Hot Pink
                                        '#2979FF', // Bright Blue
                                        '#FF3D00', // Red-Orange
                                        '#651FFF', // Blue-Purple
                                        '#FF6090', // Coral Pink
                                        '#D500F9', // Purple-Magenta
                                    ][colorOrder[i] % 20],
                                    left: `${blobPositions[i].left}%`,
                                    top: `${blobPositions[i].top}%`,
                                    width: isMobile
                                        ? `${(i % 5) * 35 + 350}px` // Reduced to 50% of previous mobile size (350-525px)
                                        : `${(i % 5) * 70 + 560}px`, // Desktop maintained (560-910px)
                                    height: isMobile
                                        ? `${(i % 5) * 35 + 350}px`
                                        : `${(i % 5) * 70 + 560}px`,
                                    // filter: 'blur(110px)', // REMOVED: Optimization A - Handled by container
                                    opacity: 0.9,
                                    animation: `blob-swirl-${(i % 3) + 1} ${25 + (i % 5) * 5}s linear infinite`,
                                    animationDelay: `-${i * 3}s`, // Staggered start times
                                    transform: 'translate(-50%, -50%)',
                                }}
                            />
                        ))}

                        {/* Base - Pure Dark */}
                        <div
                            className="absolute inset-0 -z-10"
                            style={{
                                background: '#05050A'
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dark"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0 bg-[#05050A]"
                    />
                )}
            </AnimatePresence>

            {/* Background Grid - Using original SVG approach matching ProductCanvas */}
            <div className="absolute inset-0 z-0">
                {/* Grid pattern background - SVG for crisp rendering */}
                <div
                    className="absolute inset-0 opacity-[0.20] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 40L0 0H40' stroke='%23FFFFFF' stroke-width='1' stroke-opacity='1'/%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* ProductCanvas - Only in carousel mode */}
            {ENABLE_CAROUSEL && (
                <div className="absolute inset-0 z-0">
                    <ErrorBoundary>
                        <ProductCanvas step={step} setStep={setStep} />
                    </ErrorBoundary>
                </div>
            )}

            {/* Featured work strip - sits in the upper-middle of the hero, behind
                HeroText (which only occupies the bottom). md+ only. */}
            {!ENABLE_CAROUSEL && (
                <div className="hidden md:block absolute left-0 right-0 z-[18] pointer-events-none" style={{ top: '26%' }}>
                    <FeaturedWorkStrip />
                </div>
            )}

            {/* Vertical featured strip - mobile only. Cards scroll up off-screen,
                running from the top of the hero down to just above the signature. */}
            {!ENABLE_CAROUSEL && (
                <div className="md:hidden absolute left-0 right-0 z-[18] pointer-events-auto" style={{ top: '6%', bottom: '24%' }}>
                    <FeaturedWorkStrip orientation="vertical" />
                </div>
            )}

            {/* Hero Text Overlay */}
            <HeroText
                scrollProgress={scrollProgress}
                step={ENABLE_CAROUSEL ? step : undefined}
                isVibrantMode={isVibrantDelayed}
                isMobile={isMobile}
                headerActions={<BackgroundToggle onToggle={setIsVibrantMode} />}
            />

            {/* Scroll Indicator - Only visible when modal is closed */}
            {!ENABLE_CAROUSEL && !isModalOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className={`transition-colors duration-500 ${isVibrantDelayed ? 'text-white' : 'text-zinc-400'}`}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 md:p-8 lg:p-12"
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
                                className="relative w-full max-w-[95vw] lg:max-w-[1400px] flex-1 max-h-[88vh] flex items-center justify-center p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* POS Demo - Fills container */}
                                <div className="w-full h-full flex items-center justify-center overflow-visible">
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
                                className="mt-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-md border border-white/20 font-medium z-50 shrink-0"
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
