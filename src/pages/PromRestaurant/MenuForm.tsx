import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { ReservationForm } from './ReservationForm'
import { STARTERS, MAINS, DESSERTS, DRINK_SURCHARGE } from '../../utils/constants'
import type { MenuSelection } from '../../types/menuSelection'

const STEP_LABELS = ['Entrée', 'Plat', 'Dessert', 'Gedrénks', 'Informations']

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
}

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="w-full">
      {/* Dots + connecting lines */}
      <div className="flex items-center justify-between mb-3">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold font-sans shrink-0 transition-all duration-300"
              style={
                i < step
                  ? { background: 'linear-gradient(135deg, #1B2D52, #2558C9)', color: 'white', boxShadow: '0 2px 8px rgba(37,88,201,0.35)' }
                  : i === step
                  ? { background: '#2558C9', color: 'white', boxShadow: '0 2px 12px rgba(37,88,201,0.45)', outline: '3px solid rgba(37,88,201,0.18)', outlineOffset: '2px' }
                  : { background: '#EBF0FA', color: '#9AAACF', border: '1.5px solid #C3D1EC' }
              }
            >
              {i < step ? (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{String(i + 1).padStart(2, '0')}</span>
              )}
            </div>
            {i < total - 1 && (
              <div className="flex-1 h-px mx-1.5 transition-all duration-300"
                style={{ background: i < step ? 'linear-gradient(90deg, #2558C9, #4B89E4)' : '#C3D1EC' }}
              />
            )}
          </div>
        ))}
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, i) => (
          <span
            key={i}
            className="text-[10px] font-sans tracking-wide transition-all duration-300"
            style={{
              color: i === step ? '#2558C9' : i < step ? '#4B89E4' : '#9AAACF',
              fontWeight: i === step ? 600 : 400,
              minWidth: 0,
              textAlign: i === 0 ? 'left' : i === total - 1 ? 'right' : 'center',
              flex: 1,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

interface NavProps {
  step: number
  canContinue: boolean
  onBack: () => void
  onNext: () => void
}

function StepNav({ step, canContinue, onBack, onNext }: NavProps) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: '#E8EEFA' }}>
      {step > 0 ? (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-sans transition-colors duration-150 cursor-pointer"
          style={{ color: '#7A91B8' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#2558C9' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7A91B8' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold font-sans transition-all duration-200 cursor-pointer"
        style={canContinue ? {
          background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
          color: 'white',
          boxShadow: '0 4px 16px rgba(37,88,201,0.32)',
        } : {
          background: '#EBF0FA',
          color: '#9AAACF',
          cursor: 'not-allowed',
        }}
        onMouseEnter={e => {
          if (canContinue) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(37,88,201,0.48)'
        }}
        onMouseLeave={e => {
          if (canContinue) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(37,88,201,0.32)'
        }}
      >
        Continuer
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  )
}

export function MenuForm() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [selection, setSelection] = useState<Partial<MenuSelection>>({})

  const goNext = () => { setDir(1); setStep(s => s + 1) }
  const goBack = () => { setDir(-1); setStep(s => s - 1) }

  const surcharge = selection.drinks === 'alcoholic' ? DRINK_SURCHARGE : 0

  const canContinue = [
    Boolean(selection.starter),
    Boolean(selection.main),
    Boolean(selection.dessert),
    Boolean(selection.drinks),
  ][step] ?? false

  return (
    <div
      style={{
        backgroundImage: 'radial-gradient(circle, #C3D1EC 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        backgroundColor: '#FAFCFF',
        minHeight: '60vh',
      }}
    >
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Step indicator */}
        <StepIndicator step={step} total={5} />

        {/* Step content */}
        <div className="mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 && (
                <CourseSelector
                  title="Entrée"
                  options={STARTERS}
                  selected={selection.starter ?? ''}
                  onChange={(id) => setSelection(s => ({ ...s, starter: id }))}
                  courseNumber="01"
                />
              )}
              {step === 1 && (
                <CourseSelector
                  title="Plat"
                  options={MAINS}
                  selected={selection.main ?? ''}
                  onChange={(id) => setSelection(s => ({ ...s, main: id }))}
                  courseNumber="02"
                />
              )}
              {step === 2 && (
                <CourseSelector
                  title="Dessert"
                  options={DESSERTS}
                  selected={selection.dessert ?? ''}
                  onChange={(id) => setSelection(s => ({ ...s, dessert: id }))}
                  courseNumber="03"
                />
              )}
              {step === 3 && (
                <DrinkSelector
                  selected={selection.drinks ?? ''}
                  onChange={(pkg) => setSelection(s => ({ ...s, drinks: pkg }))}
                />
              )}
              {step === 4 && (
                <div>
                  <button
                    onClick={goBack}
                    className="mb-8 flex items-center gap-2 text-sm font-sans transition-colors duration-150 cursor-pointer"
                    style={{ color: '#7A91B8' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#2558C9' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#7A91B8' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Modifier mon menu
                  </button>
                  <ReservationForm
                    menuSelection={selection as MenuSelection}
                    surcharge={surcharge}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation (steps 0–3 only) */}
        {step < 4 && (
          <StepNav
            step={step}
            canContinue={canContinue}
            onBack={goBack}
            onNext={goNext}
          />
        )}
      </div>
    </div>
  )
}
