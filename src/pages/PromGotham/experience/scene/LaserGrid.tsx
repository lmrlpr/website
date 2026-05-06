import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { LineSegments, BufferGeometry, BufferAttribute, LineBasicMaterial, AdditiveBlending } from 'three'
import { PHASES, remap, clamp, easeInOut } from '../phases'

/**
 * Phase 5 — pulsing laser grid below the camera (dance-floor reference).
 * Builds a horizontal lattice of line segments and animates colour + opacity
 * with a slow pulse.
 */
export function LaserGrid({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<LineSegments>(null)

  const { geometry, material } = useMemo(() => {
    const cols = 28
    const rows = 80
    const spacing = 4
    const xOff = ((cols - 1) * spacing) / 2

    const verts: number[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing - xOff
        const z = -r * spacing - 30
        const y = -3
        if (c < cols - 1) verts.push(x, y, z, x + spacing, y, z)
        if (r < rows - 1) verts.push(x, y, z, x, y, z - spacing)
      }
    }

    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(verts), 3))
    const m = new LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    return { geometry: g, material: m }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const p = progressRef.current ?? 0

    const tIn  = remap(p, PHASES.laser[0] - 0.04, PHASES.laser[0] + 0.06)
    const tOut = remap(p, PHASES.content[1] - 0.15, PHASES.content[1])

    const alpha = clamp(easeInOut(tIn) * (1 - tOut), 0, 1)
    material.opacity = 0.65 * alpha

    const t = performance.now() * 0.001
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.2)
    material.color.setRGB(0.0 + pulse * 0.4, 0.55 + pulse * 0.4, 0.95)

    ref.current.visible = alpha > 0.02
    ref.current.position.y = Math.sin(performance.now() * 0.0008) * 0.4
  })

  return <lineSegments ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
