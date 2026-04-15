import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TypewriterEffectSmooth } from './typewriter-effect'

const GATE_KEY = 'prom_gate_unlocked'
const ACCESS_CODE = 'Maxi'

const words = [
  { text: 'Accès' },
  { text: 'réservé.', className: 'text-blue-500' },
]

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
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0A0A0F' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-2 px-6 text-center w-full max-w-sm"
      >
        <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-2">
          Prom Gotham
        </p>

        <TypewriterEffectSmooth
          words={words}
          className="justify-center"
          cursorClassName="bg-blue-500"
        />

        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mb-6">
          Cette page n'est pas encore disponible publiquement.{' '}
          <span className="text-zinc-600">More information available soon.</span>
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
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Code d'accès"
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-center rounded-xl px-4 py-3 tracking-widest outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-600"
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs tracking-wide"
            >
              Code incorrect. Réessaie.
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold rounded-xl px-6 py-3 tracking-wide hover:bg-zinc-200 transition-colors"
          >
            Entrer
          </button>
        </form>

        <p className="text-zinc-600 text-xs mt-6">
          Code distribué par le comité Primaner
        </p>
      </motion.div>
    </div>
  )
}
