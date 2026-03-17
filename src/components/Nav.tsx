import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ROUTES = [
  { label: 'Accueil', path: '/' },
  {
    label: 'Prom Night',
    sub: [
      { label: 'Restaurant — Porta Nova', path: '/prom/restaurant' },
      { label: 'Gotham', path: '/prom/gotham' },
    ],
  },
  { label: 'LMRL Merch', path: '/merch' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [promExpanded, setPromExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function go(path: string) {
    setOpen(false)
    setPromExpanded(false)
    navigate(path)
  }

  // Determine text/icon color based on current route
  const isDark =
    location.pathname.startsWith('/prom') || location.pathname === '/merch'

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className={`fixed top-5 right-5 z-50 flex flex-col gap-[5px] p-2 rounded-md transition-colors
          ${isDark ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-black/5'}`}
      >
        <span className="block w-6 h-[2px] bg-current rounded-full" />
        <span className="block w-6 h-[2px] bg-current rounded-full" />
        <span className="block w-6 h-[2px] bg-current rounded-full" />
      </button>

      {/* Full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm flex flex-col items-center justify-center"
            onClick={() => { setOpen(false); setPromExpanded(false) }}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false); setPromExpanded(false) }}
              aria-label="Close navigation"
              className="absolute top-5 right-5 text-white/70 hover:text-white text-3xl font-light transition-colors leading-none"
            >
              ×
            </button>

            <nav
              className="flex flex-col items-center gap-2 w-full px-8"
              onClick={e => e.stopPropagation()}
            >
              {ROUTES.map(route => {
                if (route.sub) {
                  return (
                    <div key={route.label} className="flex flex-col items-center w-full">
                      <button
                        onClick={() => setPromExpanded(v => !v)}
                        className="text-white/90 hover:text-white text-4xl md:text-5xl font-bold tracking-tight py-3 transition-colors flex items-center gap-3"
                      >
                        {route.label}
                        <span
                          className={`text-2xl transition-transform duration-200 ${promExpanded ? 'rotate-180' : ''}`}
                          style={{ display: 'inline-block' }}
                        >
                          ˅
                        </span>
                      </button>
                      <AnimatePresence>
                        {promExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden flex flex-col items-center gap-1"
                          >
                            {route.sub.map(sub => (
                              <button
                                key={sub.path}
                                onClick={() => go(sub.path)}
                                className="text-white/60 hover:text-white text-xl md:text-2xl font-medium tracking-wide py-2 px-6 transition-colors"
                              >
                                {sub.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                }
                return (
                  <button
                    key={route.path}
                    onClick={() => go(route.path!)}
                    className="text-white/90 hover:text-white text-4xl md:text-5xl font-bold tracking-tight py-3 transition-colors"
                  >
                    {route.label}
                  </button>
                )
              })}
            </nav>

            {/* Footer */}
            <p className="absolute bottom-8 text-white/25 text-xs tracking-widest uppercase">
              Primaner vum Michel Rodange
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
