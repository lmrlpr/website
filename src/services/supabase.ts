import { createClient } from '@supabase/supabase-js'
import type { RestaurantReservation, GothamRegistration } from '../types/menuSelection'
import type { CartItem } from '../types/product'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export async function createRestaurantReservation(data: RestaurantReservation): Promise<void> {
  const { error } = await supabase.from('restaurant_reservations').insert({
    first_name: data.firstName,
    last_name: data.lastName,
    class_group: data.classGroup,
    email: data.email,
    phone: data.phone,
    menu_selection: data.menuSelection,
    total_surcharge: data.totalSurcharge,
    access_code: data.accessCode,
  })
  if (error) throw error
}

export async function createGothamRegistration(data: GothamRegistration): Promise<void> {
  const { error } = await supabase.from('gotham_registrations').insert({
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    ticket_type: data.ticketType,
    price: data.price,
  })
  if (error) throw error
}

export async function createMerchOrder(items: CartItem[], promoCode?: string, name?: string, email?: string): Promise<void> {
  const { error } = await supabase.from('merch_orders').insert({
    items,
    promo_code: promoCode ?? null,
    name: name ?? null,
    email: email ?? null,
  })
  if (error) throw error
}
