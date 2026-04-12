import { useState } from 'react'
import { Input } from '../../components/ui/Input'
import { redirectToRestaurantCheckout } from '../../services/stripe'
import type { MenuSelection } from '../../types/menuSelection'

const BASE_PRICE = 20
const ALCOHOL_SURCHARGE = 7

interface ReservationFormProps {
  menuSelection: MenuSelection
  surcharge: number
  onSubmit: () => void
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
      <h3 className="text-xs tracking-[0.35em] uppercase text-resto-text/50 mb-1 font-medium">Vos informations</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input dark label="Prénom" value={form.firstName} onChange={set('firstName')} placeholder="Jean" error={errors.firstName} />
        <Input dark label="Nom" value={form.lastName} onChange={set('lastName')} placeholder="Dupont" error={errors.lastName} />
      </div>
      <Input dark label="Classe" value={form.classGroup} onChange={set('classGroup')} placeholder="1CM2" error={errors.classGroup} />
      <Input dark label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jean@lycee.lu" error={errors.email} />
      <Input dark label="Téléphone (optionnel)" type="tel" value={form.phone} onChange={set('phone')} placeholder="+352 123 456 789" />

      {/* Price summary */}
      <div className="rounded-xl border border-resto-border overflow-hidden">
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-resto-text/60">Porta Nova</span>
          <span className="text-resto-text font-medium">{BASE_PRICE} €</span>
        </div>
        {hasAlcohol && (
          <div className="flex justify-between px-4 py-3 text-sm border-t border-resto-border">
            <span className="text-resto-text/60">Alcool</span>
            <span className="text-resto-accent font-medium">+{ALCOHOL_SURCHARGE} €</span>
          </div>
        )}
        <div className="flex justify-between px-4 py-3 border-t border-resto-border bg-resto-surface/50">
          <span className="text-sm font-semibold text-resto-text">Total</span>
          <span className="text-sm font-bold text-resto-text">{total} €</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-resto-accent text-ink font-semibold text-sm rounded-xl hover:bg-resto-accent/90 transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? 'Redirection vers le paiement...' : `Payer ${total} € →`}
      </button>
    </form>
  )
}
