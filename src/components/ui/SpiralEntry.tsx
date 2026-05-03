import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlipVerifyButton } from './FlipButton'

// ── Math helpers ──────────────────────────────────────────────

function easeG(p: number, g: number): number {
  if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
  return 1 - 0.5 * Math.pow(2 * (1 - p), g)
}

function easeOutElastic(x: number): number {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const c4 = (2 * Math.PI) / 4.5
  return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
}

function mapRange(v: number, s1: number, e1: number, s2: number, e2: number): number {
  return s2 + (e2 - s2) * ((v - s1) / (e1 - s1))
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(Math.max(v, lo), hi)
}

function lerp(a: number, b: number, t: number): number {
  return a * (1 - t) + b * t
}

function spiralXY(p: number, yOffset: number): [number, number] {
  p = clamp(1.2 * p, 0, 1)
  p = easeG(p, 1.8)
  const theta = 2 * Math.PI * 6 * Math.sqrt(p)
  const r = 170 * Math.sqrt(p)
  return [r * Math.cos(theta), r * Math.sin(theta) + yOffset]
}

// ── Seeded RNG ────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// ── Star data ─────────────────────────────────────────────────

interface StarData {
  dx: number
  dy: number
  perpX: number
  perpY: number
  spiralLoc: number
  strokeW: number
  z: number
  rotDir: number
  expansion: number
}

function buildStars(count: number, cameraZ: number, travelDist: number): StarData[] {
  const rng = makeRng(1234)
  const stars: StarData[] = []
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2
    const dist = 30 * rng() + 15
    const dx = dist * Math.cos(angle)
    const dy = dist * Math.sin(angle)
    const dlen = Math.hypot(dx, dy)
    const spiralLoc = (1 - Math.pow(1 - rng(), 3.0)) / 1.3
    const rawZ = lerp(
      rng() * (travelDist + cameraZ - 0.5 * cameraZ) + 0.5 * cameraZ,
      travelDist / 2,
      0.3 * spiralLoc,
    )
    stars.push({
      dx,
      dy,
      perpX: dlen > 0 ? -dy / dlen : 0,
      perpY: dlen > 0 ? dx / dlen : 0,
      spiralLoc,
      strokeW: Math.pow(rng(), 2.0),
      z: rawZ,
      rotDir: rng() > 0.5 ? 1 : -1,
      expansion: 1.2 + rng() * 0.8,
    })
  }
  return stars
}

// ── Text dissolve particles ───────────────────────────────────

interface TextParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  isGold: boolean
}

// ── Constants ─────────────────────────────────────────────────

const TITLE1 = 'PORTA'
const TITLE2 = 'NOVA'
const ACCESS_CODE = 'PROM2026'

const CAMERA_Z = -400
const TRAVEL = 3400
const VIEW_ZOOM = 100
const CHANGE_T = 0.32
const NUM_STARS = 3200
const Y_OFFSET = 28

// Tightened sequenced timeline (~5.2s to MENU button):
//   0 → 0.8s   → letters reveal on clean dark-blue background
//   0.8 → 1.0s → brief hold, text fully formed
//   1.0s       → BAM — text shatters into particles
//   1.0 → 1.6s → particles disperse and fade
//   1.4s       → starfield emerges (slight overlap with end of dispersal)
//   1.4 → 5.9s → 4.5s warp / camera zoom (no central trail cluster)
//   ~5.2s      → MENU button reveals
const TEXT_DISSOLVE_TRIGGER_MS = 1000
const TEXT_DISSOLVE_DURATION_MS = 600
const SPIRAL_START_MS = 1400
const SPIRAL_DURATION_MS = 4500
const MENU_REVEAL_T = 0.85

interface SpiralEntryProps {
  onVerified: () => void
}

