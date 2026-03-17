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
                ? 'border-resto-accent bg-resto-accent/10 text-resto-text'
                : 'border-white/8 bg-white/3 text-resto-text/70 hover:border-white/20 hover:text-resto-text'
            }`}
          >
            <p className="font-semibold text-sm mb-1">{pkg.label}</p>
            <p className="text-xs leading-relaxed opacity-70">{pkg.description}</p>
            {pkg.surcharge > 0 && (
              <div className={`mt-3 inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                selected === pkg.id ? 'bg-resto-accent/20 text-resto-accent' : 'bg-white/10 text-white/50'
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
