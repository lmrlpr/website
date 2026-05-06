import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, BufferAttribute, PointsMaterial } from 'three'
import { PHASES, remap, clamp } from '../phases'

/**
 * Slow-drifting particle field around the GOTHAM word — sets the cinematic
 * atmosphere of phase 1. Fades out by the time we enter the portal.
 *
 * Geometry + material built imperatively (matches the legacy DepthBackground
 * pattern) for predictable lifecycle in R3F v9.
 */
export function AmbientField({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<Points>(null)

  const { geometry, material, count } = useMemo(() => {
    const c = 700
    const arr = new Float32Array(c * 3)
    for (let i = 0; i < c; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 40
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30 + 4
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(arr, 3))
    const m = new PointsMaterial({
      color: 0xa78bfa,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    })
    return { geometry: g, material: m, count: c }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const p = progressRef.current ?? 0

    const fade = clamp(1 - remap(p, PHASES.approach[1] - 0.05, PHASES.portal[0]) * 1.2, 0, 1)
    material.opacity = 0.55 * fade

    const arr = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.05 * (0.4 + (i % 7) * 0.05)
      if (arr[i * 3 + 1] > 11) arr[i * 3 + 1] = -11
    }
    geometry.attributes.position.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
