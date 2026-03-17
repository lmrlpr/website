import { useState } from 'react'
import type { Product } from '../../types/product'
import { COLOR_MAP } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatCurrency'
import { ProductModal } from './ProductModal'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div
        className="group cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        {/* Image placeholder */}
        <div className="relative aspect-square bg-gray-100 rounded-sm overflow-hidden mb-4">
          {/* Color preview dots */}
          <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-white/50 shadow-sm"
                style={{ backgroundColor: COLOR_MAP[color] }}
              />
            ))}
          </div>

          {/* Product silhouette placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-300 text-xs uppercase tracking-[0.2em] font-medium">{product.name}</p>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-300 flex items-end justify-center pb-4">
            <span className="text-xs font-medium tracking-wider uppercase text-ink/0 group-hover:text-ink/70 transition-colors duration-300 bg-white px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              Voir les options
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-ink">{product.name}</p>
            {product.description && (
              <p className="text-xs text-gray-400 mt-0.5">{product.description}</p>
            )}
          </div>
          <p className="text-sm font-medium text-ink shrink-0">
            {product.price !== null ? formatCurrency(product.price) : 'TBD'}
          </p>
        </div>
      </div>

      <ProductModal
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
