import { loadStripe } from '@stripe/stripe-js'
import type { CartItem } from '../types/product'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ''

let stripePromise: ReturnType<typeof loadStripe> | null = null

export function getStripe() {
  if (!STRIPE_KEY) return Promise.resolve(null)
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_KEY)
  }
  return stripePromise
}

export async function redirectToCheckout(items: CartItem[]): Promise<void> {
  const stripe = await getStripe()
  if (!stripe) {
    console.log('[STUB] redirectToCheckout', items)
    alert('Checkout coming soon — payment integration not yet active.')
    return
  }
  // When Stripe is configured:
  // 1. POST to your backend to create a Checkout Session
  // 2. const { sessionId } = await response.json()
  // 3. await stripe.redirectToCheckout({ sessionId })
  console.log('[STUB] Stripe configured but backend not yet wired')
}
