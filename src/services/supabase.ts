import { createClient } from '@supabase/supabase-js'
import type { RestaurantReservation, GothamRegistration } from '../types/menuSelection'
import type { CartItem } from '../types/product'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key'
)

function isConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export async function createRestaurantReservation(data: RestaurantReservation): Promise<void> {
  if (!isConfigured()) {
    console.log('[STUB] createRestaurantReservation', data)
    return
  }
  const { error } = await supabase.from('restaurant_reservations').insert(data)
  if (error) throw error
}

export async function createGothamRegistration(data: GothamRegistration): Promise<void> {
  if (!isConfigured()) {
    console.log('[STUB] createGothamRegistration', data)
    return
  }
  const { error } = await supabase.from('gotham_registrations').insert(data)
  if (error) throw error
}

export async function createMerchOrder(items: CartItem[], promoCode?: string): Promise<void> {
  if (!isConfigured()) {
    console.log('[STUB] createMerchOrder', { items, promoCode })
    return
  }
  const { error } = await supabase.from('merch_orders').insert({ items, promo_code: promoCode })
  if (error) throw error
}
