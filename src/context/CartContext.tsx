import { createContext, useContext, useState, useMemo, type ReactNode } from 'react'
import type { CartItem, ProductColor, ProductSize } from '../types'

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, qty: number) => void
  promoCode: string
  setPromoCode: (code: string) => void
  discount: number
  subtotal: number
  total: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | null>(null)

const VALID_PROMO_CODES: Record<string, number> = {
  PRIMANER2025: 0.1,
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [promoCode, setPromoCodeState] = useState('')
  const [discount, setDiscount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.productId === item.productId && i.color === item.color && i.size === item.size
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateQuantity(index: number, qty: number) {
    if (qty <= 0) {
      removeItem(index)
      return
    }
    setItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], quantity: qty }
      return next
    })
  }

  function setPromoCode(code: string) {
    setPromoCodeState(code)
    const upper = code.trim().toUpperCase()
    setDiscount(VALID_PROMO_CODES[upper] ?? 0)
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  )

  const total = useMemo(() => subtotal * (1 - discount), [subtotal, discount])

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, promoCode, setPromoCode, discount, subtotal, total, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

// Re-export types for convenience
export type { ProductColor, ProductSize }
