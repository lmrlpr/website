import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SpiralEntry } from '../../components/ui/SpiralEntry'
import { GridPixelateWipe } from '../../components/ui/GridPixelateWipe'
import { PortanovaOrbit } from './PortanovaOrbit'

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
