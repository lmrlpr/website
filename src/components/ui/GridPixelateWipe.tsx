import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const COLS = 20
const ROWS = 10
const CELL_DURATION = 0.28
const MAX_STAGGER = 0.65
const MAX_DIST = Math.sqrt(COLS ** 2 + ROWS ** 2)

interface Cell {
  row: number
  col: number
  delay: number
}

const CELLS: Cell[] = []
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const norm = Math.sqrt(col ** 2 + row ** 2) / MAX_DIST
    CELLS.push({ row, col, delay: norm * MAX_STAGGER })
  }
}

interface GridPixelateWipeProps {
  onComplete: () => void
}

export function GridPixelateWipe({ onComplete }: GridPixelateWipeProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const skip = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    onComplete()
  }

  useEffect(() => {
    timerRef.current = setTimeout(onComplete, 1050)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Grid cells */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {CELLS.map(({ row, col, delay }) => (
          <motion.div
            key={`${row}-${col}`}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: CELL_DURATION, delay, ease: 'easeIn' }}
            style={{ background: '#0D1B3E' }}
          />
        ))}
      </div>

      {/* Skip button */}
      <motion.button
        onClick={skip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.45em] uppercase font-sans cursor-pointer transition-colors duration-300"
        style={{ color: 'rgba(255,255,255,0.3)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)' }}
      >
        skip
      </motion.button>
    </div>
  )
}
