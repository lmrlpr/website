import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterEffectSmooth } from '../../components/ui/typewriter-effect'

const ACCESS_CODE = 'PROM2026'

const words = [
  { text: 'Porta' },
  { text: 'Nova.', className: 'text-[#F5C640]' },
]

// Pre-computed star positions for deterministic rendering
const STARS = [
  { cx: 8, cy: 12, r: 1.2 }, { cx: 23, cy: 5, r: 0.8 }, { cx: 41, cy: 18, r: 1 },
  { cx: 67, cy: 8, r: 1.4 }, { cx: 82, cy: 22, r: 0.7 }, { cx: 95, cy: 6, r: 1.1 },
  { cx: 12, cy: 35, r: 0.9 }, { cx: 35, cy: 42, r: 1.3 }, { cx: 55, cy: 30, r: 0.6 },
  { cx: 74, cy: 38, r: 1 }, { cx: 90, cy: 45, r: 0.8 }, { cx: 18, cy: 58, r: 1.2 },
  { cx: 48, cy: 62, r: 0.7 }, { cx: 63, cy: 55, r: 1.1 }, { cx: 85, cy: 65, r: 0.9 },
  { cx: 6, cy: 75, r: 1 }, { cx: 30, cy: 78, r: 0.6 }, { cx: 52, cy: 82, r: 1.3 },
  { cx: 78, cy: 72, r: 0.8 }, { cx: 92, cy: 80, r: 1 }, { cx: 15, cy: 90, r: 0.7 },
  { cx: 44, cy: 88, r: 1.2 }, { cx: 70, cy: 92, r: 0.9 }, { cx: 88, cy: 95, r: 0.6 },
]

interface AccessCodeGateProps {
  onSuccess: () => void
}

export function AccessCodeGate({ onSuccess }: AccessCodeGateProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return

    if (code.trim().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem('restaurant_access', 'true')
      onSuccess()
    } else {
      setError('Code incorrect. Veuillez réessayer.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setCode('')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #1B3A70 55%, #2558C9 100%)' }}
    >
      {/* Star constellation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={`${s.cx}%`}
            cy={`${s.cy}%`}
            r={s.r}
            fill="white"
            opacity={0.35 + (i % 4) * 0.1}
          />
        ))}
      </svg>

      {/* Moonlight shimmer — horizontal radial glow across lower third */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(75,137,228,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Subtle horizon glow */}
      <div
        className="absolute bottom-1/3 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(245,198,64,0.15), transparent)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-2 text-center w-full max-w-sm"
      >
        {/* Arched window panel */}
        <div
          className="w-full relative"
          style={{ filter: 'drop-shadow(0 32px 80px rgba(0,0,0,0.55)) drop-shadow(0 0 40px rgba(37,88,201,0.3))' }}
        >
          {/* Arch top SVG */}
          <svg className="w-full" viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 28 L0 28 Q160 -12 320 28 Z" fill="white" fillOpacity="0.96"/>
            <path d="M0 28 Q160 -12 320 28" stroke="rgba(195,209,236,0.5)" strokeWidth="1.5" fill="none"/>
          </svg>

          <div
            className="bg-white/95 backdrop-blur-md border-x border-b px-8 pt-2 pb-8 rounded-b-2xl"
            style={{ borderColor: 'rgba(195,209,236,0.4)', boxShadow: 'inset 0 -1px 0 rgba(195,209,236,0.3)' }}
          >
            {/* Ceramic ring decoration */}
            <div className="flex justify-center mb-4">
              <motion.svg
                width="52" height="52" viewBox="0 0 48 48" fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="24" cy="24" r="20" stroke="#2558C9" strokeWidth="1" strokeDasharray="3 2" opacity="0.35"/>
                <circle cx="24" cy="24" r="14" stroke="#2558C9" strokeWidth="1.5" opacity="0.25"/>
                <circle cx="24" cy="24" r="7" stroke="#F5C640" strokeWidth="1.5" opacity="0.7"/>
                <circle cx="24" cy="24" r="2" fill="#F5C640" opacity="0.8"/>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x = 24 + 14 * Math.cos(rad)
                  const y = 24 + 14 * Math.sin(rad)
                  return <circle key={i} cx={x} cy={y} r="1.2" fill="#2558C9" opacity="0.5"/>
                })}
              </motion.svg>
            </div>

            <p className="text-resto-text/40 text-xs tracking-[0.4em] uppercase mb-2 font-resto">
              Prom Restaurant
            </p>

            <TypewriterEffectSmooth
              words={words}
              className="justify-center"
              cursorClassName="bg-[#F5C640]"
            />

            <p className="text-resto-text/50 text-sm leading-relaxed max-w-xs mb-6 font-sans">
              Le restaurant est accessible aux élèves et professeurs du lycée Michel Rodange uniquement.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={shake ? 'shake' : 'normal'}
                  animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full"
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
                    placeholder="CODE D'ACCÈS"
                    className="w-full bg-resto-surface border border-resto-border text-resto-text placeholder:text-resto-text/30 text-center text-base tracking-[0.3em] uppercase px-4 py-4 rounded-xl outline-none transition-all duration-200 cursor-text"
                    style={{ boxShadow: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#2558C9'; e.target.style.boxShadow = '0 0 0 3px rgba(37,88,201,0.12)' }}
                    onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = 'none' }}
                    autoFocus
                  />
                </motion.div>
              </AnimatePresence>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-red-500 text-xs"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full py-3.5 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(37,88,201,0.45)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
              >
                Accéder
              </button>
            </form>
          </div>
        </div>

        <p className="text-white/25 text-xs mt-4 tracking-wider">
          Code distribué par le comité Primaner
        </p>
      </motion.div>
    </div>
  )
}
