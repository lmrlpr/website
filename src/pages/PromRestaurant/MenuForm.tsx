import { useState } from 'react'
import { motion } from 'framer-motion'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { ReservationForm } from './ReservationForm'
import { STARTERS, MAINS, DESSERTS, DRINK_SURCHARGE } from '../../utils/constants'
import type { MenuSelection } from '../../types/menuSelection'

export function MenuForm() {
  const [selection, setSelection] = useState<Partial<MenuSelection>>({})
  const [showReservation, setShowReservation] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const surcharge = selection.drinks === 'alcoholic' ? DRINK_SURCHARGE : 0
  const allSelected = Boolean(selection.starter && selection.main && selection.dessert && selection.drinks)

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6"
      >
        <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-600/30 flex items-center justify-center mb-6">
          <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-resto-text mb-3">Réservation confirmée</h3>
        <p className="text-resto-text/60 text-sm max-w-sm leading-relaxed">
          Votre réservation a été enregistrée. Vous recevrez une confirmation par email.
        </p>
        {surcharge > 0 && (
          <p className="mt-4 text-sm text-resto-accent">Supplément boissons: +{surcharge} € sera réglé sur place</p>
        )}
      </motion.div>
    )
  }

  if (showReservation) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <button
          onClick={() => setShowReservation(false)}
          className="mb-8 text-sm text-resto-text/50 hover:text-resto-text transition-colors flex items-center gap-2"
        >
          ← Modifier mon menu
        </button>
        {surcharge > 0 && (
          <div className="mb-6 flex items-center justify-between px-4 py-3 rounded-xl bg-resto-accent/10 border border-resto-accent/20">
            <span className="text-xs text-resto-text/70">Supplément boissons alcoolisées</span>
            <span className="text-sm font-semibold text-resto-accent">+{DRINK_SURCHARGE} €</span>
          </div>
        )}
        <ReservationForm
          menuSelection={selection as MenuSelection}
          surcharge={surcharge}
          onSubmit={() => setSubmitted(true)}
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

      {selection.drinks === 'alcoholic' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 rounded-xl bg-resto-accent/10 border border-resto-accent/20"
        >
          <span className="text-xs text-resto-text/70">Supplément boissons alcoolisées</span>
          <span className="text-sm font-semibold text-resto-accent">+{DRINK_SURCHARGE} €</span>
        </motion.div>
      )}

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