export function SpiralEntry({ onVerified }: SpiralEntryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const portaRefs = useRef<(HTMLSpanElement | null)[]>([])
  const novaRefs = useRef<(HTMLSpanElement | null)[]>([])
  const textParticlesRef = useRef<TextParticle[]>([])
  const stoppedRef = useRef(false)

  const [showText, setShowText] = useState(true)
  const [stage, setStage] = useState<'intro' | 'menu' | 'password'>('intro')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const W = window.innerWidth
    const H = window.innerHeight
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    const size = Math.min(W, H)
    const scale = size / 440
    const stars = buildStars(NUM_STARS, CAMERA_Z, TRAVEL)

    // Sample each letter's pixel shape from the DOM and convert into particles
    function spawnTextParticles() {
      const all: { el: HTMLSpanElement | null; isGold: boolean }[] = [
        ...portaRefs.current.map(el => ({ el, isGold: false })),
        ...novaRefs.current.map(el => ({ el, isGold: true })),
      ]

      for (const { el, isGold } of all) {
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const letter = el.textContent || ''
        if (rect.width < 1 || rect.height < 1 || !letter.trim()) continue

        const off = document.createElement('canvas')
        const pad = 4
        off.width = Math.ceil(rect.width) + pad * 2
        off.height = Math.ceil(rect.height) + pad * 2
        const octx = off.getContext('2d')
        if (!octx) continue

        const cs = window.getComputedStyle(el)
        octx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
        octx.fillStyle = '#fff'
        octx.textBaseline = 'top'
        octx.fillText(letter, pad, pad)

        const data = octx.getImageData(0, 0, off.width, off.height).data
        const step = 3
        const cx = off.width / 2
        const cy = off.height / 2

        for (let py = 0; py < off.height; py += step) {
          for (let px = 0; px < off.width; px += step) {
            const idx = (py * off.width + px) * 4
            if (data[idx + 3] > 100) {
              const ddx = px - cx
              const ddy = py - cy
              const dist = Math.hypot(ddx, ddy) + 0.001
              const ox = ddx / dist
              const oy = ddy / dist

              textParticlesRef.current.push({
                x: rect.left + (px - pad),
                y: rect.top + (py - pad),
                vx: ox * (50 + Math.random() * 70) + (Math.random() - 0.5) * 30,
                vy: oy * (35 + Math.random() * 55) - 30 + (Math.random() - 0.5) * 30,
                life: 1.0,
                size: 0.5 + Math.random() * 1.4,
                isGold,
              })
            }
          }
        }
      }
    }

    function projectDot(t: number, wx: number, wy: number, wz: number, sw: number) {
      const t2 = clamp(mapRange(t, CHANGE_T, 1, 0, 1), 0, 1)
      const camZ = CAMERA_Z + easeG(Math.pow(t2, 1.2), 1.8) * TRAVEL
      if (wz <= camZ) return
      const depth = wz - camZ
      const sx = (VIEW_ZOOM * wx) / depth
      const sy = (VIEW_ZOOM * wy) / depth
      const r = Math.max(0.3, (400 * sw) / depth / 2)
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    function renderFrame(t: number, dt: number, spiralActive: boolean) {
      ctx.fillStyle = '#0D1B3E'
      ctx.fillRect(0, 0, W, H)

      if (!spiralActive) {
        // Pre-spiral phase: only render text particles (if any) on the clean background
        drawTextParticles(dt)
        return
      }

      // ── Spiral block (transformed coordinate space) ──────────
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.scale(scale, scale)

      const t1 = clamp(mapRange(t, 0, CHANGE_T + 0.25, 0, 1), 0, 1)
      const t2 = clamp(mapRange(t, CHANGE_T, 1, 0, 1), 0, 1)

      ctx.rotate(-Math.PI * easeG(t2, 2.7))

      // Stars (no central trail cluster — only the warp/starfield)
      ctx.fillStyle = 'white'
      for (const star of stars) {
        const [sx, sy] = spiralXY(star.spiralLoc, Y_OFFSET)
        const q = t1 - star.spiralLoc
        if (q <= 0) continue

        const dp = clamp(4 * q, 0, 1)
        const lin = dp
        const el = easeOutElastic(dp)
        const pw = Math.pow(dp, 2)
        let eased: number
        if (dp < 0.3) {
          eased = lerp(lin, pw, dp / 0.3)
        } else if (dp < 0.7) {
          eased = lerp(pw, el, (dp - 0.3) / 0.4)
        } else {
          eased = el
        }

        let wx: number, wy: number
        if (dp < 0.3) {
          const nf = clamp(dp / 0.3, 0, 1)
          wx = lerp(sx, sx + star.dx * 0.3, nf)
          wy = lerp(sy, sy + star.dy * 0.3, nf)
        } else if (dp < 0.7) {
          const mid = (dp - 0.3) / 0.4
          const baseX = sx + star.dx * 0.3
          const baseY = sy + star.dy * 0.3
          const targX = sx + star.dx
          const targY = sy + star.dy
          const curve = Math.sin(mid * Math.PI) * star.rotDir * star.expansion * 9
          wx = lerp(baseX, targX, mid) + curve * star.perpX
          wy = lerp(baseY, targY, mid) + curve * star.perpY
        } else {
          const end = (dp - 0.7) / 0.3
          wx = lerp(sx + star.dx * 0.7, sx + star.dx * star.expansion, easeOutElastic(end))
          wy = lerp(sy + star.dy * 0.7, sy + star.dy * star.expansion, easeOutElastic(end))
        }

        const sw = Math.max(0.3, (0.5 + 1.5 * star.strokeW) * eased)
        projectDot(t, wx, wy, star.z, sw)
      }

      // Origin dot
      if (t > CHANGE_T) {
        ctx.fillStyle = 'white'
        const dyWorld = (CAMERA_Z * Y_OFFSET) / VIEW_ZOOM
        projectDot(t, 0, dyWorld, TRAVEL, 2.5)
      }

      ctx.restore()

      // Text-particle layer always renders on top, in screen-space
      drawTextParticles(dt)
    }

    function drawTextParticles(dt: number) {
      const ps = textParticlesRef.current
      if (ps.length === 0) return
      const lifeDecay = (dt > 0 ? dt : 0.016) * (1000 / TEXT_DISSOLVE_DURATION_MS)
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i]
        if (dt > 0) {
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.vx *= 0.965
          p.vy *= 0.965
          p.vy -= 6 * dt
          p.life -= lifeDecay
        }
        if (p.life <= 0) {
          ps.splice(i, 1)
          continue
        }
        const a = Math.max(0, p.life)
        ctx.fillStyle = p.isGold ? `rgba(245,198,64,${a})` : `rgba(255,255,255,${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let textHidden = false
    let buttonShown = false
    let rafId: number
    let startTime: number | null = null
    let lastTime = 0

    function loop(now: number) {
      if (stoppedRef.current) return
      if (!startTime) startTime = now
      const elapsed = now - startTime
      const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0
      lastTime = now

      // Trigger dissolve — captures DOM rects while text is still in the layout
      if (!textHidden && elapsed > TEXT_DISSOLVE_TRIGGER_MS) {
        textHidden = true
        spawnTextParticles()
        setShowText(false)
      }

      // Spiral progress: stays at 0 before SPIRAL_START_MS, then 0→1 over SPIRAL_DURATION_MS
      const rawSpiral = (elapsed - SPIRAL_START_MS) / SPIRAL_DURATION_MS
      const spiralActive = rawSpiral >= 0
      const spiralT = clamp(rawSpiral, 0, 1)

      renderFrame(spiralT, dt, spiralActive)

      if (!buttonShown && spiralActive && spiralT >= MENU_REVEAL_T) {
        buttonShown = true
        setStage('menu')
      }

      // Keep ticking while: pre-spiral phase, spiral running, or particles still alive
      const done = spiralActive && spiralT >= 1 && textParticlesRef.current.length === 0
      if (!done) {
        rafId = requestAnimationFrame(loop)
      }
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleSkip = () => {
    stoppedRef.current = true
    textParticlesRef.current = []
    setShowText(false)
    setStage('password')
  }

  const handleVerify = async () => {
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem('restaurant_access', 'true')
      setError('')
      // brief pause so the user sees the success checkmark before transition
      await new Promise(resolve => setTimeout(resolve, 450))
      onVerified()
      return
    }
    setError('Code incorrect')
    throw new Error('wrong-code')
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ background: '#0D1B3E' }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, transparent 40%, rgba(7,15,40,0.45) 100%)',
        }}
      />

      {/* PORTA NOVA text — instantly removed when particles take over */}
      {showText && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ paddingBottom: '6vh' }}
        >
          <div className="overflow-hidden">
            <div
              className="font-resto text-white leading-none"
              style={{ fontSize: 'clamp(3rem,10vw,7rem)', letterSpacing: '0.07em' }}
            >
              {TITLE1.split('').map((char, i) => (
                <motion.span
                  key={i}
                  ref={(el: HTMLSpanElement | null) => { portaRefs.current[i] = el }}
                  className="inline-block"
                  initial={{ opacity: 0, y: 36, skewX: -8 }}
                  animate={{ opacity: 1, y: 0, skewX: 0 }}
                  transition={{ duration: 0.42, delay: 0.05 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div
              className="font-resto leading-none"
              style={{ fontSize: 'clamp(3rem,10vw,7rem)', letterSpacing: '0.07em', color: '#F5C640' }}
            >
              {TITLE2.split('').map((char, i) => (
                <motion.span
                  key={i}
                  ref={(el: HTMLSpanElement | null) => { novaRefs.current[i] = el }}
                  className="inline-block"
                  initial={{ opacity: 0, y: 36, skewX: -8 }}
                  animate={{ opacity: 1, y: 0, skewX: 0 }}
                  transition={{ duration: 0.42, delay: 0.26 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtle skip — visible only during the intro animation */}
      {stage === 'intro' && (
        <motion.button
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.45em] uppercase font-sans cursor-pointer transition-colors duration-300"
          style={{ color: 'rgba(255,255,255,0.22)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.22)' }}
        >
          skip
        </motion.button>
      )}

      {/* MENU stage — fully centered */}
      <AnimatePresence>
        {stage === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.35, ease: 'easeIn' } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/35 text-xs font-sans tracking-[0.45em] uppercase"
            >
              Prom Restaurant · 2026
            </motion.p>
            <button
              onClick={() => setStage('password')}
              className="relative px-10 py-3.5 rounded-full text-sm font-sans font-semibold text-white transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.28)',
                backdropFilter: 'blur(14px)',
                letterSpacing: '0.28em',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'rgba(255,255,255,0.18)'
                el.style.borderColor = 'rgba(255,255,255,0.55)'
                el.style.boxShadow = '0 0 32px rgba(75,137,228,0.45), 0 0 60px rgba(37,88,201,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.background = 'rgba(255,255,255,0.08)'
                el.style.borderColor = 'rgba(255,255,255,0.28)'
                el.style.boxShadow = 'none'
              }}
            >
              MENU
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password stage — glass card, centered */}
      <AnimatePresence>
        {stage === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center px-6"
          >
            <div
              className="w-full max-w-sm rounded-2xl px-8 py-9 flex flex-col gap-7"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.11)',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 32px 72px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              {/* Header */}
              <div className="flex flex-col items-center gap-3">
                <p className="text-white/35 text-[9px] tracking-[0.6em] uppercase font-sans">
                  Code d'accès
                </p>
                <div className="flex items-center gap-3 opacity-35">
                  <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7))' }} />
                  <svg width="9" height="9" viewBox="0 0 14 14">
                    <path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z" fill="#F5C640"/>
                  </svg>
                  <div className="h-px w-10" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.7), transparent)' }} />
                </div>
              </div>

              {/* Input */}
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={code}
                  onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
                  onKeyDown={e => { if (e.key === 'Enter') handleVerify().catch(() => {}) }}
                  placeholder="· · · · · · · ·"
                  autoFocus
                  className="w-full text-white placeholder:text-white/18 text-center text-base tracking-[0.55em] uppercase px-5 py-4 rounded-xl outline-none transition-all duration-200 border"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    borderColor: error ? 'rgba(248,113,113,0.55)' : 'rgba(255,255,255,0.18)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = error ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.5)'
                    e.target.style.background = 'rgba(255,255,255,0.11)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = error ? 'rgba(248,113,113,0.55)' : 'rgba(255,255,255,0.18)'
                    e.target.style.background = 'rgba(255,255,255,0.07)'
                  }}
                />
              </div>

              {/* Flip verify button */}
              <FlipVerifyButton onSubmit={handleVerify} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
