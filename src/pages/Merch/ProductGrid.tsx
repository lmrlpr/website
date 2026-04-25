import { useState } from 'react'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../../utils/constants'
import { ProductCard } from './ProductCard'
import { HoodieFamilyCard } from './HoodieFamilyCard'
import { PrimanerCard } from './PrimanerCard'
import { PrimanerModal } from './PrimanerModal'

// Crewneck gets the grouped family card (has photoshoot photos); others are individual
const HOODIE_FAMILY = new Set(['crewneck'])

// All other products shown as individual cards
const SOLO_PRODUCTS = PRODUCTS.filter(p => !HOODIE_FAMILY.has(p.id))

export function ProductGrid() {
  const [primanerOpen, setPrimanerOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">

        {/* Hoodie family — one grouped card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: 0, duration: 0.5 }}
        >
          <HoodieFamilyCard />
        </motion.div>

        {/* Individual products (T-Shirt, Tote Bag, …) */}
        {SOLO_PRODUCTS.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i + 1) * 0.07, duration: 0.5 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}

        {/* Primaner exclusive — locked teaser card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: (SOLO_PRODUCTS.length + 1) * 0.07, duration: 0.5 }}
        >
          <PrimanerCard onClick={() => setPrimanerOpen(true)} />
        </motion.div>

      </div>

      <PrimanerModal isOpen={primanerOpen} onClose={() => setPrimanerOpen(false)} />
    </div>
  )
}
