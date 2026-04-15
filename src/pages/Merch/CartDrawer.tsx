import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { COLOR_MAP } from '../../utils/constants'
import { PromoCodeInput } from './PromoCodeInput'
import { redirectToCheckout } from '../../services/stripe'

export function CartDrawer() {
  const { isOpen, closeCart, items, promoCode, subtotal, discountAmount, total, removeFromCart, updateQuantity } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const canCheckout = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  async function handleCheckout() {
    if (!canCheckout) return
    setLoading(true)
    setError(null)
    try {
      await redirectToCheckout(items, promoCode, name.trim(), email.trim())
    } catch {
      setError('Une erreur est survenue lors du paiement. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="font-bold text-ink">Panier</h2>
              <button onClick={closeCart} className="text-gray-400 hover:text-ink transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">Votre panier est vide</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => {
                    const key = `${item.productId}-${item.color}-${item.size ?? ''}`
                    return (
                      <div key={key} className="flex gap-4">
                        {/* Mini image */}
                        <div
                          className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: `${COLOR_MAP[item.color]}22` }}
                        >
                          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: COLOR_MAP[item.color] }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{item.productName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.color}{item.size ? ` · ${item.size}` : ''}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity - 1)} className="px-2.5 py-1 text-ink hover:bg-gray-50 text-xs">−</button>
                              <span className="px-2.5 py-1 text-xs font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.productId, item.color, item.size, item.quantity + 1)} className="px-2.5 py-1 text-ink hover:bg-gray-50 text-xs">+</button>
                            </div>
                            <p className="text-sm font-medium text-ink">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.color, item.size)}
                          className="text-gray-300 hover:text-gray-500 transition-colors self-start mt-0.5"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 flex flex-col gap-4">
                <PromoCodeInput />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Sous-total</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Code promo{promoCode ? ` (${promoCode})` : ''}</span>
                      <span>−{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Nom complet"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink placeholder-gray-300"
                  />
                  <input
                    type="email"
                    placeholder="Adresse email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink placeholder-gray-300"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                    <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-red-700">{error}</span>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || !canCheckout}
                  className="w-full py-4 bg-ink text-white text-sm font-semibold rounded-xl hover:bg-ink/80 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Commander →'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
