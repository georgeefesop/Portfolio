'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Trash2, Lock, RotateCcw } from 'lucide-react';
import type { TimeEntryRow } from '@/lib/admin/billing';
import {
  eur,
  netMinutes,
  composeStamp,
  clockToMinutes,
  stampToClock,
  stampToLabel,
  minsToHours,
  fmtHours,
  weekdayShort,
  formatDMY,
  BREAK_OPTIONS,
} from '@/lib/admin/time';

const cellInput =
  'w-full rounded-md border border-border-subtle bg-bg-tertiary px-2 py-1 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary disabled:opacity-60 [&::-webkit-calendar-picker-indicator]:hidden';

type Draft = {
  id: string;
  work_date: string;
  start: string; // HH:MM, blank until set
  end: string; // HH:MM, blank until set
  break_hours: number;
  hours_manual: number; // net hours, used when start/end are not both set
  work_done: string;
  comment: string;
  billable: boolean;
  rate_cents_applied: number | null;
  invoice_id: string | null;
};

function toDraft(e: TimeEntryRow): Draft {
  return {
    id: e.id,
    work_date: e.work_date,
    start: stampToClock(e.started_at),
    end: stampToClock(e.ended_at),
    break_hours: minsToHours(e.break_minutes),
    hours_manual: e.hours,
    work_done: e.work_done,
    comment: e.comment,
    billable: e.billable,
    rate_cents_applied: e.rate_cents_applied,
    invoice_id: e.invoice_id,
  };
}

// A row is in clock mode once it has both a start and an end time.
function hasClock(d: Draft): boolean {
  return Boolean(d.start && d.end);
}

// Net worked minutes for a draft: derived from start/end when both are set,
// otherwise the manually entered hours.
function draftNetMinutes(d: Draft): number {
  if (hasClock(d)) {
    return netMinutes(d.start, d.end, (Number(d.break_hours) || 0) * 60) ?? 0;
  }
  return Math.max(0, Math.round((Number(d.hours_manual) || 0) * 60));
}

// Gross clock span in minutes (end - start, overnight-aware), or null when
// either time is missing.
function grossMinutes(d: Draft): number | null {
  if (!(d.start && d.end)) return null;
  const s = clockToMinutes(d.start);
  const e = clockToMinutes(d.end);
  if (s === null || e === null) return null;
  let span = e - s;
  if (span <= 0) span += 24 * 60;
  return span;
}

// The subset that matters for dirty-tracking + saving.
function fingerprint(d: Draft): string {
  return JSON.stringify([
    d.work_date,
    d.start,
    d.end,
    d.break_hours,
    d.hours_manual,
    d.work_done,
    d.comment,
    d.billable,
  ]);
}

