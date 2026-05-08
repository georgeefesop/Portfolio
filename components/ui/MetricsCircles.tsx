'use client';

import { motion } from 'framer-motion';

export interface MetricsCirclesProps {
    metrics: Array<{ label: string; value: string }>;
    /** When true, draws a thin top border above the grid (used inside case-study bodies). */
    bordered?: boolean;
    /** Ring diameter in px. Default 88. Use ~64 for tighter density. */
    size?: number;
    /** Column count at sm+. Defaults to 4 to preserve existing call sites. */
    columns?: 2 | 3 | 4;
}

/**
 * Animated SVG ring grid that treats numeric values 0-100 as a fill percentage.
 * Anything that doesn't parse cleanly falls back to a full ring so the visual still reads.
 *
 * Originally lived inside CaseStudyModal.tsx; extracted so the homepage SpeedProof
 * section can reuse the exact same animation for the build-comparison block.
 */
export default function MetricsCircles({ metrics, bordered = true, size = 88, columns = 4 }: MetricsCirclesProps) {
    const RADIUS = 38;
    const CIRC = 2 * Math.PI * RADIUS;
    const colsClass = columns === 2
        ? 'grid-cols-2'
        : columns === 3
            ? 'grid-cols-2 sm:grid-cols-3'
            : 'grid-cols-2 sm:grid-cols-4';
    const wrapperClass = bordered
        ? `metrics-circles-root grid ${colsClass} gap-x-3 gap-y-5 border-t border-border-subtle pt-5`
        : `metrics-circles-root grid ${colsClass} gap-x-3 gap-y-5`;
    const valueTextClass = size >= 80
        ? 'metrics-circles-value absolute inset-0 flex items-center justify-center text-text-primary text-2xl md:text-[26px] font-semibold tracking-tight tabular-nums'
        : 'metrics-circles-value absolute inset-0 flex items-center justify-center text-text-primary text-lg md:text-xl font-semibold tracking-tight tabular-nums';
    return (
        <div className={wrapperClass}>
            {metrics.map((m, i) => {
                const num = parseFloat(m.value);
                const pct = Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 100;
                const offset = CIRC * (1 - pct / 100);
                return (
                    <div key={i} className="metrics-circles-item flex flex-col items-center text-center gap-2.5">
                        <div className="metrics-circles-ring relative" style={{ width: size, height: size }}>
                            <svg viewBox="0 0 100 100" className="metrics-circles-svg w-full h-full -rotate-90">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--color-border-subtle, rgba(255,255,255,0.08))"
                                    strokeWidth="6"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--color-accent-primary, #AB7B62)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRC}
                                    initial={{ strokeDashoffset: CIRC }}
                                    whileInView={{ strokeDashoffset: offset }}
                                    viewport={{ once: true, margin: '-10% 0px' }}
                                    transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                                />
                            </svg>
                            <span className={valueTextClass}>{m.value}</span>
                        </div>
                        <span className="metrics-circles-label text-[10px] md:text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-text-muted leading-tight max-w-[14ch]">
                            {m.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/** Convenience wrapper for places that always want bordered=false. */
export function MetricsCirclesPlain(props: Omit<MetricsCirclesProps, 'bordered'>) {
    return <MetricsCircles {...props} bordered={false} />;
}
