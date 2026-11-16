// Dates are written the Australian way: "15 November 2026". The spaces are non-breaking so a
// date never splits across two lines.
const NBSP = ' ';

export function longDate(value: Date | string): string {
  const d = new Date(value);
  const day = d.toLocaleDateString('en-AU', { day: 'numeric', timeZone: 'UTC' });
  const month = d.toLocaleDateString('en-AU', { month: 'long', timeZone: 'UTC' });
  const year = d.toLocaleDateString('en-AU', { year: 'numeric', timeZone: 'UTC' });
  return `${day}${NBSP}${month}${NBSP}${year}`;
}

export function isoDate(value: Date | string): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}
