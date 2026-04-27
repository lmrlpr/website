import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { redirectToGothamCheckout } from '../../services/stripe'

const ACCESS_CODE = 'GOTHAM2026'

const tickets = [
  {
    id: 'eleve' as const,
    label: 'Élève de Première',
    badge: '1ÈRE',
    price: 10,
    priceLabel: '10 €',
    description: 'Accès + all you can drink',
    highlight: "Carte d'identité obligatoire",
    accentColor: '#00D4FF',
    glowVar: 'rgba(0,212,255,0.15)',
    borderFrom: 'rgba(0,212,255,0.2)',
    borderTo: 'rgba(0,212,255,0.5)',
  },
  {
    id: 'prof' as const,
    label: 'Professeur',
    badge: 'STAFF',
    price: 55,
    priceLabel: '55 €',
    description: 'Accès + all you can drink',
    highlight: "Carte d'identité obligatoire",
    accentColor: '#8B5CF6',
    glowVar: 'rgba(139,92,246,0.15)',
    borderFrom: 'rgba(139,92,246,0.2)',
    borderTo: 'rgba(139,92,246,0.5)',
  },
  {
    id: 'plus_un' as const,
    label: '+1 / Invité',
    badge: '+1',
    price: 55,
    priceLabel: '55 €',
    description: 'Accès + all you can drink',
    highlight: "Carte d'identité obligatoire",
    accentColor: '#8B5CF6',
    glowVar: 'rgba(139,92,246,0.15)',
    borderFrom: 'rgba(139,92,246,0.2)',
    borderTo: 'rgba(139,92,246,0.5)',
  },
]

type Step = 'select' | 'code' | 'form'

