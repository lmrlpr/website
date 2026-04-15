import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ReactLenis, useLenis } from 'lenis/react'
import { ProductGrid } from './ProductGrid'
import { CartDrawer } from './CartDrawer'
import { Footer } from '../../components/layout/Footer'
import { useCart } from '../../context/CartContext'
import { MerchIntro } from './MerchIntro'
import { MerchAlbum } from './MerchAlbum'
import { PRODUCTS } from '../../utils/constants'

export default function Merch() {
  return (
    <ReactLenis root>
      <MerchInner />
    </ReactLenis>
  )
}

function MerchInner() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [banner, setBanner] = useState<{ type: 'success' | 'cancelled'; message: string } | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const scrollToGrid = () => {
    if (gridRef.current) {
      lenis?.scrollTo(gridRef.current, { offset: 0 })
    }
  }

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      setBanner({ type: 'success', message: 'Commande confirmée ! Merci pour votre achat.' })
      clearCart()
      setSearchParams({}, { replace: true })
    } else if (searchParams.get('cancelled') === '1') {
      setBanner({ type: 'cancelled', message: 'Paiement annulé. Votre panier est toujours disponible.' })
      setSearchParams({}, { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Stripe return banner */}
      <AnimatePresence>
        {banner && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-xl shadow-lg text-sm font-medium ${
              banner.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <span>{banner.message}</span>
              <button onClick={() => setBanner(null)} className="text-current opacity-50 hover:opacity-100">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic scroll intro */}
      <MerchIntro onVisit={scrollToGrid} />

      {/* Product grid section — warm gradient */}
      <div ref={gridRef} style={{ background: 'linear-gradient(to bottom, #EADFCC 0%, #F5CAA0 24%, #FFF0A8 54%, #FFFFFF 100%)' }}>
        {/* Header */}
        <div className="pt-20 pb-12 px-6 md:px-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[0.6rem] tracking-[0.5em] uppercase text-ink/40 mb-6">Collection</p>
            <div className="flex items-end justify-between">
              <h1
                className="font-merch font-light text-ink leading-none"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', letterSpacing: '0.06em' }}
              >
                LMRL Merch
              </h1>
              <p className="text-xs text-ink/40 hidden md:block tracking-[0.15em]">
                Primaner vum Michel Rodange
              </p>
            </div>
            <div className="h-px bg-ink/10 mt-8" />
          </motion.div>
        </div>

        {/* Filter bar */}
        <div className="px-6 md:px-10 max-w-6xl mx-auto mb-6">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase text-ink/40">{PRODUCTS.length} produits</p>
        </div>

        <ProductGrid />
        <MerchAlbum />
        <CartDrawer />
        <Footer />
      </div>
    </div>
  )
}
