import type { DrinkPackage } from '../../types/menuSelection'
import { DRINK_SURCHARGE } from '../../utils/constants'

interface DrinkSelectorProps {
  selected: DrinkPackage | ''
  onChange: (pkg: DrinkPackage) => void
}

const packages = [
  {
    id: 'non-alcoholic' as DrinkPackage,
    label: 'Sans alcool',
    description: 'Cocktail sans alcool + 3 Softs',
    surcharge: 0,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l-1 8H9L8 2z"/><path d="M9 10c0 5 6 8 6 8s6-3 6-8"/><path d="M3 10h18"/>
      </svg>
    ),
  },
  {
    id: 'alcoholic' as DrinkPackage,
    label: 'Avec alcool',
    description: 'Cocktail + 1/3 bouteille de vin + 1 Soft + 1 Bière',
    surcharge: DRINK_SURCHARGE,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 22V2l10 6-10 6"/><line x1="7" y1="14" x2="17" y2="8"/>
      </svg>
    ),
  },
]

export function DrinkSelector({ selected, onChange }: DrinkSelectorProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div>
          <h3 className="font-resto text-xl text-resto-text" style={{ letterSpacing: '0.05em' }}>Boissons</h3>
          <div className="mt-1 h-0.5 w-8 rounded-full bg-resto-accent opacity-60" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {packages.map((pkg) => {
          const isSelected = selected === pkg.id
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onChange(pkg.id)}
              className="text-left rounded-xl border transition-all duration-200 cursor-pointer"
              style={isSelected ? {
                background: 'linear-gradient(135deg, #2558C9 0%, #3B6FD4 100%)',
                borderColor: '#2558C9',
                boxShadow: '0 4px 20px rgba(37, 88, 201, 0.25), inset 0 0 0 1px rgba(255,255,255,0.15)',
                transform: 'translateY(0px)',
              } : {
                background: 'rgba(255,255,255,0.75)',
                borderColor: '#C3D1EC',
                boxShadow: '0 1px 4px rgba(37,88,201,0.06)',
                transform: 'translateY(0px)',
              }}
              onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(37,88,201,0.12)' } }}
              onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 4px rgba(37,88,201,0.06)' } }}
            >
              <div className="px-5 py-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className={isSelected ? 'text-white/80' : 'text-resto-accent/70'}>
                      {pkg.icon}
                    </span>
                    <p className={`font-semibold text-sm font-sans ${isSelected ? 'text-white' : 'text-resto-text'}`}>
                      {pkg.label}
                    </p>
                  </div>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                <p className={`text-xs leading-relaxed font-sans ${isSelected ? 'text-white/70' : 'text-resto-text/55'}`}>
                  {pkg.description}
                </p>

                {pkg.surcharge > 0 && (
                  <div className={`mt-3 inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold font-sans ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'text-resto-accent border border-resto-accent/30'
                  }`}
                  style={!isSelected ? { background: 'rgba(37,88,201,0.06)' } : {}}>
                    +{pkg.surcharge} €
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
