import { useState } from 'react'
import { motion } from 'framer-motion'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { ReservationForm } from './ReservationForm'
import { STARTERS, MAINS, DESSERTS, DRINK_SURCHARGE } from '../../utils/constants'
import type { MenuSelection } from '../../types/menuSelection'

const BASE_PRICE = 20

export function MenuForm() {
  const [selection, setSelection] = useState<Partial<MenuSelection>>({})
  const [showReservation, setShowReservation] = useState(false)

  const surcharge = selection.drinks === 'alcoholic' ? DRINK_SURCHARGE : 0
  const allSelected = Boolean(selection.starter && selection.main && selection.dessert && selection.drinks)

  if (showReservation) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <button
          onClick={() => setShowReservation(false)}
          className="mb-8 text-sm text-resto-text/50 hover:text-resto-text transition-colors flex items-center gap-2"
        >
          ← Modifier mon menu
        </button>
        <ReservationForm
          menuSelection={selection as MenuSelection}
          surcharge={surcharge}
        />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 space-y-10">
      <CourseSelector
        title="Entrée"
        options={STARTERS}
        selected={selection.starter ?? ''}
        onChange={(id) => setSelection(s => ({ ...s, starter: id }))}
      />

      <div className="border-t border-resto-border" />

      <CourseSelector
        title="Plat"
        options={MAINS}
        selected={selection.main ?? ''}
        onChange={(id) => setSelection(s => ({ ...s, main: id }))}
      />

      <div className="border-t border-resto-border" />

      <CourseSelector
        title="Dessert"
        options={DESSERTS}
        selected={selection.dessert ?? ''}
        onChange={(id) => setSelection(s => ({ ...s, dessert: id }))}
      />

      <div className="border-t border-resto-border" />

      <DrinkSelector
        selected={selection.drinks ?? ''}
        onChange={(pkg) => setSelection(s => ({ ...s, drinks: pkg }))}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-resto-border overflow-hidden"
      >
        <div className="flex justify-between px-4 py-3 text-sm">
          <span className="text-resto-text/60">Porta Nova</span>
          <span className="text-resto-text font-medium">{BASE_PRICE} €</span>
        </div>
        {selection.drinks === 'alcoholic' && (
          <div className="flex justify-between px-4 py-3 text-sm border-t border-resto-border">
            <span className="text-resto-text/60">Alcool</span>
            <span className="text-resto-accent font-medium">+{DRINK_SURCHARGE} €</span>
          </div>
        )}
        <div className="flex justify-between px-4 py-3 border-t border-resto-border bg-resto-surface/50">
          <span className="text-sm font-semibold text-resto-text">Total</span>
          <span className="text-sm font-bold text-resto-text">{BASE_PRICE + surcharge} €</span>
        </div>
      </motion.div>

      <button
        onClick={() => setShowReservation(true)}
        disabled={!allSelected}
        className="w-full py-4 text-sm font-semibold bg-resto-accent text-ink rounded-xl hover:bg-resto-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Mes informations →
      </button>
    </div>
  )
}
