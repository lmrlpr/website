import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterEffectSmooth } from '../../components/ui/typewriter-effect'

const ACCESS_CODE = 'PROM2026'

const words = [
  { text: 'Porta' },
  { text: 'Nova.', className: 'text-resto-accent' },
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
      style={{ background: 'linear-gradient(160deg, #EBF0FA 0%, #F5F3EF 55%, #E8EFF8 100%)' }}
    >
      {/* Decorative floating orbs */}
      <div className="absolute top-16 left-12 w-48 h-48 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2558C9 0%, transparent 70%)' }} />
      <div className="absolute bottom-24 right-10 w-32 h-32 rounded-full opacity-15 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4B89E4 0%, transparent 70%)', animationDelay: '3s' }} />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full opacity-10 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F5C640 0%, transparent 70%)', animationDelay: '1.5s' }} />

      {/* Decorative corner ornaments */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-resto-accent/10" viewBox="0 0 64 64" fill="none">
        <path d="M8 8 L8 32 Q8 8 32 8 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="currentColor"/>
        <circle cx="32" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="8" cy="32" r="1.5" fill="currentColor" opacity="0.5"/>
      </svg>
      <svg className="absolute bottom-8 right-8 w-16 h-16 text-resto-accent/10 rotate-180" viewBox="0 0 64 64" fill="none">
        <path d="M8 8 L8 32 Q8 8 32 8 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="currentColor"/>
        <circle cx="32" cy="8" r="1.5" fill="currentColor" opacity="0.5"/>
        <circle cx="8" cy="32" r="1.5" fill="currentColor" opacity="0.5"/>
      </svg>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center gap-2 text-center w-full max-w-sm"
      >
        {/* Arched window panel */}
        <div className="w-full relative" style={{ filter: 'drop-shadow(0 20px 48px rgba(37, 88, 201, 0.12))' }}>
          {/* Arch top SVG clip */}
          <svg className="w-full" viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 28 L0 28 Q160 -12 320 28 Z" fill="white" fillOpacity="0.92"/>
            <path d="M0 28 Q160 -12 320 28" stroke="#C3D1EC" strokeWidth="1.5" fill="none"/>
          </svg>

          <div
            className="bg-white/90 backdrop-blur-md border-x border-b border-resto-border px-8 pt-2 pb-8 rounded-b-2xl"
            style={{ boxShadow: 'inset 0 -1px 0 #C3D1EC' }}
          >
            {/* Ceramic ring decoration */}
            <div className="flex justify-center mb-4">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#2558C9" strokeWidth="1" strokeDasharray="3 2" opacity="0.4"/>
                <circle cx="24" cy="24" r="14" stroke="#2558C9" strokeWidth="1.5" opacity="0.3"/>
                <circle cx="24" cy="24" r="7" stroke="#F5C640" strokeWidth="1.5" opacity="0.6"/>
                <circle cx="24" cy="24" r="2" fill="#2558C9" opacity="0.5"/>
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180
                  const x = 24 + 14 * Math.cos(rad)
                  const y = 24 + 14 * Math.sin(rad)
                  return <circle key={i} cx={x} cy={y} r="1.2" fill="#2558C9" opacity="0.5"/>
                })}
              </svg>
            </div>

            <p className="text-resto-text/40 text-xs tracking-[0.4em] uppercase mb-2 font-resto">
              Prom Restaurant
            </p>

            <TypewriterEffectSmooth
              words={words}
              className="justify-center"
              cursorClassName="bg-resto-accent"
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
                style={{ background: 'linear-gradient(135deg, #2558C9 0%, #4B89E4 100%)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(37,88,201,0.4)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
              >
                Accéder
              </button>
            </form>
          </div>
        </div>

        <p className="text-resto-text/30 text-xs mt-4 tracking-wider">
          Code distribué par le comité Primaner
        </p>
      </motion.div>
    </div>
  )
}
