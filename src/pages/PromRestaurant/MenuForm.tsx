import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { ReservationForm } from './ReservationForm'
import { STARTERS, MAINS, DESSERTS, DRINK_SURCHARGE } from '../../utils/constants'
import type { MenuSelection } from '../../types/menuSelection'

const BASE_PRICE = 20

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Decorative wave divider between menu sections
function WaveDivider() {
  return (
    <div className="flex items-center gap-4 my-2">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C3D1EC, transparent)' }} />
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
        <path d="M0 5 Q5 0 10 5 Q15 10 20 5" stroke="#4B89E4" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C3D1EC, transparent)' }} />
    </div>
  )
}

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
          className="mb-8 text-sm text-resto-text/50 hover:text-resto-accent transition-colors flex items-center gap-2 cursor-pointer font-sans"
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
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-8">

      {/* Starters */}
      <AnimatedSection delay={0}>
        <CourseSelector
          title="Entrée"
          options={STARTERS}
          selected={selection.starter ?? ''}
          onChange={(id) => setSelection(s => ({ ...s, starter: id }))}
        />
      </AnimatedSection>

      <WaveDivider />

      {/* Mains */}
      <AnimatedSection delay={0.05}>
        <CourseSelector
          title="Plat"
          options={MAINS}
          selected={selection.main ?? ''}
          onChange={(id) => setSelection(s => ({ ...s, main: id }))}
        />
      </AnimatedSection>

      <WaveDivider />

      {/* Desserts */}
      <AnimatedSection delay={0.1}>
        <CourseSelector
          title="Dessert"
          options={DESSERTS}
          selected={selection.dessert ?? ''}
          onChange={(id) => setSelection(s => ({ ...s, dessert: id }))}
        />
      </AnimatedSection>

      <WaveDivider />

      {/* Drinks */}
      <AnimatedSection delay={0.15}>
        <DrinkSelector
          selected={selection.drinks ?? ''}
          onChange={(pkg) => setSelection(s => ({ ...s, drinks: pkg }))}
        />
      </AnimatedSection>

      {/* Price Summary — ceramic tile style */}
      <AnimatedSection delay={0.2}>
        <div
          className="rounded-2xl overflow-hidden border-2 border-dashed"
          style={{ borderColor: '#C3D1EC', background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)' }}
        >
          {/* Decorative top stripe */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #2558C9, #4B89E4, #F5C640, #4B89E4, #2558C9)' }} />

          <div className="px-5 py-3.5 flex justify-between items-center">
            <span className="text-sm text-resto-text/60 font-sans">Porta Nova</span>
            <span className="text-sm font-medium text-resto-text font-sans">{BASE_PRICE} €</span>
          </div>

          {selection.drinks === 'alcoholic' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 py-3.5 flex justify-between items-center border-t"
              style={{ borderColor: '#C3D1EC' }}
            >
              <span className="text-sm text-resto-text/60 font-sans">Supplément alcool</span>
              <span className="text-sm font-medium font-sans" style={{ color: '#2558C9' }}>+{DRINK_SURCHARGE} €</span>
            </motion.div>
          )}

          <div
            className="px-5 py-4 flex justify-between items-center border-t"
            style={{ borderColor: '#C3D1EC', background: 'rgba(37,88,201,0.04)' }}
          >
            <div>
              <span className="text-sm font-semibold text-resto-text font-sans">Total</span>
              {!allSelected && (
                <p className="text-xs text-resto-text/35 font-sans mt-0.5">Complétez votre menu pour continuer</p>
              )}
            </div>
            <span className="text-lg font-bold font-resto text-resto-text">{BASE_PRICE + surcharge} €</span>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA */}
      <AnimatedSection delay={0.25}>
        <button
          onClick={() => setShowReservation(true)}
          disabled={!allSelected}
          className="w-full py-4 text-sm font-semibold rounded-xl transition-all duration-200 font-sans cursor-pointer"
          style={allSelected ? {
            background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(37,88,201,0.3)',
          } : {
            background: '#E5EAF5',
            color: '#9AAACF',
            cursor: 'not-allowed',
          }}
          onMouseEnter={e => { if (allSelected) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(37,88,201,0.4)' }}
          onMouseLeave={e => { if (allSelected) (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(37,88,201,0.3)' }}
        >
          {allSelected ? 'Mes informations →' : 'Sélectionnez votre menu'}
        </button>
      </AnimatedSection>

    </div>
  )
}
