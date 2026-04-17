import { useState } from 'react'
import type { Product } from '../../types/product'
import { COLOR_MAP, getHeroImage } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatCurrency'
import { SILHOUETTE_MAP } from './Silhouettes'
import { ProductView } from './ProductView'

const BASE = import.meta.env.BASE_URL

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const heroImage = product.heroImage ?? getHeroImage(product.id)
  const Silhouette = SILHOUETTE_MAP[product.category] ?? SILHOUETTE_MAP['t-shirt']

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setModalOpen(true)}>
        {/* Image area */}
        <div
          className="relative overflow-hidden mb-4"
          style={{
            aspectRatio: '3/4',
            background: 'linear-gradient(145deg, #F0E3CC 0%, #E8D8BB 100%)',
            borderRadius: '3px',
          }}
        >
          {heroImage ? (
            <img
              src={`${BASE}${heroImage.replace(/^\//, '')}`}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            /* SVG silhouette fallback */
            <div
              className="absolute inset-0 flex items-center justify-center p-10"
              style={{ color: '#3D2410', opacity: 0.28 }}
            >
              <Silhouette />
            </div>
          )}

          {/* Color dots on hover */}
          <div className="absolute top-3 right-3 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {product.colors.slice(0, 4).map((color) => (
              <div
                key={color}
                className="w-2.5 h-2.5 rounded-full border border-white/60 shadow-sm"
                style={{ backgroundColor: COLOR_MAP[color] }}
              />
            ))}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/20 flex items-end justify-center pb-5">
            <span
              className="text-[0.6rem] tracking-[0.35em] uppercase text-ink/0 group-hover:text-white transition-all duration-300 bg-black/30 px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            >
              Voir les options
            </span>
          </div>
        </div>

        {/* Product info */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className="font-merch font-normal text-ink leading-tight"
              style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.3rem)', letterSpacing: '0.03em' }}
            >
              {product.name}
            </p>
            {product.description && (
              <p className="text-[0.7rem] text-ink/40 mt-1 tracking-[0.05em] leading-snug">
                {product.description}
              </p>
            )}
          </div>
          <p
            className="text-sm font-medium text-ink shrink-0 mt-0.5"
            style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', letterSpacing: '0.06em' }}
          >
            {product.price !== null ? formatCurrency(product.price) : 'TBD'}
          </p>
        </div>
      </div>

      <ProductView
        product={product}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
