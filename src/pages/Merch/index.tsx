import { motion } from 'framer-motion'
import { ProductGrid } from './ProductGrid'
import { CartDrawer } from './CartDrawer'
import { Footer } from '../../components/layout/Footer'

export default function Merch() {
  return (
    <div className="bg-white min-h-screen">
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
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{6} produits</p>
          <p className="text-xs text-gray-400 hidden md:block">
            Code promo Primaner: <span className="font-mono font-medium text-ink">PRIMANER2025</span>
          </p>
        </div>
      </div>

      <ProductGrid />
      <CartDrawer />
      <Footer />
    </div>
  )
}
