'use client';

import { useEffect, useRef, useCallback } from 'react';

const CELL = 20;

export default function HeroGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDarkRef = useRef(true);

    const drawGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
        ctx.clearRect(0, 0, w, h);
        ctx.strokeStyle = isDarkRef.current ? 'rgba(255,255,255,0.20)' : 'rgba(42,36,29,0.18)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        const cols = Math.ceil(w / CELL) + 1;
        const rows = Math.ceil(h / CELL) + 1;
        for (let c = 0; c <= cols; c++) {
            ctx.moveTo(c * CELL, 0);
            ctx.lineTo(c * CELL, h);
        }
        for (let r = 0; r <= rows; r++) {
            ctx.moveTo(0, r * CELL);
            ctx.lineTo(w, r * CELL);
        }
        ctx.stroke();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const render = () => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            const dpr = window.devicePixelRatio || 1;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const w = canvas.width / dpr;
            const h = canvas.height / dpr;
            drawGrid(ctx, w, h);
        };

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            render();
        };

        const updateTheme = () => {
            const theme = document.documentElement.dataset.theme ?? '';
            isDarkRef.current = !theme.startsWith('light-');
            render();
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        updateTheme();

        resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
        };
    }, [drawGrid]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}
