import { useMemo, useRef, type RefObject } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshBasicMaterial, AdditiveBlending, Color } from 'three'
import { PHASES, remap, easeInOut, easeOutExpo, lerp, clamp } from '../phases'

const FONT_URL = '/fonts/BebasNeue-Regular.ttf'
const LETTERS = ['G', 'O', 'T', 'H', 'A', 'M'] as const
const LETTER_SPACING = 2.3
const FONT_SIZE = 4
const letterX = (i: number) => (i - (LETTERS.length - 1) / 2) * LETTER_SPACING
const H_INDEX = 3
const H_X = letterX(H_INDEX)
const PORTAL_W = 1.6
const PORTAL_H = 3.4

// Drei Text refs are Three.Mesh-shaped (Troika text instances act as Meshes)
type TextRef = Mesh & { fillOpacity?: number; outlineOpacity?: number }

/**
 * GOTHAM word with a portal in the H's inner gap.
 *   landing  : all 6 letters visible, idle
 *   approach : H portal energy builds
 *   portal   : non-H letters fade & drift outward, portal plane scales up
 *   warp+    : whole group fades (camera has flown through)
 */
export function GothamPortal({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const textRefs = useRef<(TextRef | null)[]>([])
  const portalRef = useRef<Mesh>(null)
  const baseX = useMemo(() => LETTERS.map((_, i) => letterX(i)), [])

  // Simple additive plane — bright + warm, gives the inner-H gap a glowing core
  const portalMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: new Color('#a78bfa'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
      toneMapped: false,
    })
  }, [])

  useFrame(() => {
    const p = progressRef.current ?? 0
    const tApproach = remap(p, PHASES.approach[0], PHASES.approach[1])
    const tPortal   = remap(p, PHASES.portal[0],   PHASES.portal[1])
    const tWarp     = remap(p, PHASES.warp[0],     PHASES.warp[1])

    const intensity = clamp(easeInOut(tApproach) * 0.55 + tPortal * 0.7, 0, 1)

    // Portal plane brightens through approach, scales massively in portal phase
    portalMaterial.opacity = 0.15 + intensity * 0.85
    if (portalRef.current) {
      const scale = lerp(1, 22, easeOutExpo(tPortal))
      portalRef.current.scale.set(scale, scale * 1.05, 1)
      // Shift colour from violet to white-hot as the door "opens"
      const c = portalMaterial.color
      c.setRGB(
        lerp(0.65, 1.0, tPortal),
        lerp(0.55, 0.95, tPortal),
        lerp(0.98, 1.0, tPortal),
      )
    }

    // Letters: fade + drift outward in approach→portal, except the H
    const fadeOut = clamp(easeInOut(tApproach * 1.1) + tPortal, 0, 1)
    textRefs.current.forEach((t, i) => {
      if (!t) return
      if (i === H_INDEX) {
        // H stays, scales slightly during portal phase, fades during warp
        t.position.x = H_X
        const hScale = lerp(1, 1.4, easeInOut(tPortal))
        t.scale.setScalar(hScale)
        t.fillOpacity = clamp(1 - tWarp * 1.4, 0, 1)
        t.outlineOpacity = 0.55 * clamp(1 - tWarp * 1.4, 0, 1)
      } else {
        const dir = i < H_INDEX ? -1 : 1
        const distFromH = Math.abs(i - H_INDEX)
        t.position.x = baseX[i] + dir * fadeOut * 4 * distFromH
        t.fillOpacity = 1 - fadeOut
        t.outlineOpacity = 0.35 * (1 - fadeOut)
      }
    })

    // Whole group hides once camera has passed through
    if (groupRef.current) {
      groupRef.current.visible = tWarp < 0.95
      groupRef.current.position.y = Math.sin(performance.now() * 0.0005) * 0.05 * (1 - tApproach * 0.5)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Portal plane — sits behind the H, glows through the H's inner gap */}
      <mesh ref={portalRef} position={[H_X, 0, -0.6]} material={portalMaterial}>
        <planeGeometry args={[PORTAL_W, PORTAL_H, 1, 1]} />
      </mesh>

      {/* Six GOTHAM letters as separate Text instances for individual control */}
      {LETTERS.map((char, i) => (
        <Text
          key={char}
          ref={(t) => {
            textRefs.current[i] = t as TextRef | null
          }}
          font={FONT_URL}
          fontSize={FONT_SIZE}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[letterX(i), 0, 0]}
          material-toneMapped={false}
          material-transparent={true}
          outlineWidth={i === H_INDEX ? 0.02 : 0.015}
          outlineColor="#00d4ff"
          outlineOpacity={i === H_INDEX ? 0.55 : 0.35}
          fillOpacity={1}
        >
          {char}
        </Text>
      ))}
    </group>
  )
}
