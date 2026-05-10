import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2 } from 'lucide-react'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { STARTERS, MAINS, DESSERTS } from '../../utils/constants'
import { redirectToRestaurantCheckout } from '../../services/stripe'
import type { DrinkPackage } from '../../types/menuSelection'

type FoodId = 'entree' | 'hauptplat' | 'dessert' | 'gedrenks'

interface FD {
  starter: string; main: string; dessert: string
  drinks: DrinkPackage | ''
  firstName: string; lastName: string; classGroup: string; email: string; phone: string
}

const BLANK: FD = {
  starter: '', main: '', dessert: '', drinks: '',
  firstName: '', lastName: '', classGroup: '', email: '', phone: '',
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FOOD_IDS: FoodId[] = ['entree', 'hauptplat', 'dessert', 'gedrenks']
const ALL_REQUIRED = [...FOOD_IDS, 'personal']

// ── helpers ───────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, placeholder, error, type = 'text', optional = false }: {
  label: string; value: string; onChange: (v: string) => void
  placeholder?: string; error?: string; type?: string; optional?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] tracking-[0.2em] uppercase font-semibold font-sans" style={{ color: '#2558C9' }}>
        {label}{optional && <span className="ml-1 normal-case tracking-normal font-normal opacity-50">— optionnel</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border rounded-xl text-sm px-4 py-3 outline-none transition-all duration-200 font-sans bg-white"
        style={{ borderColor: error ? '#EF4444' : '#C3D1EC', color: '#1B2D52' }}
        onFocus={e => { e.target.style.borderColor = error ? '#EF4444' : '#2558C9'; e.target.style.boxShadow = error ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3px rgba(37,88,201,0.10)' }}
        onBlur={e => { e.target.style.borderColor = error ? '#EF4444' : '#C3D1EC'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p className="text-xs font-sans" style={{ color: '#EF4444' }}>{error}</p>}
    </div>
  )
}

function ConfirmBtn({ onClick, disabled, label = 'Bestätegen' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <motion.button
      onClick={onClick} disabled={disabled}
      whileHover={disabled ? {} : { y: -1 }} whileTap={disabled ? {} : { scale: 0.98 }}
      className="w-full py-3.5 rounded-xl text-sm font-semibold font-sans"
      style={disabled
        ? { background: '#EBF0FA', color: '#9AAACF', cursor: 'not-allowed' }
        : { background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)', color: 'white', boxShadow: '0 4px 16px rgba(37,88,201,0.28)', cursor: 'pointer' }
      }
    >
      {label}
    </motion.button>
  )
}

function DoneRow({ num, title, summary, onEdit }: { num: string; title: string; summary: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#22c55e' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-medium mb-0.5" style={{ color: '#16a34a' }}>
            {num} · {title}
          </p>
          <p className="font-sans text-sm font-medium" style={{ color: '#1B2D52' }}>{summary}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="font-sans text-xs font-medium px-3 py-1.5 rounded-lg"
        style={{ color: '#2558C9', background: 'rgba(37,88,201,0.06)', border: 'none', cursor: 'pointer' }}
      >
        Änner
      </button>
    </div>
  )
}

function CardShell({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{
        borderColor: done ? '#BBF7D0' : '#DDE8F5',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 2px 16px rgba(37,88,201,0.06)',
        transition: 'border-color 0.4s',
      }}
    >
      {children}
    </div>
  )
}

function CardTop() {
  return <div style={{ height: 3, background: 'linear-gradient(90deg, #1B2D52 0%, #2558C9 100%)', borderRadius: '2px 2px 0 0' }} />
}

// ── main component ────────────────────────────────────────────────────────────

export function PortanovaOrbit() {
  const [fd, setFd]       = useState<FD>(BLANK)
  const [done, setDone]   = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<Set<string>>(new Set())
  const [errs, setErrs]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const personalRef = useRef<HTMLDivElement>(null)
  const payRef      = useRef<HTMLDivElement>(null)

  const foodDone    = FOOD_IDS.every(id => done.has(id))
  const personalDone = done.has('personal')
  const allDone     = foodDone && personalDone
  const doneCount   = ALL_REQUIRED.filter(id => done.has(id)).length
  const hasAlc      = fd.drinks === 'alcoholic'
  const total       = 20 + (hasAlc ? 7 : 0)

  const isCollapsed = (id: string) => done.has(id) && !editing.has(id)

  const markDone = (id: string) => {
    setDone(p => new Set([...p, id]))
    setEditing(p => { const n = new Set(p); n.delete(id); return n })
    const idx = FOOD_IDS.indexOf(id as FoodId)
    if (idx >= 0 && idx < FOOD_IDS.length - 1) {
      const nextId = FOOD_IDS[idx + 1]
      setTimeout(() => {
        sectionRefs.current[nextId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 320)
    }
  }

  const editSection = (id: string) => {
    setEditing(p => new Set([...p, id]))
  }

  useEffect(() => {
    if (foodDone && !personalDone) {
      setTimeout(() => personalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500)
    }
  }, [foodDone])

  useEffect(() => {
    if (allDone) {
      setTimeout(() => payRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400)
    }
  }, [allDone])

  const getLabel = (id: string): string => {
    if (id === 'entree')    return STARTERS.find(o => o.id === fd.starter)?.label ?? ''
    if (id === 'hauptplat') return MAINS.find(o => o.id === fd.main)?.label ?? ''
    if (id === 'dessert')   return DESSERTS.find(o => o.id === fd.dessert)?.label ?? ''
    if (id === 'gedrenks')  return fd.drinks === 'alcoholic' ? 'Mat Alcool (+7 €)' : fd.drinks === 'non-alcoholic' ? 'Ouni Alcool' : ''
    return ''
  }

  const set = (f: keyof FD) => (v: string) => { setFd(d => ({ ...d, [f]: v })); setErrs(e => ({ ...e, [f]: '' })) }

  const onFood = (id: FoodId) => {
    const val = id === 'entree' ? fd.starter : id === 'hauptplat' ? fd.main : fd.dessert
    if (!val) return
    markDone(id)
  }

  const onDrinks = () => {
    if (!fd.drinks) { setErrs(e => ({ ...e, drinks: 'Wielt deng Gedrénks' })); return }
    markDone('gedrenks')
  }

  const onPersonal = () => {
    const e: Record<string, string> = {}
    if (!fd.firstName.trim())    e.firstName  = 'Requis'
    if (!fd.lastName.trim())     e.lastName   = 'Requis'
    if (!fd.classGroup.trim())   e.classGroup = 'Requis'
    if (!fd.email.includes('@')) e.email      = 'Email invalide'
    if (Object.keys(e).length)   { setErrs(e); return }
    setErrs({})
    markDone('personal')
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await redirectToRestaurantCheckout({
        firstName: fd.firstName, lastName: fd.lastName, classGroup: fd.classGroup,
        email: fd.email, phone: fd.phone,
        starter: fd.starter, main: fd.main, dessert: fd.dessert,
        drinks: fd.drinks, hasAlcohol: hasAlc,
      })
    } catch { setLoading(false) }
  }

  // ── food section renderer ─────────────────────────────────────────────────

  const renderFood = (id: FoodId, title: string, num: string) => {
    const collapsed = isCollapsed(id)
    return (
      <motion.div
        key={id}
        ref={el => { sectionRefs.current[id] = el }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <CardShell done={collapsed}>
          {collapsed ? (
            <DoneRow num={num} title={title} summary={getLabel(id)} onEdit={() => editSection(id)} />
          ) : (
            <>
              <CardTop />
              <div className="px-5 pt-5 pb-6">
                {id === 'entree'    && <CourseSelector title="Entrée"    options={STARTERS} selected={fd.starter} onChange={v => setFd(d => ({ ...d, starter: v }))} courseNumber={num} />}
                {id === 'hauptplat' && <CourseSelector title="Haaptplat" options={MAINS}    selected={fd.main}    onChange={v => setFd(d => ({ ...d, main: v }))}    courseNumber={num} />}
                {id === 'dessert'   && <CourseSelector title="Dessert"   options={DESSERTS} selected={fd.dessert} onChange={v => setFd(d => ({ ...d, dessert: v }))} courseNumber={num} />}
                <div className="mt-5">
                  <ConfirmBtn
                    onClick={() => onFood(id)}
                    disabled={!(id === 'entree' ? fd.starter : id === 'hauptplat' ? fd.main : fd.dessert)}
                  />
                </div>
              </div>
            </>
          )}
        </CardShell>
      </motion.div>
    )
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #E6F3FF 0%, #F0F8FF 30%, #FFFFFF 58%, #EEF6FF 85%, #F5FBFF 100%)' }}
    >
      {/* ── sticky progress bar ───────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40"
        style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(195,209,236,0.4)' }}
      >
        {/* progress fill */}
        <div className="relative overflow-hidden" style={{ height: 3, background: '#EEF3FA' }}>
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ background: 'linear-gradient(90deg, #2558C9 0%, #F5C640 100%)' }}
            animate={{ width: `${(doneCount / 5) * 100}%` }}
            transition={{ duration: 0.65, ease: EASE }}
          />
        </div>
        {/* label row */}
        <div className="max-w-xl mx-auto flex items-center justify-between px-5 py-2.5">
          <span className="font-resto" style={{ fontSize: 13, letterSpacing: '0.2em', color: '#1B2D52' }}>PORTA NOVA</span>
          <div className="flex items-center gap-1.5">
            {ALL_REQUIRED.map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  background: i < doneCount ? '#22c55e' : '#C3D1EC',
                  scale: i === doneCount - 1 ? [1, 1.4, 1] : 1,
                }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ width: 7, height: 7, borderRadius: '50%' }}
              />
            ))}
            <span className="font-sans ml-1" style={{ fontSize: 11, color: '#7A91B8' }}>{doneCount}/5</span>
          </div>
        </div>
      </div>

      {/* ── page content ──────────────────────────────────────────────────────── */}
      <div className="max-w-xl mx-auto px-4 pb-28">

        {/* Hero */}
        <div className="text-center pt-10 pb-8">
          <motion.h1
            className="font-resto"
            style={{ fontSize: 'clamp(2.4rem, 9vw, 4.8rem)', letterSpacing: '0.22em', color: '#1B2D52' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            PORTA NOVA
          </motion.h1>
          <motion.div
            style={{ height: 1, width: 72, margin: '7px auto 0', background: 'linear-gradient(90deg, transparent, #F5C640, transparent)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
          />
          <motion.p
            className="font-sans mt-2"
            style={{ fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#7A91B8' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            Prom Restaurant · 2026
          </motion.p>
          <motion.p
            className="font-sans mt-1"
            style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8C9E0' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            20h – 00h &nbsp;·&nbsp; 14 Av. de la Faïencerie &nbsp;·&nbsp; 20 € / 27 €
          </motion.p>
        </div>

        {/* Section label */}
        <motion.p
          className="font-sans text-[10px] uppercase tracking-[0.35em] mb-4"
          style={{ color: '#7A91B8' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          Wiel däi Menu
        </motion.p>

        {/* ── food sections ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {renderFood('entree',    'Entrée',    '01')}
          {renderFood('hauptplat', 'Haaptplat', '02')}
          {renderFood('dessert',   'Dessert',   '03')}

          {/* Gedrénks */}
          <motion.div
            ref={el => { sectionRefs.current['gedrenks'] = el }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
          >
            <CardShell done={isCollapsed('gedrenks')}>
              {isCollapsed('gedrenks') ? (
                <DoneRow num="04" title="Gedrénks" summary={getLabel('gedrenks')} onEdit={() => editSection('gedrenks')} />
              ) : (
                <>
                  <CardTop />
                  <div className="px-5 pt-5 pb-6">
                    {errs.drinks && <p className="text-xs font-sans mb-3" style={{ color: '#EF4444' }}>{errs.drinks}</p>}
                    <DrinkSelector
                      selected={fd.drinks}
                      onChange={pkg => { setFd(d => ({ ...d, drinks: pkg })); setErrs(e => ({ ...e, drinks: '' })) }}
                    />
                    <div className="mt-5"><ConfirmBtn onClick={onDrinks} disabled={!fd.drinks} /></div>
                  </div>
                </>
              )}
            </CardShell>
          </motion.div>
        </div>

        {/* ── gate indicator ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {!foodDone && (
            <motion.div
              key="gate"
              className="flex items-center justify-center gap-2 mt-8 py-4"
              initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Lock size={13} style={{ color: '#5A7AB0' }} />
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase" style={{ color: '#5A7AB0' }}>
                Fëllt éischt all Rubriken aus
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── personal section ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {foodDone && (
            <motion.div
              key="personal-block"
              ref={personalRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="mt-8"
            >
              {/* divider */}
              <div className="flex items-center gap-3 mb-4">
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #DDE8F5)' }} />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: '#7A91B8' }}>Deng Donnéeën</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #DDE8F5, transparent)' }} />
              </div>

              <CardShell done={isCollapsed('personal')}>
                {isCollapsed('personal') ? (
                  <DoneRow
                    num="05" title="Donnéeën"
                    summary={`${fd.firstName} ${fd.lastName} · ${fd.classGroup}`}
                    onEdit={() => editSection('personal')}
                  />
                ) : (
                  <>
                    <CardTop />
                    <div className="px-5 pt-5 pb-6">
                      <div className="relative mb-5">
                        <div className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none" style={{ color: '#EBF0FA', zIndex: 0 }}>05</div>
                        <div style={{ zIndex: 1, position: 'relative' }}>
                          <h3 className="font-resto text-2xl" style={{ letterSpacing: '0.05em', color: '#1B2D52' }}>Donnéeën</h3>
                          <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #2558C9, #F5C640)' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Prénom"  value={fd.firstName}  onChange={set('firstName')}  placeholder="Jean"   error={errs.firstName} />
                          <Field label="Nom"     value={fd.lastName}   onChange={set('lastName')}   placeholder="Dupont" error={errs.lastName} />
                        </div>
                        <Field label="Classe"    value={fd.classGroup} onChange={set('classGroup')} placeholder="1CM2"              error={errs.classGroup} />
                        <Field label="Email"     value={fd.email}      onChange={set('email')}      placeholder="jean@lycee.lu"     error={errs.email} type="email" />
                        <Field label="Téléphone" value={fd.phone}      onChange={set('phone')}      placeholder="+352 621 000 000"  optional type="tel" />
                      </div>
                      <div className="mt-5"><ConfirmBtn onClick={onPersonal} /></div>
                    </div>
                  </>
                )}
              </CardShell>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── payment section ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              key="payment-block"
              ref={payRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
              className="mt-6"
            >
              {/* summary card */}
              <div
                className="rounded-2xl border mb-3"
                style={{ borderColor: '#DDE8F5', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: '0 2px 16px rgba(37,88,201,0.06)' }}
              >
                <div className="px-5 py-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: '#7A91B8' }}>Resumé</p>
                  <div className="space-y-2">
                    {[
                      { l: 'Entrée',    v: STARTERS.find(o => o.id === fd.starter)?.label },
                      { l: 'Haaptplat', v: MAINS.find(o => o.id === fd.main)?.label },
                      { l: 'Dessert',   v: DESSERTS.find(o => o.id === fd.dessert)?.label },
                      { l: 'Gedrénks',  v: getLabel('gedrenks') },
                    ].map(row => (
                      <div key={row.l} className="flex items-start justify-between gap-3">
                        <span className="font-sans text-xs font-medium shrink-0" style={{ color: '#7A91B8', minWidth: 76 }}>{row.l}</span>
                        <span className="font-sans text-xs text-right" style={{ color: '#1B2D52' }}>{row.v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 1, background: '#EEF3FA', margin: '12px 0' }} />
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold" style={{ color: '#1B2D52' }}>Total</span>
                    <span className="font-resto text-xl" style={{ color: '#1B2D52' }}>{total} €</span>
                  </div>
                </div>
              </div>

              {/* pay button */}
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                whileHover={loading ? {} : { y: -2 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className="w-full py-4 rounded-2xl font-sans font-semibold text-sm flex items-center justify-center gap-2"
                style={loading
                  ? { background: '#C3D1EC', color: 'white', cursor: 'default' }
                  : { background: 'linear-gradient(135deg, #1B2D52 0%, #2558C9 100%)', color: 'white', boxShadow: '0 8px 32px rgba(37,88,201,0.35)', cursor: 'pointer' }
                }
              >
                {loading
                  ? <Loader2 className="animate-spin" size={18} />
                  : <>Bezuelen &nbsp;·&nbsp; {total} €</>
                }
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
