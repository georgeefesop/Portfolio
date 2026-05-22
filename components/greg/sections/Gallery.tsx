'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import FadeIn from '@/components/motion/FadeIn';
import PhotoPlaceholder from '../PhotoPlaceholder';
import {
  GALLERY_FILTERS,
  type GalleryCategory,
  type GalleryItem,
} from '@/data/greg/gallery';
import { projectsIntro } from '@/data/greg/content';

/** Thumbnail source for a card: the finished/after photo, or the single image. */
function thumbSrc(item: GalleryItem): string | null {
  return item.afterImage ?? item.image ?? null;
}

export default function Gallery({ items: allItems }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryCategory | 'all'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items =
    filter === 'all'
      ? allItems
      : allItems.filter((i) => i.category === filter);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((v) =>
        v === null ? v : (v + dir + items.length) % items.length,
      ),
    [items.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, close, step]);

  const active = lightbox !== null ? items[lightbox] : null;

  return (
    <section id="projects" className="scroll-mt-24 bg-bg-primary py-14 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-8 max-w-2xl">
            <h2 className="font-serif text-h1 leading-[0.98] tracking-tight text-text-primary">
              {projectsIntro.heading}
            </h2>
            <p className="mt-3 text-base text-text-secondary md:text-lg">
              {projectsIntro.sub}
            </p>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {GALLERY_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setFilter(f.id);
                  setLightbox(null);
                }}
                aria-pressed={filter === f.id}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'border-accent-primary bg-accent-primary/15 text-accent-primary'
                    : 'border-border-medium text-text-muted hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const src = thumbSrc(item);
            return (
              <FadeIn key={item.id} delay={(i % 3) * 0.08}>
                <button
                  type="button"
                  onClick={() => setLightbox(i)}
                  className="group block w-full overflow-hidden rounded-lg border border-border-medium bg-bg-secondary text-left transition-colors duration-300 hover:border-accent-primary/60"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    {src ? (
                      <Image
                        src={src}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <PhotoPlaceholder
                        label={item.title}
                        className="absolute inset-0"
                      />
                    )}
                    {item.video && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white">
                          <Play size={20} fill="currentColor" aria-hidden />
                        </span>
                      </span>
                    )}
                    {item.beforeImage && item.afterImage && (
                      <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Before / After
                      </span>
                    )}
                  </div>
                  <p className="p-4 text-sm font-semibold text-text-primary">
                    {item.title}
                  </p>
                </button>
              </FadeIn>
            );
          })}
        </div>

        {items.length === 0 && (
          <p className="py-12 text-center text-text-muted">
            No projects in this category yet.
          </p>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} aria-hidden />
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft size={22} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight size={22} aria-hidden />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl"
            >
              {active.video ? (
                <video
                  src={active.video}
                  controls
                  autoPlay
                  className="max-h-[78vh] w-full rounded-lg bg-black"
                />
              ) : active.beforeImage && active.afterImage ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      ['Before', active.beforeImage],
                      ['After', active.afterImage],
                    ] as const
                  ).map(([label, img]) => (
                    <div key={label}>
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-black">
                        <Image
                          src={img}
                          alt={`${active.title} - ${label}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                      <p className="mt-1.5 text-center text-xs font-semibold uppercase tracking-wider text-white/70">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : active.image ? (
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg bg-black">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                </div>
              ) : (
                <PhotoPlaceholder
                  label={active.title}
                  aspect="3 / 2"
                  className="w-full rounded-lg"
                />
              )}
              <p className="mt-3 text-center text-sm font-medium text-white">
                {active.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
