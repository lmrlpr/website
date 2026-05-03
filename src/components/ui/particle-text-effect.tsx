"use client"

import { useEffect, useRef } from "react"

interface Vector2D {
  x: number
  y: number
}

interface RGB {
  r: number
  g: number
  b: number
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 }
  vel: Vector2D = { x: 0, y: 0 }
  acc: Vector2D = { x: 0, y: 0 }
  target: Vector2D = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor: RGB = { r: 0, g: 0, b: 0 }
  targetColor: RGB = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    )
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }
    const magnitude = Math.sqrt(towardsTarget.x ** 2 + towardsTarget.y ** 2)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y }
    const steerMag = Math.sqrt(steer.x ** 2 + steer.y ** 2)
    if (steerMag > 0) {
      steer.x = (steer.x / steerMag) * this.maxForce
      steer.y = (steer.y / steerMag) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const randomPos = this._randomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = randomPos.x
      this.target.y = randomPos.y
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }

  private _randomPos(x: number, y: number, mag: number): Vector2D {
    const rx = Math.random() * 1000
    const ry = Math.random() * 500
    const dir = { x: rx - x, y: ry - y }
    const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
    if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
    return { x: x + dir.x, y: y + dir.y }
  }
}

// Logical canvas dimensions — particle physics always live in this space
const LOGICAL_W = 1000
const LOGICAL_H = 500

interface ParticleTextEffectProps {
  words?: string[]
  colorThemes?: Array<Array<RGB>>
  onWordChange?: (index: number) => void
  className?: string
  bgColor?: string  // fill color for motion-blur trail (default: black)
}

const DEFAULT_WORDS = ["HELLO"]

