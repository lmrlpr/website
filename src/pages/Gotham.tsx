import { useState } from 'react'
import { motion } from 'framer-motion'
import type { GothamRegistration } from '../types'

const MAPS_URL = 'https://www.google.com/maps/search/14+Av.+de+la+Faïencerie,+1510+Limpertsberg,+Luxembourg'

function NeonDivider({ color = 'blue' }: { color?: 'blue' | 'purple' }) {
  return (
    <div
      className={`w-16 h-px my-8 mx-auto ${color === 'blue' ? 'bg-gotham-blue/50' : 'bg-gotham-purple/50'}`}
      style={{
        boxShadow:
          color === 'blue'
            ? '0 0 8px rgba(0,212,255,0.5)'
            : '0 0 8px rgba(139,92,246,0.5)',
      }}
    />
  )
}

function RegistrationForm() {
  const [form, setForm] = useState<GothamRegistration>({ name: '', email: '', option: 'primaner' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Supabase stub — wire in next phase
    console.log('Gotham registration:', form)
    setSubmitted(true)
  }

  const price = form.option === 'externe' ? 53 : null

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-gotham-blue text-4xl mb-4">✓</div>
        <p className="text-white/80 font-semibold">Inscription enregistrée</p>
        <p className="text-white/40 text-sm mt-2">Confirmation par email à venir.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[
        { key: 'name', label: 'Nom complet', type: 'text', placeholder: 'Jean Dupont' },
        { key: 'email', label: 'Adresse email', type: 'email', placeholder: 'jean@example.com' },
      ].map(field => (
        <div key={field.key}>
          <label className="block text-gotham-blue text-[10px] tracking-[0.25em] uppercase mb-2">
            {field.label}
          </label>
          <input
            type={field.type}
            value={form[field.key as keyof GothamRegistration]}
            onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
            placeholder={field.placeholder}
            required
            className="w-full bg-white/5 border border-white/10 text-white rounded px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-gotham-blue/50 transition-colors"
          />
        </div>
      ))}

      {/* Option selector */}
      <div>
        <label className="block text-gotham-blue text-[10px] tracking-[0.25em] uppercase mb-3">
          Option d'inscription
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'primaner', label: 'Primaner', price: 'Prix à définir', desc: 'Élèves LMRL' },
            { value: 'externe', label: 'Profs & externes', price: '53€', desc: 'Professeurs & élèves externes' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm(f => ({ ...f, option: opt.value as GothamRegistration['option'] }))}
              className={`text-left p-4 rounded-lg border transition-all duration-200
                ${form.option === opt.value
                  ? 'border-gotham-blue bg-gotham-blue/10'
                  : 'border-white/10 hover:border-white/25'}`}
              style={form.option === opt.value ? { boxShadow: '0 0 16px rgba(0,212,255,0.15)' } : {}}
            >
              <p className="text-white text-sm font-semibold mb-1">{opt.label}</p>
              <p
                className="text-sm font-bold mb-1"
                style={{ color: form.option === opt.value ? '#00D4FF' : 'rgba(255,255,255,0.4)' }}
              >
                {opt.price}
              </p>
              <p className="text-white/35 text-xs">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Price summary */}
      <div className="flex justify-between items-center border-t border-white/10 pt-4">
        <span className="text-white/40 text-sm">Total</span>
        <span className="text-white font-bold text-lg">
          {price !== null ? `${price}€` : 'À définir'}
        </span>
      </div>

      <p className="text-white/25 text-xs">
        Accès avec bracelet — all you can drink inclus. Identification obligatoire (carte d'identité).
      </p>

      <button
        type="submit"
        className="w-full py-4 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, #00D4FF, #8B5CF6)',
          color: '#0A0A0F',
        }}
      >
        S'inscrire
      </button>
    </form>
  )
}

export default function Gotham() {
  return (
    <main className="bg-[#0A0A0F] min-h-screen text-white">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden">
        {/* Atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%),radial-gradient(ellipse 40% 40% at 80% 60%, rgba(139,92,246,0.06) 0%, transparent 60%)',
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.p
          className="text-gotham-blue text-xs tracking-[0.35em] uppercase font-medium mb-8 relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          Prom Night · 00h–06h
        </motion.p>

        <motion.h1
          className="relative z-10 font-bold uppercase leading-none tracking-tighter mb-6"
          style={{
            fontSize: 'clamp(5rem, 18vw, 16rem)',
            background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.3))',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          GOTHAM
        </motion.h1>

        <motion.p
          className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          La soirée qui commence quand le dîner se termine.
          <br />All you can drink — longdrinks & cocktails.
        </motion.p>
      </section>

      {/* Info strip */}
      <section className="border-t border-b border-white/5 py-10">
        <div className="max-w-3xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          {[
            { label: 'Adresse', value: '14 Av. de la Faïencerie\n1510 Limpertsberg', link: MAPS_URL },
            { label: 'Capacité', value: '300 personnes\nOuvert à tous' },
            { label: 'Entrée', value: 'Bracelet obligatoire\nCarte d\'identité requise' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-gotham-blue text-[10px] tracking-[0.25em] uppercase mb-2">{item.label}</p>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 text-sm leading-relaxed whitespace-pre-line hover:text-gotham-blue transition-colors underline underline-offset-4"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Registration */}
      <section className="max-w-lg mx-auto px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-gotham-purple text-[10px] tracking-[0.25em] uppercase mb-2">Inscription</p>
          <h2 className="text-2xl font-bold">Réserver votre place</h2>
        </div>
        <RegistrationForm />
      </section>

      <NeonDivider color="purple" />

      {/* DJ Lineup */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-gotham-blue text-[10px] tracking-[0.25em] uppercase mb-3">Line-up</p>
        <h2 className="text-2xl font-bold mb-10">DJs de la soirée</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="border border-white/8 rounded-lg p-6 flex flex-col items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}
              >
                🎧
              </div>
              <div>
                <p className="text-white/30 text-xs tracking-widest uppercase">DJ {i}</p>
                <p className="text-white/50 text-sm mt-1">À confirmer</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <NeonDivider />

      {/* Practical info */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-xl font-bold text-center mb-10">Infos pratiques</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Dress code',
              icon: '👔',
              desc: 'Tenue soignée requise. Casual chic ou tenue de soirée recommandée.',
            },
            {
              title: 'Vestiaire',
              icon: '🧥',
              desc: 'Vestiaire disponible sur place. Service inclus dans le prix d\'entrée.',
            },
            {
              title: 'Entrée',
              icon: '🎟',
              desc: 'Présentation du bracelet et d\'une pièce d\'identité obligatoire.',
            },
          ].map(item => (
            <div
              key={item.title}
              className="rounded-lg p-6 border border-white/8"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: '#00D4FF' }}
              >
                {item.title}
              </p>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <NeonDivider color="purple" />

      {/* Gallery placeholder */}
      <section className="max-w-3xl mx-auto px-6 py-16 pb-28 text-center">
        <p className="text-gotham-purple text-[10px] tracking-[0.25em] uppercase mb-3">Galerie</p>
        <h2 className="text-2xl font-bold mb-10">Photos & vidéos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.1), transparent)'
                    : 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)',
                }}
              />
              <p className="text-white/20 text-xs tracking-wider text-center px-4">
                Bientôt<br />disponible
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
