import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product, ProductColor, ProductSize } from '../../types/product'
import { COLOR_MAP, PRODUCT_SIZES, getProductImages, getPreviewImage, hasAnyPreview } from '../../utils/constants'
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

// Build a flat list of (garment, motif) pairs from a product's motifColors map.
function buildColorPairs(product: Product): Array<{ garment: ProductColor; motif: ProductColor }> {
  const pairs: Array<{ garment: ProductColor; motif: ProductColor }> = []
  for (const garment of product.colors) {
    const motifs = product.motifColors?.[garment] ?? []
    if (motifs.length === 0) {
      // No motif info — treat the garment itself as both sides of the chip.
      pairs.push({ garment, motif: garment })
    } else {
      for (const motif of motifs) pairs.push({ garment, motif })
    }
  }
  return pairs
}

export function ProductView({ product, open, onClose }: ProductViewProps) {
  const pairs = buildColorPairs(product)
  const firstPair = pairs[0] ?? { garment: product.colors[0], motif: product.colors[0] }

  const [selectedColor, setSelectedColor] = useState<ProductColor>(firstPair.garment)
  const [selectedMotifColor, setSelectedMotifColor] = useState<ProductColor | null>(firstPair.motif)
  const [selectedDesign, setSelectedDesign] = useState<number | null>(null)
  const [selectedSide, setSelectedSide] = useState<'front' | 'back'>('front')
  const [photoIdx, setPhotoIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [entretienOpen, setEntretienOpen] = useState(false)
  const { addToCart, openCart } = useCart()

  useScrollLock(open)

  const hasDesigns = product.designs && product.designs.length > 1
  const needsDesignChoice = !!hasDesigns

  // --- Preview resolution: photoshoot → design artwork → null ---
  const designNum = selectedDesign ?? 1
  const exactPhotos = getProductImages(product.id, selectedColor, designNum, selectedSide)
  const hasPhotoshoot = exactPhotos.length > 0

  const previewUrl = getPreviewImage(product.id, selectedColor, selectedMotifColor, designNum, selectedSide)
  const visiblePhotos = hasPhotoshoot ? exactPhotos : (previewUrl ? [previewUrl] : [])
  const currentPhoto = visiblePhotos[photoIdx] ?? null
  const hasPhoto = !!currentPhoto
  const showingArtworkFallback = !hasPhotoshoot && !!previewUrl

  // Front/back toggle is meaningful when either side has any visual (photoshoot OR artwork)
  const hasFrontVisual = hasAnyPreview(product.id, selectedColor, selectedMotifColor, designNum, 'front')
  const hasBackVisual  = hasAnyPreview(product.id, selectedColor, selectedMotifColor, designNum, 'back')
  const showSideToggle = selectedDesign !== null && (hasFrontVisual || hasBackVisual)

  const selectPair = (garment: ProductColor, motif: ProductColor) => {
    setSelectedColor(garment)
    setSelectedMotifColor(motif)
    setSelectedSide('front')
    setPhotoIdx(0)
  }

  useEffect(() => {
    setPhotoIdx(0)
  }, [selectedColor, selectedMotifColor, selectedDesign, selectedSide])

  useEffect(() => {
    if (open) {
      setSelectedColor(firstPair.garment)
      setSelectedMotifColor(firstPair.motif)
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
    && (!needsDesignChoice || selectedDesign !== null)

  const handleAdd = () => {
    if (!product.price) return
    if (product.sizes && !selectedSize) return
    if (needsDesignChoice && !selectedDesign) return
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      color: selectedColor,
      motifColor: selectedMotifColor && selectedMotifColor !== selectedColor ? selectedMotifColor : undefined,
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
                    {/* Showing design artwork instead of a photoshoot photo */}
                    {showingArtworkFallback && (
                      <div className="absolute top-3 left-3 right-3 flex justify-center">
                        <span className="bg-black/50 text-white text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full backdrop-blur-sm">
                          Aperçu du design
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
                  {hasFrontVisual && (
                    <button
                      onClick={() => setSelectedSide('front')}
                      className={`px-3 py-1 rounded-full text-[0.6rem] tracking-[0.2em] uppercase font-medium transition-all ${
                        selectedSide === 'front' ? 'bg-white text-black' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Front
                    </button>
                  )}
                  {hasBackVisual && (
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

                {/* Couleur — single pair picker */}
                <div>
                  <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                    Couleur —{' '}
                    <span className="normal-case tracking-normal text-ink/80">
                      {selectedColor}
                      {selectedMotifColor && selectedMotifColor !== selectedColor
                        ? <> · motif <span className="text-ink">{selectedMotifColor}</span></>
                        : null}
                    </span>
                  </p>
                  <div className="flex gap-2.5 flex-wrap">
                    {pairs.map(({ garment, motif }) => {
                      const isSelected = selectedColor === garment && selectedMotifColor === motif
                      const gHex = COLOR_MAP[garment]
                      const mHex = COLOR_MAP[motif]
                      const showsRing = garment === 'Blanc' || garment === 'Beige'
                      return (
                        <button
                          key={`${garment}-${motif}`}
                          onClick={() => selectPair(garment, motif)}
                          title={`${garment} · motif ${motif}`}
                          className={`w-10 h-10 rounded-full overflow-hidden transition-all duration-200 relative ${
                            isSelected ? 'ring-2 ring-offset-2 ring-ink scale-110' : 'hover:scale-105'
                          } ${showsRing ? 'border border-[#D4C8B4]' : ''}`}
                          style={{
                            background: garment === motif
                              ? gHex
                              : `linear-gradient(90deg, ${gHex} 0%, ${gHex} 50%, ${mHex} 50%, ${mHex} 100%)`,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>

                {/* Design — three visible thumbnails */}
                {hasDesigns && (
                  <div>
                    <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                      Design{selectedDesign
                        ? <> — <span className="normal-case tracking-normal text-ink/80">{product.designs![selectedDesign - 1]}</span></>
                        : ''}
                    </p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {product.designs!.map((label, idx) => {
                        const num = idx + 1
                        const thumbUrl = getPreviewImage(product.id, selectedColor, selectedMotifColor, num, 'front')
                        const isSelected = selectedDesign === num
                        return (
                          <button
                            key={label}
                            onClick={() => { setSelectedDesign(num); setSelectedSide('front'); setPhotoIdx(0) }}
                            className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#F0E8D8] ${
                              isSelected
                                ? 'border-ink ring-2 ring-ink/10'
                                : 'border-[#E5D5BF] hover:border-ink/60'
                            }`}
                          >
                            {thumbUrl ? (
                              <img
                                src={toUrl(thumbUrl)}
                                alt={`${product.name} ${label}`}
                                loading="lazy"
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity ${
                                  isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                                }`}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-ink/30 text-xs">
                                {label}
                              </div>
                            )}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                              <p className="text-[0.6rem] font-medium text-white tracking-[0.15em] uppercase">
                                {label}
                              </p>
                            </div>
                          </button>
                        )
                      })}
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
