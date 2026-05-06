import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { CameraRig } from './scene/CameraRig'
import { GothamPortal } from './scene/GothamPortal'
import { AmbientField } from './scene/AmbientField'
import { WarpTunnel } from './scene/WarpTunnel'
import { LaserGrid } from './scene/LaserGrid'
import { getScrollProgress } from './scroll'

/**
 * Top-level R3F scene. Holds the smoothed scroll-progress ref that drives
 * every phase, and stacks each phase component plus the post-processing
 * pipeline (bloom + subtle chromatic aberration for cinematic flair).
 */
export function Scene() {
  const progressRef = useRef(0) as RefObject<number>

  // Smooth window.scrollY-driven progress every frame, inside the R3F loop
  useFrame((_, delta) => {
    const target = getScrollProgress()
    const k = Math.min(1, delta * 6)
    progressRef.current += (target - progressRef.current) * k
  })

  return (
    <>
      {/* Lighting — minimal; mostly emissive materials and additive shaders */}
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 6, 6]} intensity={0.6} color="#a78bfa" />

      <CameraRig    progressRef={progressRef} />
      <AmbientField progressRef={progressRef} />
      <GothamPortal progressRef={progressRef} />
      <WarpTunnel   progressRef={progressRef} />
      <LaserGrid    progressRef={progressRef} />
    </>
  )
}
