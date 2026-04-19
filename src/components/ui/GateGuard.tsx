import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GATE_KEY = 'prom_gate_unlocked'
const ACCESS_CODE = 'Maxi'

interface GateGuardProps {
  children: ReactNode
}

export function GateGuard({ children }: GateGuardProps) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(GATE_KEY) === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    if (input === ACCESS_CODE) {
      sessionStorage.setItem(GATE_KEY, '1')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0F] px-6">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0.04) 40%, transparent 70%)',
        }}
      />
      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        {/* Hairline gradient border wrapper */}
        <div
          className="rounded-2xl p-px"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06))',
          }}
        >
          <div className="rounded-2xl bg-[#0D0D14]/80 backdrop-blur-xl px-8 py-10 flex flex-col items-center text-center">
            {/* Lock icon */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]"
            >
              <div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)',
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-300"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 118 0v4" />
              </svg>
            </motion.div>

            <p className="text-zinc-500 text-[0.65rem] tracking-[0.4em] uppercase mb-3">
              Primaner · 2026
            </p>

            <h1 className="text-white text-3xl font-semibold tracking-tight mb-2">
              Accès réservé
            </h1>

            <p
              className="text-zinc-400 text-[0.95rem] italic leading-relaxed mb-8 max-w-[18rem]"
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              Cette page n'est pas encore disponible publiquement.
            </p>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={shake ? 'shake' : 'normal'}
                  animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Code d'accès"
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-black/40 border border-white/10 text-white text-center rounded-xl px-4 py-3.5 tracking-[0.25em] text-sm outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-zinc-600 placeholder:tracking-[0.15em]"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="h-5">
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-rose-400/90 text-xs tracking-wide"
                    >
                      Code incorrect. Réessaie.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-xl bg-white text-black font-medium text-sm tracking-[0.15em] uppercase py-3.5 transition-transform active:scale-[0.99]"
              >
                <span className="relative z-10">Entrer</span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)',
                  }}
                />
              </button>
            </form>

            {/* Decorative divider */}
            <div className="mt-8 flex items-center gap-3 w-full">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-zinc-600 text-[0.6rem] tracking-[0.3em] uppercase">
                Comité Primaner
              </span>
              <span className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
