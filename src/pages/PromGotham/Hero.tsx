import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ParticleTextEffect } from '../../components/ui/particle-text-effect'

const EVENT_DATE = new Date('2026-07-03T00:00:00')

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768

// Pre-computed rain streaks — no Math.random() on render
const RAIN_STREAKS = Array.from({ length: 24 }, (_, i) => ({
  left: `${2 + i * 4.1}%`,
  height: `${28 + (i * 11) % 38}%`,
  duration: 2.8 + (i * 0.35) % 3.5,
  delay: (i * 0.42) % 5,
  opacity: 0.12 + (i % 4) * 0.06,
}))

// Fewer streaks on mobile for performance
const ACTIVE_STREAKS = IS_MOBILE ? RAIN_STREAKS.slice(0, 8) : RAIN_STREAKS

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => target.getTime() - Date.now())
  useEffect(() => {
    const id = setInterval(() => setDiff(target.getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [target])
  const total = Math.max(0, diff)
  return {
    days:    Math.floor(total / 86400000),
    hours:   Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[2.5rem]">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="font-bold text-white tabular-nums leading-none"
        style={{ fontSize: 'clamp(1.6rem, 4.5vw, 2.8rem)' }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="text-gotham-blue/40 text-[8px] tracking-[0.4em] uppercase mt-1.5">{label}</span>
    </div>
  )
}


export function GothamHero() {
  const { days, hours, minutes, seconds } = useCountdown(EVENT_DATE)

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'transparent' }}
    >

      {/* ── Atmospheric orbs — static on mobile, animated on desktop ── */}
      <div className="absolute inset-0 pointer-events-none">
        {IS_MOBILE ? (
          <>
            <div
              className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 65%)', filter: 'blur(40px)', opacity: 0.2 }}
            />
            <div
              className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 65%)', filter: 'blur(50px)', opacity: 0.18 }}
            />
          </>
        ) : (
          <>
            <motion.div
              animate={{ opacity: [0.12, 0.28, 0.12], scale: [1, 1.12, 1] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.18) 0%, transparent 65%)', filter: 'blur(70px)' }}
            />
            <motion.div
              animate={{ opacity: [0.1, 0.25, 0.1], scale: [1, 1.08, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
              className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)', filter: 'blur(90px)' }}
            />
            <motion.div
              animate={{ opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 60%)', filter: 'blur(50px)' }}
            />
          </>
        )}
      </div>

      {/* ── Rain streaks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ACTIVE_STREAKS.map((s, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-px"
            style={{
              left: s.left,
              height: s.height,
              opacity: s.opacity,
              background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.6) 40%, rgba(0,212,255,0.8) 60%, transparent)',
            }}
            animate={{ y: ['-100%', '120vh'] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: s.delay,
            }}
          />
        ))}
      </div>


      {/* ── Main content ── */}
      <div className="relative z-10 text-center px-6 w-full max-w-6xl mx-auto">

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-gotham-blue/60" />
          <p className="text-gotham-blue/70 text-xs tracking-[0.6em] uppercase font-medium">
            Prom Night &nbsp;·&nbsp; 00h – 06h
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-gotham-blue/60" />
        </motion.div>

        {/* ── GOTHAM — particle text, cyan+purple on dark bg ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="w-full mb-2"
        >
          <ParticleTextEffect
            words={['GOTHAM']}
            colorThemes={[[
              { r: 0,   g: 212, b: 255 },
              { r: 139, g: 92,  b: 246 },
              { r: 0,   g: 180, b: 255 },
            ]]}
            bgColor="rgba(15,11,32,0.12)"
          />
        </motion.div>

        {/* Horizontal neon accent line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 1, ease: 'easeOut' }}
          className="mx-auto mb-8 h-px w-64 bg-gradient-to-r from-transparent via-gotham-blue/70 to-transparent"
          style={{ boxShadow: '0 0 12px rgba(0,212,255,0.4)' }}
        />

        {/* ── Countdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center justify-center gap-4 md:gap-8 mb-3"
        >
          <CountdownUnit value={days}    label="Jours"  />
          <span className="text-gotham-blue/20 font-light mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>:</span>
          <CountdownUnit value={hours}   label="Heures" />
          <span className="text-gotham-blue/20 font-light mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>:</span>
          <CountdownUnit value={minutes} label="Min"    />
          <span className="text-gotham-blue/20 font-light mb-4" style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}>:</span>
          <CountdownUnit value={seconds} label="Sec"    />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/20 text-xs tracking-[0.5em] uppercase mb-10"
        >
          3 Juillet 2026
        </motion.p>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Primary — cyan neon CTA */}
          <a
            href="#tickets"
            className="group btn-neon relative px-10 py-4 text-sm font-semibold tracking-widest uppercase rounded-full cursor-pointer transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(139,92,246,0.08) 100%)',
              border: '1px solid rgba(0,212,255,0.5)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(0,212,255,0.2)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.9)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.5)'
            }}
          >
            <span className="relative text-gotham-blue group-hover:text-white transition-colors duration-200">
              Prendre un billet
            </span>
          </a>

          {/* Secondary — ghost */}
          <a
            href="#info"
            className="group relative px-10 py-4 text-sm font-medium tracking-widest uppercase rounded-full cursor-pointer transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            <span className="text-white/45 group-hover:text-white/80 transition-colors duration-200">
              Informations pratiques
            </span>
          </a>
        </motion.div>

      </div>

    </section>
  )
}
