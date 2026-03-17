import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ReservationForm } from '../types'

const ACCESS_CODE = import.meta.env.VITE_RESTO_ACCESS_CODE ?? 'LMRL2025'

const STARTERS = [
  { value: 'rigatoni-truffe', label: 'Mezzi Rigatoni à la crème de truffe et écailles de parmesan' },
  { value: 'paccheri-tomate', label: 'Paccheri à la sauce tomate, burrata et basilic' },
  { value: 'legumes-grilles', label: 'Assiette de légumes grillés 🌱' },
  { value: 'burrata-med', label: 'Burrata à la méditerranéenne (courgettes et aubergines grillées, tomates séchées et pesto) 🌱' },
]

const MAINS = [
  { value: 'bar-plancha', label: 'Bar à la plancha, sauce au citron — pommes de terre au four et légumes' },
  { value: 'escalope-veau', label: 'Escalope de veau, sauce au poivre — pommes de terre au four et légumes' },
  { value: 'spaghetti-courgettes', label: 'Spaghetti de courgettes à la méditerranéenne 🌱' },
  { value: 'pizza-buffala', label: 'Pizza Buffala' },
  { value: 'pizza-prosciutto', label: 'Pizza Prosciutto e Funghi' },
  { value: 'pizza-diavola', label: 'Pizza Diavola' },
]

const DESSERTS = [
  { value: 'tiramisu', label: 'Tiramisu' },
  { value: 'panna-cotta', label: 'Panna cotta aux fruits rouges' },
  { value: 'macedoine', label: 'Macédoine de fruits 🌱' },
]

