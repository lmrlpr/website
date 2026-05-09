import { useMemo, useRef, type RefObject } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshBasicMaterial } from 'three'
import { PHASES, remap, easeInOut, lerp, clamp } from '../phases'

const FONT_URL = '/fonts/BebasNeue-Regular.ttf'
// Word slots: G O T [H] A M. H is built geometrically as 3 boxes so the
// inner negative space is real, traversable 3D.
const SIDE_LETTERS = ['G', 'O', 'T', 'A', 'M'] as const
const SIDE_SLOTS = [0, 1, 2, 4, 5] as const
const H_SLOT = 3
const LETTER_SPACING = 3.6
const FONT_SIZE = 4.2

// Natural slot → world X (centre of the 6-slot word at x=0)
const slotX = (i: number) => (i - 2.5) * LETTER_SPACING

// H sits at slot 3 = world x = 1.6. Even spacing on both sides:
//   G(-8)  O(-4.8)  T(-1.6)  H(+1.6)  A(+4.8)  M(+8)
// CameraRig pans the camera to this X so we fly straight through the H gap.
export const H_WORLD_X = slotX(H_SLOT)

// Geometric H — sized to match the rendered cap-height of Bebas Neue at
// the same nominal FONT_SIZE. Bebas renders very tall (cap-height nearly
// equals em), so the geometric H needs significant overshoot vs FONT_SIZE.
const PILLAR_W = 0.95
const PILLAR_H = 6.6
const PILLAR_D = 0.45
const GAP = 1.7
const PILLAR_X = GAP / 2 + PILLAR_W / 2
const CROSSBAR_W = GAP
const CROSSBAR_H = 0.85

type TextRef = Mesh & { fillOpacity?: number }
type DateRef = Mesh & { fillOpacity?: number }

/**
 * GOTHAM word with the H rebuilt as a real 3D doorway, plus the event date
 * underneath as a title accent.
 *
 * The H sub-group sits at world (H_WORLD_X, 0, 0). The camera (in CameraRig)
 * pans to this X during approach so it flies straight between the pillars.
 */
