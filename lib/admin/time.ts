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
