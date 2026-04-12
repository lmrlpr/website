import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ACCESS_CODE = 'PROM2026'

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
    <div className="min-h-screen bg-resto-bg flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-10 text-center">
          <p className="text-resto-text/40 text-xs tracking-[0.4em] uppercase mb-4">Porta Nova</p>
          <h1 className="text-3xl font-bold text-resto-text tracking-tight">Accès réservé</h1>
          <p className="text-resto-text/50 text-sm mt-3 leading-relaxed">
            Le restaurant est accessible aux élèves et professeurs du lycée Michel Rodange uniquement.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            <motion.div
              key={shake ? 'shake' : 'normal'}
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setError('') }}
                placeholder="CODE D'ACCÈS"
                className="w-full bg-resto-surface border border-resto-border text-resto-text placeholder:text-resto-text/30 text-center text-lg tracking-[0.3em] uppercase px-4 py-4 rounded-xl outline-none focus:border-resto-accent transition-colors"
                autoFocus
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-red-400 text-xs mt-3"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full mt-5 py-3.5 bg-resto-accent text-ink font-semibold text-sm rounded-xl hover:bg-resto-accent/90 transition-colors"
          >
            Accéder
          </button>
        </form>

        <p className="text-center text-resto-text/30 text-xs mt-8">
          Code distribué par le comité Primaner
        </p>
      </motion.div>
    </div>
  )
}
