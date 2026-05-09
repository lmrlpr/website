import { useRef, type ReactNode } from 'react'
import { useGsap } from '../../../../hooks/useGsap'
import { gsap, ScrollTrigger } from '../../../../utils/gsap'

/**
 * A spatial slide that pins to the viewport while scroll drives a 3D
 * depth animation on its content. Reads as: a card appears tiny in the
 * distance, grows toward the camera, holds in focus, then continues forward
 * past the viewer while the next slide approaches from behind.
 *
 * Trigger range is intentionally wider than the pin: it spans from when
 * the slide first enters the viewport (its top hits the viewport bottom)
 * through when it has fully exited (its bottom leaves the viewport top).
 * That gives consecutive slides natural overlap — slide N+1 is already
 * approaching while slide N is still receding — eliminating the dead
 * frames that appear with pin-only-bound triggers.
 *
 *   0    → 0.32   enter from depth (z: -2400 → 0, opacity 0 → 1)
 *   0.32 → 0.62   hold centred while sticky pin holds the slide
 *   0.62 → 1.0    pass through camera (z: 0 → +900, opacity → 0)
 */
export function PinnedSlide({
  children,
  /** Outer container height in viewport units. Bigger = longer dwell time. */
  vh = 220,
}: {
  children: ReactNode
  vh?: number
}) {
  const innerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const ref = useGsap(() => {
    if (!innerRef.current || !stickyRef.current) return

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: stickyRef.current.parentElement,
        // Span the entire time the slide is anywhere on screen, not just
        // when it's pinned. Lets neighbouring slides overlap so there are
        // no dark frames where neither is visible.
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      },
    })

    tl.fromTo(
      innerRef.current,
      { z: -2400, opacity: 0, filter: 'blur(36px)', scale: 0.7 },
      { z: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.32 },
    )
    tl.to(innerRef.current, {
      z: 0,
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      duration: 0.30,
    })
    tl.to(innerRef.current, {
      z: 900,
      opacity: 0,
      filter: 'blur(20px)',
      scale: 1.4,
      duration: 0.38,
    })

    ScrollTrigger.refresh()
  }, [])

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ height: `${vh}vh`, position: 'relative' }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1600px',
          perspectiveOrigin: '50% 50%',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: '100%',
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity, filter',
            pointerEvents: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
