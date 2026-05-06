import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, BufferGeometry, BufferAttribute, PointsMaterial } from 'three'
import { PHASES, remap, clamp, easeInOut } from '../phases'

/**
 * Phase 4 — streaking starfield surrounding the camera once we pass through
 * the portal. Cylindrical distribution along the camera path, accelerating
 * forward as warp progresses.
 */
export function WarpTunnel({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<Points>(null)

  const { geometry, material, count } = useMemo(() => {
    const c = 1400
    const arr = new Float32Array(c * 3)
    for (let i = 0; i < c; i++) {
      const radius = 2 + Math.random() * 12
      const theta = Math.random() * Math.PI * 2
      arr[i * 3 + 0] = Math.cos(theta) * radius
      arr[i * 3 + 1] = Math.sin(theta) * radius
      arr[i * 3 + 2] = -Math.random() * 200 - 5
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(arr, 3))
    const m = new PointsMaterial({
      color: 0xffffff,
      size: 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    return { geometry: g, material: m, count: c }
  }, [])

  useFrame((_, delta) => {
    if (!ref.current) return
    const p = progressRef.current ?? 0

    const tWarp = remap(p, PHASES.warp[0] - 0.04, PHASES.warp[1])
    const tFade = remap(p, PHASES.warp[1], PHASES.warp[1] + 0.1)
    const alpha = clamp(easeInOut(tWarp) * (1 - tFade), 0, 1)
    material.opacity = 0.85 * alpha
    ref.current.visible = alpha > 0.02

    const speed = 60 + tWarp * 220
    const arr = geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += delta * speed
      if (arr[i * 3 + 2] > 5) arr[i * 3 + 2] = -200 - Math.random() * 80
    }
    geometry.attributes.position.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
