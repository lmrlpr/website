import { motion } from 'framer-motion'

export function Gallery() {
  const placeholders = [
    { span: 'col-span-2', h: 'h-64' },
    { span: 'col-span-1', h: 'h-64' },
    { span: 'col-span-1', h: 'h-48' },
    { span: 'col-span-1', h: 'h-48' },
    { span: 'col-span-1', h: 'h-48' },
  ]

  return (
    <section className="py-24 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-gotham-purple/50 text-xs tracking-[0.4em] uppercase mb-3">Galerie</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Photos & Vidéos</h2>
          <p className="text-white/30 text-sm mt-2">Teaser à venir</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-2">
          {placeholders.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`${p.span} ${p.h} rounded-xl glass flex items-center justify-center`}
              style={{
                background: `linear-gradient(135deg, rgba(${i % 2 === 0 ? '0,212,255' : '139,92,246'},0.05) 0%, transparent 100%)`,
              }}
            >
              <p className="text-white/20 text-xs uppercase tracking-widest">Bientôt</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
