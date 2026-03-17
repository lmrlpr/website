import { motion } from 'framer-motion'

export function GothamHero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gotham-bg">
      {/* Atmospheric glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/5 w-[600px] h-[600px] rounded-full animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '1.5s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 60%)', filter: 'blur(40px)' }}
        />
      </div>

      {/* Scanline texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)',
          backgroundSize: '100% 3px',
        }}
      />

      <div className="relative z-10 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-gotham-blue/60 text-xs tracking-[0.5em] uppercase mb-6"
        >
          Prom Night · 00h – 06h
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-bold leading-none tracking-tighter text-gradient-gotham"
          style={{ fontSize: 'clamp(5rem, 16vw, 13rem)' }}
        >
          GOTHAM
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-white/40 text-sm md:text-base max-w-md mx-auto leading-relaxed"
        >
          <a
            href="https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Limpertsberg+Luxembourg"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-gotham-blue transition-colors"
          >
            14 Av. de la Faïencerie · Limpertsberg
          </a>
          <br />
          Capacité : 300 personnes · Ouvert à tous
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#tickets"
            className="px-8 py-3.5 border border-gotham-blue/50 text-gotham-blue text-sm font-medium rounded-full hover:shadow-neon hover:border-gotham-blue transition-all duration-300"
          >
            Prendre un billet
          </a>
          <a
            href="#info"
            className="px-8 py-3.5 border border-white/10 text-white/60 text-sm font-medium rounded-full hover:border-white/20 hover:text-white/80 transition-all"
          >
            Informations pratiques
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gotham-bg to-transparent" />
    </section>
  )
}
