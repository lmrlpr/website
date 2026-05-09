import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { CameraRig } from './scene/CameraRig'
import { GothamPortal } from './scene/GothamPortal'
import { AmbientField } from './scene/AmbientField'
import { LaserGrid } from './scene/LaserGrid'
import { DottedCeiling } from './scene/DottedCeiling'
import { Skyline } from './scene/Skyline'
import { getIntroProgress } from './scroll'

/**
 * Top-level R3F scene. Holds the smoothed intro-progress ref that drives
 * every cinematic phase, and stacks the world layers.
 *
 * Layer order (Z-axis, far → near):
 *   Skyline       distant city silhouette on the horizon
 *   LaserGrid     stage floor + scan beam + atmospheric fog
 *   DottedCeiling wave-animated dot grid above the camera (the "roof")
 *   AmbientField  soft volumetric glow behind the title
 *   GothamPortal  the GOTHAM word + geometric H doorway
 */
export function Scene() {
  const progressRef = useRef(0) as RefObject<number>

  useFrame((_, delta) => {
    const target = getIntroProgress()
    const k = Math.min(1, delta * 6)
    progressRef.current += (target - progressRef.current) * k
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 8, 8]} intensity={0.5} color="#a78bfa" />

      <CameraRig     progressRef={progressRef} />
      <Skyline       progressRef={progressRef} />
      <LaserGrid     progressRef={progressRef} />
      <DottedCeiling progressRef={progressRef} />
      <AmbientField  progressRef={progressRef} />
      <GothamPortal  progressRef={progressRef} />
    </>
  )
}
