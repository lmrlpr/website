import { motion } from 'framer-motion'
import type { DrinkPackage } from '../../types/menuSelection'
import { DRINK_SURCHARGE } from '../../utils/constants'

interface DrinkSelectorProps {
  selected: DrinkPackage | ''
  onChange: (pkg: DrinkPackage) => void
}

const CocktailIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8M12 11v11M3 3h18l-9 8-9-8z"/>
    <path d="M9 6.5c1 1 3 1 4 0"/>
  </svg>
)

const WineIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 22h8M12 11v11"/>
    <path d="M6 3h12a1 1 0 0 1 .9 1.45L16 9a4 4 0 0 1-8 0L5.1 4.45A1 1 0 0 1 6 3z"/>
  </svg>
)

const packages = [
  {
    id: 'non-alcoholic' as DrinkPackage,
    label: 'Sans alcool',
    description: 'Cocktail sans alcool + 3 Softs',
    surcharge: 0,
    Icon: CocktailIcon,
    iconBg: 'rgba(75,137,228,0.10)',
    iconColor: '#4B89E4',
  },
  {
    id: 'alcoholic' as DrinkPackage,
    label: 'Avec alcool',
    description: 'Cocktail + ⅓ bouteille de vin + 1 Soft + 1 Bière',
    surcharge: DRINK_SURCHARGE,
    Icon: WineIcon,
    iconBg: 'rgba(245,198,64,0.12)',
    iconColor: '#D4960A',
  },
]

export function DrinkSelector({ selected, onChange }: DrinkSelectorProps) {
  return (
    <div>
      {/* Section header */}
      <div className="relative flex items-center gap-4 mb-5">
        <div
          className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none"
          style={{ color: '#EBF0FA', zIndex: 0 }}
        >
          04
        </div>
        <div style={{ zIndex: 1 }}>
          <h3 className="font-resto text-2xl text-resto-text" style={{ letterSpacing: '0.05em' }}>Boissons</h3>
          <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #2558C9, #F5C640)' }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {packages.map((pkg) => {
          const isSelected = selected === pkg.id
          return (
            <motion.button
              key={pkg.id}
              type="button"
              onClick={() => onChange(pkg.id)}
              whileHover={isSelected ? {} : { y: -3 }}
              className="text-left rounded-xl border transition-colors duration-200 cursor-pointer overflow-hidden"
              style={isSelected ? {
                background: 'linear-gradient(145deg, #1B2D52 0%, #2558C9 100%)',
                borderColor: '#2558C9',
                boxShadow: '0 8px 28px rgba(37,88,201,0.3), inset 0 0 0 1px rgba(255,255,255,0.12)',
              } : {
                background: '#FFFFFF',
                borderColor: '#C3D1EC',
                boxShadow: '0 2px 8px rgba(37,88,201,0.06)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#4B89E4'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(37,88,201,0.14)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#C3D1EC'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(37,88,201,0.06)'
                }
              }}
            >
              {/* Gold accent bar on selected */}
              {isSelected && (
                <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #F5C640, rgba(245,198,64,0.3))' }} />
              )}

              {/* Icon zone */}
              <div
                className="flex items-center justify-center h-14"
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.08)' : pkg.iconBg,
                  borderBottom: isSelected ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(195,209,236,0.4)',
                }}
              >
                <span style={{ color: isSelected ? 'rgba(255,255,255,0.85)' : pkg.iconColor }}>
                  <pkg.Icon />
                </span>
              </div>

              <div className="px-5 py-4">
                {/* Label row */}
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`font-semibold text-sm font-sans ${isSelected ? 'text-white' : 'text-resto-text'}`}>
                    {pkg.label}
                  </p>
                  {isSelected && (
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="#F5C640" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <p className={`text-xs leading-relaxed font-sans ${isSelected ? 'text-white/65' : 'text-resto-text/55'}`}>
                  {pkg.description}
                </p>

                {pkg.surcharge > 0 && (
                  <div
                    className={`mt-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold font-sans ${
                      isSelected ? 'text-[#1B2D52]' : 'text-[#D4960A]'
                    }`}
                    style={{
                      background: isSelected ? '#F5C640' : 'rgba(245,198,64,0.18)',
                      border: isSelected ? 'none' : '1px solid rgba(245,198,64,0.4)',
                    }}
                  >
                    +{pkg.surcharge} €
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
