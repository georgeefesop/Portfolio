'use client';

import ImageWithFallback from './ImageWithFallback';

type FeaturedItem = {
    id: string;
    title: string;
    tag: string;
    thumbnail: string;
    externalLink?: string;
};

// Curated subset — covers all four filter categories and the breadth Upwork
// buyers are looking for. Intentionally not all 15: the strip is a trailer.
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

function Card({ item }: { item: FeaturedItem }) {
    return (
        <div className="w-[312px] group">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 group-hover:border-accent-primary transition-colors">
                <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="312px"
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
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

export default function FeaturedWorkStrip() {
    const handleClick = (item: FeaturedItem) => {
        window.dispatchEvent(new CustomEvent('featured:open', { detail: { id: item.id } }));
    };

    // Two copies of the track so the marquee loops seamlessly via translateX(-50%).
    const renderCards = (keyPrefix: string) =>
        items.map((item, idx) => {
            if (item.externalLink) {
                return (
                    <a
                        key={`${keyPrefix}-${idx}`}
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block shrink-0 pointer-events-auto"
                    >
                        <Card item={item} />
                    </a>
                );
            }
            return (
                <button
                    key={`${keyPrefix}-${idx}`}
                    type="button"
                    onClick={() => handleClick(item)}
                    className="block shrink-0 pointer-events-auto text-left"
                >
                    <Card item={item} />
                </button>
            );
        });

    return (
        <div
            className="marquee-wrapper hidden md:block w-full overflow-hidden"
            style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
                maskImage: 'linear-gradient(to right, transparent 0, black 8%, black 92%, transparent 100%)',
            }}
        >
            <div className="marquee-track flex gap-16 w-max">
                {renderCards('a')}
                {renderCards('b')}
            </div>
        </div>
    );
}
