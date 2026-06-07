// Duration parsing for manual time entry. Returns whole minutes, or null.
export function parseDurationMinutes(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  const range = s.match(/^(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?$/);
  if (range) {
    const [, h1, m1 = '0', h2, m2 = '0'] = range;
    const start = +h1 * 60 + +m1;
    let end = +h2 * 60 + +m2;
    if (end <= start) end += 24 * 60; // overnight
    return end - start;
  }
  const mins = s.match(/^(\d+(?:\.\d+)?)\s*m(in)?$/);
  if (mins) return Math.round(+mins[1]);
  const hrs = s.match(/^(\d+(?:\.\d+)?)\s*h?$/);
  if (hrs) return Math.round(+hrs[1] * 60);
  return null;
}

// Day a logged block counts for: before 4am local, count it as yesterday.
export function defaultWorkDate(now: Date = new Date()): string {
  const d = new Date(now);
  if (d.getHours() < 4) d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function eur(cents: number): string {
  return (cents / 100).toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// --- Clock-time helpers for the start/end entry model ---------------------
// started_at / ended_at store the entered wall clock encoded as UTC
// (09:00 -> ...T09:00:00Z). They are a faithful record of the clock the user
// typed; duration is end - start, and we never do cross-timezone math on them,
// so encoding the wall clock as UTC keeps the round-trip lossless regardless
// of the server timezone.

/** "HH:MM" (24h, from <input type="time">) -> minutes since midnight, or null. */
export function clockToMinutes(hhmm: string): number | null {
  const m = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = +m[1];
  const min = +m[2];
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Net worked minutes from start/end clock minus break; handles overnight. */
export function netMinutes(
  startHHMM: string,
  endHHMM: string,
  breakMin: number,
): number | null {
  const s = clockToMinutes(startHHMM);
  const e = clockToMinutes(endHHMM);
  if (s === null || e === null) return null;
  let span = e - s;
  if (span <= 0) span += 24 * 60; // crossed midnight
  return Math.max(0, span - Math.max(0, breakMin || 0));
}

/** Add whole days to an ISO date "YYYY-MM-DD" (UTC). Negative subtracts. */
export function addDays(iso: string, days: number): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3] + days));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

/**
 * Compose a started/ended timestamp (wall clock encoded as UTC). Pass
 * nextDay = true to push it onto the following calendar day (overnight end).
 */
export function composeStamp(
  workDate: string,
  hhmm: string,
  nextDay = false,
): string | null {
  const min = clockToMinutes(hhmm);
  if (min === null) return null;
  const date = nextDay ? addDays(workDate, 1) : workDate;
  const [h, m] = hhmm.split(':');
  return `${date}T${h.padStart(2, '0')}:${m}:00.000Z`;
}

/** A stored started/ended timestamp back to "HH:MM" (24h), for the editor. */
export function stampToClock(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

/** Minutes-of-day -> "9:00 AM" label. */
export function minutesToLabel(min: number): string {
  const h24 = Math.floor(min / 60) % 24;
  const m = ((min % 60) + 60) % 60;
  const ampm = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** A stored timestamp -> "9:00 AM", or '' when null/unset. */
export function stampToLabel(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return minutesToLabel(d.getUTCHours() * 60 + d.getUTCMinutes());
}

/** Minutes -> hours, rounded to 2dp (e.g. 90 -> 1.5). */
export function minsToHours(min: number): number {
  return Math.round((min / 60) * 100) / 100;
}

/** Format hours compactly: 1.5 -> "1.5", 8 -> "8", 0.25 -> "0.25". */
export function fmtHours(hours: number): string {
  return Number(hours.toFixed(2)).toString();
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Short weekday name for an ISO date "YYYY-MM-DD" (e.g. "Mon"), or ''. */
export function weekdayShort(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return WEEKDAYS[d.getUTCDay()] ?? '';
}

/** Break-length choices in hours (0 to 4), for the add form and table editor. */
export const BREAK_OPTIONS = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 3.5, 4];

/** ISO date "YYYY-MM-DD" -> "DD/MM/YYYY", matching the date input's display. */
export function formatDMY(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}
