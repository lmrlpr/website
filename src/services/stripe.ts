import type { CartItem } from '../types/product'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export async function redirectToCheckout(items: CartItem[], promoCode?: string | null, name?: string, email?: string): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ items, promoCode, name, email }),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Checkout failed')
  }

  const { url } = await res.json()
  window.location.href = url
}

export async function redirectToGothamCheckout(data: {
  firstName: string
  lastName: string
  email: string
  ticketType: 'eleve' | 'prof' | 'plus_un'
}): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-gotham-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Checkout failed')
  }

  const { url } = await res.json()
  window.location.href = url
}

export async function redirectToRestaurantCheckout(data: {
  firstName: string
  lastName: string
  classGroup: string
  email: string
  phone?: string
  starter: string
  main: string
  dessert: string
  drinks: string
  hasAlcohol: boolean
}): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/create-restaurant-checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? 'Checkout failed')
  }

  const { url } = await res.json()
  window.location.href = url
}
