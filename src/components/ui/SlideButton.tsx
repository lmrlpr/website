import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from 'framer-motion'
import { Check, Loader2, SendHorizontal, X } from 'lucide-react'
import { cn } from '../../utils/cn'

const THRESHOLD = 0.85
const HANDLE_W = 40
const HANDLE_LEFT = -16

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 32, mass: 0.8 }

type Status = 'idle' | 'loading' | 'success' | 'error'

function StatusIcon({ status }: { status: Status }) {
  if (status === 'loading') return <Loader2 className="animate-spin" size={20} />
  if (status === 'success') return <Check size={20} />
  if (status === 'error') return <X size={20} />
  return null
}

interface SlideButtonProps {
  label?: string
  onSlide: () => Promise<void>
  disabled?: boolean
  className?: string
}

export function SlideButton({ label = 'Envoyer', onSlide, disabled, className }: SlideButtonProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [dragRight, setDragRight] = useState(220)
  const containerRef = useRef<HTMLDivElement>(null)

  const dragX = useMotionValue(0)
  const springX = useSpring(dragX, SPRING)
  const progress = useTransform(springX, [0, dragRight], [0, 1])
  const fillW = useTransform(springX, x => x + HANDLE_W - HANDLE_LEFT)

  // Measure track width and set the drag range so the handle sweeps the full track
  useEffect(() => {
    function measure() {
      const el = containerRef.current
      if (!el) return
      const w = el.offsetWidth
      // Handle starts at HANDLE_LEFT (-16), is HANDLE_W (40) wide.
      // We want handle's right edge to land ~6px from the track right edge at max drag:
      //   HANDLE_LEFT + dragRight + HANDLE_W = w - 6  →  dragRight = w - 30
      setDragRight(Math.max(120, w - 30))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const handleDragStart = useCallback(() => {
    if (completed || disabled) return
    setIsDragging(true)
  }, [completed, disabled])

  const handleDrag = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (completed || disabled) return
      dragX.set(Math.max(0, Math.min(info.offset.x, dragRight)))
    },
    [completed, disabled, dragX, dragRight],
  )

  const handleDragEnd = useCallback(() => {
    if (completed || disabled) return
    setIsDragging(false)
    if (progress.get() >= THRESHOLD) {
      setCompleted(true)
      setStatus('loading')
      onSlide()
        .then(() => setStatus('success'))
        .catch(() => {
          setStatus('error')
          setTimeout(() => {
            setCompleted(false)
            setStatus('idle')
            dragX.set(0)
          }, 2000)
        })
    } else {
      dragX.set(0)
    }
  }, [completed, disabled, progress, onSlide, dragX])

  return (
    <motion.div
      ref={containerRef}
      animate={completed ? { width: '9rem' } : { width: '100%' }}
      transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 0.9 }}
      className={cn(
        'relative flex h-12 items-center justify-center rounded-full overflow-hidden mx-auto',
        className,
      )}
      style={{
        background: completed ? 'linear-gradient(135deg, #1B2D52, #2558C9)' : 'rgba(235,240,250,1)',
        boxShadow: completed
          ? '0 6px 24px rgba(37,88,201,0.35)'
          : 'inset 0 1px 3px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(37,88,201,0.06)',
        maxWidth: completed ? undefined : '20rem',
      }}
    >
      {/* Drag fill — light translucent blue so the dark handle stays visible */}
      {!completed && (
        <motion.div
          className="absolute inset-y-0 left-0 z-0 rounded-full"
          style={{
            width: fillW,
            background:
              'linear-gradient(90deg, rgba(37,88,201,0.32) 0%, rgba(75,137,228,0.55) 100%)',
          }}
        />
      )}

      {/* Label text — stays readable on both the gray track and the light blue fill */}
      {!completed && (
        <span
          className="relative z-10 text-sm font-semibold font-sans pointer-events-none select-none px-4"
          style={{ color: '#1B2D52', opacity: 0.78, letterSpacing: '0.04em' }}
        >
          {label}
        </span>
      )}

      {/* Drag handle */}
      <AnimatePresence>
        {!completed && (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: dragRight }}
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            style={{ x: springX }}
            className="absolute -left-4 z-20 flex cursor-grab items-center justify-start active:cursor-grabbing touch-none"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{
                background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
                boxShadow: isDragging
                  ? '0 6px 22px rgba(37,88,201,0.6), 0 0 0 5px rgba(37,88,201,0.18)'
                  : '0 4px 14px rgba(37,88,201,0.45), 0 0 0 0 rgba(37,88,201,0)',
                transform: isDragging ? 'scale(1.08)' : 'scale(1)',
                transition: 'box-shadow 0.18s ease, transform 0.18s ease',
              }}
            >
              <SendHorizontal size={17} strokeWidth={2.2} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completed state */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center text-white"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.22 }}
              >
                <StatusIcon status={status} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
