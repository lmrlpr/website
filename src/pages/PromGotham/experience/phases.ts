/**
 * Cinematic phase boundaries along the intro-spacer timeline (0..1).
 *
 * After the spacer (intro > 1) the world settles into "laser stage" mode and
 * stays there while the user scrolls through pinned content slides — the
 * camera continues to drift forward (see CameraRig) but no further phase
 * transitions fire.
 */
export const PHASES = {
  landing:  [0.00, 0.10] as const, // P1 GOTHAM! idle, date reveals
  approach: [0.10, 0.32] as const, // P2 camera glides toward the H, Y drops to lower void
  portal:   [0.32, 0.50] as const, // P3 doorway opens, camera enters lower void
  laser:    [0.40, 1.00] as const, // P4 laser stage — overlaps approach tail + portal so transition is seamless
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

/** Quartic ease-out — strong start, soft landing. */
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)
