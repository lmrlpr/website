import { useState } from 'react'
import { STARTERS, MAINS, DESSERTS, COLOR_MAP } from '../../utils/constants'
import type { ProductColor } from '../../types/product'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

interface CartItem {
  productName: string
  price: number
  color: string
  motifColor?: string
  design?: string
  size?: string
  quantity: number
}

function colorHex(name?: string): string {
  if (!name) return '#9E9E9E'
  return COLOR_MAP[name as ProductColor] ?? '#9E9E9E'
}

function ColorPairChip({ color, motifColor }: { color: string; motifColor?: string }) {
  const gHex = colorHex(color)
  const mHex = motifColor ? colorHex(motifColor) : gHex
  return (
    <span
      className="inline-block w-3.5 h-3.5 rounded-full border border-black/20 align-middle shrink-0"
      style={{
        background: motifColor && motifColor !== color
          ? `linear-gradient(90deg, ${gHex} 0%, ${gHex} 50%, ${mHex} 50%, ${mHex} 100%)`
          : gHex,
      }}
      title={motifColor && motifColor !== color ? `${color} · motif ${motifColor}` : color}
    />
  )
}

interface MenuSelection {
  starter: string
  main: string
  dessert: string
  drinks: 'non-alcoholic' | 'alcoholic'
}

interface MerchOrder {
  id: string
  name?: string
  email?: string
  items: CartItem[]
  promo_code?: string
  created_at: string
}

interface GothamRegistration {
  id: string
  first_name: string
  last_name: string
  email: string
  ticket_type: 'primaner' | 'external'
  price: number
  payment_status?: string
  created_at: string
}

interface RestaurantReservation {
  id: string
  first_name: string
  last_name: string
  class_group: string
  email: string
  menu_selection: MenuSelection
  total_surcharge: number
  created_at: string
}

interface AdminData {
  merch_orders: MerchOrder[]
  gotham_registrations: GothamRegistration[]
  restaurant_reservations: RestaurantReservation[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function lookup(id: string, list: { id: string; label: string }[]) {
  return list.find(i => i.id === id)?.label ?? id
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AdminData | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) { setError('Mot de passe requis'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/get-admin-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error === 'Unauthorized' ? 'Mot de passe incorrect' : (json.error ?? 'Erreur'))
      } else {
        setData(json)
        sessionStorage.setItem('admin_auth', password)
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin</h1>
          <p className="text-sm text-gray-400 mb-6">Inscriptions & commandes</p>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              autoFocus
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Connexion...' : 'Connexion'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const { merch_orders, gotham_registrations, restaurant_reservations } = data
  const totalMerchItems = merch_orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
  )

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 mt-1 text-sm">Aperçu des inscriptions et commandes</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-4xl font-bold text-gray-900">{gotham_registrations.length}</div>
            <div className="text-sm text-gray-600 mt-1 font-medium">Gotham inscriptions</div>
            <div className="text-xs text-gray-400 mt-1">
              {gotham_registrations.filter(r => r.ticket_type === 'external').length} externes ·{' '}
              {gotham_registrations.filter(r => r.ticket_type === 'primaner').length} primaneren
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-4xl font-bold text-gray-900">{merch_orders.length}</div>
            <div className="text-sm text-gray-600 mt-1 font-medium">Commandes merch</div>
            <div className="text-xs text-gray-400 mt-1">{totalMerchItems} articles au total</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="text-4xl font-bold text-gray-900">{restaurant_reservations.length}</div>
            <div className="text-sm text-gray-600 mt-1 font-medium">Réservations restaurant</div>
            <div className="text-xs text-gray-400 mt-1">
              {restaurant_reservations.filter(r => r.total_surcharge > 0).length} avec supplément boissons
            </div>
          </div>
        </div>

        {/* Gotham */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Gotham — Inscriptions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Nom', 'Email', 'Type', 'Prix', 'Paiement', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gotham_registrations.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune inscription</td></tr>
                ) : gotham_registrations.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.ticket_type === 'external'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {r.ticket_type === 'external' ? 'Externe' : 'Primaner'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.price > 0 ? `€${r.price}` : 'Gratuit'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.payment_status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {r.payment_status === 'paid' ? 'Payé ✓' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{r.created_at ? formatDate(r.created_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Merch */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Merch — Commandes</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Nom', 'Email', 'Articles', 'Promo', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {merch_orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Aucune commande</td></tr>
                ) : merch_orders.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{o.name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{o.email ?? '—'}</td>
                    <td className="px-4 py-3">
                      <ul className="space-y-1.5">
                        {o.items.map((item, i) => (
                          <li key={i} className="text-gray-700 flex items-center gap-2 flex-wrap">
                            <span className="font-semibold whitespace-nowrap">{item.quantity}×</span>
                            <span className="font-medium text-gray-900">{item.productName}</span>
                            <ColorPairChip color={item.color} motifColor={item.motifColor} />
                            <span className="text-gray-500 text-xs">
                              {item.color}
                              {item.motifColor && item.motifColor !== item.color ? ` + motif ${item.motifColor}` : ''}
                              {item.design ? ` · ${item.design}` : ''}
                              {item.size ? ` · ${item.size}` : ''}
                              {' · '}€{item.price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.promo_code ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{o.created_at ? formatDate(o.created_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Restaurant */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Restaurant — Réservations</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Nom', 'Classe', 'Email', 'Entrée', 'Plat', 'Dessert', 'Boissons', 'Supplément', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurant_reservations.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Aucune réservation</td></tr>
                ) : restaurant_reservations.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.first_name} {r.last_name}</td>
                    <td className="px-4 py-3 text-gray-600">{r.class_group}</td>
                    <td className="px-4 py-3 text-gray-600">{r.email}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px]" title={r.menu_selection ? lookup(r.menu_selection.starter, STARTERS) : ''}>
                      <span className="line-clamp-2">{r.menu_selection ? lookup(r.menu_selection.starter, STARTERS) : '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px]" title={r.menu_selection ? lookup(r.menu_selection.main, MAINS) : ''}>
                      <span className="line-clamp-2">{r.menu_selection ? lookup(r.menu_selection.main, MAINS) : '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px]" title={r.menu_selection ? lookup(r.menu_selection.dessert, DESSERTS) : ''}>
                      <span className="line-clamp-2">{r.menu_selection ? lookup(r.menu_selection.dessert, DESSERTS) : '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        r.menu_selection?.drinks === 'alcoholic'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {r.menu_selection?.drinks === 'alcoholic' ? 'Alcoolisées' : 'Non-alcoolisées'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {r.total_surcharge > 0 ? `+€${r.total_surcharge}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{r.created_at ? formatDate(r.created_at) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}
