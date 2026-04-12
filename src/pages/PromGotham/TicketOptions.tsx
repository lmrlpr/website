import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { createGothamRegistration } from '../../services/supabase'
import { redirectToGothamCheckout } from '../../services/stripe'

const tickets = [
  {
    id: 'primaner' as const,
    label: 'Primaner',
    price: null,
    priceLabel: 'Prix à définir',
    description: 'Accès + bracelet + all you can drink',
    highlight: 'Identification: carte d\'identité',
    color: 'gotham-blue',
    borderClass: 'border-gotham-blue/30 hover:border-gotham-blue/60',
    badgeClass: 'bg-gotham-blue/10 text-gotham-blue',
  },
  {
    id: 'external' as const,
    label: 'Profs & Élèves ext.',
    price: 53,
    priceLabel: '53 €',
    description: 'Accès + bracelet + all you can drink',
    highlight: 'Identification: carte d\'identité',
    color: 'gotham-purple',
    borderClass: 'border-gotham-purple/30 hover:border-gotham-purple/60',
    badgeClass: 'bg-gotham-purple/10 text-gotham-purple',
  },
]

export function TicketOptions() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<'primaner' | 'external' | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(() => searchParams.get('success') === '1')

  // Clean up URL params on mount
  if (searchParams.get('success') === '1' || searchParams.get('cancelled') === '1') {
    setSearchParams({}, { replace: true })
  }

  const cancelled = searchParams.get('cancelled') === '1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      if (selected === 'external') {
        await redirectToGothamCheckout({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        })
      } else {
        await createGothamRegistration({
          ...form,
          ticketType: selected,
          price: 0,
        })
        setDone(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full border border-gotham-blue/30 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-gotham-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Inscription confirmée</h3>
        <p className="text-white/40 text-sm">Vous serez sur la liste. N'oubliez pas votre carte d'identité.</p>
      </div>
    )
  }

  return (
    <section id="tickets" className="py-24 px-6 md:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-gotham-blue/50 text-xs tracking-[0.4em] uppercase mb-3">Billets</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Choisissez votre option</h2>
        </motion.div>

        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm"
          >
            Paiement annulé. Vous pouvez réessayer ci-dessous.
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {tickets.map((ticket, i) => (
            <motion.button
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              onClick={() => setSelected(ticket.id)}
              className={`text-left p-7 rounded-2xl glass border-2 transition-all duration-300 ${ticket.borderClass} ${selected === ticket.id ? 'ring-1 ring-gotham-blue/30 scale-[1.01]' : ''}`}
            >
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${ticket.badgeClass}`}>
                {ticket.label}
              </div>
              <div className="flex items-end justify-between mb-4">
                <p className="text-2xl font-bold text-white">{ticket.priceLabel}</p>
              </div>
              <p className="text-white/50 text-sm mb-3 leading-relaxed">{ticket.description}</p>
              <p className="text-white/30 text-xs">{ticket.highlight}</p>
            </motion.button>
          ))}
        </div>

        {selected && (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-7 flex flex-col gap-4"
          >
            <p className="text-white/50 text-xs tracking-widest uppercase">Vos informations</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Prénom', field: 'firstName', placeholder: 'Jean' },
                { label: 'Nom', field: 'lastName', placeholder: 'Dupont' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">{label}</label>
                  <input
                    required
                    value={form[field as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 rounded-xl text-sm outline-none focus:border-gotham-blue/50 transition-colors"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-wider block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="jean@example.com"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 rounded-xl text-sm outline-none focus:border-gotham-blue/50 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-red-300">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-3.5 border border-gotham-blue/50 text-gotham-blue text-sm font-semibold rounded-xl hover:shadow-neon hover:bg-gotham-blue/10 transition-all disabled:opacity-40"
            >
              {loading
                ? (selected === 'external' ? 'Redirection vers le paiement...' : 'Inscription...')
                : (selected === 'external' ? 'Payer 53 € →' : "S'inscrire →")}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
