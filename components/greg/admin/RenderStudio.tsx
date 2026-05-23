'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  CheckSquare,
  Download,
  Loader2,
  Send,
  Share2,
  Sparkles,
  Square,
  Upload,
  X,
} from 'lucide-react';
import { resizeImage } from '@/lib/greg/image-resize';

const MAX_REFS = 4;
const MAX_COUNT = 4;

const field =
  'w-full rounded-lg border border-border-medium bg-bg-tertiary px-3.5 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-dim focus:border-accent-primary';
const labelClass = 'mb-1.5 block text-xs font-medium text-text-muted';

type Job = {
  id: string;
  status: string;
  image_url: string | null;
  error: string | null;
};

type Quota = { used: number; cap: number; remaining: number };

/** A live MM:SS-ish elapsed counter, started when a batch is generating. */
function Elapsed({ since }: { since: number }) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const tick = () => setSecs(Math.floor((Date.now() - since) / 1000));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [since]);
  return <span>{secs}s</span>;
}

export default function RenderStudio({
  initialQuota,
}: {
  initialQuota: Quota;
}) {
  const [brief, setBrief] = useState('');
  const [count, setCount] = useState(1);
  const [refs, setRefs] = useState<File[]>([]);
  const [quota, setQuota] = useState<Quota>(initialQuota);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [batchId, setBatchId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const generating = jobs.some((j) => j.status === 'generating');

  // --- Reference photo upload -------------------------------------------------
  const onFiles = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(e.target.files ?? []);
      e.target.value = '';
      if (!picked.length) return;
      const room = MAX_REFS - refs.length;
      const resized = await Promise.all(
        picked.slice(0, room).map((f) => resizeImage(f)),
      );
      setRefs((prev) => [...prev, ...resized]);
    },
    [refs.length],
  );

  function removeRef(idx: number) {
    setRefs((prev) => prev.filter((_, i) => i !== idx));
  }

  // --- Poll the batch while anything is still generating ----------------------
  const poll = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/greg/render-studio?batch=${id}`);
      const data = (await res.json()) as { jobs?: Job[]; quota?: Quota };
      if (data.jobs) setJobs(data.jobs);
      if (data.quota) setQuota(data.quota);
    } catch {
      // Transient - the next tick retries.
    }
  }, []);

  useEffect(() => {
    if (!batchId || !generating) return;
    const id = window.setInterval(() => {
      void poll(batchId);
    }, 2500);
    return () => window.clearInterval(id);
  }, [batchId, generating, poll]);

  // --- Submit -----------------------------------------------------------------
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || generating) return;
    if (!brief.trim()) {
      setError('Describe the render you want to create.');
      return;
    }
    if (count > quota.remaining) {
      setError(
        quota.remaining === 0
          ? `No renders left this week. The limit resets as older renders age past 7 days.`
          : `You have ${quota.remaining} render${quota.remaining === 1 ? '' : 's'} left this week. Lower the count.`,
      );
      return;
    }

    setError(null);
    setSubmitting(true);
    setSelected(new Set());
    // Optimistic placeholder tiles so the loader shows the moment we submit.
    setJobs(
      Array.from({ length: count }, (_, i) => ({
        id: `pending-${i}`,
        status: 'generating',
        image_url: null,
        error: null,
      })),
    );
    setBatchId(null);
    setStartedAt(Date.now());

    try {
      const body = new FormData();
      body.set('brief', brief.trim());
      body.set('count', String(count));
      refs.forEach((f) => body.append('refs', f));

      const res = await fetch('/api/greg/render-studio', {
        method: 'POST',
        body,
      });
      const data = (await res.json()) as {
        batchId?: string;
        quota?: Quota;
        error?: string;
      };
      if (data.quota) setQuota(data.quota);

      if (!res.ok || !data.batchId) {
        setJobs([]);
        setError(messageFor(data.error));
        setSubmitting(false);
        return;
      }

      setBatchId(data.batchId);
      // The POST already finished the work; fetch the final job rows.
      await poll(data.batchId);
    } catch {
      setJobs([]);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // --- Result selection + download -------------------------------------------
  const done = jobs.filter((j) => j.status === 'done' && j.image_url);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function downloadOne(url: string, idx: number) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `render-${idx + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }

  async function downloadSelected() {
    const picked = done.filter((j) => selected.has(j.id));
    for (let i = 0; i < picked.length; i++) {
      await downloadOne(picked[i].image_url as string, i);
    }
  }

  async function share(url: string) {
    const text = 'Here is a design render from G.E. Revamp Services.';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Design render', text, url });
        return;
      } catch {
        // User dismissed or share failed - fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      window.alert('Image link copied. Paste it anywhere to share.');
    } catch {
      window.open(url, '_blank', 'noopener');
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Quota banner */}
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border-subtle bg-bg-secondary px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Sparkles size={15} className="text-accent-primary" aria-hidden />
          <span>
            <strong className="text-text-primary">{quota.remaining}</strong> of{' '}
            {quota.cap} renders left this week
          </span>
        </div>
        <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-bg-tertiary sm:block">
          <div
            className="h-full rounded-full bg-accent-primary transition-all"
            style={{
              width: `${(quota.remaining / quota.cap) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Brief form */}
      <form
        onSubmit={submit}
        className="rounded-2xl border border-border-subtle bg-bg-secondary p-6 md:p-7"
      >
        <h2 className="text-h4 font-bold tracking-tight text-text-primary">
          Describe the render
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Write it the way you would explain it to a client. The studio turns
          your words into a realistic visual.
        </p>

        <div className="mt-5">
          <label htmlFor="rs-brief" className={labelClass}>
            What do you want to show?
          </label>
          <textarea
            id="rs-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="A single-storey extension on the back of a stone village house, white render with limestone detail, large sliding doors onto a paved terrace with an olive tree..."
            rows={5}
            className={field}
            disabled={submitting || generating}
          />
        </div>

        {/* Reference photos */}
        <div className="mt-5">
          <span className={labelClass}>
            Reference photos (optional, up to {MAX_REFS})
          </span>
          <div className="flex flex-wrap gap-2.5">
            {refs.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-bg-tertiary py-1.5 pl-2.5 pr-1.5 text-xs text-text-secondary"
              >
                <span className="max-w-[140px] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeRef(i)}
                  className="rounded p-0.5 text-text-muted transition-colors hover:text-accent-coral"
                  aria-label={`Remove ${f.name}`}
                >
                  <X size={13} aria-hidden />
                </button>
              </span>
            ))}
            {refs.length < MAX_REFS && (
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border-medium px-3 py-1.5 text-xs font-medium text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary">
                <Upload size={13} aria-hidden />
                Add photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFiles}
                  className="hidden"
                  disabled={submitting || generating}
                />
              </label>
            )}
          </div>
        </div>

        {/* Count */}
        <div className="mt-5">
          <span className={labelClass}>How many renders?</span>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-lg border border-border-medium bg-bg-tertiary">
              <button
                type="button"
                onClick={() => setCount((c) => Math.max(1, c - 1))}
                disabled={count <= 1 || submitting || generating}
                className="px-3.5 py-2 text-lg leading-none text-text-secondary disabled:opacity-40"
                aria-label="Fewer renders"
              >
                -
              </button>
              <span className="w-9 text-center text-sm font-semibold text-text-primary">
                {count}
              </span>
              <button
                type="button"
                onClick={() => setCount((c) => Math.min(MAX_COUNT, c + 1))}
                disabled={count >= MAX_COUNT || submitting || generating}
                className="px-3.5 py-2 text-lg leading-none text-text-secondary disabled:opacity-40"
                aria-label="More renders"
              >
                +
              </button>
            </div>
            <span className="text-sm text-text-muted">
              Each one uses a render from your weekly limit
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || generating || quota.remaining === 0}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-cta-bg px-7 py-3.5 font-semibold text-cta-fg transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting || generating ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden />
              Creating your renders
            </>
          ) : (
            <>
              <Send size={17} aria-hidden />
              Create {count} render{count === 1 ? '' : 's'}
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-xs text-accent-coral" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* Results */}
      {jobs.length > 0 && (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h4 font-bold tracking-tight text-text-primary">
              {generating ? 'Creating your renders' : 'Your renders'}
            </h2>
            {done.length > 1 && (
              <button
                type="button"
                onClick={downloadSelected}
                disabled={selected.size === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-medium px-3.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={13} aria-hidden />
                Download selected ({selected.size})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jobs.map((job, i) => (
              <RenderTile
                key={job.id}
                job={job}
                index={i}
                startedAt={startedAt}
                selectable={done.length > 1}
                checked={selected.has(job.id)}
                onToggle={() => toggleSelect(job.id)}
                onDownload={() =>
                  job.image_url && downloadOne(job.image_url, i)
                }
                onShare={() => job.image_url && share(job.image_url)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------

function RenderTile({
  job,
  index,
  startedAt,
  selectable,
  checked,
  onToggle,
  onDownload,
  onShare,
}: {
  job: Job;
  index: number;
  startedAt: number;
  selectable: boolean;
  checked: boolean;
  onToggle: () => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  if (job.status === 'failed') {
    return (
      <div className="flex aspect-[16/9] flex-col items-center justify-center rounded-xl border border-border-subtle bg-bg-tertiary p-4 text-center">
        <X size={22} className="text-accent-coral" aria-hidden />
        <p className="mt-2 text-xs text-accent-coral">
          {job.error ?? 'This render failed. Please try again.'}
        </p>
      </div>
    );
  }

  if (job.status !== 'done' || !job.image_url) {
    return (
      <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2.5 rounded-xl border border-border-subtle bg-bg-tertiary">
        <Loader2
          size={26}
          className="animate-spin text-accent-primary"
          aria-hidden
        />
        <span className="text-xs font-medium text-text-muted">
          Render {index + 1} ·{' '}
          {startedAt ? <Elapsed since={startedAt} /> : '0s'}
        </span>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-border-subtle bg-bg-tertiary">
      <div className="relative aspect-[16/9]">
        <Image
          src={job.image_url}
          alt={`Design render ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          unoptimized
        />
        {selectable && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute left-2 top-2 inline-flex items-center justify-center rounded-md bg-black/65 p-1.5 text-white transition-colors hover:bg-black/80"
            aria-label={checked ? 'Deselect render' : 'Select render'}
            aria-pressed={checked}
          >
            {checked ? (
              <CheckSquare size={16} className="text-accent-primary" aria-hidden />
            ) : (
              <Square size={16} aria-hidden />
            )}
          </button>
        )}
      </div>
      <figcaption className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 rounded-md bg-cta-bg px-3 py-1.5 text-xs font-semibold text-cta-fg transition-all hover:brightness-95"
        >
          <Download size={13} aria-hidden />
          Download
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `A design render from G.E. Revamp Services: ${job.image_url}`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-md border border-border-medium px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24s8.24 3.7 8.24 8.24-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
          </svg>
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-medium px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
        >
          <Share2 size={13} aria-hidden />
          Share
        </button>
      </figcaption>
    </figure>
  );
}

function messageFor(code: string | undefined): string {
  switch (code) {
    case 'render_unavailable':
      return 'The render studio is not set up yet. Please try again later.';
    case 'prompt_failed':
      return 'Could not understand the brief well enough. Try describing it with a bit more detail.';
    case 'render_failed':
      return 'The images could not be generated. Please try again in a moment.';
    case 'ref_upload_failed':
      return 'Your reference photos could not be processed. Try smaller images, or remove them and describe the project in the brief instead.';
    case 'invalid_form':
      return 'Something went wrong with the upload. Please try again.';
    case undefined:
      return 'Something went wrong. Please try again.';
    default:
      // Server sent a human-readable message (quota / validation).
      return code;
  }
}