const BASE_PRICE = 0 // TBD — placeholder
const ALCOHOL_SURCHARGE = 7

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="mb-6">
      <label className="block text-resto-accent text-xs tracking-[0.2em] uppercase font-medium mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border border-resto-text/20 text-resto-text rounded px-4 py-3 text-sm appearance-none focus:outline-none focus:border-resto-accent/60 transition-colors"
      >
        <option value="" disabled className="bg-[#1C1410]">— Choisir —</option>
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-[#1C1410]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function Restaurant() {
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<ReservationForm>({
    name: '',
    email: '',
    phone: '',
    starter: '',
    main: '',
    dessert: '',
    drinks: 'sans-alcool',
  })

  function checkCode() {
    if (code.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      setUnlocked(true)
      setCodeError(false)
    } else {
      setCodeError(true)
      setTimeout(() => setCodeError(false), 500)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Supabase stub — wire in next phase
    console.log('Reservation submitted:', form)
    setSubmitted(true)
  }

  const drinksSurcharge = form.drinks === 'avec-alcool' ? ALCOHOL_SURCHARGE : 0
  const total = BASE_PRICE + drinksSurcharge

  return (
    <main className="bg-[#1C1410] min-h-screen text-[#F5ECD7]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, #D4A853 0%, transparent 70%)',
          }}
        />
        <motion.p
          className="text-[#D4A853] text-xs tracking-[0.3em] uppercase font-medium mb-6 relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          Prom Night · 20h–00h
        </motion.p>
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight relative z-10 mb-4"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
        >
          Dîner au<br />Porta Nova
        </motion.h1>
        <motion.div
          className="w-10 h-px bg-[#D4A853]/40 my-6 relative z-10"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }}
        />
        <motion.p
          className="text-[#F5ECD7]/60 text-sm md:text-base max-w-sm leading-relaxed relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          Un dîner d'exception pour marquer la fin de vos années au lycée.
          <br />Entrée, plat, dessert et boissons — tout est inclus.
        </motion.p>
      </section>

      {/* Info block */}
      <section className="max-w-2xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-6 text-center">
        {[
          { label: 'Adresse', value: '14 Av. de la Faïencerie\n1510 Limpertsberg', link: 'https://maps.app.goo.gl/porta-nova' },
          { label: 'Capacité', value: '175 personnes\nÉlèves & professeurs uniquement' },
          { label: 'Programme', value: '20h00 — Accueil\n22h00 — Dîner\n00h00 — Suite à Gotham' },
        ].map(item => (
          <div key={item.label} className="border border-[#F5ECD7]/10 rounded-lg p-6">
            <p className="text-[#D4A853] text-[10px] tracking-[0.2em] uppercase mb-3">{item.label}</p>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5ECD7]/80 text-sm leading-relaxed whitespace-pre-line hover:text-[#D4A853] transition-colors underline underline-offset-4"
              >
                {item.value}
              </a>
            ) : (
              <p className="text-[#F5ECD7]/80 text-sm leading-relaxed whitespace-pre-line">{item.value}</p>
            )}
          </div>
        ))}
      </section>

      {/* Access code gate */}
      <section className="max-w-lg mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="border border-[#F5ECD7]/10 rounded-xl p-8 text-center"
            >
              <p className="text-[#D4A853] text-[10px] tracking-[0.25em] uppercase mb-4">Accès réservé</p>
              <h2 className="text-xl font-semibold mb-2">Entrez votre code d'accès</h2>
              <p className="text-[#F5ECD7]/50 text-sm mb-8">
                Réservé aux élèves et professeurs du Lycée Michel Rodange.
              </p>
              <motion.div
                animate={codeError ? { x: [-8, 8, -8, 8, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkCode()}
                  placeholder="CODE D'ACCÈS"
                  className={`flex-1 bg-transparent border rounded px-4 py-3 text-sm text-center tracking-widest uppercase focus:outline-none transition-colors
                    ${codeError
                      ? 'border-red-500/60 text-red-400 placeholder:text-red-500/40'
                      : 'border-[#F5ECD7]/20 focus:border-[#D4A853]/60 placeholder:text-[#F5ECD7]/20'
                    }`}
                />
                <button
                  onClick={checkCode}
                  className="px-5 py-3 bg-[#D4A853] text-[#1C1410] text-sm font-semibold rounded hover:bg-[#D4A853]/80 transition-colors"
                >
                  →
                </button>
              </motion.div>
              {codeError && (
                <p className="text-red-400/80 text-xs mt-3">Code incorrect. Veuillez réessayer.</p>
              )}
            </motion.div>
          ) : submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-[#D4A853]/30 rounded-xl p-12 text-center"
            >
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold mb-3">Réservation enregistrée</h2>
              <p className="text-[#F5ECD7]/60 text-sm">
                Vous recevrez une confirmation par email dans les prochains jours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-2"
            >
              <div className="mb-8">
                <p className="text-[#D4A853] text-[10px] tracking-[0.25em] uppercase mb-1">Formulaire d'inscription</p>
                <h2 className="text-2xl font-bold">Votre réservation</h2>
              </div>

              {/* Personal info */}
              {[
                { key: 'name', label: 'Nom complet', type: 'text', placeholder: 'Jean Dupont' },
                { key: 'email', label: 'Adresse email', type: 'email', placeholder: 'jean@lycee.lu' },
                { key: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+352 000 000' },
              ].map(field => (
                <div key={field.key} className="mb-6">
                  <label className="block text-[#D4A853] text-xs tracking-[0.2em] uppercase font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof ReservationForm]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    required
                    className="w-full bg-transparent border border-[#F5ECD7]/20 text-[#F5ECD7] rounded px-4 py-3 text-sm placeholder:text-[#F5ECD7]/25 focus:outline-none focus:border-[#D4A853]/60 transition-colors"
                  />
                </div>
              ))}

              <SelectField
                label="Entrée"
                value={form.starter}
                onChange={v => setForm(f => ({ ...f, starter: v }))}
                options={STARTERS}
              />
              <SelectField
                label="Plat principal"
                value={form.main}
                onChange={v => setForm(f => ({ ...f, main: v }))}
                options={MAINS}
              />
              <SelectField
                label="Dessert"
                value={form.dessert}
                onChange={v => setForm(f => ({ ...f, dessert: v }))}
                options={DESSERTS}
              />

              {/* Drinks */}
              <div className="mb-8">
                <p className="text-[#D4A853] text-xs tracking-[0.2em] uppercase font-medium mb-4">Boissons</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'sans-alcool', label: 'Sans alcool', desc: 'Cocktail sans alcool + 3 Softs', extra: '' },
                    { value: 'avec-alcool', label: 'Avec alcool', desc: 'Cocktail + ⅓ bouteille de vin + Soft + Bière', extra: '+7€' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, drinks: opt.value as ReservationForm['drinks'] }))}
                      className={`text-left p-4 rounded-lg border transition-colors
                        ${form.drinks === opt.value
                          ? 'border-[#D4A853] bg-[#D4A853]/10'
                          : 'border-[#F5ECD7]/15 hover:border-[#F5ECD7]/30'}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-semibold">{opt.label}</span>
                        {opt.extra && (
                          <span className="text-[#D4A853] text-xs font-bold">{opt.extra}</span>
                        )}
                      </div>
                      <p className="text-[#F5ECD7]/50 text-xs leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#F5ECD7]/10 pt-6 mb-6 flex justify-between items-center">
                <span className="text-[#F5ECD7]/60 text-sm">Total estimé</span>
                <span className="text-[#D4A853] text-xl font-bold">
                  {total > 0 ? `${total}€` : 'Prix à définir'}
                  {drinksSurcharge > 0 && (
                    <span className="text-[#F5ECD7]/40 text-xs font-normal ml-2">(+{ALCOHOL_SURCHARGE}€ alcool inclus)</span>
                  )}
                </span>
              </div>

              <p className="text-[#F5ECD7]/30 text-xs mb-6">
                🌱 Options véganes disponibles. Le paiement sera effectué ultérieurement.
              </p>

              <button
                type="submit"
                className="w-full py-4 bg-[#D4A853] text-[#1C1410] font-semibold rounded-lg hover:bg-[#D4A853]/80 transition-colors tracking-wide"
              >
                Confirmer la réservation
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}