export default function TimeTable({ entries }: { entries: TimeEntryRow[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Draft[]>(() => entries.map(toDraft));
  const [merge, setMerge] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Draft[][]>([]);

  // Refs so the keyboard-undo handler always sees the latest state.
  const draftsRef = useRef(drafts);
  const historyRef = useRef(history);
  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  // Undo the last cell edit (Ctrl/Cmd+Z), stepping back through the history.
  const undo = useCallback(() => {
    const h = historyRef.current;
    if (!h.length) return;
    setDrafts(h[h.length - 1]);
    setHistory((cur) => cur.slice(0, -1));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === 'z' &&
        historyRef.current.length
      ) {
        e.preventDefault();
        undo();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo]);

  // Re-seed drafts whenever the server data changes (after a save/delete
  // triggers router.refresh()); fresh server state clears the undo history.
  useEffect(() => {
    setDrafts(entries.map(toDraft));
    setHistory([]);
  }, [entries]);

  const originals = useMemo(() => {
    const m = new Map<string, string>();
    entries.forEach((e) => m.set(e.id, fingerprint(toDraft(e))));
    return m;
  }, [entries]);

  const dirtyIds = useMemo(
    () =>
      drafts
        .filter((d) => !d.invoice_id && fingerprint(d) !== originals.get(d.id))
        .map((d) => d.id),
    [drafts, originals],
  );

  function patch<K extends keyof Draft>(id: string, key: K, value: Draft[K]) {
    const snapshot = draftsRef.current;
    setHistory((h) => [...h.slice(-99), snapshot]);
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? ({ ...d, [key]: value } as Draft) : d)),
    );
  }

  async function saveAll() {
    if (dirtyIds.length === 0) return;
    setSaving(true);
    setError(null);
    const dirty = drafts.filter((d) => dirtyIds.includes(d.id));
    const payload = dirty.map((d) => {
      const duration = draftNetMinutes(d);
      const overnight =
        (clockToMinutes(d.end) ?? 0) <= (clockToMinutes(d.start) ?? 0);
      return {
        id: d.id,
        work_date: d.work_date,
        started_at: d.start ? composeStamp(d.work_date, d.start) : null,
        ended_at: d.end
          ? composeStamp(d.work_date, d.end, overnight && Boolean(d.start))
          : null,
        break_minutes: Math.round((Number(d.break_hours) || 0) * 60),
        duration_minutes: duration,
        work_done: d.work_done,
        comment: d.comment,
        billable: d.billable,
      };
    });
    try {
      const res = await fetch('/api/admin/time', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries: payload }),
      });
      const data = (await res.json().catch(() => null)) as {
        failed?: number;
        results?: { ok: boolean; error?: string }[];
      } | null;
      if (!res.ok && res.status !== 207) {
        throw new Error(res.status === 401 ? 'Session expired.' : 'Save failed.');
      }
      if (data?.failed) {
        const first = data.results?.find((r) => !r.ok)?.error;
        setError(`${data.failed} row(s) failed${first ? `: ${first}` : ''}.`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  function discardAll() {
    if (
      dirtyIds.length &&
      !window.confirm(`Discard ${dirtyIds.length} unsaved change(s)?`)
    ) {
      return;
    }
    setDrafts(entries.map(toDraft));
    setHistory([]);
    setError(null);
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch('/api/admin/time', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || 'Delete failed.');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  }

  // Totals across the loaded entries (billable only).
  const totals = useMemo(() => {
    let mins = 0;
    let cents = 0;
    entries.forEach((e) => {
      if (e.billable) {
        mins += e.duration_minutes;
        cents += e.amount_cents;
      }
    });
    return { hours: minsToHours(mins), cents };
  }, [entries]);

  // Merge-by-day aggregation (read-only preview of 1-line-per-day invoicing).
  // Numbers aggregate each day's BILLABLE entries (what an invoice line bills);
  // `count` tracks every entry so the Bill column can show billable / total.
  type DayAgg = {
    date: string;
    startIso: string | null;
    endIso: string | null;
    startMs: number | null;
    endMs: number | null;
    grossMin: number;
    hasTimes: boolean;
    breakMin: number;
    billedMin: number;
    cents: number;
    rateCents: number;
    billable: number;
    count: number;
    work: string[];
    notes: string[];
  };
  const byDay = useMemo(() => {
    const map = new Map<string, DayAgg>();
    entries.forEach((e) => {
      const g: DayAgg =
        map.get(e.work_date) ?? {
          date: e.work_date,
          startIso: null,
          endIso: null,
          startMs: null,
          endMs: null,
          grossMin: 0,
          hasTimes: false,
          breakMin: 0,
          billedMin: 0,
          cents: 0,
          rateCents: 0,
          billable: 0,
          count: 0,
          work: [],
          notes: [],
        };
      g.count += 1;
      if (e.billable) {
        g.billable += 1;
        if (e.started_at && e.ended_at) {
          const s = new Date(e.started_at).getTime();
          const en = new Date(e.ended_at).getTime();
          if (!Number.isNaN(s) && !Number.isNaN(en)) {
            g.grossMin += Math.round((en - s) / 60000);
            g.hasTimes = true;
            if (g.startMs === null || s < g.startMs) {
              g.startMs = s;
              g.startIso = e.started_at;
            }
            if (g.endMs === null || en > g.endMs) {
              g.endMs = en;
              g.endIso = e.ended_at;
            }
          }
        }
        g.breakMin += e.break_minutes;
        g.billedMin += e.duration_minutes;
        g.cents += e.amount_cents;
        if (e.rate_cents_applied) g.rateCents = e.rate_cents_applied;
        if (e.work_done && !g.work.includes(e.work_done)) g.work.push(e.work_done);
        if (e.comment && !g.notes.includes(e.comment)) g.notes.push(e.comment);
      }
      map.set(e.work_date, g);
    });
    return [...map.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries]);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={merge}
            onChange={(e) => setMerge(e.target.checked)}
            className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
          />
          Merge by day
          <span className="text-xs text-text-dim">
            (preview &middot; 1 line per day for invoicing)
          </span>
        </label>

        <div className="flex items-center gap-3">
          {dirtyIds.length > 0 && !merge && (
            <span className="text-xs text-text-muted">
              {dirtyIds.length} unsaved &middot; Ctrl+Z to undo
            </span>
          )}
          <button
            type="button"
            onClick={discardAll}
            disabled={saving || merge || dirtyIds.length === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-border-medium px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RotateCcw size={15} aria-hidden />
            Discard
          </button>
          <button
            type="button"
            onClick={saveAll}
            disabled={saving || merge || dirtyIds.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-primary transition-all hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" aria-hidden />
            ) : (
              <Save size={15} aria-hidden />
            )}
            Save changes
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-accent-coral/40 bg-accent-coral/10 px-3 py-2 text-xs text-accent-coral" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-bg-secondary">
        {merge ? (
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-3 py-3 font-medium sm:pl-6">Day</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Start</th>
                <th className="px-3 py-3 font-medium">End</th>
                <th className="px-3 py-3 text-right font-medium">Hours</th>
                <th className="px-3 py-3 text-right font-medium">Break</th>
                <th className="px-3 py-3 text-right font-medium">Billed</th>
                <th className="px-3 py-3 text-right font-medium">Rate</th>
                <th className="px-3 py-3 text-right font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Work done</th>
                <th className="px-3 py-3 font-medium">Comment</th>
                <th className="px-3 py-3 text-center font-medium sm:pr-6">Bill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {byDay.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-8 text-center text-text-muted sm:px-6">
                    No entries in view yet.
                  </td>
                </tr>
              ) : (
                byDay.map((g) => (
                  <tr key={g.date} className="align-middle text-text-secondary">
                    <td className="whitespace-nowrap px-3 py-3 text-text-muted sm:pl-6">
                      {weekdayShort(g.date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">{formatDMY(g.date)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-text-muted">
                      {g.startIso ? stampToLabel(g.startIso) : '--'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-text-muted">
                      {g.endIso ? stampToLabel(g.endIso) : '--'}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-text-secondary">
                      {g.hasTimes ? fmtHours(minsToHours(g.grossMin)) : '--'}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-text-muted">
                      {g.breakMin ? fmtHours(minsToHours(g.breakMin)) : '--'}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-text-primary">
                      {fmtHours(minsToHours(g.billedMin))}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-text-muted">
                      {g.rateCents ? `${eur(g.rateCents)}/h` : '--'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-text-primary">
                      {eur(g.cents)}
                    </td>
                    <td className="min-w-[12rem] px-3 py-3 text-text-primary">
                      {g.work.join('; ') || <span className="text-text-dim">--</span>}
                    </td>
                    <td className="min-w-[10rem] px-3 py-3">
                      {g.notes.join('; ') || <span className="text-text-dim">--</span>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-center tabular-nums text-text-muted sm:pr-6">
                      {g.billable}/{g.count}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="border-b border-border-subtle text-xs uppercase tracking-wide text-text-muted">
              <tr>
                <th className="px-3 py-3 font-medium sm:pl-6">Day</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Start</th>
                <th className="px-3 py-3 font-medium">End</th>
                <th className="px-3 py-3 text-right font-medium">Hours</th>
                <th className="px-3 py-3 font-medium">Break</th>
                <th className="px-3 py-3 text-right font-medium">Billed</th>
                <th className="px-3 py-3 text-right font-medium">Rate</th>
                <th className="px-3 py-3 text-right font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Work done</th>
                <th className="px-3 py-3 font-medium">Comment</th>
                <th className="px-3 py-3 text-center font-medium">Bill</th>
                <th className="px-3 py-3 sm:pr-6" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {drafts.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-text-muted sm:px-6">
                    No entries this week yet.
                  </td>
                </tr>
              ) : (
                drafts.map((d) => {
                  const locked = !!d.invoice_id;
                  const gross = grossMinutes(d);
                  const billed = draftNetMinutes(d);
                  const rateCents = d.rate_cents_applied ?? 0;
                  const amountCents = Math.round(minsToHours(billed) * rateCents);
                  return (
                    <tr key={d.id} className="align-middle text-text-secondary">
                      <td className="whitespace-nowrap px-3 py-2 text-text-muted sm:pl-6">
                        {weekdayShort(d.work_date)}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          value={d.work_date}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'work_date', e.target.value)}
                          className={`${cellInput} w-[9.5rem]`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={d.start}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'start', e.target.value)}
                          className={`${cellInput} w-[7rem]`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="time"
                          value={d.end}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'end', e.target.value)}
                          className={`${cellInput} w-[7rem]`}
                        />
                      </td>
                      <td className="w-16 px-3 py-2 text-right tabular-nums text-text-secondary">
                        {gross === null ? (
                          <span className="text-text-dim">--</span>
                        ) : (
                          fmtHours(minsToHours(gross))
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={d.break_hours}
                          disabled={locked}
                          onChange={(e) =>
                            patch(d.id, 'break_hours', Number(e.target.value))
                          }
                          className={`${cellInput} w-[5.5rem]`}
                        >
                          {BREAK_OPTIONS.map((h) => (
                            <option key={h} value={h}>
                              {h === 0 ? '--' : `${fmtHours(h)}h`}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="w-16 px-3 py-2 text-right tabular-nums font-medium text-text-primary">
                        {fmtHours(minsToHours(billed))}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-text-muted">
                        {rateCents ? `${eur(rateCents)}/h` : '--'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-text-primary">
                        {eur(d.billable ? amountCents : 0)}
                      </td>
                      <td className="px-3 py-2 min-w-[11rem]">
                        <input
                          type="text"
                          value={d.work_done}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'work_done', e.target.value)}
                          className={cellInput}
                        />
                      </td>
                      <td className="px-3 py-2 min-w-[10rem]">
                        <input
                          type="text"
                          value={d.comment}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'comment', e.target.value)}
                          className={cellInput}
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={d.billable}
                          disabled={locked}
                          onChange={(e) => patch(d.id, 'billable', e.target.checked)}
                          className="h-4 w-4 rounded border-border-medium bg-bg-tertiary accent-accent-primary"
                        />
                      </td>
                      <td className="px-3 py-2 text-right sm:pr-6">
                        {locked ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs text-text-dim"
                            title="On an issued invoice -- frozen"
                          >
                            <Lock size={13} aria-hidden />
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => remove(d.id)}
                            disabled={deletingId === d.id}
                            className="inline-flex items-center rounded-md p-1.5 text-text-muted transition-colors hover:bg-bg-tertiary hover:text-accent-coral disabled:opacity-50"
                            aria-label="Delete entry"
                          >
                            {deletingId === d.id ? (
                              <Loader2 size={15} className="animate-spin" aria-hidden />
                            ) : (
                              <Trash2 size={15} aria-hidden />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between border-t border-border-subtle px-4 py-4 text-sm sm:px-6">
          <span className="text-text-muted">Billable (in view)</span>
          <span className="font-semibold tabular-nums text-text-primary">
            {fmtHours(totals.hours)}h / EUR {eur(totals.cents)}
          </span>
        </div>
      </div>
    </div>
  );
}
