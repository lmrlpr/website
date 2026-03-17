import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface NavOverlayProps {
  open: boolean
  onClose: () => void
}

export function NavOverlay({ open, onClose }: NavOverlayProps) {
  const [promOpen, setPromOpen] = useState(false)
  const location = useLocation()

  const handleLink = () => {
    onClose()
    setPromOpen(false)
  }

  const navItems = [
    { label: 'Accueil', to: '/' },
    {
      label: 'Prom Night',
      sub: [
        { label: 'Restaurant — Porta Nova', to: '/prom/restaurant' },
        { label: 'Gotham', to: '/prom/gotham' },
      ],
    },
    { label: 'LMRL Merch', to: '/merch' },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-ink flex flex-col justify-center px-10 md:px-20"
        >
          <nav className="flex flex-col gap-2">
            {navItems.map((item, i) =>
              item.sub ? (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <button
                    onClick={() => setPromOpen(!promOpen)}
                    className="flex items-center gap-3 text-white/80 hover:text-white transition-colors text-4xl md:text-6xl font-semibold tracking-tight text-left w-full"
                  >
                    {item.label}
                    <motion.span
                      animate={{ rotate: promOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-2xl md:text-3xl opacity-60"
                    >
                      ↓
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {promOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden pl-4 mt-1 flex flex-col gap-1"
                      >
                        {item.sub.map((sub) => (
                          <Link
                            key={sub.to}
                            to={sub.to}
                            onClick={handleLink}
                            className={`block text-xl md:text-2xl font-medium py-1 transition-colors ${location.pathname === sub.to ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link
                    to={item.to!}
                    onClick={handleLink}
                    className={`block text-4xl md:text-6xl font-semibold tracking-tight transition-colors ${location.pathname === item.to ? 'text-white' : 'text-white/70 hover:text-white'}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          <div className="absolute bottom-10 left-10 md:left-20 text-white/30 text-sm tracking-widest uppercase">
            Primaner vum Michel Rodange
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
