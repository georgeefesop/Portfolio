'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion';
import ImageWithFallback from './ImageWithFallback';

type FeaturedItem = {
    id: string;
    title: string;
    tag: string;
    thumbnail: string;
    externalLink?: string;
};

// Thumbnails that ship with built-in white margins/borders - start zoomed and
// scale further on hover so the user perceives a true zoom-in, not zoom-out.
const ZOOM_IDS = new Set([
    'kingfisher-mortgages',
    'olympus-sports',
    'la-hacienda',
    'instant-access-locksmiths',
    'saxseat',
]);

const items: FeaturedItem[] = [
    { id: 'realfi', title: 'RealFi', tag: 'Cardano · Fintech', thumbnail: '/images/realfi/hero.png' },
    { id: 'kingfisher-mortgages', title: 'Kingfisher Mortgages', tag: 'WordPress · Brand', thumbnail: '/images/kingfisher/hero.png' },
    { id: 'allsop-francis', title: 'Allsop & Francis', tag: 'AI Image Direction', thumbnail: '/images/allsop-francis/2.png' },
    { id: 'uk-vehicles', title: 'UK Vehicles Cyprus', tag: 'Next.js · Commerce', thumbnail: '/images/uk-vehicles/hero.png' },
    { id: 'ai-tools', title: 'AI User Tools', tag: 'SaaS · AI', thumbnail: '/images/ai-tools/AIUT-2.png' },
    { id: 'stellar', title: 'Stellar Observatory', tag: 'Creative Code', thumbnail: '/images/stellar/so-1.png' },
    { id: 'forecast', title: 'Forecast', tag: 'Next.js · Latest', thumbnail: '/images/forecast/hero.png' },
    { id: 'instant-access-locksmiths', title: 'Instant Access Locksmiths', tag: 'Local SEO · Conversion', thumbnail: '/images/instant-access-locksmiths/hero.png' },
];

function dispatchOpen(item: FeaturedItem) {
    window.dispatchEvent(new CustomEvent('featured:open', { detail: { id: item.id } }));
}

function HorizontalCard({ item }: { item: FeaturedItem }) {
    const isInstantAccess = item.id === 'instant-access-locksmiths';
    const isZoomed = ZOOM_IDS.has(item.id);
    const zoomClass = isInstantAccess
        ? 'scale-[1.12] group-hover:scale-[1.18]'
        : isZoomed
            ? 'scale-110 group-hover:scale-[1.16]'
            : 'group-hover:scale-105';
    return (
        <div className="w-[312px] group">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 border-2 border-white/10 group-hover:border-accent-primary transition-colors">
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="312px"
                    className={`object-cover opacity-90 group-hover:opacity-100 transition-all duration-500 ${zoomClass}`}
                />
            </div>
            <div className="mt-3">
                <div className="text-base font-medium text-white truncate group-hover:text-accent-primary transition-colors">
                    {item.title}
                </div>
                <div className="mt-1.5">
                    <span className="inline-block text-xs font-mono uppercase tracking-wider text-text-muted bg-zinc-800 border border-zinc-700 px-2.5 py-1 rounded">
                        {item.tag}
                    </span>
                </div>
            </div>
        </div>
    );
}

function VerticalCard({ item }: { item: FeaturedItem }) {
    const isInstantAccess = item.id === 'instant-access-locksmiths';
    const isZoomed = ZOOM_IDS.has(item.id);
    const zoomClass = isInstantAccess ? 'scale-[1.12]' : isZoomed ? 'scale-110' : '';
    return (
        <div className="w-full group">
            <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-white/5 border-2 border-white/10">
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 312px"
                    className={`object-cover opacity-95 transition-transform duration-500 ${zoomClass}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                    <div className="text-sm font-medium text-white truncate">{item.title}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white/70 mt-0.5">{item.tag}</div>
                </div>
            </div>
        </div>
    );
}

function renderClickable(
    item: FeaturedItem,
    key: string,
    extraClass: string,
    Inner: React.ComponentType<{ item: FeaturedItem }>,
) {
    if (item.externalLink) {
        return (
            <a
                key={key}
                href={item.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`block shrink-0 pointer-events-auto ${extraClass}`}
            >
                <Inner item={item} />
            </a>
        );
    }
    return (
        <button
            key={key}
            type="button"
            onClick={() => dispatchOpen(item)}
            className={`block shrink-0 pointer-events-auto text-left ${extraClass}`}
        >
            <Inner item={item} />
        </button>
    );
}

export default function FeaturedWorkStrip({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
    if (orientation === 'vertical') return <VerticalStrip />;
    return <HorizontalStrip />;
}

function HorizontalStrip() {
    const x = useMotionValue(0);
    const [isHover, setIsHover] = useState(false);
    const speedRef = useRef(0); // current px/sec
    const halfWidth = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            if (trackRef.current) halfWidth.current = trackRef.current.scrollWidth / 2;
        };
        update();
        const ro = new ResizeObserver(update);
        if (trackRef.current) ro.observe(trackRef.current);
        return () => ro.disconnect();
    }, []);

    useAnimationFrame((_t, delta) => {
        // Asymmetric: ease to a stop on hover, snap back to full speed on leave.
        if (isHover) {
            const k = 1 - Math.exp(-delta * 0.005);
            speedRef.current += (0 - speedRef.current) * k;
        } else {
            speedRef.current = 60; // px/sec, instant resume
        }
        let next = x.get() - speedRef.current * (delta / 1000);
        if (halfWidth.current > 0 && next <= -halfWidth.current) next += halfWidth.current;
        x.set(next);
    });

    return (
        <div
            className="hidden md:block w-full overflow-hidden"
            style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            }}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <motion.div ref={trackRef} style={{ x }} className="flex gap-16 w-max will-change-transform">
                {items.map((item, idx) => renderClickable(item, `a-${idx}`, '', HorizontalCard))}
                {items.map((item, idx) => renderClickable(item, `b-${idx}`, '', HorizontalCard))}
            </motion.div>
        </div>
    );
}

function VerticalStrip() {
    const y = useMotionValue(0);
    const speedRef = useRef(0);
    const halfHeight = useRef(0);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            if (trackRef.current) halfHeight.current = trackRef.current.scrollHeight / 2;
        };
        update();
        const ro = new ResizeObserver(update);
        if (trackRef.current) ro.observe(trackRef.current);
        return () => ro.disconnect();
    }, []);

    useAnimationFrame((_t, delta) => {
        // Always at full speed on mobile - no hover pause needed.
        const target = 35; // px/sec, slower than horizontal
        const k = 1 - Math.exp(-delta * 0.003);
        speedRef.current += (target - speedRef.current) * k;
        let next = y.get() - speedRef.current * (delta / 1000);
        if (halfHeight.current > 0 && next <= -halfHeight.current) next += halfHeight.current;
        y.set(next);
    });

    return (
        <div
            className="md:hidden w-full h-full overflow-hidden"
            style={{
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 14%, black 86%, transparent 100%)',
                maskImage: 'linear-gradient(to bottom, transparent 0, black 14%, black 86%, transparent 100%)',
            }}
        >
            <motion.div ref={trackRef} style={{ y }} className="flex flex-col gap-5 h-max will-change-transform px-6">
                {items.map((item, idx) => renderClickable(item, `va-${idx}`, 'block w-full', VerticalCard))}
                {items.map((item, idx) => renderClickable(item, `vb-${idx}`, 'block w-full', VerticalCard))}
            </motion.div>
        </div>
    );
}
