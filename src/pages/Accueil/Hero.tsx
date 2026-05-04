import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TextEffect } from '../../components/ui/text-effect'
import { GradientBackground } from '../../components/ui/gradient-background'

export function Hero() {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      document.body.style.overflow = ''
    }, 1600)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <GradientBackground>
      {/* Content */}
      <div className="flex flex-col items-center text-center px-5 min-h-[100dvh] justify-center pb-16">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, duration: 0.7, ease: 'easeOut' }}
          className="mt-5 mb-1 px-8 py-3 rounded-2xl text-center"
          style={{ background: 'rgba(60,20,0,0.07)', border: '1px solid rgba(60,20,0,0.12)' }}
        >
          <p
            className="font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.3rem, 4.5vw, 2.8rem)', color: '#1A0800' }}
          >
            Vill Gléck fir d'Examen!
          </p>
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

        {/* Navigation links — subtle, secondary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: 'easeOut' }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          {[
            { to: '/prom/gotham', label: 'Prom Gotham' },
            { to: '/prom/restaurant', label: 'Prom Restaurant' },
            { to: '/merch', label: 'Merch' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-2 text-sm transition-all duration-200 active:opacity-60"
              style={{ color: 'rgba(30, 8, 0, 0.4)' }}
            >
              <span className="group-hover:underline underline-offset-2">{label}</span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </Link>
          ))}
        </motion.div>
      </div>
    </GradientBackground>
  )
}
