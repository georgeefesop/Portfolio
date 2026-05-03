'use client';

import { useEffect, useRef, useCallback } from 'react';

const CELL = 40;
const DECAY = 0.91;
const TRAIL_MAX_DARK = 0.18;
const TRAIL_MAX_LIGHT = 0.10;
const THRESHOLD = 0.004;

export default function HeroGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cellsRef = useRef<Map<string, number>>(new Map());
    const isDarkRef = useRef(true);
    const rafRef = useRef<number | null>(null);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const isDark = isDarkRef.current;
        const trailMax = isDark ? TRAIL_MAX_DARK : TRAIL_MAX_LIGHT;

        ctx.clearRect(0, 0, w, h);

        // Decay cells and fill highlights
        const cells = cellsRef.current;
        const toDelete: string[] = [];
        cells.forEach((alpha, key) => {
            const next = alpha * DECAY;
            if (next < THRESHOLD) { toDelete.push(key); return; }
            cells.set(key, next);
            const [col, row] = key.split(',').map(Number);
            ctx.fillStyle = isDark
                ? `rgba(255,255,255,${next})`
                : `rgba(0,0,0,${next})`;
            ctx.fillRect(col * CELL, row * CELL, CELL, CELL);
        });
        toDelete.forEach(k => cells.delete(k));

        // Draw grid lines on top
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(42,36,29,0.18)';
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

        rafRef.current = requestAnimationFrame(draw);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const col = Math.floor((e.clientX - rect.left) / CELL);
            const row = Math.floor((e.clientY - rect.top) / CELL);
            if (col < 0 || row < 0) return;
            const trailMax = isDarkRef.current ? TRAIL_MAX_DARK : TRAIL_MAX_LIGHT;
            cellsRef.current.set(`${col},${row}`, trailMax);
        };

        const updateTheme = () => {
            const theme = document.documentElement.dataset.theme ?? '';
            isDarkRef.current = !theme.startsWith('light-');
        };

        const observer = new MutationObserver(updateTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        updateTheme();

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [draw]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}
