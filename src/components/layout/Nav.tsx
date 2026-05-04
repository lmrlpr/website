import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NavOverlay } from './NavOverlay'
import { useCart } from '../../context/CartContext'
import { useScrollLock } from '../../hooks/useScrollLock'

export function Nav() {
  const [open, setOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const { totalItems, openCart } = useCart()
  const location = useLocation()

  useScrollLock(open)

  useEffect(() => {
    const handler = (e: Event) => setPanelOpen((e as CustomEvent<{ open: boolean }>).detail.open)
    window.addEventListener('restaurant-panel', handler)
    return () => window.removeEventListener('restaurant-panel', handler)
  }, [])

  const isLight = location.pathname === '/' || location.pathname === '/merch' || location.pathname === '/prom/restaurant'
  const hideNav = panelOpen && location.pathname === '/prom/restaurant'

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{ pointerEvents: hideNav ? 'none' : 'auto', opacity: hideNav ? 0 : 1, transition: 'opacity 0.25s ease' }}
      >
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
        >
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="LMRL"
            className={`h-9 w-9 rounded-full object-cover flex-shrink-0 ${
              isLight ? '' : 'ring-1 ring-white/20'
            }`}
          />
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isLight ? 'text-ink' : 'text-white'}`}>
            PRIMANER
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Cart button (only on merch page) */}
          {location.pathname === '/merch' && (
            <button
              onClick={openCart}
              className={`relative p-2 ${isLight ? 'text-ink' : 'text-white'} hover:opacity-70 transition-opacity`}
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-ink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>
          )}

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className={`flex flex-col gap-[5px] p-2 ${isLight ? 'text-ink' : 'text-white'} hover:opacity-70 transition-opacity`}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`}
            />
          </button>
        </div>
      </nav>

      <NavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  )
}
