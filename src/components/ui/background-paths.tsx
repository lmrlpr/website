import { useMemo } from 'react'
import { motion } from 'framer-motion'

const DURATIONS = [22, 28, 24, 31, 19, 26, 33, 21, 27, 29, 23, 25, 30, 20, 32, 18, 24, 27, 22, 29,
  31, 20, 26, 23, 28, 25, 21, 30, 24, 27, 19, 22, 28, 31, 23, 26]

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768

function FloatingPaths({ position, gradientId }: { position: number; gradientId: string }) {
  const count = IS_MOBILE ? 8 : 36
  const paths = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
      width: 0.5 + i * 0.03,
      opacity: 0.04 + i * 0.012,
      duration: DURATIONS[i],
    })),
  [position, count])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        {paths.map((path) => IS_MOBILE ? (
          <path
            key={path.id}
            d={path.d}
            stroke={`url(#${gradientId})`}
            strokeWidth={path.width}
            strokeOpacity={path.opacity * 1.5}
          />
        ) : (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={`url(#${gradientId})`}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: path.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FloatingPaths position={1} gradientId="gothamGradPos" />
      <FloatingPaths position={-1} gradientId="gothamGradNeg" />
    </div>
  )
}
