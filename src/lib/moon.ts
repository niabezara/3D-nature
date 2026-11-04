/** Moon phase maths, accurate to within about a day: plenty for drawing. */

const SYNODIC_MONTH = 29.530588853;
/** A known new moon: 6 Jan 2000, 18:14 UTC. */
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const DAY = 86_400_000;

/** 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter. */
export function moonPhase(date: Date | string): number {
  const t = typeof date === "string" ? new Date(date).getTime() : date.getTime();
  const days = (t - KNOWN_NEW_MOON) / DAY;
  return (((days / SYNODIC_MONTH) % 1) + 1) % 1;
}

/** Fraction of the disc that is lit, 0–1. */
export const illumination = (phase: number) => (1 - Math.cos(2 * Math.PI * phase)) / 2;

export function phaseName(phase: number): string {
  const names = ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"];
  return names[Math.round(phase * 8) % 8];
}

/**
 * SVG path of the lit part of a moon of radius r centred at (cx, cy).
 * Outer edge is a half circle on the lit side; the terminator is a half ellipse.
 */
export function litPath(phase: number, cx: number, cy: number, r: number): string {
  const waxing = phase < 0.5;
  const rx = Math.abs(Math.cos(2 * Math.PI * phase)) * r;
  const crescent = phase < 0.25 || phase > 0.75;
  const top = `${cx} ${cy - r}`;
  const bottom = `${cx} ${cy + r}`;
  // waxing: lit on the right; waning: lit on the left
  const outerSweep = waxing ? 1 : 0;
  // crescents bulge toward the lit side, gibbous moons away from it
  const terminatorSweep = waxing ? (crescent ? 0 : 1) : crescent ? 1 : 0;
  return `M ${top} A ${r} ${r} 0 0 ${outerSweep} ${bottom} A ${rx.toFixed(2)} ${r} 0 0 ${terminatorSweep} ${top} Z`;
}
