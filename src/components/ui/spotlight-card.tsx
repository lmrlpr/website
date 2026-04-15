import { useEffect, useRef, type ReactNode } from 'react'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  customSize?: boolean
  width?: string | number
  height?: string | number
}

const glowColorMap = {
  blue:   { base: 195, spread: 160 },
  purple: { base: 270, spread: 200 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
}

const beforeAfterCSS = `
[data-glow]::before,
[data-glow]::after {
  pointer-events: none;
  content: "";
  position: absolute;
  inset: calc(var(--border-size) * -1);
  border: var(--border-size) solid transparent;
  border-radius: calc(var(--radius) * 1px);
  background-attachment: fixed;
  background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
  background-repeat: no-repeat;
  background-position: 50% 50%;
  mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
}
[data-glow]::before {
  background-image: radial-gradient(
    calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
    calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
    hsl(var(--hue,210) calc(var(--saturation,100) * 1%) calc(var(--lightness,50) * 1%) / var(--border-spot-opacity,1)),
    transparent 100%
  );
  filter: brightness(2);
}
[data-glow]::after {
  background-image: radial-gradient(
    calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
    calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
    hsl(0 100% 100% / var(--border-light-opacity,1)),
    transparent 100%
  );
}
[data-glow] [data-glow] {
  position: absolute;
  inset: 0;
  will-change: filter;
  opacity: var(--outer, 1);
  border-radius: calc(var(--radius) * 1px);
  border-width: calc(var(--border-size) * 20);
  filter: blur(calc(var(--border-size) * 10));
  background: none;
  pointer-events: none;
  border: none;
}
[data-glow] > [data-glow]::before {
  inset: -10px;
  border-width: 10px;
}
`

let styleInjected = false

export function GlowCard({ children, className = '', glowColor = 'blue', customSize = false, width, height }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!styleInjected) {
      const el = document.createElement('style')
      el.textContent = beforeAfterCSS
      document.head.appendChild(el)
      styleInjected = true
    }
  }, [])

  useEffect(() => {
    const sync = (e: PointerEvent) => {
      cardRef.current?.style.setProperty('--x', e.clientX.toFixed(2))
      cardRef.current?.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2))
      cardRef.current?.style.setProperty('--y', e.clientY.toFixed(2))
      cardRef.current?.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2))
    }
    document.addEventListener('pointermove', sync)
    return () => document.removeEventListener('pointermove', sync)
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  const inlineStyle: Record<string, string | number> = {
    '--base': base,
    '--spread': spread,
    '--radius': '16',
    '--border': '2',
    '--backdrop': 'hsl(0 0% 8% / 0.85)',
    '--backup-border': 'hsl(0 0% 100% / 0.06)',
    '--size': '220',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue,210) calc(var(--saturation,100) * 1%) calc(var(--lightness,70) * 1%) / var(--bg-spot-opacity,0.08)),
      transparent
    )`,
    backgroundColor: 'var(--backdrop, transparent)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: 'var(--border-size) solid var(--backup-border)',
    position: 'relative',
    touchAction: 'none',
  }

  if (width !== undefined) inlineStyle.width = typeof width === 'number' ? `${width}px` : width
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      ref={cardRef}
      data-glow
      style={inlineStyle as React.CSSProperties}
      className={`rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-5 gap-4 backdrop-blur-sm ${!customSize ? '' : ''} ${className}`}
    >
      <div data-glow />
      {children}
    </div>
  )
}
