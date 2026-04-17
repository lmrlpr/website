import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
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

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C3D1EC 40%, #C3D1EC 60%, transparent)' }} />
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
        <path d="M0 7 Q7 0 14 7 Q21 14 28 7" stroke="#4B89E4" strokeWidth="1" strokeOpacity="0.35" fill="none"/>
        <circle cx="14" cy="7" r="2" fill="#F5C640" opacity="0.7"/>
      </svg>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C3D1EC 40%, #C3D1EC 60%, transparent)' }} />
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
      <div
        className="min-h-screen"
        style={{
          backgroundImage: 'radial-gradient(circle, #C3D1EC 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          backgroundColor: '#FAFCFF',
        }}
      >
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
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundImage: 'radial-gradient(circle, #C3D1EC 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        backgroundColor: '#FAFCFF',
      }}
    >
      <div className="max-w-xl mx-auto px-6 py-10 space-y-8">

        {/* Starters */}
        <AnimatedSection delay={0}>
          <CourseSelector
            title="Entrée"
            options={STARTERS}
            selected={selection.starter ?? ''}
            onChange={(id) => setSelection(s => ({ ...s, starter: id }))}
            courseNumber="01"
          />
        </AnimatedSection>

        <SectionDivider />

        {/* Mains */}
        <AnimatedSection delay={0.05}>
          <CourseSelector
            title="Plat"
            options={MAINS}
            selected={selection.main ?? ''}
            onChange={(id) => setSelection(s => ({ ...s, main: id }))}
            courseNumber="02"
          />
        </AnimatedSection>

        <SectionDivider />

        {/* Desserts */}
        <AnimatedSection delay={0.1}>
          <CourseSelector
            title="Dessert"
            options={DESSERTS}
            selected={selection.dessert ?? ''}
            onChange={(id) => setSelection(s => ({ ...s, dessert: id }))}
            courseNumber="03"
          />
        </AnimatedSection>

        <SectionDivider />

        {/* Drinks */}
        <AnimatedSection delay={0.15}>
          <DrinkSelector
            selected={selection.drinks ?? ''}
            onChange={(pkg) => setSelection(s => ({ ...s, drinks: pkg }))}
          />
        </AnimatedSection>

        {/* Price Summary */}
        <AnimatedSection delay={0.2}>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ borderColor: '#C3D1EC', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', boxShadow: '0 4px 24px rgba(37,88,201,0.08)' }}
          >
            {/* Bold Mediterranean stripe */}
            <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #1B2D52, #2558C9 35%, #4B89E4 60%, #F5C640 80%, #4B89E4 90%, #2558C9)' }} />

            <div className="px-6 py-4 flex justify-between items-center">
              <span className="text-sm text-resto-text/55 font-sans">Porta Nova</span>
              <span className="text-sm font-medium text-resto-text font-sans">{BASE_PRICE} €</span>
            </div>

            <AnimatePresence>
              {selection.drinks === 'alcoholic' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 flex justify-between items-center border-t overflow-hidden"
                  style={{ borderColor: '#E8EEFA', paddingTop: '1rem', paddingBottom: '1rem' }}
                >
                  <span className="text-sm text-resto-text/55 font-sans">Supplément alcool</span>
                  <span className="text-sm font-semibold font-sans" style={{ color: '#2558C9' }}>+{DRINK_SURCHARGE} €</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className="px-6 py-5 flex justify-between items-center border-t"
              style={{ borderColor: '#E8EEFA', background: 'rgba(37,88,201,0.03)' }}
            >
              <div>
                <span className="text-sm font-semibold text-resto-text font-sans">Total</span>
                {!allSelected && (
                  <p className="text-xs text-resto-text/35 font-sans mt-0.5">Fëllt Äre Menü aus, fir weiderzemaachen.</p>
                )}
              </div>
              <span className="font-resto text-2xl" style={{ color: '#1B2D52' }}>{BASE_PRICE + surcharge} €</span>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection delay={0.25}>
          <button
            onClick={() => setShowReservation(true)}
            disabled={!allSelected}
            className="w-full py-4 text-sm font-semibold rounded-xl transition-all duration-200 font-sans cursor-pointer relative overflow-hidden"
            style={allSelected ? {
              background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)',
              color: 'white',
              boxShadow: '0 4px 24px rgba(37,88,201,0.35)',
            } : {
              background: '#E5EAF5',
              color: '#9AAACF',
              cursor: 'not-allowed',
            }}
            onMouseEnter={e => {
              if (allSelected) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 32px rgba(37,88,201,0.5)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={e => {
              if (allSelected) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(37,88,201,0.35)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              }
            }}
          >
            {allSelected ? 'Mes informations →' : 'Sélectionnez votre menu'}
          </button>
        </AnimatedSection>

      </div>
    </div>
  )
}
