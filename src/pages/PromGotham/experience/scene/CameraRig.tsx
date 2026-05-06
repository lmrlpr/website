import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PHASES, lerp, easeInOut, easeOutExpo, remap } from '../phases'

/**
 * Drives the camera along the master scroll timeline.
 *
 *   Z=18    landing
 *   Z=4     approach end (H dominates frame)
 *   Z=-8    portal end (camera has flown through the H)
 *   Z=-60   warp end (deep tunnel)
 *   Z=-120  laser end
 *   Z=-380  content end
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
    const p = progressRef.current

    const tApproach = remap(p, PHASES.landing[0], PHASES.approach[1])
    const tPortal   = remap(p, PHASES.portal[0],  PHASES.portal[1])
    const tWarp     = remap(p, PHASES.warp[0],    PHASES.warp[1])
    const tLaser    = remap(p, PHASES.laser[0],   PHASES.laser[1])
    const tContent  = remap(p, PHASES.content[0], PHASES.content[1])

    // Composed Z: each phase contributes its own delta on top
    const z =
        lerp(18,  4,    easeInOut(tApproach))
      + lerp(0,  -12,   easeInOut(tPortal))
      + lerp(0,  -52,   easeOutExpo(tWarp))
      + lerp(0,  -60,   easeInOut(tLaser))
      + lerp(0,  -260,  easeInOut(tContent))

    camera.position.z = z

    const parallaxStrength = 0.35 * (1 - tApproach * 0.85)
    camera.position.x = mouse.current.x * parallaxStrength
    camera.position.y = 0.5 + mouse.current.y * parallaxStrength

    camera.rotation.z = Math.sin(performance.now() * 0.0005) * 0.02 * tWarp
    camera.lookAt(0, 0, camera.position.z - 10)
  })

  return null
}
