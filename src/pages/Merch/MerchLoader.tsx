import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLenis } from 'lenis/react'

const LETTERS = 'MERCH'.split('')

// Phase 1: how long the full cover stays before the curtain rises
const COVER_HOLD_MS = 2000
// Total: when scroll unlocks and loader disappears
const TOTAL_MS = 7000

export function MerchLoader() {
  const [phase, setPhase] = useState<'cover' | 'curtain' | 'done'>('cover')
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis

  useEffect(() => {
    // Lock scroll immediately
    document.body.style.overflow = 'hidden'
    // Give lenis a tick to initialise before stopping it
    const tLock = setTimeout(() => lenisRef.current?.stop(), 60)

    const tCurtain = setTimeout(() => setPhase('curtain'), COVER_HOLD_MS)

    const tDone = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }, TOTAL_MS)

    return () => {
      clearTimeout(tLock)
      clearTimeout(tCurtain)
      clearTimeout(tDone)
      document.body.style.overflow = ''
      lenisRef.current?.start()
    }
  }, [])

  // Duration in seconds for the progress bar fill
  const progressSec = (TOTAL_MS - COVER_HOLD_MS) / 1000

  return (
    <>
      {/* ── Phase 1 : full cream cover ─────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'cover' && (
          <motion.div
            key="cover"
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none"
            style={{ backgroundColor: '#EADFCC' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Brand label */}
            <motion.p
              className="text-[0.55rem] tracking-[0.7em] uppercase mb-10"
              style={{ color: '#8B5E3C' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              LMRL
            </motion.p>

            {/* MERCH — each letter slides up from below */}
            <div className="flex items-end overflow-hidden">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  className="font-merch font-light text-ink block"
                  style={{
                    fontSize: 'clamp(5rem, 18vw, 11rem)',
                    letterSpacing: '0.12em',
                    lineHeight: 1,
                  }}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.25 + i * 0.08,
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>

            {/* Thin decorative line extending outward */}
            <motion.div
              className="mt-7"
              style={{ height: '1px', background: '#3D2410', opacity: 0.25 }}
              initial={{ width: 0 }}
              animate={{ width: 90 }}
              transition={{ delay: 1.0, duration: 0.55, ease: 'easeOut' }}
            />

            {/* Subtitle */}
            <motion.p
              className="mt-5 text-[0.5rem] tracking-[0.55em] uppercase"
              style={{ color: '#8B5E3C', opacity: 0.65 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ delay: 1.4, duration: 0.45 }}
            >
              Collection Primaner
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 2 : runway progress bar while photos load ───────────────── */}
      <AnimatePresence>
        {phase === 'curtain' && (
          <motion.div
            key="runway"
            className="fixed bottom-0 left-0 right-0 z-[200] pointer-events-none"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ duration: 0.35 }}
          >
            {/* Label */}
            <motion.p
              className="text-center text-[0.45rem] tracking-[0.5em] uppercase mb-3"
              style={{ color: '#8B5E3C', opacity: 0.6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Chargement de la collection
            </motion.p>

            {/* Runway track */}
            <div className="relative w-full h-[2px]" style={{ background: 'rgba(139,94,60,0.15)' }}>
              {/* Animated fill */}
              <motion.div
                className="absolute inset-y-0 left-0 origin-left"
                style={{ background: '#8B5E3C' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: progressSec - 0.4, ease: 'linear', delay: 0.2 }}
              />
              {/* Gliding dot at the leading edge */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: '#8B5E3C', left: '0%' }}
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: progressSec - 0.4, ease: 'linear', delay: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
