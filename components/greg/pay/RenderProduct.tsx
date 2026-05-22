'use client';

import { useState } from 'react';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { Check, ChevronDown, Loader2, Sparkles, Upload, X } from 'lucide-react';
import {
  renderContent,
  renderExamples,
  RENDER_PRICE_EUR,
  RENDER_MAX_QUANTITY,
} from '@/data/greg/renders';
import { resizeImage } from '@/lib/greg/image-resize';
import { whatsappUrl } from '@/lib/greg/site';

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';
const MAX_IMAGES = 5;
const MAX_TOTAL_BYTES = 4_300_000;

export default function RenderProduct({
  uploadsEnabled = true,
}: {
  uploadsEnabled?: boolean;
}) {
  const posthog = usePostHog();
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [styleNotes, setStyleNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const singleExamples = renderExamples.filter((ex) => ex.image);
  const ba = renderExamples.find((ex) => ex.beforeImage && ex.afterImage);
  const total = RENDER_PRICE_EUR * quantity;

  function toggle() {
    setExpanded((v) => {
      if (!v) posthog?.capture('render_card_expanded');
      return !v;
    });
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!picked.length) return;
    const room = MAX_IMAGES - files.length;
    const resized = await Promise.all(
      picked.slice(0, room).map((f) => resizeImage(f)),
    );
    setFiles((prev) => [...prev, ...resized]);
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!description.trim()) {
      setError('Tell us what you would like rendered.');
      return;
    }
    if (files.reduce((s, f) => s + f.size, 0) > MAX_TOTAL_BYTES) {
      setError(
        'Those photos are a bit large together. Remove one, or send them on WhatsApp instead.',
      );
      return;
    }
    setError(null);
    setLoading(true);
    posthog?.capture('render_checkout_started', { quantity });
    try {
      const body = new FormData();
      body.set('projectDescription', description.trim());
      body.set('location', location.trim());
      body.set('whatsapp', whatsapp.trim());
      body.set('styleNotes', styleNotes.trim());
      body.set('quantity', String(quantity));
      files.forEach((f) => body.append('images', f));
      const res = await fetch('/api/greg/render-order', {
        method: 'POST',
        body,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'checkout_failed');
      window.location.href = data.url;
    } catch (err) {
      setError(
        err instanceof Error && err.message !== 'checkout_failed'
          ? err.message
          : 'Something went wrong. Please try again or message us on WhatsApp.',
      );
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-accent-primary bg-bg-elevated shadow-lg shadow-accent-primary/10">
      {/* Header - always visible, click to expand/collapse */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        className="block w-full p-6 text-left md:p-8"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent-primary">
          <Sparkles size={12} aria-hidden />
          {renderContent.eyebrow}
        </span>
        <div className="mt-3 flex items-start justify-between gap-4">
          <h2 className="font-serif text-h2 leading-tight tracking-tight text-text-primary">
            {renderContent.title}
          </h2>
          <ChevronDown
            size={22}
            aria-hidden
            className={`mt-1 shrink-0 text-text-muted transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
          {renderContent.blurb}
        </p>

        {/* First row of examples - always visible */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {singleExamples.map((ex) => (
            <figure
              key={ex.id}
              className="overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={ex.image as string}
                  alt={ex.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 230px"
                />
              </div>
            </figure>
          ))}
        </div>

        {/* Price + collapsed prompt */}
        {!expanded && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-text-primary">
                EUR {RENDER_PRICE_EUR}
              </span>
              <span className="text-sm text-text-muted">
                {renderContent.priceNote}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-cta-bg px-5 py-2.5 text-sm font-semibold text-cta-fg">
              {renderContent.cta}
              <ChevronDown size={15} aria-hidden />
            </span>
          </div>
        )}
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-border-subtle px-6 pb-8 pt-6 md:px-8">
          {/* Before/after example */}
          {ba && (
            <figure className="overflow-hidden rounded-lg border border-border-subtle bg-bg-secondary">
              <div className="grid grid-cols-2">
                {(
                  [
                    ['Before', ba.beforeImage as string],
                    ['After', ba.afterImage as string],
                  ] as const
                ).map(([label, src]) => (
                  <div key={label} className="relative aspect-[3/2]">
                    <Image
                      src={src}
                      alt={`${ba.title} - ${label}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 340px"
                    />
                    <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <figcaption className="px-3 py-2.5 text-xs font-medium text-text-secondary">
                {ba.title}
              </figcaption>
            </figure>
          )}

          {/* What's included */}
          <ul className="mt-6 space-y-2">
            {renderContent.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <Check
                  size={15}
                  className="mt-0.5 shrink-0 text-accent-primary"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Pre-payment intake form */}
          <form onSubmit={submit} className="mt-7 flex flex-col gap-4">
            <h3 className="text-h4 font-bold tracking-tight text-text-primary">
              Tell us what to render
            </h3>

            <div>
              <label htmlFor="rp-desc" className={labelClass}>
                What would you like rendered?
              </label>
              <textarea
                id="rp-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the project: a single-storey extension on the back of the house, an outdoor kitchen, a new boundary wall and gate..."
                rows={4}
                className={field}
              />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label htmlFor="rp-loc" className={labelClass}>
                  Where is the property?
                </label>
                <input
                  id="rp-loc"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Town or area"
                  className={field}
                />
              </div>
              <div className="flex-1">
                <label htmlFor="rp-wa" className={labelClass}>
                  Your WhatsApp number
                </label>
                <input
                  id="rp-wa"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+357 99 123456"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="rp-style" className={labelClass}>
                Style or material notes (optional)
              </label>
              <input
                id="rp-style"
                type="text"
                value={styleNotes}
                onChange={(e) => setStyleNotes(e.target.value)}
                placeholder="e.g. limestone and white render, modern look"
                className={field}
              />
            </div>

            {/* Reference photos */}
            {uploadsEnabled ? (
              <div>
                <span className={labelClass}>
                  Reference photos (optional, up to {MAX_IMAGES})
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {files.map((f, i) => (
                    <span
                      key={`${f.name}-${i}`}
                      className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-tertiary py-1.5 pl-2.5 pr-1.5 text-xs text-text-secondary"
                    >
                      <span className="max-w-[140px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="rounded p-0.5 text-text-muted transition-colors hover:text-accent-coral"
                        aria-label={`Remove ${f.name}`}
                      >
                        <X size={13} aria-hidden />
                      </button>
                    </span>
                  ))}
                  {files.length < MAX_IMAGES && (
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border-medium px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary">
                      <Upload size={13} aria-hidden />
                      Add photos
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={onFiles}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-text-muted">
                Have photos of the site? Gregory will ask for them on WhatsApp.
              </p>
            )}

            {/* Quantity */}
            <div>
              <span className={labelClass}>How many renders?</span>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center rounded-lg border border-border-medium bg-bg-tertiary">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2 text-lg leading-none text-text-secondary disabled:opacity-40"
                    aria-label="Fewer renders"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-text-primary">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((q) => Math.min(RENDER_MAX_QUANTITY, q + 1))
                    }
                    disabled={quantity >= RENDER_MAX_QUANTITY}
                    className="px-3.5 py-2 text-lg leading-none text-text-secondary disabled:opacity-40"
                    aria-label="More renders"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-text-muted">
                  EUR {RENDER_PRICE_EUR} each
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-bg px-7 py-3.5 font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                  Redirecting to payment
                </>
              ) : (
                `Continue to payment - EUR ${total}`
              )}
            </button>

            {error && (
              <p className="text-xs text-accent-coral" role="alert">
                {error}
              </p>
            )}

            <p className="text-center text-xs text-text-muted">
              Prefer to talk it through first?{' '}
              <a
                href={whatsappUrl(
                  'Hello, I would like to ask about a same-day design render.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent-primary hover:underline"
              >
                Message us on WhatsApp
              </a>
            </p>
          </form>
        </div>
      )}
    </section>
  );
}
