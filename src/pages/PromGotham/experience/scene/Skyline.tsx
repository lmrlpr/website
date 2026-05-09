import { useEffect, useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Group,
  Mesh,
  InstancedMesh,
  BoxGeometry,
  MeshBasicMaterial,
  Object3D,
  ShaderMaterial,
  Color,
  PlaneGeometry,
} from 'three'
import { PHASES, remap, clamp, easeInOut } from '../phases'

/**
 * Distant Gotham skyline — a row of black silhouetted buildings on the
 * horizon of the laser stage, with a faint atmospheric glow plane behind.
 * Procedurally generated; deterministic seed so it's stable across renders.
 *
 * Sits at z ≈ -360, so it stays in view as the camera advances through the
 * stage on content scroll. Pure silhouette — no detail, no windows. The
 * outline is what carries the city identity.
 */
export function Skyline({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const instRef = useRef<InstancedMesh>(null)
  const haloRef = useRef<Mesh>(null)

  // Pseudo-random with a fixed seed so the city looks the same every reload
  const buildings = useMemo(() => {
    let s = 0xa55a3
    const rng = () => {
      s = (s * 1664525 + 1013904223) >>> 0
      return (s & 0xffff) / 0xffff
    }
    const out: { x: number; w: number; h: number; d: number }[] = []
    let x = -160
    while (x < 160) {
      const w = 4 + rng() * 10
      const h = 6 + Math.pow(rng(), 1.6) * 38
      const d = 4 + rng() * 8
      out.push({ x: x + w / 2, w, h, d })
      x += w + (0.4 + rng() * 1.6)
    }
    return out
  }, [])

  const buildingGeo = useMemo(() => new BoxGeometry(1, 1, 1), [])
  const buildingMat = useMemo(
    () =>
      new MeshBasicMaterial({
        color: 0x12091f,
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    [],
  )

  // Seed the instanced matrices after mount (refs aren't populated during useMemo)
  useEffect(() => {
    if (!instRef.current) return
    const dummy = new Object3D()
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2 - 3, 0) // floor sits at y = -3
      dummy.scale.set(b.w, b.h, b.d)
      dummy.updateMatrix()
      instRef.current!.setMatrixAt(i, dummy.matrix)
    })
    instRef.current.instanceMatrix.needsUpdate = true
  }, [buildings])

  // Atmospheric glow halo behind the city — gives the skyline its silhouette.
  // Brighter colours so the silhouettes read clearly through the dim scrim.
  const haloMat = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0 },
        uHot: { value: new Color('#c8a8ff') },
        uCold: { value: new Color('#241344') },
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
        uniform vec3 uCold;
        void main() {
          // Vertical gradient: hot near the horizon, fading to cold up
          float v = smoothstep(0.0, 0.65, vUv.y);
          vec3 col = mix(uHot, uCold, v);
          // Subtle horizontal vignette
          float h = 1.0 - smoothstep(0.45, 0.95, abs(vUv.x - 0.5));
          float a = (1.0 - v) * h * uOpacity;
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    })
  }, [])

  useFrame(() => {
    const p = progressRef.current ?? 0
    const tIn = remap(p, PHASES.portal[1] - 0.15, PHASES.laser[0] + 0.05)
    const alpha = clamp(easeInOut(tIn), 0, 1)

    buildingMat.opacity = 1.0 * alpha
    haloMat.uniforms.uOpacity.value = 1.4 * alpha

    if (groupRef.current) groupRef.current.visible = alpha > 0.01
  })

  return (
    <group ref={groupRef} position={[0, 0, -260]}>
      {/* Atmospheric halo — fades from violet at the horizon to dark above */}
      <mesh ref={haloRef} position={[0, 22, -4]} material={haloMat}>
        <primitive object={new PlaneGeometry(480, 100, 1, 1)} attach="geometry" />
      </mesh>

      {/* Instanced skyline buildings */}
      <instancedMesh
        ref={instRef}
        args={[buildingGeo, buildingMat, buildings.length]}
        frustumCulled={false}
      />
    </group>
  )
}
