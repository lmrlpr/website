import { motion } from 'framer-motion'

function ClockIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> }
function PinIcon()     { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function IdCardIcon()  { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h2"/></svg> }

const items = [
  { icon: <ClockIcon />,   label: 'Horaires',       value: '00h – 06h',                                  accent: '#00D4FF' },
  { icon: <PinIcon />,     label: 'Adresse',        value: '14 Av. de la Faïencerie, 1510 Limpertsberg', accent: '#8B5CF6', link: 'https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Luxembourg' },
  { icon: <IdCardIcon />,  label: 'Identification', value: "Carte d'identité obligatoire à l'entrée",    accent: '#00D4FF' },
]

export function PracticalInfo() {
  return (
    <section id="info" className="py-24 px-6 md:px-10 relative">

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p className="text-gotham-blue/70 text-xs tracking-[0.5em] uppercase mb-3 font-medium">À savoir</p>
          <h2 className="font-display text-3xl md:text-5xl text-white" style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>Infos pratiques</h2>
          <div className="mt-3 w-16 h-px bg-gradient-to-r from-gotham-blue/60 to-transparent" />
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group rounded-xl px-5 py-4 flex gap-4 items-start transition-all duration-200 cursor-default"
              style={{
                background: 'rgba(10,10,15,0.6)',
                border: `1px solid ${item.accent}12`,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${item.accent}30`
                ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${item.accent}06`
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = `${item.accent}12`
                ;(e.currentTarget as HTMLElement).style.boxShadow = ''
              }}
            >
              {/* Icon with neon accent */}
              <span
                className="shrink-0 mt-0.5 transition-all duration-200"
                style={{ color: `${item.accent}70` }}
              >
                {item.icon}
              </span>

              <div className="min-w-0">
                <p
                  className="text-xs tracking-[0.35em] uppercase mb-1"
                  style={{ color: `${item.accent}50` }}
                >
                  {item.label}
                </p>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200 underline underline-offset-4 break-words"
                    style={{ color: 'rgba(255,255,255,0.75)', textDecorationColor: `${item.accent}40` }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = item.accent}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)'}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-white/75 text-sm break-words">{item.value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
