import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const events = [
  {
    id: 'prom',
    category: 'Soirée',
    title: 'Prom Night 2025',
    description: 'Dîner à Porta Nova suivi d\'une soirée au Gotham. Une nuit inoubliable pour les Primaner LMRL.',
    detail: '14 Av. de la Faïencerie · Limpertsberg',
    links: [
      { label: 'Restaurant', to: '/prom/restaurant' },
      { label: 'Gotham', to: '/prom/gotham' },
    ],
    accent: '#1C1410',
    textColor: 'text-white',
  },
  {
    id: 'merch',
    category: 'Boutique',
    title: 'LMRL Merch',
    description: 'Hoodies, crewnecks, t-shirts et plus — aux couleurs du comité Primaner Michel Rodange.',
    detail: 'Collection disponible en ligne',
    links: [
      { label: 'Voir la boutique', to: '/merch' },
    ],
    accent: '#F8F7F4',
    textColor: 'text-ink',
  },
]

export function EventCards() {
  return (
    <section className="bg-parchment py-24 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-gray-400 mb-3">À venir</p>
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">Événements</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="group rounded-3xl overflow-hidden"
              style={{ backgroundColor: event.accent }}
            >
              {/* Image placeholder */}
              <div
                className="h-48 w-full opacity-20"
                style={{
                  background: event.id === 'prom'
                    ? 'linear-gradient(135deg, #D4A853 0%, #8B6914 100%)'
                    : 'linear-gradient(135deg, #C41E3A 0%, #1A1A1A 100%)',
                }}
              />
              <div className="p-8">
                <p className={`text-xs tracking-[0.35em] uppercase font-medium mb-3 ${event.textColor} opacity-50`}>
                  {event.category}
                </p>
                <h3 className={`text-2xl font-bold tracking-tight mb-3 ${event.textColor}`}>
                  {event.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${event.textColor} opacity-60`}>
                  {event.description}
                </p>
                <p className={`text-xs mb-8 ${event.textColor} opacity-40`}>{event.detail}</p>
                <div className="flex flex-wrap gap-3">
                  {event.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 ${
                        event.id === 'prom'
                          ? 'border border-white/20 text-white hover:bg-white/10'
                          : 'border border-ink/20 text-ink hover:bg-ink hover:text-white'
                      }`}
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
