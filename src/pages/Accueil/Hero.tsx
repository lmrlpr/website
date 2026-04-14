import { motion } from 'framer-motion'
import { LampContainer } from '../../components/ui/lamp'

export function Hero() {
  return (
    <LampContainer>
      {/* PRIMANER slides in from above into the lamp glow */}
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        className="flex flex-col items-center text-center"
      >
        <p className="text-white/50 text-xs md:text-sm tracking-[0.4em] uppercase mb-6 font-medium">
          Lycée Michel Rodange Luxembourg
        </p>
        <h1
          className="font-bold leading-none tracking-tighter"
          style={{
            fontSize: 'clamp(4.5rem, 14vw, 11rem)',
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF9A3C 50%, #FFB347 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          PRIMANER
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
        className="mt-8 max-w-lg text-white/60 text-base md:text-lg leading-relaxed text-center"
      >
        Offiziell Website vun den LMRL Primaner.
        <br />
        Hei fannt der all d'Informatiounen zu Kommenden Eventer.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}
        className="mt-10 text-white/40 text-sm tracking-[0.25em] uppercase font-medium"
      >
        2025 / 2026
      </motion.p>
    </LampContainer>
  )
}
