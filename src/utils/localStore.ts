export interface StoredRestaurant {
  type: 'restaurant'
  id: string
  firstName: string
  lastName: string
  classGroup: string
  email: string
  phone: string
  starter: string
  main: string
  dessert: string
  drinks: string
  surcharge: number
  savedAt: string
}

export interface StoredGotham {
  type: 'gotham'
  id: string
  firstName: string
  lastName: string
  email: string
  ticketType: 'primaner' | 'external'
  price: number
  savedAt: string
}

export interface StoredMerch {
  type: 'merch'
  id: string
  items: { name: string; color: string; size?: string; qty: number; price: number }[]
  promoCode?: string
  savedAt: string
}

export type StoredEntry = StoredRestaurant | StoredGotham | StoredMerch

const KEY = 'primaner_entries'

function load(): StoredEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(entries: StoredEntry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function pushEntry(entry: StoredEntry) {
  const entries = load()
  entries.unshift(entry)
  save(entries)
}

export function getEntries(): StoredEntry[] {
  return load()
}

export function clearEntries() {
  localStorage.removeItem(KEY)
}
