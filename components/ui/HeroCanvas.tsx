'use client';

import { useEffect, useRef } from 'react';
import { MotionValue } from 'framer-motion';

interface HeroCanvasProps {
    frames: string[];
    scrollProgress: MotionValue<number>;
    images?: HTMLImageElement[];
}

export default function HeroCanvas({
    frames,
    scrollProgress,
    images = [],
}: HeroCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentFrameIndex = useRef<number>(-1);
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false }); // Alpha false for performance
        if (!ctx) return;

        // Handle Resize
        const handleResize = () => {
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (parent) {
                const dpr = window.devicePixelRatio || 1;
                // Set display size (css pixels)
                canvas.style.width = '100%';
                canvas.style.height = '100%';

                // Set actual size in memory (scaled to account for extra pixel density)
                // We use the parent's dimensions because canvas is 100% w/h
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale context to ensure correct drawing operations
                // But we handle drawing manually to "contain" the image
                // So we might not need globally scaling ctx if we calculate dst rect.
                // The prompt says: "Scale context ... ctx.scale(dpr, dpr)"
                // If we do that, we draw in CSS pixels.
                ctx.scale(dpr, dpr);

                // Enable high-quality smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Force redraw
                currentFrameIndex.current = -1;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // Drawing Logic
        const draw = () => {
            if (!canvas || !ctx) return;

            const progress = scrollProgress.get();
            // Map progress 0-1 to frame index 0-190
            // User requested animation to complete by halfway (0.5 progress)
            // So we multiply progress by 2 and clamp to 1.
            const acceleratedProgress = Math.min(1, progress * 2);

            const totalFrames = frames.length;
            if (totalFrames === 0) return;

            const maxIndex = totalFrames - 1;
            const index = Math.min(
                maxIndex,
                Math.max(0, Math.round(acceleratedProgress * maxIndex))
            );

            if (index !== currentFrameIndex.current) {
                currentFrameIndex.current = index;

                // Get image
                let img: HTMLImageElement | undefined = images[index];
                if (!img && frames[index]) {
                    // Fallback if images not passed (should rely on browser cache if preloaded)
                    // But creating new Image here is bad for perf. 
                    // We assume images are passed or preloaded by browser cache.
                    // If we just use new Image(), it might flicker if not cached.
                    // For now, we prefer the passed images.
                    img = new Image();
                    img.src = frames[index];
                }

                if (img && img.complete) {
                    // Clear canvas
                    // Context is scaled by dpr.
                    // canvas.width is dpr * cssWidth.
                    // We need to clear rect in CSS pixels:
                    const width = canvas.width / (window.devicePixelRatio || 1);
                    const height = canvas.height / (window.devicePixelRatio || 1);

                    ctx.clearRect(0, 0, width, height);

                    // Calculate scaling
                    // User requested to make the object smaller.
                    // Instead of full cover, we apply a clear black background (handled by CSS bg-black)
                    // and scale the image down slightly so it doesn't dominate as much, 
                    // while still centering it.

                    const imgWidth = 1920;
                    const imgHeight = 1080;

                    // Standard cover scale
                    const coverScale = Math.max(width / imgWidth, height / imgHeight);

                    // We reduce the scale to 60% of "cover" to make the object appear smaller
                    // This might expose edges if the image isn't on a black background, 
                    // but we verified the frames are on black.
                    const scale = coverScale * 0.6;

                    const drawWidth = imgWidth * scale;
                    const drawHeight = imgHeight * scale;

                    // Center the image
                    const offsetX = (width - drawWidth) / 2;
                    const offsetY = (height - drawHeight) / 2;

                    // Draw
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                    // Cover Veo logo (bottom right)
                    ctx.fillStyle = '#000000';
                    // Logo is roughly in the bottom right corner. We cover a small area there.
                    // 120x40 pixel box should be enough, positioned relative to the image bounds
                    ctx.fillRect(offsetX + drawWidth - 140, offsetY + drawHeight - 50, 140, 50);
                }
            }

            requestRef.current = requestAnimationFrame(draw);
        };

        requestRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [scrollProgress, frames, images]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
                imageRendering: 'auto', // webkit-optimize-contrast is deprecated/standardizing
                filter: 'contrast(1.1) brightness(0.9)'
            }}
            aria-label="Kinetic sculpture animation"
        />
    );
}
