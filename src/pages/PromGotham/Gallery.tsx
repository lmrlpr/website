import { motion } from 'framer-motion'

const CELLS = [
  { col: 'col-span-2',    h: 'h-40 sm:h-64', hue: '#00D4FF', angle: 135, delay: 0 },
  { col: 'col-span-1',    h: 'h-40 sm:h-64', hue: '#8B5CF6', angle: 45,  delay: 0.06 },
  { col: 'col-span-1',    h: 'h-32 sm:h-48', hue: '#8B5CF6', angle: 225, delay: 0.12 },
  { col: 'col-span-1',    h: 'h-32 sm:h-48', hue: '#00D4FF', angle: 315, delay: 0.18 },
  { col: 'col-span-1',    h: 'h-32 sm:h-48', hue: '#8B5CF6', angle: 90,  delay: 0.24 },
]

// Abstract noise-like patterns per cell
function CellPattern({ hue, index }: { hue: string; index: number }) {
  const lines = 6
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`cellGrad${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={hue} stopOpacity="0.4" />
          <stop offset="100%" stopColor={hue} stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: lines }).map((_, i) => (
        <line
          key={i}
          x1={i * (200 / lines)}
          y1="0"
          x2={i * (200 / lines) + 60}
          y2="200"
          stroke={hue}
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
      ))}
      <circle cx="100" cy="100" r="60" stroke={hue} strokeWidth="0.5" strokeOpacity="0.2" fill="none" strokeDasharray="6 4" />
      <circle cx="100" cy="100" r="30" stroke={hue} strokeWidth="0.5" strokeOpacity="0.15" fill="none" />
    </svg>
  )
}

export function Gallery() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 relative">

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-gotham-rose/70 text-xs tracking-[0.5em] uppercase mb-3 font-medium">Galerie</p>
          <h2 className="font-display text-3xl md:text-5xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>Fotoen & Videoen</h2>
          <div className="mt-3 w-16 h-px bg-gradient-to-r from-gotham-rose/60 to-transparent" />
          <p className="text-white/30 text-sm mt-3">Teaser geschwënn</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CELLS.map((cell, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              transition={{ delay: cell.delay, duration: 0.5 }}
              className={`${cell.col} ${cell.h} rounded-xl relative overflow-hidden cursor-pointer group`}
              style={{
                background: `linear-gradient(${cell.angle}deg, rgba(10,10,15,0.9) 0%, ${cell.hue}08 100%)`,
                border: `1px solid ${cell.hue}12`,
              }}
            >
              <CellPattern hue={cell.hue} index={i} />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 50%, ${cell.hue}08 0%, transparent 70%)` }}
              />

              {/* Corner brackets on hover */}
              <div className="absolute top-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ borderTop: `1px solid ${cell.hue}70`, borderLeft: `1px solid ${cell.hue}70` }} />
              <div className="absolute bottom-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ borderBottom: `1px solid ${cell.hue}70`, borderRight: `1px solid ${cell.hue}70` }} />

              {/* Label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-xs uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: cell.hue }}
                >
                  Geschwënn
                </p>
                <p
                  className="absolute text-xs uppercase tracking-[0.3em] opacity-20 group-hover:opacity-0 transition-opacity duration-200"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  ···
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
