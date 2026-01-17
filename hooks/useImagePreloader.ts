import { useState, useEffect } from 'react';

interface UseImagePreloaderResult {
    images: HTMLImageElement[];
    progress: number;
    isLoaded: boolean;
}

export const useImagePreloader = (urls: string[]): UseImagePreloaderResult => {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!urls.length) return;

        let loadedCount = 0;
        const total = urls.length;
        const loadedImages: HTMLImageElement[] = new Array(total);
        let isCancelled = false;

        // Load images in batches to prevent network choking
        const loadImages = async () => {
            // Create all image objects first to maintain order
            urls.forEach((url, index) => {
                const img = new Image();
                loadedImages[index] = img;
            });

            // Simple implementation: Load all (browser handles concurrency)
            // For 191 images, we might want to batch if it's too heavy,
            // but modern browsers handle this reasonably well.
            // We'll stick to basic individual loading tracking.

            const incrementProgress = () => {
                if (isCancelled) return;
                loadedCount++;
                const percent = Math.round((loadedCount / total) * 100);
                setProgress(percent);

                if (loadedCount === total) {
                    setImages(loadedImages);
                    setIsLoaded(true);
                }
            };

            urls.forEach((url, index) => {
                const img = loadedImages[index];
                img.onload = incrementProgress;
                img.onerror = incrementProgress; // Count errors as loaded to proceed
                img.src = url;
            });
        };

        loadImages();

        return () => {
            isCancelled = true;
        };
    }, [urls]);

    return { images, progress, isLoaded };
};
