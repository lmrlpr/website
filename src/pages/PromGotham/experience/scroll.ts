/**
 * Scroll → cinematic-progress driver for the Gotham experience.
 *
 * The page is split into two scroll domains:
 *   1. The cinematic intro spacer (configurable height, set on mount)
 *      — drives all 3D phases (landing → portal → laser stage), reported
 *        as `intro` ∈ [0, 1] while inside the spacer, then > 1 once past it.
 *   2. Pinned content slides after the spacer
 *      — each manages its own ScrollTrigger pin + depth animation (see
 *        PinnedSlide). The camera continues to drift forward while content
 *        is on screen, parameterised by the overflow past intro = 1.
 */

let introHeightPx = 1

export function setIntroHeight(px: number) {
  introHeightPx = Math.max(1, px)
}

export function getIntroHeight(): number {
  return introHeightPx
}

/** Raw intro progress. 0..1 inside the spacer, > 1 once we've scrolled past it. */
export function getIntroProgress(): number {
  if (typeof window === 'undefined') return 0
  return window.scrollY / introHeightPx
}

type Listener = (smoothed: number, raw: number) => void
const listeners = new Set<Listener>()
let smoothed = 0
let raf = 0
let running = false

function loop() {
  const raw = getIntroProgress()
  smoothed += (raw - smoothed) * 0.12
  for (const fn of listeners) fn(smoothed, raw)
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running) return
  running = true
  smoothed = getIntroProgress()
  raf = requestAnimationFrame(loop)
}

function stop() {
  if (!running) return
  running = false
  cancelAnimationFrame(raf)
}

export function subscribeIntro(fn: Listener): () => void {
  listeners.add(fn)
  start()
  fn(smoothed, getIntroProgress())
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0) stop()
  }
}
