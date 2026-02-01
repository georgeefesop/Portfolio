'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomScrollbar() {
    const { scrollYProgress } = useScroll();
    const [pageHeight, setPageHeight] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [isVibrant, setIsVibrant] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Smooth scroll progress for the thumb position
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // Update dimensions
    useEffect(() => {
        const updateDimensions = () => {
            setPageHeight(document.documentElement.scrollHeight);
            setViewportHeight(window.innerHeight);
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        window.addEventListener('scroll', updateDimensions);

        // Check vibrant mode
        const checkVibrant = () => {
            setIsVibrant(document.documentElement.classList.contains('vibrant-mode'));
        };
        checkVibrant();

        const observer = new MutationObserver(checkVibrant);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => {
            window.removeEventListener('resize', updateDimensions);
            window.removeEventListener('scroll', updateDimensions);
            observer.disconnect();
        };
    }, []);

    // Show/hide logic
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        const handleInteraction = () => {
            setIsVisible(true);
            clearTimeout(timeout);
            if (!isDragging) {
                timeout = setTimeout(() => setIsVisible(false), 2000);
            }
        };

        window.addEventListener('scroll', handleInteraction);
        window.addEventListener('mousemove', (e) => {
            if (e.clientX > window.innerWidth - 40) handleInteraction();
        });

        return () => {
            window.removeEventListener('scroll', handleInteraction);
        };
    }, [isDragging]);

    // Calculate thumb height proportionally
    const thumbHeightRatio = viewportHeight / pageHeight;
    const thumbHeight = Math.max(viewportHeight * (thumbHeightRatio || 0.1), 40); // Min 40px

    // Map scroll progress to thumb Y position
    const y = useTransform(smoothProgress, [0, 1], [0, viewportHeight - thumbHeight]);

    // DRAG LOGIC
    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);

        const startY = e.clientY;
        const startScrollProgress = scrollYProgress.get();
        const totalScrollable = pageHeight - viewportHeight;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const scrollRange = viewportHeight - thumbHeight;
            const deltaProgress = deltaY / scrollRange;
            const newProgress = Math.min(Math.max(startScrollProgress + deltaProgress, 0), 1);

            window.scrollTo({
                top: newProgress * totalScrollable,
                behavior: 'instant' // Must be instant for drag sync
            });
        };

        const onMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.body.style.userSelect = ''; // Re-enable selection
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.body.style.userSelect = 'none'; // Prevent selection while dragging
    };

    if (pageHeight <= viewportHeight + 1) return null;

    return (
        <motion.div
            className={`fixed right-0 top-0 bottom-0 z-50 group flex flex-col items-center py-1 transition-all duration-300 ${isDragging ? 'w-4' : 'w-2 hover:w-4'
                }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible || isDragging ? 1 : 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Hit area extension */}
            <div className="absolute inset-0 px-2 cursor-pointer pointer-events-auto" />

            {/* Thumb - Using a motion.div for position sync */}
            <motion.div
                onMouseDown={handleMouseDown}
                style={{
                    y,
                    height: thumbHeight,
                    width: '100%',
                }}
                className={`
                    relative rounded-full cursor-grab active:cursor-grabbing pointer-events-auto
                    ${isVibrant
                        ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]'
                        : 'bg-zinc-600 group-hover:bg-zinc-500'
                    }
                    transition-colors duration-300
                `}
            />
        </motion.div>
    );
}
