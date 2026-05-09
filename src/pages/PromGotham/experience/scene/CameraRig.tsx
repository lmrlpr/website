import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PHASES, lerp, easeInOut, easeOutExpo, remap, clamp } from '../phases'
import { H_WORLD_X } from './GothamPortal'

/**
 * Camera path along the cinematic timeline.
 *
 *   Z=22    landing
 *   Z=4     approach end (H dominates frame, camera just outside the doorway)
 *   Z=-12   portal end   (camera flown through the H)
 *   Z=-110  laser end    (deep into the stage, looking at the city silhouette)
 *
 * After the intro spacer (intro progress > 1) the camera continues to drift
 * forward at a constant rate per pixel of further scroll, so the laser
 * stage feels like it keeps unfolding while content slides traverse the
 * foreground.
 *
 * X axis: glides from 0 → H_WORLD_X over approach so the H is dead-centre
 * by the time we cross into portal phase, then pans back to 0 over laser
 * so the city / floor are framed centrally.
 *
 * Y axis: starts slightly elevated for cinematic 3/4 framing; drops to 0 by
 * portal so the camera goes flat through the gap; rises slightly on the
 * laser stage to reveal the floor.
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

    // Z path
    const zIntro =
        lerp(22, 4,    easeInOut(tApproach))
      + lerp(0, -58,   easeOutExpo(tPortal))   // absorbed flash phase distance
      + lerp(0, -56,   easeInOut(tLaser))

    const zContent = -overflow * 32
    camera.position.z = zIntro + zContent

    // X path: pan toward H during approach, hold through portal, release on laser
    const wordPan  = easeInOut(remap(p, PHASES.landing[0], PHASES.approach[1]))
    const releaseX = easeInOut(remap(p, PHASES.laser[0],   PHASES.laser[1]))
    const camBaseX = lerp(0, H_WORLD_X, wordPan) - lerp(0, H_WORLD_X, releaseX)

    // Y framing — slight elevation pre-portal, flat through portal, low overhead on stage
    const baseY =
        lerp(0.7, 0.0, easeInOut(clamp(tApproach + tPortal, 0, 1)))
      + lerp(0,   1.6, easeInOut(tLaser))

    // Parallax fades out hard once approach starts so traversal is stable
    const parallax = 0.32 * (1 - clamp(tApproach + tPortal * 1.2, 0, 1))
    camera.position.x = camBaseX + mouse.current.x * parallax
    camera.position.y = baseY + mouse.current.y * parallax

    // Subtle roll on the laser stage
    camera.rotation.z = Math.sin(performance.now() * 0.0004) * 0.012 * tLaser

    // Look forward — track camBaseX so we look straight ahead, not diagonally
    const lookY = baseY - lerp(0, 0.6, tLaser)
    camera.lookAt(camBaseX, lookY, camera.position.z - 12)
  })

  return null
}
