import * as React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { cn } from '../../utils/cn'

export type CellOrigin = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface BentoImageCell {
  src: string
  alt?: string
  /** CSS grid-column value e.g. 'span 1' | 'span 2' */
  colSpan: string
  /** CSS grid-row value, defaults to 'span 1' */
  rowSpan?: string
  /** Which corner this cell appears to grow from */
  origin: CellOrigin
}

interface HeroGalleryScrollAnimationProps {
  cells: BentoImageCell[]
  children?: React.ReactNode
  bgColor?: string
  className?: string
}

const ORIGIN_CSS: Record<CellOrigin, string> = {
  'top-left': '0% 0%',
  'top-right': '100% 0%',
  'bottom-left': '0% 100%',
  'bottom-right': '100% 100%',
}

export function HeroGalleryScrollAnimation({
  cells,
  children,
  bgColor = '#EADFCC',
  className,
}: HeroGalleryScrollAnimationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // All cells share one scale: 0.5 → 1 over the first 90% of scroll
  const cellScale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1])

  // Per-axis translate MotionValues — sign depends on which side the corner is on
  const xLeft = useTransform(scrollYProgress, [0.1, 0.9], ['-35%', '0%'])
  const xRight = useTransform(scrollYProgress, [0.1, 0.9], ['35%', '0%'])
  const yTop = useTransform(scrollYProgress, [0.1, 0.9], ['-35%', '0%'])
  const yBottom = useTransform(scrollYProgress, [0.1, 0.9], ['35%', '0%'])

  const translateMap: Record<CellOrigin, { x: MotionValue<string>; y: MotionValue<string> }> = {
    'top-left': { x: xLeft, y: yTop },
    'top-right': { x: xRight, y: yTop },
    'bottom-left': { x: xLeft, y: yBottom },
    'bottom-right': { x: xRight, y: yBottom },
  }

  // Overlay fades away over the first 50% of scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const overlayScale = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    // Outer: 350vh tall — defines the scroll distance for the animation
    <div
      ref={containerRef}
      className={cn('relative', className)}
      style={{ height: '350vh' }}
    >
      {/* Sticky viewport — stays pinned while user scrolls through 350vh */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        {/* Image bento grid — fills the sticky viewport, z-0 */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-2">
          {cells.map((cell) => {
            const { x, y } = translateMap[cell.origin]
            return (
              <motion.div
                key={cell.src}
                className="overflow-hidden rounded-xl"
                style={{
                  gridColumn: cell.colSpan,
                  gridRow: cell.rowSpan ?? 'span 1',
                  scale: cellScale,
                  x,
                  y,
                  transformOrigin: ORIGIN_CSS[cell.origin],
                  willChange: 'transform',
                }}
              >
                <img
                  src={cell.src}
                  alt={cell.alt ?? ''}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                  draggable={false}
                />
              </motion.div>
            )
          })}
        </div>

        {/* Overlay — title + CTA, centered over the grid, fades out as images assemble */}
        {children && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
            style={{
              opacity: overlayOpacity,
              scale: overlayScale,
              willChange: 'transform, opacity',
            }}
          >
            {/* pointer-events restored on inner div so buttons remain clickable */}
            <div className="pointer-events-auto flex flex-col items-center">
              {children}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
