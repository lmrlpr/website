import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductColor, ProductSize } from '../../types/product'
import { COLOR_MAP, PRODUCT_SIZES, getProductImages, hasProductImages, getFallbackImage } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'
import { useScrollLock } from '../../hooks/useScrollLock'
import { SILHOUETTE_MAP } from './Silhouettes'

const BASE = import.meta.env.BASE_URL

const CATEGORY_LABELS: Record<string, string> = {
  hoodie:       'Pullover avec capuche',
  crewneck:     'Pullover sans capuche',
  'zip-hoodie': 'Zipper',
  't-shirt':    'T-Shirt',
  'tote-bag':   'Tote Bag',
}

function toUrl(path: string) {
  return `${BASE}${path.replace(/^\//, '')}`
}

interface ProductViewProps {
  product: Product
  open: boolean
  onClose: () => void
}

export function ProductView({ product, open, onClose }: ProductViewProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0])
  const [selectedMotifColor, setSelectedMotifColor] = useState<ProductColor | null>(null)
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)
  const [selectedSide, setSelectedSide] = useState<'front' | 'back'>('front')
  const [photoIdx, setPhotoIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [entretienOpen, setEntretienOpen] = useState(false)
  const { addToCart, openCart } = useCart()

  useScrollLock(open)

  const availableMotifColors = product.motifColors?.[selectedColor] ?? null
  const needsMotifChoice = availableMotifColors !== null && availableMotifColors.length > 1
  const hasDesigns = product.designs && product.designs.length > 1
  const needsDesignChoice = !!hasDesigns

  // --- Photo resolution ---
  const designNum = selectedDesign ?? 1
  const exactPhotos = getProductImages(product.id, selectedColor, designNum, selectedSide)
  const hasExact = exactPhotos.length > 0
  // Fallback: any photo from this product
  const fallbackUrl = getFallbackImage(product.id)
  const isFallback = !hasExact && !!fallbackUrl

  // All photos shown for current view (exact match or empty)
  const visiblePhotos = hasExact ? exactPhotos : (fallbackUrl ? [fallbackUrl] : [])
  const currentPhoto = visiblePhotos[photoIdx] ?? null
  const hasPhoto = !!currentPhoto

  // Whether front/back toggle is meaningful
  const frontPhotos = getProductImages(product.id, selectedColor, designNum, 'front')
  const backPhotos  = getProductImages(product.id, selectedColor, designNum, 'back')
  const showSideToggle = selectedDesign !== null && (frontPhotos.length > 0 || backPhotos.length > 0)

  useEffect(() => {
    setPhotoIdx(0)
  }, [selectedColor, selectedDesign, selectedSide])

  useEffect(() => {
    if (availableMotifColors && availableMotifColors.length === 1) {
      setSelectedMotifColor(availableMotifColors[0])
    } else {
      setSelectedMotifColor(null)
    }
    setSelectedDesign(null)
    setSelectedSide('front')
    setSelectedSize(null)
  }, [selectedColor])

  useEffect(() => {
    if (open) {
      setSelectedColor(product.colors[0])
      setSelectedDesign(null)
      setSelectedSide('front')
      setPhotoIdx(0)
      setSelectedSize(null)
      setQuantity(1)
      setAdded(false)
    }
  }, [open])

  const canAdd = product.price !== null
    && (!product.sizes || selectedSize !== null)
    && (!needsMotifChoice || selectedMotifColor !== null)
    && (!needsDesignChoice || selectedDesign !== null)

  const handleAdd = () => {
    if (!product.price) return
    if (product.sizes && !selectedSize) return
    if (needsMotifChoice && !selectedMotifColor) return
    if (needsDesignChoice && !selectedDesign) return
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: selectedColor,
      motifColor: selectedMotifColor ?? undefined,
      design: selectedDesign && product.designs ? product.designs[selectedDesign - 1] : undefined,
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

  const Silhouette = SILHOUETTE_MAP[product.category] ?? SILHOUETTE_MAP['t-shirt']
  const garmentHex = COLOR_MAP[selectedColor]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40"
          />

          {/* Full-screen panel */}
          <motion.div
            initial={{ x: '4%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '3%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[60] flex flex-col md:flex-row overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Left panel ─────────────────────────────────────────────── */}
            <div
              className="relative h-[38vh] md:h-full md:w-[58%] shrink-0 flex items-center justify-center overflow-hidden"
              style={{ background: 'linear-gradient(145deg, #F2E8D5 0%, #EAD9C0 100%)' }}
            >
              <AnimatePresence mode="wait">
                {hasPhoto ? (
                  <motion.div
                    key={currentPhoto}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <img
                      src={toUrl(currentPhoto)}
                      alt={`${product.name} ${selectedColor}`}
                      className="w-full h-full object-contain"
                    />
                    {/* "No photo for this combination" notice */}
                    {isFallback && (
                      <div className="absolute top-3 left-3 right-3 flex justify-center">
                        <span className="bg-black/50 text-white text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Pas de photo pour cette sélection
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* SVG silhouette — no photos at all */
                  <motion.div
                    key="silhouette"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${garmentHex}22 0%, ${garmentHex}0A 60%, transparent 100%)`,
                        transition: 'background 0.5s ease',
                      }}
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center p-16 md:p-24"
                      style={{ color: '#1A1A1A', opacity: 0.05, transform: 'translate(6px, 6px)' }}
                    >
                      <Silhouette />
                    </div>
                    <div
                      className="relative flex items-center justify-center p-16 md:p-24 w-full h-full"
                      style={{ color: garmentHex, opacity: 0.82, transition: 'color 0.4s ease' }}
                    >
                      <Silhouette />
                    </div>
                    <AnimatePresence>
                      {selectedMotifColor && (
                        <motion.div
                          key={selectedMotifColor}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white/60 shadow-md"
                          style={{ backgroundColor: COLOR_MAP[selectedMotifColor] }}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Photo gallery dots — multiple photos for same combination */}
              {visiblePhotos.length > 1 && (
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {visiblePhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIdx(idx)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === photoIdx ? 'bg-white scale-125' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Front / Back toggle */}
              {showSideToggle && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1 bg-black/20 backdrop-blur-sm rounded-full p-1">
                  {frontPhotos.length > 0 && (
                    <button
                      onClick={() => setSelectedSide('front')}
                      className={`px-3 py-1 rounded-full text-[0.6rem] tracking-[0.2em] uppercase font-medium transition-all ${
                        selectedSide === 'front' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Front
                    </button>
                  )}
                  {backPhotos.length > 0 && (
                    <button
                      onClick={() => setSelectedSide('back')}
                      className={`px-3 py-1 rounded-full text-[0.6rem] tracking-[0.2em] uppercase font-medium transition-all ${
                        selectedSide === 'back' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Back
                    </button>
                  )}
                </div>
              )}

              {/* Category label */}
              <p
                className="absolute bottom-5 left-6 text-[0.6rem] tracking-[0.35em] uppercase"
                style={{ color: hasPhoto ? 'rgba(255,255,255,0.6)' : 'rgba(50, 25, 0, 0.35)' }}
              >
                {CATEGORY_LABELS[product.category] ?? product.category}
              </p>

              {/* Mobile close */}
              <button
                onClick={onClose}
                className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Right panel ─────────────────────────────────────────────── */}
            <div
              className="relative flex-1 overflow-y-auto border-l border-[#E5D5BF]"
              style={{ background: '#FAF6EE', paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
            >
              {/* Desktop close */}
              <button
                onClick={onClose}
                className="hidden md:flex absolute top-6 right-6 w-9 h-9 rounded-full bg-ink/5 hover:bg-ink/10 items-center justify-center transition-colors z-10"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="px-8 md:px-10 pt-10 pb-4 flex flex-col gap-7">

                {/* Header */}
                <div className="pr-12">
                  <p className="text-[0.6rem] tracking-[0.4em] uppercase text-ink/40 mb-2">LMRL Primaner</p>
                  <h2
                    className="font-merch font-light leading-tight text-ink"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '0.04em' }}
                  >
                    {product.name}
                  </h2>
                  <p className="mt-3 font-medium text-ink" style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: '1.4rem' }}>
                    {product.price !== null ? formatCurrency(product.price) : 'Prix à définir'}
                  </p>
                </div>

                <div className="h-px bg-[#E5D5BF]" />

                {/* Garment color */}
                <div>
                  <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                    Couleur — <span className="normal-case tracking-normal text-ink/80">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2.5 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`w-9 h-9 rounded-full transition-all duration-200 ${
                          selectedColor === color ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105'
                        } ${color === 'Blanc' ? 'border border-[#D4C8B4]' : ''}`}
                        style={{ backgroundColor: COLOR_MAP[color] }}
                      />
                    ))}
                  </div>
                </div>

                {/* Design selector */}
                {hasDesigns && (
                  <div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                      Design{selectedDesign
                        ? <> — <span className="normal-case tracking-normal text-ink/80">{product.designs![selectedDesign - 1]}</span></>
                        : ''}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {product.designs!.map((label, idx) => {
                        const num = idx + 1
                        const available = hasProductImages(product.id, selectedColor, num)
                        return (
                          <button
                            key={label}
                            onClick={() => { setSelectedDesign(num); setSelectedSide('front'); setPhotoIdx(0) }}
                            className={`px-4 h-10 text-xs font-medium rounded-lg border transition-all duration-200 ${
                              selectedDesign === num
                                ? 'bg-ink text-white border-ink'
                                : 'bg-transparent text-ink border-[#D4C8B4] hover:border-ink'
                            } ${!available ? 'opacity-40' : ''}`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Motif color */}
                {needsMotifChoice && (
                  <div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                      Couleur du motif{selectedMotifColor
                        ? <> — <span className="normal-case tracking-normal text-ink/80">{selectedMotifColor}</span></>
                        : ''}
                    </p>
                    <div className="flex gap-2.5 flex-wrap">
                      {availableMotifColors!.map((motif) => (
                        <button
                          key={motif}
                          onClick={() => setSelectedMotifColor(motif)}
                          title={motif}
                          className={`w-9 h-9 rounded-full transition-all duration-200 ${
                            selectedMotifColor === motif ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105'
                          } ${motif === 'Blanc' ? 'border border-[#D4C8B4]' : ''}`}
                          style={{ backgroundColor: COLOR_MAP[motif] }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {product.sizes && (
                  <div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                      Taille{selectedSize ? <> — <span className="normal-case tracking-normal text-ink/80">{selectedSize}</span></> : ''}
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {PRODUCT_SIZES.filter(s => product.sizes!.includes(s)).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`h-10 text-xs font-medium rounded-lg border transition-all duration-200 ${
                            selectedSize === size
                              ? 'bg-ink text-white border-ink'
                              : 'bg-transparent text-ink border-[#D4C8B4] hover:border-ink'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50">Qté</p>
                  <div className="flex items-center border border-[#D4C8B4] rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-ink hover:bg-[#EDE3D5] transition-colors text-sm">−</button>
                    <span className="px-4 py-2 text-sm font-medium text-ink min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-ink hover:bg-[#EDE3D5] transition-colors text-sm">+</button>
                  </div>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAdd}
                  disabled={!canAdd || added}
                  className={`w-full py-4 rounded-xl text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                    added
                      ? 'bg-[#2D6A4F] text-white'
                      : canAdd
                        ? 'bg-ink text-white hover:bg-[#2A2A2A]'
                        : 'bg-[#E8DDD0] text-ink/30 cursor-not-allowed'
                  }`}
                >
                  {added
                    ? '✓ Ajouté au panier'
                    : product.price === null
                      ? 'Prix à confirmer'
                      : needsDesignChoice && !selectedDesign
                        ? 'Choisir un design'
                        : needsMotifChoice && !selectedMotifColor
                          ? 'Choisir un motif'
                          : product.sizes && !selectedSize
                            ? 'Choisir une taille'
                            : 'Ajouter au panier'
                  }
                </button>

                {/* Description */}
                {product.description && (
                  <div className="border-t border-[#E5D5BF] pt-6">
                    <p className="text-sm text-ink/60 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Entretien */}
                <div className="border-t border-[#E5D5BF]">
                  <button
                    onClick={() => setEntretienOpen(o => !o)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 group-hover:text-ink/70 transition-colors">
                      Composition & entretien
                    </span>
                    <svg
                      width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                      className="text-ink/30 transition-transform duration-200 shrink-0"
                      style={{ transform: entretienOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <AnimatePresence>
                    {entretienOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-ink/55 leading-relaxed pb-5">
                          100% coton biologique. Lavage à 30°C. Ne pas sécher au sèche-linge. Repassage à basse température.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
