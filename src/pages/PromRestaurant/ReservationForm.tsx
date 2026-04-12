import { useState } from 'react'
import { Input } from '../../components/ui/Input'
import { createRestaurantReservation } from '../../services/supabase'
import type { MenuSelection } from '../../types/menuSelection'

interface ReservationFormProps {
  menuSelection: MenuSelection
  surcharge: number
  onSubmit: () => void
}

export function ReservationForm({ menuSelection, surcharge, onSubmit }: ReservationFormProps) {
  const [form, setForm] = useState({ firstName: '', lastName: '', classGroup: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<typeof form>>({})

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
      await createRestaurantReservation({
        ...form,
        menuSelection: { ...menuSelection, drinkSurcharge: surcharge },
        totalSurcharge: surcharge,
        accessCode: sessionStorage.getItem('restaurant_access') ?? '',
      })
onSubmit()
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

      {surcharge > 0 && (
        <div className="px-4 py-3 rounded-xl bg-resto-accent/10 border border-resto-accent/20 flex justify-between">
          <span className="text-xs text-resto-text/60">Supplément boissons alcoolisées</span>
          <span className="text-sm font-semibold text-resto-accent">+{surcharge} €</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-resto-accent text-ink font-semibold text-sm rounded-xl hover:bg-resto-accent/90 transition-colors disabled:opacity-50 mt-2"
      >
        {loading ? 'Envoi en cours...' : 'Confirmer ma réservation'}
      </button>
    </form>
  )
}
