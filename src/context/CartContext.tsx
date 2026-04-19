import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { CartItem } from '../types/product'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

interface CartState {
  items: CartItem[]
  promoCode: string | null
  discount: number
  discountType: 'percent' | 'flat' | null
  discountLabel: string
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; color: string; size?: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; color: string; size?: string; quantity: number } }
  | { type: 'APPLY_PROMO'; payload: { code: string; discount: number; discountType: 'percent' | 'flat'; label: string } }
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
      const key = `${action.payload.productId}-${action.payload.color}-${action.payload.motifColor ?? ''}-${action.payload.design ?? ''}-${action.payload.size ?? ''}`
      const existing = state.items.find(i => `${i.productId}-${i.color}-${i.motifColor ?? ''}-${i.design ?? ''}-${i.size ?? ''}` === key)
      if (existing) {
        return { ...state, items: state.items.map(i => `${i.productId}-${i.color}-${i.motifColor ?? ''}-${i.design ?? ''}-${i.size ?? ''}` === key ? { ...i, quantity: i.quantity + action.payload.quantity } : i) }
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
      return { ...state, promoCode: action.payload.code, discount: action.payload.discount, discountType: action.payload.discountType, discountLabel: action.payload.label }
    case 'CLEAR_PROMO':
      return { ...state, promoCode: null, discount: 0, discountType: null, discountLabel: '' }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'CLEAR_CART':
      return { ...state, items: [], promoCode: null, discount: 0, discountType: null, discountLabel: '', isOpen: false }
    default:
      return state
  }
}

const initialState: CartState = { items: [], promoCode: null, discount: 0, discountType: null, discountLabel: '', isOpen: false }

// Read persisted cart synchronously during the very first render, so any effect
// (including those in deeper components) sees the hydrated state immediately —
// prevents a race where a child's clearCart() runs before a later hydrate effect
// restores the stale items.
function initFromStorage(): CartState {
  if (typeof window === 'undefined') return initialState
  try {
    const stored = window.localStorage.getItem('lmrl-cart')
    if (!stored) return initialState
    const parsed = JSON.parse(stored)
    return {
      ...initialState,
      items: parsed.items ?? [],
      promoCode: parsed.promoCode ?? null,
      discount: parsed.discount ?? 0,
      discountType: parsed.discountType ?? null,
      discountLabel: parsed.discountLabel ?? '',
    }
  } catch {
    return initialState
  }
}

interface CartContextValue extends CartState {
  totalItems: number
  subtotal: number
  discountAmount: number
  total: number
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, color: string, size?: string) => void
  updateQuantity: (productId: string, color: string, size: string | undefined, quantity: number) => void
  applyPromoCode: (code: string) => Promise<boolean>
  clearPromoCode: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initFromStorage)

  useEffect(() => {
    localStorage.setItem('lmrl-cart', JSON.stringify({ items: state.items, promoCode: state.promoCode, discount: state.discount, discountType: state.discountType, discountLabel: state.discountLabel }))
  }, [state.items, state.promoCode, state.discount, state.discountType, state.discountLabel])

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  let discountAmount = 0
  if (state.promoCode && state.discount > 0 && state.discountType) {
    discountAmount = state.discountType === 'percent'
      ? Math.round(subtotal * (state.discount / 100) * 100) / 100
      : state.discount
  }
  const total = Math.max(0, subtotal - discountAmount)

  const value: CartContextValue = {
    ...state, totalItems, subtotal, discountAmount, total,
    addToCart: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeFromCart: (productId, color, size) => dispatch({ type: 'REMOVE_ITEM', payload: { productId, color, size } }),
    updateQuantity: (productId, color, size, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { productId, color, size, quantity } }),
    applyPromoCode: async (code: string) => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/validate-promo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ code: code.trim().toUpperCase() }),
        })
        const data = await res.json()
        if (data.valid) {
          dispatch({ type: 'APPLY_PROMO', payload: { code: code.trim().toUpperCase(), discount: data.value, discountType: data.discountType, label: data.label } })
          return true
        }
        return false
      } catch {
        return false
      }
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
