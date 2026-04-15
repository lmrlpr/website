import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { AccessCodeGate } from './AccessCodeGate'
import { MenuForm } from './MenuForm'
import { Footer } from '../../components/layout/Footer'

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function PromRestaurant() {
  const [hasAccess, setHasAccess] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const success = searchParams.get('success') === '1'
  const cancelled = searchParams.get('cancelled') === '1'

  useEffect(() => {
    if (sessionStorage.getItem('restaurant_access') === 'true') {
      setHasAccess(true)
    }
  }, [])

  useEffect(() => {
    if (success || cancelled) {
      setSearchParams({}, { replace: true })
    }
  }, [success, cancelled, setSearchParams])

  if (!hasAccess) {
    return <AccessCodeGate onSuccess={() => setHasAccess(true)} />
  }

  return (
    <div className="min-h-screen text-resto-text" style={{ background: 'linear-gradient(180deg, #F0EDF7 0%, #F5F3EF 18%, #F5F3EF 100%)' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="relative pt-28 pb-20 px-6 md:px-10 max-w-4xl mx-auto overflow-hidden">

        {/* Floating decorative orb */}
        <div
          className="absolute -top-8 right-0 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(37,88,201,0.08) 0%, transparent 70%)',
            animation: 'float 8s ease-in-out infinite',
          }}
        />

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xs tracking-[0.5em] uppercase text-resto-accent/60 mb-6 font-sans"
        >
          Prom Night · 20h – 00h
        </motion.p>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-resto text-5xl md:text-7xl lg:text-8xl text-resto-text leading-none mb-4" style={{ letterSpacing: '0.02em' }}>
            Porta Nova
          </h1>
        </motion.div>

        {/* Ornamental divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 my-6"
        >
          <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(90deg, transparent, #2558C9)' }} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z" fill="#2558C9" opacity="0.7"/>
          </svg>
          <div className="h-px flex-1 max-w-[200px]" style={{ background: 'linear-gradient(90deg, #2558C9, transparent)' }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-resto-text/55 text-base md:text-lg max-w-md leading-relaxed mb-8 font-sans italic"
        >
          Dîner complet — entrée, plat, dessert et boissons inclus pour les Primaner et professeurs du LMRL.
        </motion.p>

        {/* Location chip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Limpertsberg+Luxembourg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-resto-border bg-white/60 backdrop-blur-sm text-sm text-resto-text/70 hover:text-resto-accent hover:border-resto-accent/40 hover:bg-white/80 transition-all duration-200 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 shrink-0 text-resto-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            14 Av. de la Faïencerie, 1510 Limpertsberg
          </a>
        </motion.div>
      </div>

      {/* ── Wave Divider ─────────────────────────────────── */}
      <div className="relative" style={{ marginTop: '-1px' }}>
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block"
          preserveAspectRatio="none"
          style={{ height: '64px' }}
        >
          <path
            d="M0 0 C240 64 480 0 720 32 C960 64 1200 0 1440 32 L1440 64 L0 64 Z"
            fill="#EBF0FA"
          />
        </svg>
      </div>

      {/* ── Menu / Content Area ───────────────────────────── */}
      <div className="bg-resto-surface" style={{ minHeight: '50vh' }}>

        {/* Success state */}
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-20"
          >
            {/* Sun / celebration icon */}
            <div className="relative mb-8">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F5C640 0%, #e8a800 100%)', boxShadow: '0 0 40px rgba(245,198,64,0.4)' }}
              >
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Starburst rays */}
              <svg className="absolute inset-0 w-20 h-20 animate-shimmer" viewBox="0 0 80 80" fill="none">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = 40 + 44 * Math.cos(rad)
                  const y1 = 40 + 44 * Math.sin(rad)
                  const x2 = 40 + 50 * Math.cos(rad)
                  const y2 = 40 + 50 * Math.sin(rad)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5C640" strokeWidth="2" opacity="0.5"/>
                })}
              </svg>
            </div>
            <h3 className="font-resto text-3xl text-resto-text mb-3">Réservation confirmée</h3>
            <p className="text-resto-text/55 text-sm max-w-sm leading-relaxed font-sans">
              Votre paiement a été accepté. Vous recevrez une confirmation par email.
            </p>
          </motion.div>
        ) : (
          <>
            {cancelled && (
              <FadeInSection>
                <div className="max-w-xl mx-auto px-6 pt-8">
                  <div className="px-5 py-3.5 rounded-xl border text-sm font-sans"
                    style={{ background: 'rgba(245,198,64,0.08)', borderColor: 'rgba(245,198,64,0.3)', color: '#92700A' }}>
                    Paiement annulé. Vous pouvez réessayer ci-dessous.
                  </div>
                </div>
              </FadeInSection>
            )}
            <MenuForm />
          </>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="border-t border-resto-border bg-resto-surface">
        <Footer />
      </div>
    </div>
  )
}
