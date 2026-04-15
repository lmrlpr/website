import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TextEffect } from '../../components/ui/text-effect'
import { GradientBackground } from '../../components/ui/gradient-background'

export function Hero() {
  return (
    <GradientBackground>
      {/* Content */}
      <div className="flex flex-col items-center text-center px-5">
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.75, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <h1
            className="font-bold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(4.5rem, 14vw, 11rem)',
              color: '#1A0800',
            }}
          >
            PRIMANER
          </h1>
        </motion.div>

        <TextEffect
          per='word'
          preset='blur'
          delay={0.45}
          as='p'
          className="mt-8 max-w-lg text-base md:text-lg leading-relaxed"
          style={{ color: 'rgba(60, 20, 0, 0.55)' }}
        >
          Offiziell Website vun den LMRL Primaner. Hei fannt der all d'Informatiounen zu Kommenden Eventer.
        </TextEffect>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-6 text-sm tracking-[0.25em] uppercase font-medium"
          style={{ color: 'rgba(60, 20, 0, 0.35)' }}
        >
          2025 / 2026
        </motion.p>

        {/* Navigation cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.85, ease: 'easeOut' }}
          className="mt-12 flex gap-4 flex-wrap justify-center"
        >
          <Link
            to="/prom/gotham"
            className="group flex flex-col items-start gap-1 px-7 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'rgba(30, 8, 0, 0.18)',
              border: '1px solid rgba(30, 8, 0, 0.2)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              minWidth: '160px',
            }}
          >
            <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Événement
            </span>
            <span className="text-lg font-bold leading-tight" style={{ color: '#1A0800' }}>
              Prom Gotham
            </span>
            <span className="text-xs mt-1 group-hover:translate-x-1 transition-transform duration-200" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Voir →
            </span>
          </Link>

          <Link
            to="/prom/restaurant"
            className="group flex flex-col items-start gap-1 px-7 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'rgba(30, 8, 0, 0.18)',
              border: '1px solid rgba(30, 8, 0, 0.2)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              minWidth: '160px',
            }}
          >
            <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Événement
            </span>
            <span className="text-lg font-bold leading-tight" style={{ color: '#1A0800' }}>
              Prom Restaurant
            </span>
            <span className="text-xs mt-1 group-hover:translate-x-1 transition-transform duration-200" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Voir →
            </span>
          </Link>

          <Link
            to="/merch"
            className="group flex flex-col items-start gap-1 px-7 py-5 rounded-2xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: 'rgba(30, 8, 0, 0.18)',
              border: '1px solid rgba(30, 8, 0, 0.2)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              minWidth: '160px',
            }}
          >
            <span className="text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Boutique
            </span>
            <span className="text-lg font-bold leading-tight" style={{ color: '#1A0800' }}>
              Merch
            </span>
            <span className="text-xs mt-1 group-hover:translate-x-1 transition-transform duration-200" style={{ color: 'rgba(30, 8, 0, 0.45)' }}>
              Voir →
            </span>
          </Link>
        </motion.div>
      </div>
    </GradientBackground>
  )
}
