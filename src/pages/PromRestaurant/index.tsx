import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { AccessCodeGate } from './AccessCodeGate'
import { MenuForm } from './MenuForm'
import { Footer } from '../../components/layout/Footer'

// Pre-computed particle positions for deterministic rendering
const PARTICLES = [
  { left: 12, size: 3, duration: 5.2, delay: 0 },
  { left: 28, size: 2, duration: 4.8, delay: 0.7 },
  { left: 45, size: 4, duration: 6.1, delay: 1.4 },
  { left: 58, size: 2.5, duration: 5.5, delay: 2.1 },
  { left: 72, size: 3, duration: 4.3, delay: 0.3 },
  { left: 83, size: 2, duration: 6.4, delay: 1.8 },
  { left: 91, size: 3.5, duration: 5.0, delay: 0.9 },
  { left: 37, size: 2, duration: 4.6, delay: 2.5 },
]

const TITLE_LINE1 = 'PORTA'
const TITLE_LINE2 = 'NOVA'

// Wave path pair for animation morphing
const WAVE_A = 'M0 40 C240 0 480 80 720 40 C960 0 1200 80 1440 40 L1440 80 L0 80 Z'
const WAVE_B = 'M0 60 C240 20 480 80 720 30 C960 -10 1200 60 1440 50 L1440 80 L0 80 Z'
const WAVE_C = 'M0 20 C240 60 480 10 720 50 C960 80 1200 20 1440 60 L1440 80 L0 80 Z'

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
    <div className="min-h-screen text-resto-text" style={{ background: '#FFFFFF' }}>

      {/* ── Hero ─────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #1B2D52 0%, #2558C9 28%, #4B89E4 54%, #7FB3E8 74%, #C8DFF5 88%, #FFFFFF 100%)',
          paddingBottom: '120px',
        }}
      >
        {/* Floating light particles */}
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: `${p.left}%`,
              bottom: '120px',
              width: p.size,
              height: p.size,
            }}
            animate={{ y: [0, -120, -200], opacity: [0, 0.65, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeOut' }}
          />
        ))}

        {/* Hero content */}
        <div className="relative pt-32 pb-8 px-6 md:px-12 max-w-5xl mx-auto">

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs tracking-[0.5em] uppercase text-white/50 mb-8 font-sans"
          >
            Prom Night · 20h – 00h
          </motion.p>

          {/* Main title — letter by letter */}
          <div className="overflow-hidden mb-2">
            <div className="font-resto text-[clamp(3.5rem,12vw,8rem)] text-white leading-none" style={{ letterSpacing: '0.04em' }}>
              {TITLE_LINE1.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 60, skewX: -8 }}
                  animate={{ opacity: 1, y: 0, skewX: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <div className="font-resto text-[clamp(3.5rem,12vw,8rem)] leading-none" style={{ letterSpacing: '0.04em', color: '#F5C640' }}>
              {TITLE_LINE2.split('').map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 60, skewX: -8 }}
                  animate={{ opacity: 1, y: 0, skewX: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Ornamental divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0.3 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 my-7"
            style={{ transformOrigin: 'left' }}
          >
            <div className="h-px w-20" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }} />
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z" fill="#F5C640" opacity="0.9"/>
            </svg>
            <div className="h-px w-32" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)' }} />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-white/65 text-base md:text-lg max-w-md leading-relaxed mb-8 font-sans italic"
          >
            Komplett Iessen — Entrée, Haaptplat, Dessert a Gedrénks abegraff fir LMRL-Studenten a Léierpersonal.
          </motion.p>

          {/* Location chip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <a
              href="https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Limpertsberg+Luxembourg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm transition-all duration-200 cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)' }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              14 Av. de la Faïencerie, 1510 Limpertsberg
            </a>
          </motion.div>
        </div>

        {/* ── 3-Layer Animated Waves ─── */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: '100px' }}>
          {/* Layer 3 — slowest, most opaque */}
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="absolute bottom-0 w-full"
            style={{ height: '100px' }}
            preserveAspectRatio="none"
          >
            <motion.path
              d={WAVE_A}
              fill="white"
              fillOpacity={0.35}
              animate={{ d: [WAVE_A, WAVE_C, WAVE_A] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          {/* Layer 2 — medium */}
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="absolute bottom-0 w-full"
            style={{ height: '100px' }}
            preserveAspectRatio="none"
          >
            <motion.path
              d={WAVE_B}
              fill="white"
              fillOpacity={0.6}
              animate={{ d: [WAVE_B, WAVE_A, WAVE_B] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
          {/* Layer 1 — fastest, fullest */}
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="absolute bottom-0 w-full"
            style={{ height: '100px' }}
            preserveAspectRatio="none"
          >
            <path d="M0 50 C360 20 720 80 1080 50 C1260 35 1380 55 1440 50 L1440 80 L0 80 Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* ── Menu / Content Area ───────────────────────────── */}
      <div className="bg-white" style={{ minHeight: '50vh' }}>

        {/* Success state */}
        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-20"
          >
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F5C640 0%, #e8a800 100%)', boxShadow: '0 0 60px rgba(245,198,64,0.45)' }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <svg className="absolute inset-0 w-24 h-24 animate-shimmer" viewBox="0 0 96 96" fill="none">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x1 = 48 + 52 * Math.cos(rad)
                  const y1 = 48 + 52 * Math.sin(rad)
                  const x2 = 48 + 60 * Math.cos(rad)
                  const y2 = 48 + 60 * Math.sin(rad)
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5C640" strokeWidth="2" opacity="0.45"/>
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
      <div className="border-t border-resto-border bg-white">
        <Footer />
      </div>
    </div>
  )
}
