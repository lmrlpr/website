import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductGrid } from './ProductGrid'
import { CartDrawer } from './CartDrawer'
import { Footer } from '../../components/layout/Footer'
import { useCart } from '../../context/CartContext'

export default function Merch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { clearCart } = useCart()
  const [banner, setBanner] = useState<{ type: 'success' | 'cancelled'; message: string } | null>(null)

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
    <div className="bg-white min-h-screen">
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

      {/* Header */}
      <div className="pt-32 pb-12 px-6 md:px-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.5em] uppercase text-gray-300 mb-4">Collection</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl md:text-6xl font-bold text-ink tracking-tight">LMRL Merch</h1>
            <p className="text-sm text-gray-400 hidden md:block">
              Primaner vum Michel Rodange
            </p>
          </div>
          <div className="h-px bg-gray-100 mt-8" />
        </motion.div>
      </div>

      {/* Filter bar */}
      <div className="px-6 md:px-10 max-w-6xl mx-auto mb-6">
        <p className="text-xs text-gray-400">{6} produits</p>
      </div>

      <ProductGrid />
      <CartDrawer />
      <Footer />
    </div>
  )
}
