import { useMemo, useRef, type RefObject } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, MeshBasicMaterial } from 'three'
// @ts-expect-error — troika-three-text has no bundled types but preloadFont is exported at runtime
import { preloadFont } from 'troika-three-text'
import { PHASES, remap, easeInOut, lerp, clamp } from '../phases'

const FONT_URL = '/fonts/BebasNeue-Regular.ttf'

// Kick off Bebas Neue download immediately at module load so by the time the
// scene mounts the font is already in cache and Text letters render in sync
// with the geometric H. Without this the H pops in seconds before G O T A M !
const FONT_CHARS = 'GOTHAMSAVEDT0123456789. !'
preloadFont({ font: FONT_URL, characters: FONT_CHARS }, () => {})

// 7-slot word: G O T [H] A M ! — exactly 3 chars on each side of H, so the
// word is mathematically symmetric around H. No camera X-pan needed.
const SIDE_LETTERS = ['G', 'O', 'T', 'A', 'M', '!'] as const
const SIDE_SLOTS = [0, 1, 2, 4, 5, 6] as const
const H_SLOT = 3
const LETTER_SPACING = 3.6
const FONT_SIZE = 4.2

// World X for a slot (H at x=0, perfectly centred)
const slotX = (i: number) => (i - H_SLOT) * LETTER_SPACING
export const H_WORLD_X = 0

// Geometric H — the crossbar sits high so the *lower* void becomes the
// obvious doorway the camera flies through.
const PILLAR_W = 0.95
const PILLAR_H = 5.8
const PILLAR_D = 0.45
const GAP = 1.7
const PILLAR_X = GAP / 2 + PILLAR_W / 2
const CROSSBAR_W = GAP
const CROSSBAR_H = 0.85
// Crossbar pushed UP — gives a tall lower doorway and a small upper window
const CROSSBAR_Y = 1.05

type TextRef = Mesh & { fillOpacity?: number }
type DateRef = Mesh & { fillOpacity?: number }

/**
 * GOTHAM! word with the H rebuilt as a real 3D doorway.
 *
 * The 7-slot word is symmetric around H (3 chars each side). Crossbar sits
 * high (y=1.05) so the lower void below the crossbar is a clear vertical
 * channel — the camera (panning down to y=-1.5) flies straight through it.
 * Crossbar lifts away during portal phase to clear the camera's path.
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
    const tPillarFade = remap(p, PHASES.portal[0] + 0.5 * (PHASES.portal[1] - PHASES.portal[0]), PHASES.portal[1])

    // Side letters drift outward + fade in approach→portal
    const fade = clamp(easeInOut(tApproach * 1.0) + tPortal, 0, 1)
    SIDE_SLOTS.forEach((slot, i) => {
      const t = textRefs.current[i]
      if (!t) return
      const dir = slot < H_SLOT ? -1 : 1
      const dist = Math.abs(slot - H_SLOT)
      t.position.x = slotX(slot) + dir * fade * 2.2 * dist
      t.fillOpacity = 1 - fade
    })

    // Date label — fades in during landing, fades out as we approach
    const dateAlpha = clamp(easeInOut(tLanding) - tApproach * 1.6, 0, 1)
    if (dateRef.current) dateRef.current.fillOpacity = dateAlpha
    if (labelRef.current) labelRef.current.fillOpacity = dateAlpha * 0.85

    // Doorway opens: crossbar lifts further up + fades, pillars spread slightly
    if (crossbarRef.current) {
      const open = easeInOut(tPortal)
      crossbarRef.current.position.y = lerp(CROSSBAR_Y, 7, open)
      crossbarMat.opacity = clamp(1 - tPortal * 1.4, 0, 1)
    }
    const spread = easeInOut(tPortal) * 0.55
    if (leftPillarRef.current) leftPillarRef.current.position.x = -PILLAR_X - spread
    if (rightPillarRef.current) rightPillarRef.current.position.x = PILLAR_X + spread

    pillarMat.opacity = clamp(1 - tPillarFade * 1.4, 0, 1)

    if (groupRef.current) {
      groupRef.current.visible = tPillarFade < 0.98
      groupRef.current.position.y = Math.sin(performance.now() * 0.0005) * 0.05 * (1 - tApproach * 0.5)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Geometric H — crossbar HIGH so the lower void is the doorway */}
      <group ref={hGroupRef} position={[H_WORLD_X, 0, 0]}>
        <mesh ref={leftPillarRef} position={[-PILLAR_X, 0, 0]} material={pillarMat}>
          <boxGeometry args={[PILLAR_W, PILLAR_H, PILLAR_D]} />
        </mesh>
        <mesh ref={rightPillarRef} position={[PILLAR_X, 0, 0]} material={pillarMat}>
          <boxGeometry args={[PILLAR_W, PILLAR_H, PILLAR_D]} />
        </mesh>
        <mesh ref={crossbarRef} position={[0, CROSSBAR_Y, 0]} material={crossbarMat}>
          <boxGeometry args={[CROSSBAR_W, CROSSBAR_H, PILLAR_D]} />
        </mesh>
      </group>

      {/* Side letters — clean white, no outline halo */}
      {SIDE_LETTERS.map((char, i) => (
        <Text
          key={`${SIDE_SLOTS[i]}-${char}`}
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

      {/* SAVE THE DATE — cyan, well below H for breathing room */}
      <Text
        ref={(t) => {
          labelRef.current = t as DateRef | null
        }}
        font={FONT_URL}
        fontSize={0.5}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        position={[H_WORLD_X, -5.2, 0]}
        material-toneMapped={false}
        material-transparent={true}
        letterSpacing={0.5}
        fillOpacity={0}
      >
        SAVE THE DATE
      </Text>

      {/* Event date — warm white, larger */}
      <Text
        ref={(t) => {
          dateRef.current = t as DateRef | null
        }}
        font={FONT_URL}
        fontSize={1.15}
        color="#f3f5ff"
        anchorX="center"
        anchorY="middle"
        position={[H_WORLD_X, -6.5, 0]}
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
