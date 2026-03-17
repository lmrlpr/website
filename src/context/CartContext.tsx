import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem } from '../types/product'
import { VALID_PROMO_CODES } from '../utils/constants'

interface CartState {
  items: CartItem[]
  promoCode: string | null
  discount: number
  discountLabel: string
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; color: string; size?: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; color: string; size?: string; quantity: number } }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number; label: string } }
  | { type: 'CLEAR_PROMO' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; payload: Partial<CartState> }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload }
    case 'ADD_ITEM': {
      const key = `${action.payload.productId}-${action.payload.color}-${action.payload.size ?? ''}`
      const existing = state.items.find(i => `${i.productId}-${i.color}-${i.size ?? ''}` === key)
      if (existing) {
        return { ...state, items: state.items.map(i => `${i.productId}-${i.color}-${i.size ?? ''}` === key ? { ...i, quantity: i.quantity + action.payload.quantity } : i) }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM': {
      const key = `${action.payload.productId}-${action.payload.color}-${action.payload.size ?? ''}`
      return { ...state, items: state.items.filter(i => `${i.productId}-${i.color}-${i.size ?? ''}` !== key) }
    }
    case 'UPDATE_QTY': {
      const key = `${action.payload.productId}-${action.payload.color}-${action.payload.size ?? ''}`
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => `${i.productId}-${i.color}-${i.size ?? ''}` !== key) }
      }
      return { ...state, items: state.items.map(i => `${i.productId}-${i.color}-${i.size ?? ''}` === key ? { ...i, quantity: action.payload.quantity } : i) }
    }
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.payload.code, discount: action.payload.discount, discountLabel: action.payload.label }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: null, discount: 0, discountLabel: '' }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'CLEAR_CART':
      return { ...state, items: [], promoCode: null, discount: 0, discountLabel: '', isOpen: false }
    default:
      return state
  }
}

const initialState: CartState = { items: [], promoCode: null, discount: 0, discountLabel: '', isOpen: false }

interface CartContextValue extends CartState {
  totalItems: number
  subtotal: number
  discountAmount: number
  total: number
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color: string, size?: string) => void
  updateQuantity: (productId: string, color: string, size: string | undefined, quantity: number) => void
  applyPromoCode: (code: string) => boolean
  clearPromoCode: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lmrl-cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        dispatch({ type: 'HYDRATE', payload: { items: parsed.items ?? [], promoCode: parsed.promoCode, discount: parsed.discount ?? 0, discountLabel: parsed.discountLabel ?? '' } })
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    localStorage.setItem('lmrl-cart', JSON.stringify({ items: state.items, promoCode: state.promoCode, discount: state.discount, discountLabel: state.discountLabel }))
  }, [state.items, state.promoCode, state.discount, state.discountLabel])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  let discountAmount = 0
  if (state.promoCode && state.discount > 0) {
    const promo = VALID_PROMO_CODES.find(p => p.code === state.promoCode)
    if (promo) {
      discountAmount = promo.discountType === 'percent' ? Math.round(subtotal * (promo.value / 100) * 100) / 100 : promo.value
    }
  }
  const total = Math.max(0, subtotal - discountAmount)

  const value: CartContextValue = {
    ...state, totalItems, subtotal, discountAmount, total,
    addToCart: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeFromCart: (productId, color, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, color, size } }),
    updateQuantity: (productId, color, size, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { productId, color, size, quantity } }),
    applyPromoCode: (code) => {
      const promo = VALID_PROMO_CODES.find(p => p.code.toLowerCase() === code.trim().toLowerCase())
      if (promo) { dispatch({ type: 'APPLY_PROMO', payload: { code: promo.code, discount: promo.value, label: promo.label } }); return true }
      return false
    },
    clearPromoCode: () => dispatch({ type: 'CLEAR_PROMO' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
