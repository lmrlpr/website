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
  },
  {
    id: 'alcoholic' as DrinkPackage,
    label: 'Avec alcool',
    description: `Cocktail + 1/3 bouteille de vin + 1 Soft + 1 Bière`,
    surcharge: DRINK_SURCHARGE,
  },
]

export function DrinkSelector({ selected, onChange }: DrinkSelectorProps) {
  return (
    <div>
      <h3 className="text-xs tracking-[0.35em] uppercase text-resto-text/50 mb-4 font-medium">Boissons</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => onChange(pkg.id)}
            className={`text-left px-5 py-5 rounded-xl border transition-all duration-200 ${
              selected === pkg.id
                ? 'border-ink bg-ink text-white'
                : 'border-resto-border bg-resto-surface/50 text-resto-text/70 hover:border-resto-accent/40 hover:text-resto-text'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm">{pkg.label}</p>
              {selected === pkg.id && (
                <svg className="w-4 h-4 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className="text-xs leading-relaxed opacity-70">{pkg.description}</p>
            {pkg.surcharge > 0 && (
              <div className={`mt-3 inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                selected === pkg.id ? 'bg-white/20 text-white' : 'bg-resto-border text-resto-text/40'
              }`}>
                +{pkg.surcharge} €
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
