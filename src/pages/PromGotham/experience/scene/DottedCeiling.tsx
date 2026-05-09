import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Points,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  AdditiveBlending,
} from 'three'
import { PHASES, remap, clamp, easeInOut } from '../phases'

/**
 * Wave-animated dotted surface above the camera — the "roof" of the dance
 * floor. Adapted from the 21st.dev DottedSurface component, ported into R3F
 * and scaled into our scene units (their reference uses world units of 150
 * separation and amplitude 50; our scene runs at ~1/30 that scale).
 *
 * The grid sits at world y = +12, well above the camera's y range (0..1.6),
 * and is wider on Z than the camera ever travels, so the user always sees
 * dots overhead. Each frame the Y of every point is displaced by two
 * orthogonal sine waves — the surface ripples like a moving stage light rig.
 *
 * Fades in as the laser stage forms.
 */
export function DottedCeiling({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<Points>(null)
  const countRef = useRef(0)

  const AMOUNTX = 60
  const AMOUNTY = 90
  const SEPARATION = 4
  const AMPLITUDE = 2.4

  const { geometry, material, basePositions } = useMemo(() => {
    const positions: number[] = []
    const base: number[] = []
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2
        positions.push(x, 0, z)
        base.push(ix, iy)
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    const m = new PointsMaterial({
      color: 0xeaf0ff,
      size: 0.22,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    })
    return { geometry: g, material: m, basePositions: new Float32Array(base) }
  }, [])

  useFrame(() => {
    const p = progressRef.current ?? 0
    const tIn = remap(p, PHASES.portal[1] - 0.05, PHASES.laser[0] + 0.05)
    const alpha = clamp(easeInOut(tIn), 0, 1)
    material.opacity = 1.0 * alpha

    if (!ref.current) return
    ref.current.visible = alpha > 0.01
    if (alpha < 0.01) return

    countRef.current += 0.05
    const count = countRef.current

    const arr = geometry.attributes.position.array as Float32Array
    const total = AMOUNTX * AMOUNTY
    for (let i = 0; i < total; i++) {
      const ix = basePositions[i * 2]
      const iy = basePositions[i * 2 + 1]
      arr[i * 3 + 1] =
        Math.sin((ix + count) * 0.3) * AMPLITUDE +
        Math.sin((iy + count) * 0.5) * AMPLITUDE
    }
    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points
      ref={ref}
      position={[0, 9, -180]}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  )
}
