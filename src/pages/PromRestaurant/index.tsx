import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SpiralEntry } from '../../components/ui/SpiralEntry'
import { GridPixelateWipe } from '../../components/ui/GridPixelateWipe'
import { PortanovaOrbit } from './PortanovaOrbit'
import { Footer } from '../../components/layout/Footer'

type Phase = 'spiral' | 'wipe' | 'menu'

export default function PromRestaurant() {
  const [phase, setPhase] = useState<Phase>('spiral')
  const [searchParams, setSearchParams] = useSearchParams()

  const success   = searchParams.get('success')   === '1'
  const cancelled = searchParams.get('cancelled') === '1'

  useEffect(() => {
    if (sessionStorage.getItem('restaurant_access') === 'true') setPhase('menu')
  }, [])

  useEffect(() => {
    if (success || cancelled) setSearchParams({}, { replace: true })
  }, [success, cancelled, setSearchParams])

  if (phase === 'spiral') {
    return <SpiralEntry onVerified={() => setPhase('wipe')} />
  }

  // ── success confirmation ────────────────────────────────────────────────────
  if (success) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #E6F3FF 0%, #F0F8FF 35%, #FFFFFF 65%, #F5FBFF 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
            style={{ background: 'linear-gradient(135deg, #F5C640 0%, #e8a800 100%)', boxShadow: '0 0 60px rgba(245,198,64,0.45)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="font-resto text-3xl mb-3" style={{ color: '#1B2D52' }}>Réservation confirmée</h3>
          <p className="text-sm max-w-sm leading-relaxed font-sans" style={{ color: '#5A7AB0' }}>
            Votre paiement a été accepté. Vous recevrez une confirmation par email.
          </p>
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
              Paiement annulé. Vous pouvez réessayer ci-dessous.
            </div>
          </div>
        )}

        <PortanovaOrbit />

        <div className="border-t" style={{ borderColor: '#E8EEFA', background: 'white' }}>
          <Footer />
        </div>
      </motion.div>
    </>
  )
}
