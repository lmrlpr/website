import { HeroGalleryScrollAnimation } from '../../components/ui/hero-gallery-scroll-animation'
import type { BentoImageCell } from '../../components/ui/hero-gallery-scroll-animation'

const BASE = import.meta.env.BASE_URL

const CELLS: BentoImageCell[] = [
  {
    src: `${BASE}merch-images/2210_w018_n002_1385a_p30_1385.jpg`,
    alt: '',
    colSpan: 'span 1',
    origin: 'top-left',
  },
  {
    src: `${BASE}merch-images/IMG_2092.png`,
    alt: '',
    colSpan: 'span 2',
    origin: 'top-right',
  },
  {
    src: `${BASE}merch-images/draught-beer-png-mug.jpg`,
    alt: '',
    colSpan: 'span 2',
    origin: 'bottom-left',
  },
  {
    src: `${BASE}merch-images/png-red-apple-isolated-white-background.jpg`,
    alt: '',
    colSpan: 'span 1',
    origin: 'bottom-right',
  },
]

export function MerchIntro({ onVisit }: { onVisit: () => void }) {
  return (
    <HeroGalleryScrollAnimation cells={CELLS} bgColor="#EADFCC">
      <p className="text-[0.65rem] tracking-[0.5em] uppercase text-ink/50 mb-6">Collection</p>
      <h1
        className="font-merch font-light text-ink leading-none mb-10 text-center drop-shadow-sm"
        style={{ fontSize: 'clamp(5rem, 18vw, 12rem)', letterSpacing: '0.08em' }}
      >
        MERCH
      </h1>
      <div className="h-px w-10 bg-ink/30 mb-10" />
      <button
        type="button"
        onClick={onVisit}
        className="cursor-pointer px-10 py-3 rounded-full border border-ink/40 text-ink text-xs tracking-[0.4em] uppercase transition-colors duration-200 hover:bg-ink hover:text-[#EADFCC] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
      >
        Visit Store
      </button>
    </HeroGalleryScrollAnimation>
  )
}
