import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import type { Product, ProductColor, ProductSize } from '../types'

const PRODUCTS: Product[] = [
  { id: 'hoodie', name: 'Hoodie', price: 50, colors: ['Red', 'Black', 'Grey', 'Green'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'crewneck', name: 'Crewneck', price: 50, colors: ['Red', 'Black', 'Grey', 'Green'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'zip-hoodie', name: 'Zip Hoodie', price: 55, colors: ['Red', 'Black', 'Grey', 'Green'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'tshirt', name: 'T-shirt', price: 25, colors: ['Red', 'Black', 'Grey', 'Green'], sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 'tote-bag', name: 'Tote Bag', price: null, colors: [], sizes: [] },
  { id: 'socks', name: 'Socks', price: null, colors: [], sizes: [] },
]

const COLOR_HEX: Record<ProductColor, string> = {
  Red: '#C0392B',
  Black: '#1A1A1A',
  Grey: '#8E8E8E',
  Green: '#2D6A4F',
}

function ProductCard({ product }: { product: Product }) {
  const { addItem, setIsOpen } = useCart()
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors[0] ?? null
  )
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [added, setAdded] = useState(false)

  const canAdd = product.price !== null && selectedColor !== null && selectedSize !== null

  function handleAdd() {
    if (!canAdd || !selectedColor || !selectedSize) return
    addItem({
      productId: product.id,
      productName: product.name,
      color: selectedColor,
      size: selectedSize,
      price: product.price!,
    })
    setAdded(true)
    setIsOpen(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col">
      {/* Image placeholder */}
      <div
        className="aspect-[3/4] rounded-sm mb-5 flex items-end p-5 relative overflow-hidden"
        style={{
          background: selectedColor
            ? `linear-gradient(160deg, ${COLOR_HEX[selectedColor]}18 0%, ${COLOR_HEX[selectedColor]}08 100%)`
            : '#F0EEE9',
          border: '1px solid #E5E3DC',
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.06 }}
        >
          <span
            className="font-bold uppercase tracking-tighter text-center"
            style={{ fontSize: 'clamp(2rem, 8vw, 5rem)', color: '#1A1A1A' }}
          >
            LMRL
          </span>
        </div>
        {product.price === null && (
          <span className="relative z-10 text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">
            À définir
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="flex justify-between items-baseline mb-4">
        <h3 className="text-sm font-semibold tracking-wide text-ink">{product.name}</h3>
        <span className="text-sm text-ink/60">
          {product.price !== null ? `${product.price}€` : '—'}
        </span>
      </div>

      {/* Color swatches */}
      {product.colors.length > 0 && (
        <div className="flex gap-2 mb-4">
          {product.colors.map(color => (
            <button
              key={color}
              title={color}
              onClick={() => setSelectedColor(color)}
              className="w-5 h-5 rounded-full border-2 transition-all duration-150"
              style={{
                backgroundColor: COLOR_HEX[color],
                borderColor: selectedColor === color ? '#1A1A1A' : 'transparent',
                outline: selectedColor === color ? '2px solid #E5E3DC' : 'none',
                outlineOffset: '1px',
              }}
            />
          ))}
        </div>
      )}

      {/* Size selector */}
      {product.sizes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.sizes.map(size => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-2.5 py-1 text-xs font-medium border transition-colors
                ${selectedSize === size
                  ? 'bg-ink text-white border-ink'
                  : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink/80'}`}
            >
              {size}
            </button>
          ))}
        </div>
      )}

      {/* Add to cart */}
      {product.price !== null ? (
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={`w-full py-3 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200
            ${canAdd
              ? added
                ? 'bg-green-800/10 text-green-700 border border-green-700/30'
                : 'bg-ink text-white hover:bg-ink/80'
              : 'border border-ink/10 text-ink/25 cursor-not-allowed'}`}
        >
          {added ? '✓ Ajouté' : canAdd ? 'Ajouter au panier' : 'Sélectionner taille'}
        </button>
      ) : (
        <div className="py-3 text-center text-xs tracking-[0.15em] uppercase text-ink/30 border border-ink/8">
          Prix à définir
        </div>
      )}
    </div>
  )
}

function CartDrawer() {
  const { items, removeItem, updateQuantity, setPromoCode, discount, subtotal, total, isOpen, setIsOpen } = useCart()
  const [codeInput, setCodeInput] = useState('')
  const [codeApplied, setCodeApplied] = useState(false)

  function applyCode() {
    setPromoCode(codeInput)
    setCodeApplied(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-ink/20 z-40 backdrop-blur-sm"
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#F8F7F4] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-ink/8">
              <h2 className="text-sm font-semibold tracking-widest uppercase text-ink">
                Panier ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink/40 hover:text-ink text-xl transition-colors"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <p className="text-ink/40 text-sm text-center mt-16">Votre panier est vide.</p>
              ) : (
                <div className="space-y-5">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div
                        className="w-16 h-20 rounded flex-shrink-0 flex items-center justify-center"
                        style={{ background: '#E8E6DF' }}
                      >
                        <span className="text-[8px] font-bold tracking-widest text-ink/30 uppercase">LMRL</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{item.productName}</p>
                        <p className="text-xs text-ink/50 mt-0.5">{item.color} · {item.size}</p>
                        <p className="text-sm font-medium text-ink mt-1">{item.price}€</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-ink/15 text-ink/60 hover:text-ink text-sm transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xs font-medium text-ink w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center border border-ink/15 text-ink/60 hover:text-ink text-sm transition-colors"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(idx)}
                            className="ml-auto text-ink/30 hover:text-ink/70 text-xs transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/8 space-y-4">
                {/* Promo code */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeApplied(false) }}
                    placeholder="CODE PROMO"
                    className="flex-1 bg-transparent border border-ink/15 text-ink text-xs tracking-widest uppercase px-3 py-2.5 placeholder:text-ink/25 focus:outline-none focus:border-ink/40 transition-colors"
                  />
                  <button
                    onClick={applyCode}
                    className="px-4 py-2.5 bg-ink text-white text-xs font-semibold tracking-wide hover:bg-ink/80 transition-colors"
                  >
                    Appliquer
                  </button>
                </div>
                {codeApplied && (
                  <p className={`text-xs ${discount > 0 ? 'text-green-700' : 'text-red-500'}`}>
                    {discount > 0
                      ? `✓ Code appliqué — ${Math.round(discount * 100)}% de réduction`
                      : 'Code invalide'}
                  </p>
                )}

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink/60">
                    <span>Sous-total</span>
                    <span>{subtotal}€</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Réduction ({Math.round(discount * 100)}%)</span>
                      <span>−{(subtotal * discount).toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-ink pt-1 border-t border-ink/8">
                    <span>Total</span>
                    <span>{total.toFixed(2)}€</span>
                  </div>
                </div>

                <button
                  className="w-full py-4 bg-ink text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-ink/80 transition-colors"
                >
                  Passer commande →
                </button>
                <p className="text-ink/30 text-[10px] text-center">
                  Paiement sécurisé via Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Merch() {
  const { items, setIsOpen } = useCart()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <main className="bg-[#F8F7F4] min-h-screen text-ink">
      <CartDrawer />

      {/* Cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-40 flex items-center gap-2 px-4 py-2.5 bg-[#F8F7F4] border border-ink/10 hover:border-ink/30 rounded-full text-xs font-medium tracking-wide transition-colors shadow-sm"
      >
        Panier
        {totalItems > 0 && (
          <span className="bg-ink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Header */}
      <header className="pt-28 pb-16 text-center px-6 border-b border-ink/6">
        <motion.p
          className="text-ink/40 text-[10px] tracking-[0.35em] uppercase mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          Primaner vum Michel Rodange
        </motion.p>
        <motion.h1
          className="text-6xl md:text-8xl font-bold tracking-tighter text-ink leading-none mb-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        >
          LMRL
        </motion.h1>
        <motion.p
          className="text-ink/40 text-sm tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          Collection 2025
        </motion.p>
      </header>

      {/* Product grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-ink/6 py-12 text-center">
        <p className="text-ink/30 text-xs tracking-[0.2em] uppercase">
          Livraison & informations disponibles prochainement
        </p>
      </footer>
    </main>
  )
}
