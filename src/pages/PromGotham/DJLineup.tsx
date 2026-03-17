import { motion } from 'framer-motion'

export function DJLineup() {
  const placeholders = ['DJ 1', 'DJ 2', 'DJ 3']
  return (
    <section className="py-24 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-gotham-purple/50 text-xs tracking-[0.4em] uppercase mb-3">Musique</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">DJ Lineup</h2>
          <p className="text-white/30 text-sm mt-2">Line-up à confirmer prochainement</p>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {placeholders.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="shrink-0 w-52 h-64 glass rounded-2xl flex flex-col justify-end p-5"
              style={{
                background: `radial-gradient(circle at 50% 0%, rgba(${i === 0 ? '0,212,255' : i === 1 ? '139,92,246' : '0,212,255'},0.08) 0%, transparent 70%)`,
              }}
            >
              <div className="w-8 h-1 rounded-full mb-3" style={{ background: i % 2 === 0 ? '#00D4FF' : '#8B5CF6' }} />
              <p className="text-white/60 text-sm font-medium">{name}</p>
              <p className="text-white/25 text-xs mt-1">Annoncé bientôt</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
