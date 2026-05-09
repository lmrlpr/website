import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PHASES, lerp, easeInOut, easeOutExpo, remap, clamp } from '../phases'

/**
 * Camera path along the cinematic timeline.
 *
 *   Phase     | Z       | Y      | Notes
 *   ----------|---------|--------|---------------------------------------------
 *   landing   | 22      | +0.5   | 3/4 frame of the whole word
 *   approach  | 22 → 4  | 0.5→-1.5 | Y drops to align with H's *lower* void
 *   portal    | 4 → -12 | -1.5   | Flat traversal through the doorway
 *   laser     | -12→-110| -1.5→+1.6 | Y rises, looking slightly down at floor
 *   content   | drift   | +1.6   | Slow forward Z drift while content slides pass
 *
 * The H sits at world (0,0,0) and the lower void spans approximately y=-2.9
 * to y=+0.5 (below the high-set crossbar). Camera at y=-1.5 is dead-centre
 * of that channel — the doorway feel is unmistakable.
 *
 * Word is symmetric around H so no X-pan is needed; camera stays at x=0.
 */
export function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame(() => {
    const p = progressRef.current ?? 0
    const overflow = Math.max(0, p - 1)

    const tApproach = remap(p, PHASES.landing[0], PHASES.approach[1])
    const tPortal   = remap(p, PHASES.portal[0],  PHASES.portal[1])
    const tLaser    = remap(p, PHASES.laser[0],   PHASES.laser[1])

    // ---- Z path ----
    const zIntro =
        lerp(22, 4,    easeInOut(tApproach))
      + lerp(0, -16,   easeOutExpo(tPortal))
      + lerp(0, -98,   easeInOut(tLaser))

    const zContent = -overflow * 32
    camera.position.z = zIntro + zContent

    // ---- Y path: drop into lower H void during approach/portal, rise on stage ----
    const yLanding = 0.5
    const yLowerVoid = -1.5
    const yStage = 1.6

    const yToVoid = lerp(yLanding, yLowerVoid, easeInOut(clamp(tApproach + tPortal * 0.3, 0, 1)))
    const yToStage = lerp(0, yStage - yLowerVoid, easeInOut(tLaser))
    const baseY = yToVoid + yToStage

    // Subtle landing breath — tiny low-frequency sin so the landing frame still feels alive
    const breath = (1 - tApproach) * Math.sin(performance.now() * 0.00045) * 0.05

    // Mouse parallax: strong at landing, off during portal traversal
    const parallaxK = (1 - clamp(tApproach + tPortal * 1.3, 0, 1)) * 0.32
                    + clamp((tLaser - 0.6) / 0.4, 0, 1) * 0.18

    camera.position.x = mouse.current.x * parallaxK
    camera.position.y = baseY + breath + mouse.current.y * parallaxK

    // Roll removed — was barely visible and added noise
    camera.rotation.z = 0

    // lookAt — tracks position so we always look horizontal-forward, not diagonal.
    // On the laser stage, dip slightly down so the floor reads.
    const lookY = baseY - lerp(0, 0.7, tLaser)
    camera.lookAt(0, lookY, camera.position.z - 12)
  })

  return null
}