export function TicketOptions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<'eleve' | 'prof' | 'plus_un' | null>(null)
  const [step, setStep] = useState<Step>('select')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [shake, setShake] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const done = searchParams.get('success') === '1'

  if (searchParams.get('success') === '1' || searchParams.get('cancelled') === '1') {
    setSearchParams({}, { replace: true })
  }

  const cancelled = searchParams.get('cancelled') === '1'
  const selectedTicket = tickets.find(t => t.id === selected)

  const handleTicketSelect = (id: typeof selected) => {
    setSelected(id)
    setStep('code')
    setCode('')
    setCodeError('')
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      setStep('form')
      setCodeError('')
    } else {
      setCodeError('Code incorrect. Veuillez réessayer.')
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setCode('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await redirectToGothamCheckout({ firstName: form.firstName, lastName: form.lastName, email: form.email, ticketType: selected })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ border: '1px solid rgba(0,212,255,0.4)', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}
        >
          <svg className="w-8 h-8 text-gotham-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wide">Inscription confirmée</h3>
        <p className="text-white/40 text-sm">Tu es sur la liste. N'oublie pas ta carte d'identité.</p>
      </div>
    )
  }

  return (
    <section id="tickets" className="py-24 px-6 md:px-10 relative">
      {/* Section top border with glow */}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-gotham-rose/70 text-xs tracking-[0.5em] uppercase mb-3 font-medium">Billets</p>
          <h2 className="font-display font-800 text-3xl md:text-5xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
            Choisissez votre option
          </h2>
          <div className="mt-3 w-16 h-px bg-gradient-to-r from-gotham-rose/60 to-transparent" />
        </motion.div>

        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-3 rounded-xl text-amber-300 text-sm"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            Paiement annulé. Vous pouvez réessayer ci-dessous.
          </motion.div>
        )}

        {/* Ticket cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {tickets.map((ticket, i) => {
            const isSelected = selected === ticket.id && step !== 'select'
            return (
              <motion.button
                key={ticket.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => handleTicketSelect(ticket.id)}
                className="text-left rounded-2xl p-7 cursor-pointer transition-all duration-200 relative overflow-hidden group"
                style={{
                  background: `linear-gradient(135deg, rgba(10,10,15,0.9) 0%, ${ticket.glowVar} 100%)`,
                  border: `1px solid ${isSelected ? ticket.accentColor + '80' : ticket.borderFrom}`,
                  boxShadow: isSelected ? `0 0 24px ${ticket.glowVar}, 0 8px 40px rgba(0,0,0,0.5)` : '0 8px 40px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = ticket.borderTo
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${ticket.glowVar}, 0 8px 40px rgba(0,0,0,0.5)`
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLElement).style.borderColor = ticket.borderFrom
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)'
                  }
                }}
              >
                {/* Corner bracket accent */}
                <div className="absolute top-0 left-0 w-5 h-5 transition-all duration-200"
                  style={{ borderTop: `2px solid ${ticket.accentColor}40`, borderLeft: `2px solid ${ticket.accentColor}40` }}
                />
                <div className="absolute bottom-0 right-0 w-5 h-5 transition-all duration-200"
                  style={{ borderBottom: `2px solid ${ticket.accentColor}40`, borderRight: `2px solid ${ticket.accentColor}40` }}
                />

                {/* Badge */}
                <div
                  className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold tracking-widest mb-5"
                  style={{ background: `${ticket.accentColor}18`, color: ticket.accentColor, border: `1px solid ${ticket.accentColor}30` }}
                >
                  {ticket.badge}
                </div>

                {/* Label */}
                <p className="text-white/60 text-xs tracking-wider uppercase mb-3">{ticket.label}</p>

                {/* Price */}
                <p
                  className="font-gotham leading-none mb-4 tracking-wide"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: ticket.accentColor, textShadow: `0 0 20px ${ticket.accentColor}60` }}
                >
                  {ticket.priceLabel}
                </p>

                {/* Divider */}
                <div className="w-full h-px mb-4" style={{ background: `linear-gradient(90deg, ${ticket.accentColor}30, transparent)` }} />

                <p className="text-white/50 text-sm leading-relaxed mb-2">{ticket.description}</p>
                <p className="text-white/25 text-xs">{ticket.highlight}</p>

                {/* Arrow indicator */}
                <div className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: ticket.accentColor }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Step 2 & 3 forms */}
        <AnimatePresence mode="wait">
          {step === 'code' && selected && (
            <motion.div
              key="code-gate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{ background: 'rgba(10,10,15,0.8)', border: '1px solid rgba(0,212,255,0.12)', boxShadow: '0 0 40px rgba(0,212,255,0.05)' }}
            >
              <div>
                <p className="text-gotham-blue/60 text-xs tracking-[0.4em] uppercase mb-1">// Code d'accès requis</p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Réservé aux élèves de Première, à leurs +1, et aux professeurs.
                </p>
              </div>
              <form onSubmit={handleCodeSubmit} className="flex flex-col gap-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={shake ? 'shake' : 'still'}
                    animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <input
                      type="text"
                      value={code}
                      onChange={e => { setCode(e.target.value.toUpperCase()); setCodeError('') }}
                      placeholder="CODE D'ACCÈS"
                      autoFocus
                      className="w-full text-white placeholder:text-white/20 text-center text-base tracking-[0.35em] uppercase px-4 py-4 rounded-xl outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(0,212,255,0.2)',
                      }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.5)'; e.target.style.boxShadow = '0 0 12px rgba(0,212,255,0.12)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(0,212,255,0.2)'; e.target.style.boxShadow = '' }}
                    />
                  </motion.div>
                </AnimatePresence>
                {codeError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-center text-red-400 text-xs">
                    {codeError}
                  </motion.p>
                )}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep('select'); setSelected(null) }}
                    className="flex-1 py-3.5 text-sm rounded-xl cursor-pointer transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3.5 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 text-gotham-blue"
                    style={{ border: '1px solid rgba(0,212,255,0.4)', background: 'rgba(0,212,255,0.06)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0,212,255,0.25)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.8)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)' }}
                  >
                    Valider →
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'form' && selected && selectedTicket && (
            <motion.form
              key="details-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleSubmit}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{ background: 'rgba(10,10,15,0.8)', border: '1px solid rgba(0,212,255,0.12)', boxShadow: '0 0 40px rgba(0,212,255,0.05)' }}
            >
              <div className="flex items-center justify-between">
                <p className="text-white/40 text-xs tracking-[0.4em] uppercase">// Vos informations</p>
                <span className="text-xs font-medium" style={{ color: selectedTicket.accentColor }}>{selectedTicket.label} — {selectedTicket.priceLabel}</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: 'Prénom', field: 'firstName', placeholder: 'Jean' },
                  { label: 'Nom', field: 'lastName', placeholder: 'Dupont' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="text-xs text-white/35 uppercase tracking-wider block mb-1.5">{label}</label>
                    <input
                      required
                      value={form[field as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full text-white placeholder:text-white/20 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 10px rgba(0,212,255,0.08)' }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = '' }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs text-white/35 uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jean@example.com"
                  className="w-full text-white placeholder:text-white/20 px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,212,255,0.4)'; e.target.style.boxShadow = '0 0 10px rgba(0,212,255,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = '' }}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs text-red-300">{error}</span>
                </div>
              )}
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setStep('code')}
                  className="flex-1 py-3.5 text-sm rounded-xl cursor-pointer transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)' }}
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 text-sm font-semibold rounded-xl cursor-pointer transition-all duration-200 text-gotham-blue disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ border: '1px solid rgba(0,212,255,0.4)', background: 'rgba(0,212,255,0.06)' }}
                  onMouseEnter={e => { if (!loading) { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0,212,255,0.25)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.8)' } }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.4)' }}
                >
                  {loading ? 'Redirection...' : `Payer ${selectedTicket.price} € →`}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
