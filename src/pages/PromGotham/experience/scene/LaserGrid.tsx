import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Group,
  LineSegments,
  BufferGeometry,
  BufferAttribute,
  LineBasicMaterial,
  AdditiveBlending,
  Mesh,
  MeshBasicMaterial,
  Color,
  ShaderMaterial,
  DoubleSide,
} from 'three'
import { PHASES, remap, clamp, easeInOut } from '../phases'

/**
 * Phase 5 — laser stage. Three layers stacked far → near:
 *
 *   Atmosphere fog plane  — vertical haze gradient between camera and skyline
 *   Floor lattice         — horizontal grid below the camera, cyan/violet pulse
 *   Horizontal scan beam  — laser sweep that travels along Z
 *
 * The wavy dotted ceiling above is in DottedCeiling.tsx.
 */
export function LaserGrid({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const floorRef = useRef<LineSegments>(null)
  const scanRef = useRef<Mesh>(null)
  const fogRef = useRef<Mesh>(null)

  // ---- Floor lattice ----
  const { floorGeo, floorMat } = useMemo(() => {
    const cols = 32
    const rows = 100
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
      toneMapped: false,
    })
    return { floorGeo: g, floorMat: m }
  }, [])

  // ---- Horizontal scan beam (laser sweep) ----
  const scanMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: new Color('#a855ff'),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: AdditiveBlending,
        toneMapped: false,
      }),
    [],
  )

  // ---- Atmosphere fog plane ----
  const fogMat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0 },
          uHot: { value: new Color('#1a0e2c') },
        },
        vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: /* glsl */ `
        varying vec2 vUv;
        uniform float uOpacity;
        uniform vec3 uHot;
        void main() {
          float a = smoothstep(0.0, 0.45, vUv.y) * (1.0 - smoothstep(0.45, 1.0, vUv.y));
          gl_FragColor = vec4(uHot, a * uOpacity);
        }
      `,
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        toneMapped: false,
      }),
    [],
  )

  useFrame(() => {
    const p = progressRef.current ?? 0

    const tIn = remap(p, PHASES.portal[1] - 0.04, PHASES.laser[0] + 0.04)
    const alpha = clamp(easeInOut(tIn), 0, 1)

    if (!groupRef.current) return
    groupRef.current.visible = alpha > 0.02

    const t = performance.now() * 0.001
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.4)
    floorMat.color.setRGB(
      lerp01(0.0, 0.55, pulse),
      lerp01(0.7, 0.35, pulse),
      lerp01(0.95, 0.95, pulse),
    )
    floorMat.opacity = 1.0 * alpha
    if (floorRef.current) floorRef.current.position.y = Math.sin(t * 0.7) * 0.25

    if (scanRef.current) {
      const sweep = (t * 0.32) % 1
      const z = lerp01(-30, -340, sweep)
      scanRef.current.position.z = z
      scanMat.opacity = 0.75 * alpha * (0.6 + 0.4 * Math.sin(t * 4))
    }

    fogMat.uniforms.uOpacity.value = 0.85 * alpha
  })

  return (
    <group ref={groupRef}>
      {/* Atmosphere fog */}
      <mesh ref={fogRef} position={[0, 8, -200]} material={fogMat} frustumCulled={false}>
        <planeGeometry args={[420, 60, 1, 1]} />
      </mesh>

      {/* Floor lattice */}
      <lineSegments ref={floorRef} geometry={floorGeo} material={floorMat} frustumCulled={false} />

      {/* Horizontal sweeping scan beam */}
      <mesh ref={scanRef} position={[0, -2.85, -100]} material={scanMat}>
        <boxGeometry args={[80, 0.06, 1.4]} />
      </mesh>
    </group>
  )
}

const lerp01 = (a: number, b: number, t: number) => a + (b - a) * t
