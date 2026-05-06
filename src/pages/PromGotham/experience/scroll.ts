/**
 * Read the page's vertical scroll progress, normalised to 0..1.
 * The Gotham experience uses a tall scroll container, but the visible
 * content is fixed — scroll progress drives a 3D timeline instead of
 * moving DOM content vertically.
 */
export function getScrollProgress(): number {
  if (typeof window === 'undefined') return 0
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  return Math.max(0, Math.min(1, window.scrollY / max))
}

/**
 * Subscribe to a smoothed scroll-progress stream. Returns an unsubscribe fn.
 * Smoothed via critically-damped lerp inside a single shared rAF loop.
 */
type ProgressFn = (smoothed: number, raw: number) => void

let listeners = new Set<ProgressFn>()
let raf = 0
let smoothed = 0
let raw = 0
let running = false

function loop() {
  raw = getScrollProgress()
  smoothed += (raw - smoothed) * 0.12
  for (const fn of listeners) fn(smoothed, raw)
  raf = requestAnimationFrame(loop)
}

function start() {
  if (running) return
  running = true
  raw = smoothed = getScrollProgress()
  raf = requestAnimationFrame(loop)
}

function stop() {
  if (!running) return
  running = false
  cancelAnimationFrame(raf)
}

export function subscribeScroll(fn: ProgressFn): () => void {
  listeners.add(fn)
  start()
  fn(smoothed, raw)
  return () => {
    listeners.delete(fn)
    if (listeners.size === 0) stop()
  }
}
