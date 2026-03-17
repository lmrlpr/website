import { useState, useEffect } from 'react'
import { AccessCodeGate } from './AccessCodeGate'
import { MenuForm } from './MenuForm'
import { Footer } from '../../components/layout/Footer'

export default function PromRestaurant() {
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('restaurant_access') === 'true') {
      setHasAccess(true)
    }
  }, [])

  if (!hasAccess) {
    return <AccessCodeGate onSuccess={() => setHasAccess(true)} />
  }

  return (
    <div className="min-h-screen bg-resto-bg text-resto-text">
      {/* Hero */}
      <div className="pt-32 pb-16 px-6 md:px-10 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.4em] uppercase text-resto-text/40 mb-4">Prom Night · 20h – 00h</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Porta Nova</h1>
        <p className="text-resto-text/60 text-base md:text-lg max-w-lg leading-relaxed mb-8">
          Dîner complet — entrée, plat, dessert et boissons inclus pour les Primaner et professeurs du LMRL.
        </p>

        <div className="flex flex-wrap gap-6 text-sm text-resto-text/50">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <a
              href="https://maps.google.com/?q=14+Avenue+de+la+Faïencerie+1510+Limpertsberg+Luxembourg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-resto-accent transition-colors underline underline-offset-4"
            >
              14 Av. de la Faïencerie, 1510 Limpertsberg
            </a>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            175 personnes · Élèves & professeurs uniquement
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8 max-w-4xl mx-auto" />

      {/* Form */}
      <MenuForm />

      <div className="border-t border-white/8" style={{ marginTop: '2rem' }}>
        <Footer />
      </div>
    </div>
  )
}
