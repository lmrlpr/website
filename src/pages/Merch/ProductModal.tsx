import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductColor, ProductSize } from '../../types/product'
import { COLOR_MAP, PRODUCT_SIZES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'

interface ProductModalProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addToCart, openCart } = useCart()

  const handleAdd = () => {
    if (!product.price) return
    if (product.sizes && !selectedSize) return
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: selectedColor,
      size: selectedSize ?? undefined,
      quantity,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
      openCart()
    }, 800)
  }

  const canAdd = product.price !== null && (!product.sizes || selectedSize !== null)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-xl z-50 bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="md:w-56 aspect-square bg-gray-100 flex items-center justify-center shrink-0">
                <p className="text-gray-300 text-xs uppercase tracking-[0.2em]">{product.name}</p>
              </div>

              {/* Details */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-ink">{product.name}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">LMRL Primaner</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-ink transition-colors ml-2 mt-0.5">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-xl font-bold text-ink mb-5">
                  {product.price !== null ? formatCurrency(product.price) : 'Prix à définir'}
                </p>

                {/* Colors */}
                <div className="mb-4">
                  <p className="text-xs tracking-widest uppercase text-gray-400 mb-2.5">
                    Couleur — <span className="text-ink normal-case tracking-normal">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-7 h-7 rounded-full transition-all duration-200 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105'}`}
                        style={{ backgroundColor: COLOR_MAP[color] }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                {product.sizes && (
                  <div className="mb-5">
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-2.5">Taille</p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRODUCT_SIZES.filter(s => product.sizes!.includes(s)).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${selectedSize === size ? 'bg-ink text-white border-ink' : 'bg-transparent text-ink border-gray-200 hover:border-ink'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-xs tracking-widest uppercase text-gray-400">Qté</p>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-ink hover:bg-gray-50 transition-colors text-sm">−</button>
                    <span className="px-3 py-1.5 text-sm font-medium text-ink min-w-[2.5rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1.5 text-ink hover:bg-gray-50 transition-colors text-sm">+</button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!canAdd || added}
                  className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    added
                      ? 'bg-green-600 text-white'
                      : canAdd
                        ? 'bg-ink text-white hover:bg-ink/80'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {added ? '✓ Ajouté au panier' : product.price === null ? 'Prix à confirmer' : !product.sizes || selectedSize ? 'Ajouter au panier' : 'Choisir une taille'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
