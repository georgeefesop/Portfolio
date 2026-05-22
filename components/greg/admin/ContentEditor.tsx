'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Loader2,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ImagePlus,
} from 'lucide-react';
import { resizeImage } from '@/lib/greg/image-resize';
import type {
  GregService,
  GregTestimonial,
  BusinessDetails,
} from '@/data/greg/content';
import {
  GALLERY_FILTERS,
  type GalleryItem,
  type GalleryCategory,
} from '@/data/greg/gallery';

type Tab = 'gallery' | 'services' | 'testimonials' | 'business';

const TABS: { id: Tab; label: string }[] = [
  { id: 'gallery', label: 'Photo gallery' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'business', label: 'Business details' },
];

const CATEGORIES = GALLERY_FILTERS.filter(
  (f): f is { id: GalleryCategory; label: string } => f.id !== 'all',
);

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelCls = 'mb-1 block text-xs font-medium text-text-muted';
const iconBtn =
  'inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-medium text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-30';
const addBtn =
  'inline-flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-medium px-4 py-2.5 text-sm font-medium text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary';

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export default function ContentEditor({
  gallery: g0,
  services: s0,
  testimonials: t0,
  business: b0,
}: {
  gallery: GalleryItem[];
  services: GregService[];
  testimonials: GregTestimonial[];
  business: BusinessDetails;
}) {
  const [tab, setTab] = useState<Tab>('gallery');
  const [gallery, setGallery] = useState<GalleryItem[]>(g0);
  const [services, setServices] = useState<GregService[]>(s0);
  const [testimonials, setTestimonials] = useState<GregTestimonial[]>(t0);
  const [business, setBusiness] = useState<BusinessDetails>(b0);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  function switchTab(t: Tab) {
    setTab(t);
    setSaved(false);
    setError(null);
  }

  async function save(key: Tab, data: unknown) {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/greg/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, data }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        throw new Error(d.error ?? 'Could not save.');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadImage(file: File): Promise<string | null> {
    const resized = await resizeImage(file);
    const body = new FormData();
    body.append('file', resized);
    const res = await fetch('/api/greg/admin/upload', {
      method: 'POST',
      body,
    });
    const d = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !d.url) {
      setError('Could not upload that photo. Please try again.');
      return null;
    }
    return d.url;
  }

  /* ---- gallery ---- */
  function patchGallery(id: string, patch: Partial<GalleryItem>) {
    setGallery((list) =>
      list.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );
  }
  function moveGallery(i: number, dir: -1 | 1) {
    setGallery((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }
  async function onGalleryFile(id: string, file: File) {
    setUploading(id);
    setError(null);
    const url = await uploadImage(file);
    if (url) patchGallery(id, { image: url });
    setUploading(null);
  }

  /* ---- services ---- */
  function patchService(id: string, patch: Partial<GregService>) {
    setServices((list) =>
      list.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    );
  }
  function patchPoint(id: string, pi: number, value: string) {
    setServices((list) =>
      list.map((s) =>
        s.id === id
          ? { ...s, points: s.points.map((p, i) => (i === pi ? value : p)) }
          : s,
      ),
    );
  }

  /* ---- testimonials ---- */
  function patchTestimonial(ti: number, patch: Partial<GregTestimonial>) {
    setTestimonials((list) =>
      list.map((t, i) =>
        i === ti ? { ...t, ...patch, placeholder: false } : t,
      ),
    );
  }

  function saveBar(key: Tab, data: unknown, noun: string) {
    return (
      <div className="flex flex-wrap items-center gap-3 border-t border-border-subtle pt-4">
        <button
          type="button"
          onClick={() => save(key, data)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta-bg px-5 py-2.5 text-sm font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden />
              Saving
            </>
          ) : (
            `Save ${noun}`
          )}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-accent-primary">
            <Check size={15} aria-hidden />
            Saved. It is live on your website.
          </span>
        )}
        {error && (
          <span className="text-sm text-accent-coral" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border-subtle pb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-accent-primary/15 text-accent-primary'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Gallery */}
      {tab === 'gallery' && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Your project photos. Use the arrows to put your best work at the
            top.
          </p>
          {gallery.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-secondary p-4 sm:flex-row"
            >
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-bg-tertiary sm:h-24 sm:w-36">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-text-dim">
                    No photo yet
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    patchGallery(item.id, { title: e.target.value })
                  }
                  placeholder="Project title"
                  className={field}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={item.category}
                    onChange={(e) =>
                      patchGallery(item.id, {
                        category: e.target.value as GalleryCategory,
                      })
                    }
                    className={`${field} max-w-[210px]`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border-medium px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary">
                    {uploading === item.id ? (
                      <Loader2 size={13} className="animate-spin" aria-hidden />
                    ) : (
                      <ImagePlus size={13} aria-hidden />
                    )}
                    {item.image ? 'Replace photo' : 'Upload photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        e.target.value = '';
                        if (f) onGalleryFile(item.id, f);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="flex shrink-0 gap-1 sm:flex-col">
                <button
                  type="button"
                  onClick={() => moveGallery(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className={iconBtn}
                >
                  <ArrowUp size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => moveGallery(i, 1)}
                  disabled={i === gallery.length - 1}
                  aria-label="Move down"
                  className={iconBtn}
                >
                  <ArrowDown size={14} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setGallery((g) => g.filter((x) => x.id !== item.id))
                  }
                  aria-label="Remove project"
                  className={`${iconBtn} hover:!border-accent-coral hover:!text-accent-coral`}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setGallery((g) => [
                ...g,
                { id: uid(), title: 'New project', category: 'renovations' },
              ])
            }
            className={addBtn}
          >
            <Plus size={15} aria-hidden />
            Add a project
          </button>
          {saveBar('gallery', gallery, 'gallery')}
        </div>
      )}

      {/* Services */}
      {tab === 'services' && (
        <div className="flex flex-col gap-4">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex flex-col gap-3 rounded-xl border border-border-subtle bg-bg-secondary p-4"
            >
              <div className="flex items-start gap-3">
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) =>
                    patchService(svc.id, { title: e.target.value })
                  }
                  placeholder="Service name"
                  className={`${field} font-semibold`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setServices((s) => s.filter((x) => x.id !== svc.id))
                  }
                  aria-label="Remove service"
                  className={`${iconBtn} shrink-0 hover:!border-accent-coral hover:!text-accent-coral`}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
              <textarea
                value={svc.description}
                onChange={(e) =>
                  patchService(svc.id, { description: e.target.value })
                }
                placeholder="Short description of the service"
                rows={2}
                className={field}
              />
              <div>
                <span className={labelCls}>Bullet points</span>
                <div className="flex flex-col gap-1.5">
                  {svc.points.map((p, pi) => (
                    <div key={pi} className="flex gap-2">
                      <input
                        type="text"
                        value={p}
                        onChange={(e) =>
                          patchPoint(svc.id, pi, e.target.value)
                        }
                        placeholder="A short selling point"
                        className={field}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          patchService(svc.id, {
                            points: svc.points.filter((_, i) => i !== pi),
                          })
                        }
                        aria-label="Remove point"
                        className={`${iconBtn} shrink-0`}
                      >
                        <Trash2 size={13} aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    patchService(svc.id, { points: [...svc.points, ''] })
                  }
                  className="mt-2 text-xs font-medium text-accent-primary hover:underline"
                >
                  + Add point
                </button>
              </div>
              <label className="flex w-fit cursor-pointer select-none items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={!!svc.featured}
                  onChange={(e) =>
                    patchService(svc.id, { featured: e.target.checked })
                  }
                  className="h-4 w-4 cursor-pointer accent-accent-primary"
                />
                Highlight this as the most requested service
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setServices((s) => [
                ...s,
                {
                  id: uid(),
                  title: 'New service',
                  description: '',
                  points: [''],
                },
              ])
            }
            className={addBtn}
          >
            <Plus size={15} aria-hidden />
            Add a service
          </button>
          {saveBar(
            'services',
            services.map((s) => ({
              ...s,
              points: s.points.filter((p) => p.trim() !== ''),
            })),
            'services',
          )}
        </div>
      )}

      {/* Testimonials */}
      {tab === 'testimonials' && (
        <div className="flex flex-col gap-4">
          {testimonials.map((t, ti) => (
            <div
              key={ti}
              className="flex flex-col gap-2 rounded-xl border border-border-subtle bg-bg-secondary p-4"
            >
              <div className="flex items-center justify-between">
                <span className={labelCls}>Testimonial {ti + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setTestimonials((l) => l.filter((_, i) => i !== ti))
                  }
                  aria-label="Remove testimonial"
                  className={`${iconBtn} hover:!border-accent-coral hover:!text-accent-coral`}
                >
                  <Trash2 size={14} aria-hidden />
                </button>
              </div>
              <textarea
                value={t.quote}
                onChange={(e) =>
                  patchTestimonial(ti, { quote: e.target.value })
                }
                placeholder="What the client said about the work"
                rows={3}
                className={field}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) =>
                    patchTestimonial(ti, { name: e.target.value })
                  }
                  placeholder="Client name"
                  className={field}
                />
                <input
                  type="text"
                  value={t.location}
                  onChange={(e) =>
                    patchTestimonial(ti, { location: e.target.value })
                  }
                  placeholder="Town"
                  className={field}
                />
                <input
                  type="text"
                  value={t.project}
                  onChange={(e) =>
                    patchTestimonial(ti, { project: e.target.value })
                  }
                  placeholder="Project type"
                  className={field}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setTestimonials((l) => [
                ...l,
                { quote: '', name: '', location: '', project: '' },
              ])
            }
            className={addBtn}
          >
            <Plus size={15} aria-hidden />
            Add a testimonial
          </button>
          {saveBar(
            'testimonials',
            testimonials.map((t) => ({
              quote: t.quote,
              name: t.name,
              location: t.location,
              project: t.project,
            })),
            'testimonials',
          )}
        </div>
      )}

      {/* Business details */}
      {tab === 'business' && (
        <div className="flex max-w-md flex-col gap-4">
          <div>
            <span className={labelCls}>Email address</span>
            <input
              type="email"
              value={business.email}
              onChange={(e) =>
                setBusiness((b) => ({ ...b, email: e.target.value }))
              }
              placeholder="you@example.com"
              className={field}
            />
          </div>
          <div>
            <span className={labelCls}>Registered address</span>
            <input
              type="text"
              value={business.address}
              onChange={(e) =>
                setBusiness((b) => ({ ...b, address: e.target.value }))
              }
              placeholder="Street, town, postcode"
              className={field}
            />
          </div>
          <div>
            <span className={labelCls}>VAT number (leave blank if none)</span>
            <input
              type="text"
              value={business.vatNumber}
              onChange={(e) =>
                setBusiness((b) => ({ ...b, vatNumber: e.target.value }))
              }
              placeholder="CY..."
              className={field}
            />
          </div>
          {saveBar('business', business, 'business details')}
        </div>
      )}
    </div>
  );
}
