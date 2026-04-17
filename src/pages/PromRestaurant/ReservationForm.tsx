import { useState } from 'react'
import { redirectToRestaurantCheckout } from '../../services/stripe'
import type { MenuSelection } from '../../types/menuSelection'

const BASE_PRICE = 20
const ALCOHOL_SURCHARGE = 7

interface ReservationFormProps {
  menuSelection: MenuSelection
  surcharge: number
}

interface MedInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string
  type?: string
}

function MedInput({ label, value, onChange, placeholder, error, type = 'text' }: MedInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs tracking-[0.22em] uppercase font-sans font-semibold" style={{ color: '#2558C9', opacity: 0.8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white border text-resto-text placeholder:text-resto-text/30 text-sm px-4 py-3.5 rounded-xl outline-none transition-all duration-200 font-sans cursor-text"
        style={{
          borderColor: error ? '#EF4444' : '#C3D1EC',
          boxShadow: 'none',
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? '#EF4444' : '#2558C9'
          e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(37,88,201,0.12)'
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? '#EF4444' : '#C3D1EC'
          e.target.style.boxShadow = 'none'
        }}
      />
      {error && (
        <p className="text-red-500 text-xs font-sans">{error}</p>
      )}
    </div>
  )
}

export function ReservationForm({ menuSelection, surcharge }: ReservationFormProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', classGroup: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const hasAlcohol = surcharge > 0
  const total = BASE_PRICE + (hasAlcohol ? ALCOHOL_SURCHARGE : 0)

  const validate = () => {
    const e: Partial<typeof form> = {}
    if (!form.firstName.trim()) e.firstName = 'Requis'
    if (!form.lastName.trim()) e.lastName = 'Requis'
    if (!form.classGroup.trim()) e.classGroup = 'Requis'
    if (!form.email.includes('@')) e.email = 'Email invalide'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await redirectToRestaurantCheckout({
        firstName: form.firstName,
        lastName: form.lastName,
        classGroup: form.classGroup,
        email: form.email,
        phone: form.phone,
        starter: menuSelection.starter,
        main: menuSelection.main,
        dessert: menuSelection.dessert,
        drinks: menuSelection.drinks,
        hasAlcohol,
      })
    } catch {
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Section header */}
      <div className="relative mb-1">
        <div
          className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none"
          style={{ color: '#EBF0FA', zIndex: 0 }}
        >
          05
        </div>
        <div style={{ zIndex: 1, position: 'relative' }}>
          <h3 className="font-resto text-2xl text-resto-text" style={{ letterSpacing: '0.05em' }}>Vos informations</h3>
          <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #2558C9, #F5C640)' }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <MedInput label="Prénom" value={form.firstName} onChange={set('firstName')} placeholder="Jean" error={errors.firstName} />
        <MedInput label="Nom" value={form.lastName} onChange={set('lastName')} placeholder="Dupont" error={errors.lastName} />
      </div>
      <MedInput label="Classe" value={form.classGroup} onChange={set('classGroup')} placeholder="1CM2" error={errors.classGroup} />
      <MedInput label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jean@lycee.lu" error={errors.email} />
      <MedInput label="Téléphone (optionnel)" type="tel" value={form.phone} onChange={set('phone')} placeholder="+352 123 456 789" />

      {/* Price summary */}
      <div
        className="rounded-2xl overflow-hidden border mt-2"
        style={{ borderColor: '#C3D1EC', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px rgba(37,88,201,0.08)' }}
      >
        <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #1B2D52, #2558C9 35%, #4B89E4 60%, #F5C640 80%, #4B89E4 90%, #2558C9)' }} />

        <div className="px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-resto-text/55 font-sans">Porta Nova</span>
          <span className="text-sm font-medium text-resto-text font-sans">{BASE_PRICE} €</span>
        </div>
        {hasAlcohol && (
          <div className="px-6 py-4 flex justify-between items-center border-t" style={{ borderColor: '#E8EEFA' }}>
            <span className="text-sm text-resto-text/55 font-sans">Supplément alcool</span>
            <span className="text-sm font-semibold font-sans" style={{ color: '#2558C9' }}>+{ALCOHOL_SURCHARGE} €</span>
          </div>
        )}
        <div className="px-6 py-5 flex justify-between items-center border-t" style={{ borderColor: '#E8EEFA', background: 'rgba(37,88,201,0.03)' }}>
          <span className="text-sm font-semibold text-resto-text font-sans">Total</span>
          <span className="font-resto text-2xl" style={{ color: '#1B2D52' }}>{total} €</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 text-white font-semibold text-sm rounded-xl transition-all duration-200 font-sans cursor-pointer mt-1"
        style={loading ? {
          background: '#9AAACF',
          cursor: 'not-allowed',
        } : {
          background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
          boxShadow: '0 4px 24px rgba(37,88,201,0.35)',
        }}
        onMouseEnter={e => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(37,88,201,0.5)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
          }
        }}
        onMouseLeave={e => {
          if (!loading) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(37,88,201,0.35)'
            ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
          }
        }}
      >
        {loading ? 'Redirection vers le paiement...' : `Payer ${total} € →`}
      </button>
    </form>
  )
}
