import { Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { setIntroHeight, subscribeIntro, getIntroHeight } from './scroll'
import { clamp, remap } from './phases'

const INTRO_VH = 700 // height of cinematic intro spacer in viewport-units

/**
 * Top-level Gotham experience.
 *
 *   Layer A (fixed canvas)     — the 3D world (GOTHAM, doorway, laser stage)
 *   Layer B (intro spacer)     — purely scroll height; drives cinematic phases
 *   Layer C (pinned slides)    — content sections that pin to viewport while
 *                                scroll drives a depth tween (see PinnedSlide)
 *
 * Once we've scrolled past the intro spacer, intro progress > 1 and the
 * world stays in "laser stage" mode. The 3D camera continues advancing
 * forward through Z so the stage feels like it keeps unfolding while the
 * spatial slides pass through.
 */
export function Experience({ children }: { children: React.ReactNode }) {
  const dimRef = useRef<HTMLDivElement>(null)

  // Set intro spacer height (in pixels) on mount + on resize so the intro
  // progress is normalised against actual rendered spacer height.
  useLayoutEffect(() => {
    const apply = () => setIntroHeight((INTRO_VH / 100) * window.innerHeight)
    apply()
    window.addEventListener('resize', apply)
    return () => window.removeEventListener('resize', apply)
  }, [])

  useEffect(() => {
    return subscribeIntro((p) => {
      if (!dimRef.current) return
      // Very subtle dim as content slides take over — too much darkening
      // murders the laser stage / city / ceiling.
      const dim = clamp(remap(p, 0.85, 1.05) * 0.18, 0, 0.18)
      dimRef.current.style.opacity = String(dim)
    })
  }, [])

  return (
    <div className="relative" style={{ background: '#050309' }}>
      {/* Fixed cinematic backdrop — always visible behind everything */}
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 52, near: 0.1, far: 1200, position: [0, 0.4, 22] }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* Dim scrim — fades up as content slides take over */}
        <div
          ref={dimRef}
          className="absolute inset-0"
          style={{ background: '#050309', opacity: 0, pointerEvents: 'none' }}
        />

        {/* Cinematic vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 35%, rgba(5,3,9,0.85) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Cinematic intro spacer — drives all 3D phases */}
      <div style={{ height: `${INTRO_VH}vh`, pointerEvents: 'none' }} aria-hidden />

      {/* Pinned content slides — each one is a spatial slide that approaches
          the viewer and passes through */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

// Re-export so callers don't need to know about the scroll module
export { getIntroHeight }
