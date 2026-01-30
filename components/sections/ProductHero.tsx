'use client';

import { useState, useEffect } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import ProductCanvas from '@/components/ui/ProductCanvas';
import HeroText from '@/components/ui/HeroText';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';

// FEATURE FLAG: Set to true to re-enable carousel mode
// When false: Shows simple hero with modal button
// When true: Shows original 3-screen carousel
const ENABLE_CAROUSEL = false;

export type StepId = 0 | 1 | 2;

export default function ProductHero() {
    const scrollProgress = useScrollProgress();
    const [step, setStep] = useState<StepId>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="relative h-[100svh] w-full overflow-hidden bg-[#05050A]">
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

            {/* Hero Text Overlay */}
            <HeroText
                scrollProgress={scrollProgress}
                step={ENABLE_CAROUSEL ? step : undefined}
                onOpenDemo={ENABLE_CAROUSEL ? undefined : handleOpenModal}
            />

            {/* Scroll Indicator - Only visible when modal is closed */}
            {!ENABLE_CAROUSEL && !isModalOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="text-zinc-400"
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
                    )}
                </AnimatePresence>
            )}
        </section>
    );
}
