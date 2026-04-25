import { motion } from 'framer-motion'

const BASE = import.meta.env.BASE_URL

interface PrimanerCardProps {
  onClick: () => void
}

export function PrimanerCard({ onClick }: PrimanerCardProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left cursor-pointer"
      aria-label="Ouvrir la section Primaner exclusive"
    >
      {/* Image area — same 3:4 ratio as ProductCard */}
      <div
        className="relative overflow-hidden mb-4"
        style={{ aspectRatio: '3/4', borderRadius: '3px' }}
      >
        {/* Blurred background photo */}
        <img
          src={`${BASE}merch/Tabea_zoe_main_PRIMANER.webp`}
          alt="Collection exclusive Primaner"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(14px) brightness(0.45) saturate(0.3)',
            transform: 'scale(1.12)',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0A0808]/30" />

        {/* Hover shimmer */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)',
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
          {/* Animated lock */}
          <div className="relative">
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
                width: '72px',
                height: '72px',
                left: '-12px',
                top: '-12px',
              }}
            />
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="relative flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm group-hover:border-white/40 transition-colors duration-300"
            >
              <motion.svg
                animate={{ rotate: [0, -10, 10, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 118 0v4" />
              </motion.svg>
            </motion.div>
          </div>

          {/* Text */}
          <div className="text-center">
            <p className="text-white/50 text-[0.55rem] tracking-[0.45em] uppercase mb-1">
              Accès réservé
            </p>
            <p
              className="text-white text-sm tracking-[0.15em] uppercase font-medium"
              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
            >
              Collection Privée
            </p>
          </div>

          {/* Unlock hint on hover */}
          <motion.span
            initial={false}
            className="text-[0.6rem] tracking-[0.3em] uppercase text-white/70 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Voir
          </motion.span>
        </div>

        {/* Bottom gradient fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(10,8,8,0.6) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Product info below card */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="font-merch font-normal text-ink leading-tight"
            style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', letterSpacing: '0.03em' }}
          >
            Édition Primaner
          </p>
          <p className="text-[0.7rem] text-ink/40 mt-1 tracking-[0.05em] leading-snug">
            T-Shirt & Crewneck — Accès exclusif
          </p>
        </div>
        <p
          className="text-sm font-medium text-ink/30 shrink-0 mt-0.5"
          style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', letterSpacing: '0.06em' }}
        >
          — €
        </p>
      </div>
    </button>
  )
}
