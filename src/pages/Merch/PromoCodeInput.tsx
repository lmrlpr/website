import { useState } from 'react'
import { useCart } from '../../context/CartContext'

export function PromoCodeInput() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const { promoCode, applyPromoCode, clearPromoCode, discountLabel } = useCart()

  const handleApply = () => {
    if (!code.trim()) return
    const ok = applyPromoCode(code)
    setStatus(ok ? 'success' : 'error')
    if (ok) setCode('')
    setTimeout(() => setStatus('idle'), 3000)
  }

  if (promoCode) {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-medium text-green-700">{discountLabel}</span>
        </div>
        <button onClick={clearPromoCode} className="text-xs text-green-600 hover:text-green-800 transition-colors">
          Retirer
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={code}
        onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus('idle') }}
        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        placeholder="CODE PROMO"
        className={`flex-1 px-4 py-2.5 text-sm border rounded-xl outline-none transition-colors uppercase tracking-wider ${
          status === 'error' ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-ink focus:border-ink'
        }`}
      />
      <button
        onClick={handleApply}
        className="px-4 py-2.5 text-sm font-medium bg-ink text-white rounded-xl hover:bg-ink/80 transition-colors"
      >
        Appliquer
      </button>
    </div>
  )
}
