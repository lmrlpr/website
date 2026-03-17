import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Accueil() {
  const navigate = useNavigate()

  return (
    <main className="bg-accueil min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 65% 40%, rgba(255,255,255,0.18) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Eyebrow */}
        <motion.p
          className="text-ink/50 text-xs tracking-[0.3em] uppercase font-medium mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Lycée Michel Rodange Luxembourg
        </motion.p>

        {/* Hero wordmark */}
        <motion.h1
          className="text-ink font-bold uppercase leading-none tracking-tighter mb-10"
          style={{ fontSize: 'clamp(4rem, 14vw, 13rem)', letterSpacing: '-0.02em' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
        >
          PRIMANER
        </motion.h1>

        {/* Divider line */}
        <motion.div
          className="w-12 h-px bg-ink/25 mb-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        />

        {/* Subtitle */}
        <motion.p
          className="text-ink/70 text-base md:text-lg font-normal max-w-md leading-relaxed mb-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          Offiziell Website vun den LMRL Primaner.
          <br />
          Hei fannt der all d&apos;Informatiounen zu Kommenden Eventer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/prom/restaurant')}
            className="px-8 py-3.5 bg-ink text-white text-sm font-semibold tracking-wide rounded-full hover:bg-ink/80 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Prom Night →
          </button>
          <button
            onClick={() => navigate('/merch')}
            className="px-8 py-3.5 bg-white/30 text-ink text-sm font-semibold tracking-wide rounded-full border border-ink/20 hover:bg-white/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
          >
            LMRL Merch →
          </button>
        </motion.div>
      </motion.div>

      {/* Bottom micro-label */}
      <motion.p
        className="absolute bottom-8 text-ink/30 text-[10px] tracking-[0.25em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Primaner vum Michel Rodange ASBL
      </motion.p>
    </main>
  )
}
