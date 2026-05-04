import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GothamHero } from './Hero'
import { TicketOptions } from './TicketOptions'
import { DJLineup } from './DJLineup'
import { PracticalInfo } from './PracticalInfo'
import { Gallery } from './Gallery'
import { Footer } from '../../components/layout/Footer'
import { BackgroundPaths } from '../../components/ui/background-paths'

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth <= 768

export default function PromGotham() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Scroll-driven opacity transforms — only computed on desktop
  const violetOpacity = useTransform(scrollYProgress, [0, 0.22, 0.45, 0.62], [0.35, 0.42, 0.55, 0.32])
  const roseOpacity   = useTransform(scrollYProgress, [0.28, 0.48, 0.72, 1], [0.18, 0.38, 0.48, 0.55])
  const cyanOpacity   = useTransform(scrollYProgress, [0.55, 0.72, 0.88, 1], [0.12, 0.24, 0.32, 0.40])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden" style={{ background: '#100812' }}>

      {/* ── Base ambient wash — persistent violet/navy radial so page never feels flat ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse 120% 90% at 50% 40%, rgba(76,29,149,0.28) 0%, rgba(50,10,20,0.22) 45%, transparent 80%)',
        }}
      />

      {/* ── Fixed background paths + scanlines — cover the full page ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden scanlines" style={{ zIndex: 0 }}>
        <BackgroundPaths />
      </div>

      {/* ── Color overlays — scroll-driven on desktop, static on mobile ── */}
      {IS_MOBILE ? (
        <>
          {/* Violet bloom — static, no blur */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: 0.38,
              background: 'radial-gradient(ellipse 100% 80% at 25% 55%, rgba(167,139,250,1) 0%, rgba(124,58,237,0.55) 40%, transparent 75%)',
            }}
          />
          {/* Crimson bloom — static, no blur */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: 0.32,
              background: 'radial-gradient(ellipse 90% 75% at 78% 45%, rgba(200,25,25,1) 0%, rgba(140,12,12,0.55) 40%, transparent 72%)',
            }}
          />
          {/* Cyan accent — static, no blur */}
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: 0.22,
              background: 'radial-gradient(ellipse 80% 50% at 50% 85%, rgba(34,211,238,1) 0%, transparent 70%)',
            }}
          />
        </>
      ) : (
        <>
          {/* Violet bloom */}
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: violetOpacity,
              background: 'radial-gradient(ellipse 100% 80% at 25% 55%, rgba(167,139,250,1) 0%, rgba(124,58,237,0.55) 40%, transparent 75%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Crimson bloom */}
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: roseOpacity,
              background: 'radial-gradient(ellipse 90% 75% at 78% 45%, rgba(200,25,25,1) 0%, rgba(140,12,12,0.55) 40%, transparent 72%)',
              filter: 'blur(40px)',
            }}
          />
          {/* Cyan accent at bottom */}
          <motion.div
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 1,
              opacity: cyanOpacity,
              background: 'radial-gradient(ellipse 80% 50% at 50% 85%, rgba(34,211,238,1) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </>
      )}

      {/* ── Page content above overlays ── */}
      <div className="relative" style={{ zIndex: 2 }}>
        <GothamHero />
        <TicketOptions />
        <DJLineup />
        <Gallery />
        <PracticalInfo />
        <div className="[&_*]:!text-white/30 [&_p]:!text-white/30 [&_a]:!text-white/40">
          <Footer />
        </div>
      </div>
    </div>
  )
}
