import { motion } from 'framer-motion'

const items = [
  { icon: '🕛', label: 'Horaires', value: '00h – 06h' },
  { icon: '👔', label: 'Dress code', value: 'Smart casual — Pas de survêtement' },
  { icon: '🧥', label: 'Vestiaire', value: 'Disponible sur place' },
  { icon: '📍', label: 'Adresse', value: '14 Av. de la Faïencerie, 1510 Limpertsberg', link: 'https://maps.google.com/?q=14+Avenue+de+la+Faïencerie+1510+Luxembourg' },
  { icon: '🪪', label: 'Identification', value: 'Carte d\'identité obligatoire à l\'entrée' },
  { icon: '🍹', label: 'All you can drink', value: 'Longdrinks & cocktails inclus avec le bracelet' },
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
              <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
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
