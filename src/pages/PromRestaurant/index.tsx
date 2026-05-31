import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SpiralEntry } from '../../components/ui/SpiralEntry'
import { GridPixelateWipe } from '../../components/ui/GridPixelateWipe'
import { PortanovaOrbit } from './PortanovaOrbit'
import { RESTAURANT_CLOSED } from './config'

// Pre-computed star positions (reused from AccessCodeGate)
const STARS = [
  { cx: 8, cy: 12, r: 1.2 }, { cx: 23, cy: 5, r: 0.8 }, { cx: 41, cy: 18, r: 1 },
  { cx: 67, cy: 8, r: 1.4 }, { cx: 82, cy: 22, r: 0.7 }, { cx: 95, cy: 6, r: 1.1 },
  { cx: 12, cy: 35, r: 0.9 }, { cx: 35, cy: 42, r: 1.3 }, { cx: 55, cy: 30, r: 0.6 },
  { cx: 74, cy: 38, r: 1 }, { cx: 90, cy: 45, r: 0.8 }, { cx: 18, cy: 58, r: 1.2 },
  { cx: 48, cy: 62, r: 0.7 }, { cx: 63, cy: 55, r: 1.1 }, { cx: 85, cy: 65, r: 0.9 },
  { cx: 6, cy: 75, r: 1 }, { cx: 30, cy: 78, r: 0.6 }, { cx: 52, cy: 82, r: 1.3 },
  { cx: 78, cy: 72, r: 0.8 }, { cx: 92, cy: 80, r: 1 }, { cx: 15, cy: 90, r: 0.7 },
  { cx: 44, cy: 88, r: 1.2 }, { cx: 70, cy: 92, r: 0.9 }, { cx: 88, cy: 95, r: 0.6 },
]

function ClosedScreen() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #1B3A70 55%, #2558C9 100%)' }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.cx}%`} cy={`${s.cy}%`} r={s.r} fill="white" opacity={0.35 + (i % 4) * 0.1} />
        ))}
      </svg>
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(75,137,228,0.22) 0%, transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-2 text-center w-full max-w-sm"
        style={{ filter: 'drop-shadow(0 32px 80px rgba(0,0,0,0.55)) drop-shadow(0 0 40px rgba(37,88,201,0.3))' }}
      >
        <svg className="w-full" viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 28 L0 28 Q160 -12 320 28 Z" fill="white" fillOpacity="0.96"/>
          <path d="M0 28 Q160 -12 320 28" stroke="rgba(195,209,236,0.5)" strokeWidth="1.5" fill="none"/>
        </svg>
        <div
          className="bg-white/95 backdrop-blur-md border-x border-b px-8 pt-2 pb-10 rounded-b-2xl w-full"
          style={{ borderColor: 'rgba(195,209,236,0.4)' }}
        >
          <div className="flex justify-center mb-5">
            <motion.svg
              width="52" height="52" viewBox="0 0 48 48" fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <circle cx="24" cy="24" r="20" stroke="#2558C9" strokeWidth="1" strokeDasharray="3 2" opacity="0.35"/>
              <circle cx="24" cy="24" r="14" stroke="#2558C9" strokeWidth="1.5" opacity="0.25"/>
              <circle cx="24" cy="24" r="7" stroke="#F5C640" strokeWidth="1.5" opacity="0.7"/>
              <circle cx="24" cy="24" r="2" fill="#F5C640" opacity="0.8"/>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180
                return <circle key={i} cx={24 + 14 * Math.cos(rad)} cy={24 + 14 * Math.sin(rad)} r="1.2" fill="#2558C9" opacity="0.5"/>
              })}
            </motion.svg>
          </div>
          <p className="text-resto-text/40 text-xs tracking-[0.4em] uppercase mb-1 font-resto">Porta Nova</p>
          <p className="text-resto-text/30 text-[10px] tracking-[0.35em] uppercase mb-6 font-sans">Prom Restaurant · 2026</p>
          <p className="font-resto text-3xl mb-3" style={{ color: '#1B2D52' }}>Keng Plaatzen mei</p>
          <p className="text-sm font-sans leading-relaxed" style={{ color: '#5A7AB0' }}>
            De Restaurant ass voll.
          </p>
        </div>
        <p className="text-white/25 text-xs mt-4 tracking-wider">Porta Nova · 2026</p>
      </motion.div>
    </div>
  )
}

type Phase = 'spiral' | 'wipe' | 'menu'

export default function PromRestaurant() {
  const [phase, setPhase] = useState<Phase>('spiral')
  const [searchParams, setSearchParams] = useSearchParams()
  // Capture URL flags into local state on mount so they persist after we
  // clean the URL — otherwise the success page flashes and disappears.
  const [paid, setPaid] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => {
    const success = searchParams.get('success') === '1'
    const cancelledFlag = searchParams.get('cancelled') === '1'
    if (success) setPaid(true)
    if (cancelledFlag) setCancelled(true)
    if (sessionStorage.getItem('restaurant_access') === 'true') setPhase('menu')
    if (success || cancelledFlag) setSearchParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (RESTAURANT_CLOSED && !paid) {
    return <ClosedScreen />
  }

  if (phase === 'spiral' && !paid) {
    return <SpiralEntry onVerified={() => setPhase('wipe')} />
  }

  // ── success confirmation ────────────────────────────────────────────────────
  if (paid) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #E6F3FF 0%, #F0F8FF 35%, #FFFFFF 65%, #F5FBFF 100%)' }}
      >
        {/* radiating success rings */}
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ width: 240, height: 240, border: '1.5px solid rgba(34,197,94,0.35)' }}
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 2.4, delay: i * 0.6, repeat: Infinity, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center relative"
        >
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', boxShadow: '0 0 48px rgba(34,197,94,0.55)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 14 }}
          >
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <motion.path
                d="M5 13l4 4L19 7"
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.45, duration: 0.5, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>
          <p className="font-sans text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: '#16a34a' }}>
            Bezuelung erfollegräich
          </p>
          <h3 className="font-resto text-3xl mb-2" style={{ color: '#1B2D52' }}>Ta place est réservée</h3>
          <p className="text-sm max-w-sm leading-relaxed font-sans mb-8" style={{ color: '#5A7AB0' }}>
            À bientôt au Porta Nova.
          </p>
          <a
            href="/"
            className="font-sans text-xs tracking-[0.25em] uppercase px-5 py-2.5 rounded-full"
            style={{ color: '#1B2D52', border: '1px solid rgba(27,45,82,0.2)' }}
          >
            Retour à l'accueil
          </a>
        </motion.div>
      </div>
    )
  }

  // ── menu phase (+ optional wipe overlay) ───────────────────────────────────
  return (
    <>
      {phase === 'wipe' && <GridPixelateWipe onComplete={() => setPhase('menu')} />}

      <motion.div
        key="menu"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {cancelled && (
          <div className="max-w-xl mx-auto px-6 pt-6">
            <div
              className="px-5 py-3.5 rounded-xl border text-sm font-sans"
              style={{ background: 'rgba(245,198,64,0.08)', borderColor: 'rgba(245,198,64,0.3)', color: '#92700A' }}
            >
              Le paiement n'a pas abouti — réessaie ci-dessous.
            </div>
          </div>
        )}

        <PortanovaOrbit />
      </motion.div>
    </>
  )
}