export function ParticleTextEffect({
  words = DEFAULT_WORDS,
  colorThemes,
  onWordChange,
  className = "",
  bgColor = "rgba(0,0,0,0.1)",
}: ParticleTextEffectProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false })
  const scaleRef = useRef({ x: 1, y: 1 })

  const pixelSteps = 6
  const drawAsPoints = true

  const toLogical = (clientX: number, clientY: number, rect: DOMRect) => ({
    x: (clientX - rect.left) * (LOGICAL_W / (rect.right - rect.left)),
    y: (clientY - rect.top) * (LOGICAL_H / (rect.bottom - rect.top)),
  })

  const randomPos = (x: number, y: number, mag: number): Vector2D => {
    const rx = Math.random() * LOGICAL_W
    const ry = Math.random() * LOGICAL_H
    const dir = { x: rx - x, y: ry - y }
    const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
    if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
    return { x: x + dir.x, y: y + dir.y }
  }

  const nextWord = (wordIdx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const word = words[wordIdx % words.length]

    // Always render text in logical 1000×500 space
    const offscreen = document.createElement("canvas")
    offscreen.width = LOGICAL_W
    offscreen.height = LOGICAL_H
    const offCtx = offscreen.getContext("2d")!
    offCtx.fillStyle = "white"
    offCtx.font = "bold 100px Arial"
    offCtx.textAlign = "center"
    offCtx.textBaseline = "middle"
    offCtx.fillText(word, LOGICAL_W / 2, LOGICAL_H / 2)

    const imageData = offCtx.getImageData(0, 0, LOGICAL_W, LOGICAL_H)
    const pixels = imageData.data

    const theme = colorThemes?.[wordIdx % (colorThemes?.length ?? 1)]
    const newColor: RGB = theme
      ? { ...theme[Math.floor(Math.random() * theme.length)] }
      : { r: Math.random() * 255, g: Math.random() * 255, b: Math.random() * 255 }

    const particles = particlesRef.current
    let particleIndex = 0

    const coordsIndexes: number[] = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) coordsIndexes.push(i)

    // Shuffle for fluid motion
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const coordIndex of coordsIndexes) {
      if (pixels[coordIndex + 3] > 0) {
        const x = (coordIndex / 4) % LOGICAL_W
        const y = Math.floor(coordIndex / 4 / LOGICAL_W)

        let p: Particle
        if (particleIndex < particles.length) {
          p = particles[particleIndex]
          p.isKilled = false
          particleIndex++
        } else {
          p = new Particle()
          const pos = randomPos(LOGICAL_W / 2, LOGICAL_H / 2, (LOGICAL_W + LOGICAL_H) / 2)
          p.pos.x = pos.x
          p.pos.y = pos.y
          p.maxSpeed = Math.random() * 6 + 4
          p.maxForce = p.maxSpeed * 0.05
          p.particleSize = Math.random() * 6 + 6
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025
          particles.push(p)
        }

        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        }
        p.targetColor = { ...newColor }
        p.colorWeight = 0
        p.target.x = x
        p.target.y = y
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(LOGICAL_W, LOGICAL_H)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const particles = particlesRef.current
    const sx = scaleRef.current.x
    const sy = scaleRef.current.y

    ctx.save()
    ctx.scale(sx, sy)

    // Motion blur fill in logical space
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.move()
      p.draw(ctx, drawAsPoints)
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > LOGICAL_W || p.pos.y < 0 || p.pos.y > LOGICAL_H)) {
        particles.splice(i, 1)
      }
    }

    // Right-click / long-press kill interaction
    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((p) => {
        const d = Math.sqrt((p.pos.x - mouseRef.current.x) ** 2 + (p.pos.y - mouseRef.current.y) ** 2)
        if (d < 50) p.kill(LOGICAL_W, LOGICAL_H)
      })
    }

    ctx.restore()

    frameCountRef.current++
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length
      nextWord(wordIndexRef.current)
      onWordChange?.(wordIndexRef.current)
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    let animationStarted = false

    const sizeCanvas = () => {
      const w = wrapper.clientWidth
      if (w === 0) return false
      const h = Math.round(w * 0.5)
      canvas.width = w
      canvas.height = h
      scaleRef.current = { x: w / LOGICAL_W, y: h / LOGICAL_H }
      return true
    }

    const startAnimation = () => {
      if (animationStarted) return
      if (!sizeCanvas()) return
      animationStarted = true
      nextWord(0)
      animate()
    }

    startAnimation()

    const ro = new ResizeObserver(() => {
      if (!animationStarted) {
        startAnimation()
      } else {
        sizeCanvas()
      }
    })
    ro.observe(wrapper)

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.isRightClick = e.button === 2
      const pos = toLogical(e.clientX, e.clientY, canvas.getBoundingClientRect())
      mouseRef.current.x = pos.x
      mouseRef.current.y = pos.y
    }
    const handleMouseUp = () => {
      mouseRef.current.isPressed = false
      mouseRef.current.isRightClick = false
    }
    const handleMouseMove = (e: MouseEvent) => {
      const pos = toLogical(e.clientX, e.clientY, canvas.getBoundingClientRect())
      mouseRef.current.x = pos.x
      mouseRef.current.y = pos.y
    }
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()

    const handleTouchStart = (e: TouchEvent) => {
      mouseRef.current.isPressed = true
      mouseRef.current.isRightClick = false
      const touch = e.touches[0]
      const pos = toLogical(touch.clientX, touch.clientY, canvas.getBoundingClientRect())
      mouseRef.current.x = pos.x
      mouseRef.current.y = pos.y
    }
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const pos = toLogical(touch.clientX, touch.clientY, canvas.getBoundingClientRect())
      mouseRef.current.x = pos.x
      mouseRef.current.y = pos.y
    }
    const handleTouchEnd = () => {
      mouseRef.current.isPressed = false
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("contextmenu", handleContextMenu)
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true })
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      ro.disconnect()
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("contextmenu", handleContextMenu)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [words])

  // prefers-reduced-motion: static fallback
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return (
      <div className={`flex items-center justify-center bg-black aspect-[2/1] ${className}`}>
        <span className="font-bold text-4xl text-white tracking-widest">{words[0]}</span>
      </div>
    )
  }

  return (
    <div ref={wrapperRef} className={`w-full ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  )
}
