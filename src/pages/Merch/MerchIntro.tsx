import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion'
import { SmoothScrollHero } from '../../components/ui/modern-hero'

const BASE = import.meta.env.BASE_URL
const CENTER_IMAGE = `${BASE}merch/Tabea_Zoe_main_PRIMANER.webp`
const MOBILE_IMAGE = `${BASE}merch/Trio.webp`

function useMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function MobileHero({ onVisit }: { onVisit: () => void }) {
  const { scrollY } = useScroll()
  const REVEAL = 400
  const IMAGE_VH = 62

  const clip1 = useTransform(scrollY, [0, REVEAL], [12, 0])
  const clip2 = useTransform(scrollY, [0, REVEAL], [88, 100])
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`

  return (
    <div style={{ backgroundColor: '#EADFCC' }}>
      {/* Pinned reveal section — image sticks to the top of the viewport while
          the user scrolls through REVEAL px, so the clip-path expansion happens
          in place (not simultaneously with the page scrolling). Once the outer
          container scrolls past, the image unpins and the rest of the page
          (MERCH title, button) scrolls into view normally. */}
      <div
        className="relative w-full"
        style={{ height: `calc(${IMAGE_VH}vh + ${REVEAL}px)` }}
      >
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: `${IMAGE_VH}vh` }}
        >
          <motion.div
            style={{
              clipPath,
              backgroundImage: `url(${MOBILE_IMAGE})`,
              backgroundPosition: 'center 18%',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              willChange: 'clip-path',
            }}
            className="absolute inset-0"
          />
        </div>
      </div>

      {/* Text below the image */}
      <div className="flex flex-col items-center pt-8 pb-12 px-6">
        <p className="text-[0.6rem] tracking-[0.5em] uppercase text-ink/40 mb-4">Collection</p>
        <h1
          className="font-merch font-light text-ink leading-none text-center"
          style={{ fontSize: 'clamp(3.5rem, 22vw, 5rem)', letterSpacing: '0.08em' }}
        >
          MERCH
        </h1>
        <div className="h-px w-10 bg-ink/20 my-6" />
        <button
          type="button"
          onClick={onVisit}
          className="cursor-pointer inline-flex items-center gap-3 px-8 py-3 rounded-full border border-ink/30 text-ink text-xs tracking-[0.4em] uppercase transition-colors duration-200 focus:outline-none"
        >
          Visit Store
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

export function MerchIntro({ onVisit }: { onVisit: () => void }) {
  const isMobile = useMobile()

  if (isMobile) {
    return <MobileHero onVisit={onVisit} />
  }

  return (
    <SmoothScrollHero
      centerImage={CENTER_IMAGE}
      centerImagePosition="73% 5%"
      parallaxImages={[]}
      bgColor="#EADFCC"
      sectionHeight={900}
      parallaxPaddingTop={0}
      keepImageVisible
    >
      <p className="text-[0.65rem] tracking-[0.5em] uppercase mb-6 text-white/70">Collection</p>
      <h1
        className="font-merch font-light text-white leading-none mb-10 text-center drop-shadow-lg"
        style={{ fontSize: 'clamp(5rem, 18vw, 12rem)', letterSpacing: '0.08em' }}
      >
        MERCH
      </h1>
      <div className="h-px w-10 mb-10 bg-white/50" />
      <button
        type="button"
        onClick={onVisit}
        className="cursor-pointer inline-flex items-center gap-3 px-10 py-3 rounded-full border border-white/50 text-white text-xs tracking-[0.4em] uppercase transition-colors duration-200 hover:bg-white hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Visit Store
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </button>
    </SmoothScrollHero>
  )
}
