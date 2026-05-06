import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'
import { subscribeScroll } from './scroll'
import { PHASES, remap, clamp } from './phases'

/**
 * Top-level Gotham experience.
 *
 * Layout strategy:
 *   - A fixed-position Canvas covers the viewport for the entire page
 *   - A scroll spacer at the top consumes ~5 viewport-heights of scroll, which
 *     is what drives the cinematic phases (landing → portal → warp → laser)
 *   - After the spacer, the page returns to natural document flow and the
 *     content sections (children) scroll past with their own entry animations
 *   - The Canvas dims during the content phase so text stays readable
 */
export function Experience({ children }: { children: React.ReactNode }) {
  const dimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return subscribeScroll((p) => {
      if (!dimRef.current) return
      // Dim layer fades in as we approach content phase, holds through content
      const dim = clamp(remap(p, PHASES.laser[0], PHASES.content[0] + 0.05) * 0.55, 0, 0.55)
      dimRef.current.style.opacity = String(dim)
    })
  }, [])

  return (
    <div className="relative" style={{ background: '#070410' }}>
      {/* Fixed cinematic backdrop — always visible behind everything */}
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          camera={{ fov: 55, near: 0.1, far: 800, position: [0, 0.5, 18] }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>

        {/* Dim scrim — fades up to make content sections readable later */}
        <div
          ref={dimRef}
          className="absolute inset-0"
          style={{ background: '#070410', opacity: 0, pointerEvents: 'none' }}
        />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(7,4,16,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Spacer that gives the cinematic phases room to play out */}
      <div style={{ height: '500vh', pointerEvents: 'none' }} aria-hidden />

      {/* Natural-flow content sits above the fixed canvas */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
