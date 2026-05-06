/**
 * Phase boundaries along the master scroll timeline (0..1).
 * Every visual driven by scroll references these ranges so phases can be
 * retuned in one place without hunting through component code.
 */
export const PHASES = {
  landing:  [0.00, 0.08] as const, // P1 idle landing
  approach: [0.08, 0.28] as const, // P2 camera pulls toward GOTHAM / focus to H
  portal:   [0.28, 0.42] as const, // P3 H inner gap opens, camera enters
  warp:     [0.42, 0.55] as const, // P4 tunnel transition
  laser:    [0.55, 0.68] as const, // P5 laser grid forms
  content:  [0.62, 1.00] as const, // P6/P7 panels approach (overlap with laser tail)
} as const

/** Linear remap of t into 0..1 over [a, b], clamped. */
export const remap = (t: number, a: number, b: number) =>
  Math.max(0, Math.min(1, (t - a) / Math.max(1e-6, b - a)))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))

/** Cubic ease in/out — used for cinematic transitions. */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Exponential ease out — long, fast-decaying tail (cinematic camera). */
export const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
