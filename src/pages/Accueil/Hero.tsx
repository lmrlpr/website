import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-accueil"
    >
      {/* Subtle geometric overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255,100,0,0.3) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="text-ink/60 text-xs md:text-sm tracking-[0.4em] uppercase mb-6 font-medium">
            Lycée Michel Rodange Luxembourg
          </p>
          <h1
            className="font-bold text-ink leading-none tracking-tighter"
            style={{ fontSize: 'clamp(4.5rem, 14vw, 11rem)' }}
          >
            PRIMANER
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          className="mt-8 max-w-lg text-ink/70 text-base md:text-lg leading-relaxed"
        >
          Offiziell Website vun den LMRL Primaner.
          <br />
          Hei fannt der all d'Informatiounen zu Kommenden Eventer.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 text-ink/50 text-sm tracking-[0.25em] uppercase font-medium"
        >
          2025 / 2026
        </motion.p>
      </div>

    </section>
  )
}
