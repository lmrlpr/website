import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { ReservationForm } from './ReservationForm'
import { STARTERS, MAINS, DESSERTS, DRINK_SURCHARGE } from '../../utils/constants'
import type { MenuSelection } from '../../types/menuSelection'

const STEPS = ['Entrée', 'Plat', 'Dessert', 'Boissons', 'Vos infos']

export function MenuForm() {
  const [step, setStep] = useState(0)
  const [selection, setSelection] = useState<Partial<MenuSelection>>({})
  const [submitted, setSubmitted] = useState(false)

  const surcharge = selection.drinks === 'alcoholic' ? DRINK_SURCHARGE : 0

  const canNext = () => {
    if (step === 0) return Boolean(selection.starter)
    if (step === 1) return Boolean(selection.main)
    if (step === 2) return Boolean(selection.dessert)
    if (step === 3) return Boolean(selection.drinks)
    return false
  }

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

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      {/* Step indicator */}
      <div className="flex items-center gap-1.5 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < step ? 'bg-resto-accent' : i === step ? 'bg-resto-accent w-4' : 'bg-white/15'
              }`}
            />
          </div>
        ))}
        <span className="ml-3 text-xs text-resto-text/40">{STEPS[step]}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <CourseSelector
              title="Choisissez votre entrée"
              options={STARTERS}
              selected={selection.starter ?? ''}
              onChange={(id) => setSelection(s => ({ ...s, starter: id }))}
            />
          )}
          {step === 1 && (
            <CourseSelector
              title="Choisissez votre plat"
              options={MAINS}
              selected={selection.main ?? ''}
              onChange={(id) => setSelection(s => ({ ...s, main: id }))}
            />
          )}
          {step === 2 && (
            <CourseSelector
              title="Choisissez votre dessert"
              options={DESSERTS}
              selected={selection.dessert ?? ''}
              onChange={(id) => setSelection(s => ({ ...s, dessert: id }))}
            />
          )}
          {step === 3 && (
            <DrinkSelector
              selected={selection.drinks ?? ''}
              onChange={(pkg) => setSelection(s => ({ ...s, drinks: pkg }))}
            />
          )}
          {step === 4 && (
            <ReservationForm
              menuSelection={selection as MenuSelection}
              surcharge={surcharge}
              onSubmit={() => setSubmitted(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Surcharge indicator */}
      {selection.drinks === 'alcoholic' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center justify-between px-4 py-3 rounded-xl bg-resto-accent/10 border border-resto-accent/20"
        >
          <span className="text-xs text-resto-text/70">Supplément boissons alcoolisées</span>
          <span className="text-sm font-semibold text-resto-accent">+{DRINK_SURCHARGE} €</span>
        </motion.div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="flex gap-3 mt-10">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-6 py-3 text-sm font-medium text-resto-text/50 border border-white/10 rounded-xl hover:border-white/20 hover:text-resto-text transition-all"
            >
              ← Retour
            </button>
          )}
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext()}
            className="flex-1 py-3 text-sm font-semibold bg-resto-accent text-ink rounded-xl hover:bg-resto-accent/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Mes informations →' : 'Continuer →'}
          </button>
        </div>
      )}
    </div>
  )
}
