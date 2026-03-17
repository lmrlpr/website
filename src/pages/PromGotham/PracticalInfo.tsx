import { motion } from 'framer-motion'

function ClockIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function ShirtIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  )
}
function HangerIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20.59 19H3.41a2 2 0 01-1.55-3.27L12 6l10.14 9.73A2 2 0 0120.59 19z"/>
      <path d="M12 6V3a1 1 0 10-2 0"/>
    </svg>
  )
}
function PinIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  )
}
function IdCardIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/>
      <path d="M14 10h4M14 14h2"/>
    </svg>
  )
}
function GlassIcon() {
  return (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M8 22h8M12 22v-7M5 2l2 7h10l2-7H5zM7 9c0 2.76 2.24 6 5 6s5-3.24 5-6"/>
    </svg>
  )
}

const items = [
  { icon: <ClockIcon />, label: 'Horaires', value: '00h – 06h' },
  { icon: <ShirtIcon />, label: 'Dress code', value: 'Smart casual — Pas de survêtement' },
  { icon: <HangerIcon />, label: 'Vestiaire', value: 'Disponible sur place' },
  { icon: <PinIcon />, label: 'Adresse', value: '14 Av. de la Faïencerie, 1510 Limpertsberg', link: 'https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Luxembourg' },
  { icon: <IdCardIcon />, label: 'Identification', value: "Carte d'identité obligatoire à l'entrée" },
  { icon: <GlassIcon />, label: 'All you can drink', value: 'Longdrinks & cocktails inclus avec le bracelet' },
]

export function PracticalInfo() {
  return (
    <section id="info" className="py-24 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-gotham-blue/50 text-xs tracking-[0.4em] uppercase mb-3">À savoir</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Infos pratiques</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="glass rounded-2xl px-5 py-4 flex gap-4 items-start"
            >
              <span className="text-gotham-blue/60 shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-1">{item.label}</p>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-white/80 text-sm hover:text-gotham-blue transition-colors underline underline-offset-4">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white/80 text-sm">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
