import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AccessCodeGate } from './AccessCodeGate'
import { MenuForm } from './MenuForm'
import { Footer } from '../../components/layout/Footer'

export default function PromRestaurant() {
  const [hasAccess, setHasAccess] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const success = searchParams.get('success') === '1'
  const cancelled = searchParams.get('cancelled') === '1'

  useEffect(() => {
    if (sessionStorage.getItem('restaurant_access') === 'true') {
      setHasAccess(true)
    }
  }, [])

  useEffect(() => {
    if (success || cancelled) {
      setSearchParams({}, { replace: true })
    }
  }, [success, cancelled, setSearchParams])

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
              href="https://maps.google.com/?q=14+Avenue+de+la+Faiencerie+1510+Limpertsberg+Luxembourg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-resto-accent transition-colors underline underline-offset-4"
            >
              14 Av. de la Faïencerie, 1510 Limpertsberg
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-resto-border max-w-4xl mx-auto" />

      {/* Success state */}
      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16"
        >
          <div className="w-16 h-16 rounded-full bg-green-900/30 border border-green-600/30 flex items-center justify-center mb-6">
            <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-resto-text mb-3">Réservation confirmée</h3>
          <p className="text-resto-text/60 text-sm max-w-sm leading-relaxed">
            Votre paiement a été accepté. Vous recevrez une confirmation par email.
          </p>
        </motion.div>
      ) : (
        <>
          {cancelled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto px-6 pt-8"
            >
              <div className="px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
                Paiement annulé. Vous pouvez réessayer ci-dessous.
              </div>
            </motion.div>
          )}
          <MenuForm />
        </>
      )}

      <div className="border-t border-resto-border" style={{ marginTop: '2rem' }}>
        <Footer />
      </div>
    </div>
  )
}
