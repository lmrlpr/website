import { useState } from 'react'
import { getEntries, clearEntries, type StoredEntry, type StoredRestaurant, type StoredGotham, type StoredMerch } from '../../utils/localStore'

function fmt(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function exportCSV(entries: StoredEntry[]) {
  const rows: string[][] = [['Type', 'Prénom', 'Nom', 'Email', 'Détails', 'Date']]

  for (const e of entries) {
    if (e.type === 'restaurant') {
      const r = e as StoredRestaurant
      rows.push([
        'Restaurant',
        r.firstName, r.lastName, r.email,
        `Classe: ${r.classGroup} | Entrée: ${r.starter} | Plat: ${r.main} | Dessert: ${r.dessert} | Boissons: ${r.drinks}${r.surcharge > 0 ? ` (+${r.surcharge}€)` : ''}`,
        fmt(r.savedAt),
      ])
    } else if (e.type === 'gotham') {
      const g = e as StoredGotham
      rows.push([
        'Gotham',
        g.firstName, g.lastName, g.email,
        `Type: ${g.ticketType === 'primaner' ? 'Primaner' : 'Externe'} | Prix: ${g.price > 0 ? `${g.price}€` : 'Gratuit'}`,
        fmt(g.savedAt),
      ])
    } else {
      const m = e as StoredMerch
      const detail = m.items.map(i => `${i.qty}× ${i.name} ${i.color}${i.size ? ` ${i.size}` : ''} ${i.price}€`).join(', ')
      rows.push([
        'Merch',
        '', '', '',
        detail + (m.promoCode ? ` | Promo: ${m.promoCode}` : ''),
        fmt(m.savedAt),
      ])
    }
  }

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `primaner_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function Admin() {
  const [entries, setEntries] = useState<StoredEntry[]>(() => getEntries())
  const [tab, setTab] = useState<'all' | 'restaurant' | 'gotham' | 'merch'>('all')

  const restaurants = entries.filter(e => e.type === 'restaurant') as StoredRestaurant[]
  const gothams = entries.filter(e => e.type === 'gotham') as StoredGotham[]
  const merchs = entries.filter(e => e.type === 'merch') as StoredMerch[]

  const visible = tab === 'all' ? entries
    : tab === 'restaurant' ? restaurants
    : tab === 'gotham' ? gothams
    : merchs

  function handleClear() {
    if (!confirm('Effacer toutes les entrées ?')) return
    clearEntries()
    setEntries([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Coordinateur</h1>
            <p className="text-gray-400 mt-1 text-sm">{entries.length} entrée{entries.length !== 1 ? 's' : ''} enregistrée{entries.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => exportCSV(entries)}
              disabled={entries.length === 0}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-40 transition-colors"
            >
              Exporter CSV
            </button>
            <button
              onClick={handleClear}
              disabled={entries.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Effacer tout
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Restaurant', count: restaurants.length, sub: `${restaurants.filter(r => r.drinks === 'alcoholic').length} alcoolisées`, key: 'restaurant' },
            { label: 'Gotham', count: gothams.length, sub: `${gothams.filter(g => g.ticketType === 'external').length} externes`, key: 'gotham' },
            { label: 'Merch', count: merchs.length, sub: `${merchs.reduce((s, m) => s + m.items.reduce((a, i) => a + i.qty, 0), 0)} articles`, key: 'merch' },
          ].map(c => (
            <button
              key={c.key}
              onClick={() => setTab(tab === c.key as typeof tab ? 'all' : c.key as typeof tab)}
              className={`text-left bg-white rounded-2xl border p-6 transition-all ${tab === c.key ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="text-4xl font-bold text-gray-900">{c.count}</div>
              <div className="text-sm font-medium text-gray-700 mt-1">{c.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
            </button>
          ))}
        </div>

        {/* Table */}
        {visible.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-16 text-center text-gray-400 text-sm">
            Aucune entrée — les inscriptions et commandes apparaîtront ici automatiquement.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Type', 'Nom', 'Email', 'Détails', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visible.map(e => {
                  if (e.type === 'restaurant') {
                    const r = e as StoredRestaurant
                    return (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Restaurant</span></td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{r.firstName} {r.lastName}<span className="text-gray-400 font-normal ml-1 text-xs">{r.classGroup}</span></td>
                        <td className="px-4 py-3 text-gray-500">{r.email}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs">
                          <div className="text-xs space-y-0.5">
                            <div><span className="text-gray-400">Entrée:</span> {r.starter}</div>
                            <div><span className="text-gray-400">Plat:</span> {r.main}</div>
                            <div><span className="text-gray-400">Dessert:</span> {r.dessert}</div>
                            <div>
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-xs font-medium ${r.drinks === 'alcoholic' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                {r.drinks === 'alcoholic' ? `Alcoolisées +${r.surcharge}€` : 'Non-alcoolisées'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(r.savedAt)}</td>
                      </tr>
                    )
                  }
                  if (e.type === 'gotham') {
                    const g = e as StoredGotham
                    return (
                      <tr key={g.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">Gotham</span></td>
                        <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{g.firstName} {g.lastName}</td>
                        <td className="px-4 py-3 text-gray-500">{g.email}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${g.ticketType === 'external' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {g.ticketType === 'primaner' ? 'Primaner' : 'Externe'}
                          </span>
                          {g.price > 0 && <span className="ml-2 text-gray-400">{g.price}€</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(g.savedAt)}</td>
                      </tr>
                    )
                  }
                  const m = e as StoredMerch
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Merch</span></td>
                      <td className="px-4 py-3 text-gray-400 text-xs">—</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">—</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        <ul className="space-y-0.5">
                          {m.items.map((i, idx) => (
                            <li key={idx}><span className="font-semibold">{i.qty}×</span> {i.name} · {i.color}{i.size ? ` · ${i.size}` : ''} · {i.price}€</li>
                          ))}
                        </ul>
                        {m.promoCode && <div className="text-gray-400 mt-1">Promo: {m.promoCode}</div>}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{fmt(m.savedAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
