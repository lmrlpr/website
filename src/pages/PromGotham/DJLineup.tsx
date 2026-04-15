import { motion } from 'framer-motion'
import { GlowCard } from '../../components/ui/spotlight-card'

const DJS = [
  { name: 'DJ 1', label: 'Annoncé bientôt', color: 'blue' as const,   accent: '#00D4FF', index: 0 },
  { name: 'DJ 2', label: 'Annoncé bientôt', color: 'purple' as const, accent: '#8B5CF6', index: 1 },
  { name: 'DJ 3', label: 'Annoncé bientôt', color: 'blue' as const,   accent: '#00D4FF', index: 2 },
]

function DJPlaceholder({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[140px]">
      {/* Abstract DJ silhouette */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ opacity: 0.15 }}>
        <circle cx="40" cy="40" r="36" stroke={accent} strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="40" cy="40" r="24" stroke={accent} strokeWidth="1" />
        <circle cx="40" cy="40" r="8" fill={accent} />
        {/* Headphone shape */}
        <path d="M20 40 Q20 20 40 20 Q60 20 60 40" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
        <rect x="14" y="36" width="8" height="14" rx="4" fill={accent} opacity="0.6" />
        <rect x="58" y="36" width="8" height="14" rx="4" fill={accent} opacity="0.6" />
      </svg>
    </div>
  )
}

export function DJLineup() {
  return (
    <section className="py-24 px-6 md:px-10 relative">
      {/* Section divider */}

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="text-gotham-purple/80 text-xs tracking-[0.5em] uppercase mb-3 font-medium">Musique</p>
          <h2 className="font-display text-3xl md:text-5xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>DJ Lineup</h2>
          <div className="mt-3 w-16 h-px bg-gradient-to-r from-gotham-purple/60 to-transparent" />
          <p className="text-white/30 text-sm mt-3">Line-up à confirmer prochainement</p>
        </motion.div>

        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-2">
          {DJS.map((dj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="shrink-0 w-56"
            >
              <GlowCard
                glowColor={dj.color}
                customSize
                width={224}
                height={280}
                className="flex flex-col"
              >
                {/* Top visual area */}
                <div className="flex-1 relative overflow-hidden rounded-xl"
                  style={{ background: `radial-gradient(circle at 50% 30%, ${dj.accent}12 0%, rgba(10,10,15,0.6) 70%)` }}
                >
                  <DJPlaceholder accent={dj.accent} />

                  {/* TBA badge */}
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold tracking-widest"
                    style={{ background: `${dj.accent}18`, color: dj.accent, border: `1px solid ${dj.accent}30` }}
                  >
                    TBA
                  </div>
                </div>

                {/* Info row */}
                <div className="pt-3">
                  <div className="w-8 h-0.5 rounded-full mb-2" style={{ background: dj.accent, boxShadow: `0 0 8px ${dj.accent}` }} />
                  <p className="text-white/70 text-sm font-medium tracking-wide">{dj.name}</p>
                  <p className="text-white/25 text-xs mt-0.5 tracking-wider">{dj.label}</p>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
