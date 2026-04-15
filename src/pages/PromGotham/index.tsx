import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GothamHero } from './Hero'
import { TicketOptions } from './TicketOptions'
import { DJLineup } from './DJLineup'
import { PracticalInfo } from './PracticalInfo'
import { Gallery } from './Gallery'
import { Footer } from '../../components/layout/Footer'
import { BackgroundPaths } from '../../components/ui/background-paths'

export default function PromGotham() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  // Violet bloom: present from top, strengthens through middle
  const violetOpacity = useTransform(scrollYProgress, [0, 0.22, 0.45, 0.62], [0.35, 0.42, 0.55, 0.32])
  // Rose/pink bloom: fades in through gallery and info
  const roseOpacity   = useTransform(scrollYProgress, [0.28, 0.48, 0.72, 1], [0.18, 0.38, 0.48, 0.55])
  // Warm cyan highlight: stronger across footer area
  const cyanOpacity   = useTransform(scrollYProgress, [0.55, 0.72, 0.88, 1], [0.12, 0.24, 0.32, 0.40])

  return (
    <div ref={containerRef} className="relative min-h-screen" style={{ background: '#0F0B20' }}>

      {/* ── Base ambient wash — persistent violet/navy radial so page never feels flat ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse 120% 90% at 50% 40%, rgba(76,29,149,0.35) 0%, rgba(30,15,60,0.2) 45%, transparent 80%)',
        }}
      />

      {/* ── Fixed background paths + scanlines — cover the full page ── */}
      <div className="fixed inset-0 pointer-events-none scanlines" style={{ zIndex: 0 }}>
        <BackgroundPaths />
      </div>

      {/* ── Scroll-driven color overlays ── */}
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
      {/* Rose/pink bloom */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          opacity: roseOpacity,
          background: 'radial-gradient(ellipse 100% 80% at 75% 65%, rgba(251,113,133,1) 0%, rgba(225,29,72,0.55) 40%, transparent 75%)',
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
