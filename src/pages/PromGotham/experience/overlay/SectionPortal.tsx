import { useRef, type ReactNode } from 'react'
import { useGsap } from '../../../../hooks/useGsap'
import { gsap, ScrollTrigger } from '../../../../utils/gsap'

/**
 * Wraps a content section so it enters the viewport "from depth" — the inner
 * element starts pushed back along Z with heavy blur and zero opacity, then
 * flies forward into focus as the user scrolls.
 *
 * Uses ScrollTrigger scrub so the animation tracks scroll position 1:1 — no
 * snap, no spring. Feels like the section is approaching the camera as you
 * pull yourself forward through space.
 */
export function SectionPortal({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null)

  const ref = useGsap(() => {
    if (!innerRef.current) return
    gsap.fromTo(
      innerRef.current,
      { z: -1200, opacity: 0, filter: 'blur(28px)' },
      {
        z: 0,
        opacity: 1,
        filter: 'blur(0px)',
        ease: 'none',
        scrollTrigger: {
          trigger: innerRef.current,
          start: 'top 95%',
          end: 'top 25%',
          scrub: true,
        },
      },
    )
    // Refresh once on mount so positions are correct after layout
    ScrollTrigger.refresh()
  }, [])

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}
    >
      <div ref={innerRef} style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity, filter' }}>
        {children}
      </div>
    </div>
  )
}
