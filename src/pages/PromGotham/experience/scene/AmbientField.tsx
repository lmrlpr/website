import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Color, AdditiveBlending } from 'three'
import { PHASES, remap, clamp } from '../phases'

/**
 * Distant radial-glow plane behind the GOTHAM word — replaces the old
 * random drifting particle field. No floaters. Fades out as we enter the
 * portal phase so it doesn't interfere with the doorway traversal.
 */
export function AmbientField({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<Mesh>(null)

  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.5 },
        uColor: { value: new Color('#3a2a5a') },
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
        uniform vec3 uColor;
        void main() {
          float d = distance(vUv, vec2(0.5));
          float a = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(uColor, a * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    })
  }, [])

  useFrame(() => {
    const p = progressRef.current ?? 0
    // Fade out fully by the second half of approach — must be gone before
    // the H fills the frame, otherwise it washes out the doorway.
    const midApproach = PHASES.approach[0] + 0.5 * (PHASES.approach[1] - PHASES.approach[0])
    const fade = clamp(1 - remap(p, PHASES.approach[0], midApproach) * 1.4, 0, 1)
    material.uniforms.uOpacity.value = 0.45 * fade
    if (ref.current) ref.current.visible = fade > 0.01
  })

  return (
    <mesh ref={ref} position={[0, 0, -10]} material={material} frustumCulled={false}>
      <planeGeometry args={[80, 44, 1, 1]} />
    </mesh>
  )
}