export function GothamPortal({ progressRef }: { progressRef: RefObject<number> }) {
  const groupRef = useRef<Group>(null)
  const textRefs = useRef<(TextRef | null)[]>([])
  const dateRef = useRef<DateRef>(null)
  const labelRef = useRef<DateRef>(null)
  const hGroupRef = useRef<Group>(null)
  const leftPillarRef = useRef<Mesh>(null)
  const rightPillarRef = useRef<Mesh>(null)
  const crossbarRef = useRef<Mesh>(null)

  const pillarMat = useMemo(
    () => new MeshBasicMaterial({ color: 0xf3f5ff, transparent: true, opacity: 1, toneMapped: false }),
    [],
  )
  const crossbarMat = useMemo(
    () => new MeshBasicMaterial({ color: 0xf3f5ff, transparent: true, opacity: 1, toneMapped: false }),
    [],
  )

  useFrame(() => {
    const p = progressRef.current ?? 0
    const tLanding = remap(p, PHASES.landing[0], PHASES.landing[1])
    const tApproach = remap(p, PHASES.approach[0], PHASES.approach[1])
    const tPortal = remap(p, PHASES.portal[0], PHASES.portal[1])
    // Fade pillars over the *tail* of the portal phase — they dissolve as the
    // camera passes them.
    const tPillarFade = remap(p, PHASES.portal[0] + 0.5 * (PHASES.portal[1] - PHASES.portal[0]), PHASES.portal[1])

    // Side letters drift outward + fade in approach→portal
    const fade = clamp(easeInOut(tApproach * 1.0) + tPortal, 0, 1)
    SIDE_SLOTS.forEach((slot, i) => {
      const t = textRefs.current[i]
      if (!t) return
      const dir = slot < H_SLOT ? -1 : 1
      const dist = Math.abs(slot - H_SLOT)
      const baseX = slotX(slot)
      t.position.x = baseX + dir * fade * 2.2 * dist
      t.fillOpacity = 1 - fade
    })

    // Date label — fades in during landing, fades out as we approach
    const dateAlpha = clamp(easeInOut(tLanding) - tApproach * 1.6, 0, 1)
    if (dateRef.current) dateRef.current.fillOpacity = dateAlpha
    if (labelRef.current) labelRef.current.fillOpacity = dateAlpha * 0.7

    // Doorway opens: crossbar lifts away + fades, pillars spread slightly
    if (crossbarRef.current) {
      const open = easeInOut(tPortal)
      crossbarRef.current.position.y = lerp(0.25, 6, open)
      crossbarMat.opacity = clamp(1 - tPortal * 1.4, 0, 1)
    }
    const spread = easeInOut(tPortal) * 0.6
    if (leftPillarRef.current) leftPillarRef.current.position.x = -PILLAR_X - spread
    if (rightPillarRef.current) rightPillarRef.current.position.x = PILLAR_X + spread

    // Pillars fade out across portal tail (was tFlash before flash was deleted)
    pillarMat.opacity = clamp(1 - tPillarFade * 1.4, 0, 1)

    if (groupRef.current) {
      groupRef.current.visible = tPillarFade < 0.98
      groupRef.current.position.y = Math.sin(performance.now() * 0.0005) * 0.05 * (1 - tApproach * 0.5)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Geometric H — pillars + crossbar parented to a sub-group at H_WORLD_X */}
      <group ref={hGroupRef} position={[H_WORLD_X, 0, 0]}>
        <mesh ref={leftPillarRef} position={[-PILLAR_X, 0, 0]} material={pillarMat}>
          <boxGeometry args={[PILLAR_W, PILLAR_H, PILLAR_D]} />
        </mesh>
        <mesh ref={rightPillarRef} position={[PILLAR_X, 0, 0]} material={pillarMat}>
          <boxGeometry args={[PILLAR_W, PILLAR_H, PILLAR_D]} />
        </mesh>
        <mesh ref={crossbarRef} position={[0, 0.25, 0]} material={crossbarMat}>
          <boxGeometry args={[CROSSBAR_W, CROSSBAR_H, PILLAR_D]} />
        </mesh>
      </group>

      {/* Side letters — clean white, no outline halo */}
      {SIDE_LETTERS.map((char, i) => (
        <Text
          key={char}
          ref={(t) => {
            textRefs.current[i] = t as TextRef | null
          }}
          font={FONT_URL}
          fontSize={FONT_SIZE}
          color="#f3f5ff"
          anchorX="center"
          anchorY="middle"
          position={[slotX(SIDE_SLOTS[i]), 0, 0]}
          material-toneMapped={false}
          material-transparent={true}
          fillOpacity={1}
        >
          {char}
        </Text>
      ))}

      {/* SAVE THE DATE label — sits centred under the H */}
      <Text
        ref={(t) => {
          labelRef.current = t as DateRef | null
        }}
        font={FONT_URL}
        fontSize={0.55}
        color="#a78bfa"
        anchorX="center"
        anchorY="middle"
        position={[H_WORLD_X, -3.6, 0]}
        material-toneMapped={false}
        material-transparent={true}
        letterSpacing={0.45}
        fillOpacity={0}
      >
        SAVE THE DATE
      </Text>

      {/* Event date */}
      <Text
        ref={(t) => {
          dateRef.current = t as DateRef | null
        }}
        font={FONT_URL}
        fontSize={1.05}
        color="#f3f5ff"
        anchorX="center"
        anchorY="middle"
        position={[H_WORLD_X, -4.7, 0]}
        material-toneMapped={false}
        material-transparent={true}
        letterSpacing={0.18}
        fillOpacity={0}
      >
        02.07.2026
      </Text>
    </group>
  )
}
