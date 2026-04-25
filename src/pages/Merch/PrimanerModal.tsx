import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ProductSize } from '../../types/product'
import { PRIMANER_PRODUCTS, PRIMANER_SIZES } from '../../utils/constants'
import { formatCurrency } from '../../utils/formatCurrency'
import { useCart } from '../../context/CartContext'
import { useScrollLock } from '../../hooks/useScrollLock'

const BASE = import.meta.env.BASE_URL
const GATE_KEY = 'primaner_access'
const ACCESS_CODE = 'PROM2026'

const PHOTOS = [
  '/merch/Tabea_zoe_main_PRIMANER.webp',
  '/merch/Trio_2_PRIMANER.jpg',
]

function toUrl(p: string) {
  return `${BASE}${p.replace(/^\//, '')}`
}

interface PrimanerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrimanerModal({ isOpen, onClose }: PrimanerModalProps) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(GATE_KEY) === 'true')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const [photoIdx, setPhotoIdx] = useState(0)
  const [selectedProductIdx, setSelectedProductIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [quantity] = useState(1)
  const [added, setAdded] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const { addToCart, openCart } = useCart()

  useScrollLock(isOpen)

  const selectedProduct = PRIMANER_PRODUCTS[selectedProductIdx]

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    if (input.trim().toUpperCase() === ACCESS_CODE) {
      sessionStorage.setItem(GATE_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setShake(true)
      setInput('')
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2000)
    }
  }

  function handleAddToCart() {
    if (!selectedSize) return
    addToCart({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      color: 'Blanc',
      motifColor: undefined,
      design: undefined,
      size: selectedSize,
      quantity,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      onClose()
      openCart()
    }, 800)
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setPhotoIdx(0)
      setSelectedSize(null)
      setAdded(false)
    }, 350)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/50"
          />

          {/* Full-screen panel */}
          <motion.div
            initial={{ x: '4%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '3%', opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-[60] flex flex-col md:flex-row overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* ── Left panel: photo ─────────────────────────────────────────── */}
            <div
              className="relative h-[38vh] md:h-full md:w-[58%] shrink-0 overflow-hidden"
              style={{ background: '#0A0808' }}
              onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
              onTouchEnd={e => {
                if (touchStartX.current === null) return
                const dx = e.changedTouches[0].clientX - touchStartX.current
                touchStartX.current = null
                if (dx < -40) setPhotoIdx(i => Math.min(i + 1, PHOTOS.length - 1))
                else if (dx > 40) setPhotoIdx(i => Math.max(i - 1, 0))
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={photoIdx}
                  src={toUrl(PHOTOS[photoIdx])}
                  alt="Collection Primaner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Gradient overlay for legibility */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.35) 100%)',
                }}
              />

              {/* Exclusive badge */}
              <div className="absolute top-4 left-4">
                <span
                  className="text-[0.55rem] tracking-[0.35em] uppercase text-white/80 bg-black/30 backdrop-blur-sm border border-white/15 px-3 py-1.5 rounded-full"
                >
                  Édition Exclusive
                </span>
              </div>

              {/* Photo nav dots */}
              {PHOTOS.length > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  {PHOTOS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`rounded-full transition-all duration-300 ${
                        i === photoIdx
                          ? 'w-5 h-1.5 bg-white'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Mobile close */}
              <button
                onClick={handleClose}
                className="md:hidden absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
              >
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Right panel: gate or product selection ────────────────────── */}
            <div
              className="relative flex-1 overflow-y-auto border-l border-[#E5D5BF] flex flex-col"
              style={{ background: unlocked ? '#FAF6EE' : '#0A0A0F' }}
            >
              {/* Desktop close */}
              <button
                onClick={handleClose}
                className="hidden md:flex absolute top-6 right-6 w-9 h-9 rounded-full items-center justify-center transition-colors z-10"
                style={{
                  background: unlocked ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)',
                  color: unlocked ? 'inherit' : 'white',
                }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <AnimatePresence mode="wait">

                {/* ── LOCKED: password gate ─────────────────────────────────── */}
                {!unlocked && (
                  <motion.div
                    key="gate"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex items-center justify-center px-8 py-12 relative overflow-hidden"
                  >
                    {/* Ambient glow behind card */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.04) 45%, transparent 70%)',
                      }}
                    />

                    {/* Glass card */}
                    <div
                      className="relative w-full max-w-sm rounded-2xl p-px"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.06))',
                      }}
                    >
                      <div className="rounded-2xl bg-[#0D0D18]/90 backdrop-blur-xl px-8 py-10 flex flex-col items-center text-center">

                        {/* Animated lock icon */}
                        <div className="relative mb-6">
                          {/* Outer glow pulse */}
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                              width: '80px', height: '80px',
                              left: '-18px', top: '-18px',
                              background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
                            }}
                          />
                          {/* Icon circle */}
                          <motion.div
                            animate={{ rotate: [0, -12, 12, -7, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                            className="relative flex items-center justify-center w-11 h-11 rounded-full border border-white/12"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                          >
                            <svg
                              width="20" height="20" viewBox="0 0 24 24"
                              fill="none" stroke="currentColor" strokeWidth="1.5"
                              strokeLinecap="round" strokeLinejoin="round"
                              className="text-zinc-300"
                            >
                              <rect x="4" y="11" width="16" height="10" rx="2" />
                              <path d="M8 11V7a4 4 0 118 0v4" />
                            </svg>
                          </motion.div>
                          {/* Rotating ring */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                            className="absolute pointer-events-none"
                            style={{
                              width: '52px', height: '52px',
                              left: '-6px', top: '-6px',
                              borderRadius: '50%',
                              border: '1px solid transparent',
                              borderTopColor: 'rgba(139,92,246,0.5)',
                              borderRightColor: 'rgba(139,92,246,0.15)',
                            }}
                          />
                        </div>

                        <p className="text-zinc-500 text-[0.6rem] tracking-[0.42em] uppercase mb-3">
                          Primaner · 2026
                        </p>
                        <h2 className="text-white text-2xl font-semibold tracking-tight mb-2">
                          Collection Exclusive
                        </h2>
                        <p
                          className="text-zinc-400 text-[0.9rem] italic leading-relaxed mb-8 max-w-[16rem]"
                          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                        >
                          Réservé aux élèves Primaner du LMRL
                        </p>

                        {/* Password form */}
                        <form onSubmit={handlePasswordSubmit} className="w-full flex flex-col gap-3">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={shake ? 'shake' : 'normal'}
                              animate={shake ? { x: [-8, 8, -8, 8, 0] } : { x: 0 }}
                              transition={{ duration: 0.4 }}
                              className="relative w-full"
                            >
                              <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Code d'accès"
                                autoFocus
                                autoComplete="off"
                                spellCheck={false}
                                className="w-full bg-black/40 border border-white/10 text-white text-center rounded-xl px-4 py-3.5 tracking-[0.25em] text-sm outline-none focus:border-white/30 focus:bg-black/60 transition-all placeholder:text-zinc-600 placeholder:tracking-[0.15em]"
                              />
                            </motion.div>
                          </AnimatePresence>

                          <div className="h-5">
                            <AnimatePresence>
                              {error && (
                                <motion.p
                                  initial={{ opacity: 0, y: -4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0 }}
                                  className="text-rose-400/90 text-xs tracking-wide"
                                >
                                  Code incorrect. Réessaie.
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          <button
                            type="submit"
                            className="group relative w-full overflow-hidden rounded-xl bg-white text-black font-medium text-sm tracking-[0.15em] uppercase py-3.5 transition-transform active:scale-[0.99]"
                          >
                            <span className="relative z-10">Entrer</span>
                            <span
                              aria-hidden
                              className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06), transparent)' }}
                            />
                          </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 flex items-center gap-3 w-full">
                          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <span className="text-zinc-600 text-[0.55rem] tracking-[0.3em] uppercase">Comité Primaner</span>
                          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── UNLOCKED: product selection ───────────────────────────── */}
                {unlocked && (
                  <motion.div
                    key="shop"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="px-8 md:px-10 pt-10 pb-10 flex flex-col gap-7"
                    style={{ paddingBottom: 'max(2.5rem, env(safe-area-inset-bottom))' }}
                  >
                    {/* Header */}
                    <div className="pr-12">
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-[0.6rem] tracking-[0.4em] uppercase text-ink/40">LMRL Primaner</p>
                        <span className="text-[0.55rem] tracking-[0.2em] uppercase text-white bg-[#4F3BE8] px-2 py-0.5 rounded-full">
                          Exclusif
                        </span>
                      </div>
                      <h2
                        className="font-merch font-light leading-tight text-ink"
                        style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', letterSpacing: '0.04em' }}
                      >
                        Édition Primaner
                      </h2>
                      <p
                        className="mt-3 font-medium text-ink"
                        style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif', fontSize: '1.4rem' }}
                      >
                        {formatCurrency(selectedProduct.price)}
                      </p>
                    </div>

                    <div className="h-px bg-[#E5D5BF]" />

                    {/* Product type selector */}
                    <div>
                      <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                        Modèle
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {PRIMANER_PRODUCTS.map((product, idx) => {
                          const isSelected = selectedProductIdx === idx
                          return (
                            <button
                              key={product.id}
                              onClick={() => { setSelectedProductIdx(idx); setSelectedSize(null) }}
                              className={`flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border transition-all duration-200 ${
                                isSelected
                                  ? 'border-ink bg-ink text-white'
                                  : 'border-[#E5D5BF] bg-white/60 text-ink hover:border-ink/40'
                              }`}
                            >
                              {/* Garment icon */}
                              <svg
                                width="28" height="28" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" strokeWidth="1.3"
                                strokeLinecap="round" strokeLinejoin="round"
                                className={isSelected ? 'text-white/80' : 'text-ink/50'}
                              >
                                {idx === 0 ? (
                                  /* T-shirt icon */
                                  <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 001 .83H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 001-.83l.58-3.57a2 2 0 00-1.35-2.14z" />
                                ) : (
                                  /* Crewneck / sweatshirt icon */
                                  <>
                                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 001 .83H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 001-.83l.58-3.57a2 2 0 00-1.35-2.14z" />
                                    <path d="M9 10h6" />
                                  </>
                                )}
                              </svg>
                              <span
                                className="text-xs font-medium tracking-wide"
                                style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                              >
                                {idx === 0 ? 'T-Shirt' : 'Crewneck'}
                              </span>
                              <span className={`text-[0.7rem] ${isSelected ? 'text-white/70' : 'text-ink/50'}`}>
                                {formatCurrency(product.price)}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="h-px bg-[#E5D5BF]" />

                    {/* Size selector */}
                    <div>
                      <p className="text-[0.65rem] tracking-[0.35em] uppercase text-ink/50 mb-3">
                        Taille {selectedSize && <span className="normal-case tracking-normal text-ink/80">— {selectedSize}</span>}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {PRIMANER_SIZES.map(size => {
                          const isSelected = selectedSize === size
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size as ProductSize)}
                              className={`min-w-[3.2rem] px-3 py-2.5 rounded-lg border text-xs font-medium tracking-wide transition-all duration-150 ${
                                isSelected
                                  ? 'bg-ink text-white border-ink'
                                  : 'border-[#D5C4A8] text-ink/70 hover:border-ink/50 hover:text-ink'
                              }`}
                              style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                            >
                              {size}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize || added}
                      className={`relative w-full overflow-hidden rounded-xl py-4 text-sm font-medium tracking-[0.18em] uppercase transition-all duration-300 ${
                        added
                          ? 'bg-green-700 text-white'
                          : !selectedSize
                          ? 'bg-ink/10 text-ink/30 cursor-not-allowed'
                          : 'bg-ink text-white hover:bg-ink/85 active:scale-[0.99]'
                      }`}
                      style={{ fontFamily: '"Space Grotesk", system-ui, sans-serif' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={added ? 'added' : 'add'}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="block"
                        >
                          {added ? 'Ajouté ✓' : 'Ajouter au panier'}
                        </motion.span>
                      </AnimatePresence>
                    </button>

                    {/* Note about exclusivity */}
                    <p
                      className="text-center text-[0.7rem] text-ink/35 italic leading-relaxed"
                      style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
                    >
                      Collection réservée aux élèves Primaner du Lycée Michel Rodange Luxembourg
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
