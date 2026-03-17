import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const EVENT_DATE = new Date('2026-07-03T00:00:00')

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now())

  useEffect(() => {
    const interval = setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const total = Math.max(0, diff)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  return { days, hours, minutes, seconds }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-bold text-white tabular-nums" style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)' }}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase mt-1">{label}</span>
    </div>
  )
}

export function GothamHero() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE)

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

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 flex items-center justify-center gap-6 md:gap-10"
        >
          <CountdownUnit value={days} label="Jours" />
          <span className="text-white/20 font-light text-2xl mb-4">:</span>
          <CountdownUnit value={hours} label="Heures" />
          <span className="text-white/20 font-light text-2xl mb-4">:</span>
          <CountdownUnit value={minutes} label="Min" />
          <span className="text-white/20 font-light text-2xl mb-4">:</span>
          <CountdownUnit value={seconds} label="Sec" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-3 text-white/25 text-xs tracking-[0.3em] uppercase"
        >
          3 Juillet 2026
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
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
