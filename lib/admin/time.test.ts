import { describe, it, expect } from 'vitest';
import { parseDurationMinutes, defaultWorkDate } from './time';

describe('parseDurationMinutes', () => {
  it('parses minutes', () => expect(parseDurationMinutes('90m')).toBe(90));
  it('parses decimal hours', () => expect(parseDurationMinutes('1.5h')).toBe(90));
  it('parses bare hours', () => expect(parseDurationMinutes('2')).toBe(120));
  it('parses a 24h range', () => expect(parseDurationMinutes('9-11:30')).toBe(150));
  it('parses an overnight range', () => expect(parseDurationMinutes('22:00-02:00')).toBe(240));
  it('rejects junk', () => expect(parseDurationMinutes('soon')).toBeNull());
});

describe('defaultWorkDate', () => {
  it('before 4am rolls to yesterday', () =>
    expect(defaultWorkDate(new Date('2026-06-07T02:30:00'))).toBe('2026-06-06'));
  it('after 4am stays today', () =>
    expect(defaultWorkDate(new Date('2026-06-07T09:00:00'))).toBe('2026-06-07'));
});
