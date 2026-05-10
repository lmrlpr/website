import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Loader2 } from 'lucide-react'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { STARTERS, MAINS, DESSERTS } from '../../utils/constants'
import { redirectToRestaurantCheckout } from '../../services/stripe'
import type { DrinkPackage } from '../../types/menuSelection'

type FoodId = 'entree' | 'hauptplat' | 'dessert' | 'gedrenks'
type UserType = 'primaner' | 'proffen' | ''

interface FD {
  starter: string; main: string; dessert: string
  drinks: DrinkPackage | ''
  userType: UserType
  firstName: string; lastName: string; classGroup: string; email: string; phone: string
}

const BLANK: FD = {
  starter: '', main: '', dessert: '', drinks: '',
  userType: '',
  firstName: '', lastName: '', classGroup: '', email: '', phone: '',
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const FOOD_IDS: FoodId[] = ['entree', 'hauptplat', 'dessert', 'gedrenks']
const ALL_REQUIRED = [...FOOD_IDS, 'profil', 'personal']

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

function ProfileSelector({ selected, onChange }: { selected: UserType; onChange: (t: UserType) => void }) {
  const options: { id: UserType; label: string; sub: string; price: string }[] = [
    { id: 'primaner', label: 'Primaner', sub: 'Élève LMRL', price: '5 € / 12 €' },
    { id: 'proffen',  label: 'Proffen',  sub: 'Professeur', price: '35 € / 42 €' },
  ]
  return (
    <div>
      <div className="relative mb-5">
        <div className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none" style={{ color: '#EBF0FA', zIndex: 0 }}>05</div>
        <div style={{ zIndex: 1, position: 'relative' }}>
          <h3 className="font-resto text-2xl" style={{ letterSpacing: '0.05em', color: '#1B2D52' }}>Profil</h3>
          <div className="mt-1.5 h-0.5 w-10 rounded-full" style={{ background: 'linear-gradient(90deg, #2558C9, #F5C640)' }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const isSel = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              whileHover={isSel ? {} : { y: -2 }}
              className="text-left rounded-xl border transition-colors duration-200 cursor-pointer overflow-hidden"
              style={isSel ? {
                background: 'linear-gradient(145deg, #1B2D52 0%, #2558C9 100%)',
                borderColor: '#2558C9',
                boxShadow: '0 6px 24px rgba(37,88,201,0.28)',
              } : {
                background: '#FFFFFF',
                borderColor: '#C3D1EC',
                boxShadow: '0 1px 4px rgba(37,88,201,0.06)',
              }}
            >
              {isSel && <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #F5C640, rgba(245,198,64,0.3))' }} />}
              <div className="px-4 py-4">
                <p className={`font-sans font-semibold text-sm mb-0.5 ${isSel ? 'text-white' : 'text-[#1B2D52]'}`}>{opt.label}</p>
                <p className={`font-sans text-xs mb-3 ${isSel ? 'text-white/60' : 'text-[#7A91B8]'}`}>{opt.sub}</p>
                <p className={`font-resto text-lg ${isSel ? 'text-white' : 'text-[#1B2D52]'}`}>{opt.price}</p>
                <p className={`font-sans text-[10px] mt-0.5 ${isSel ? 'text-white/50' : 'text-[#B0BDD4]'}`}>ouni / mat alcool</p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

const STEPS = [
  { id: 'entree',    label: 'Entrée' },
  { id: 'hauptplat', label: 'Haaptplat' },
  { id: 'dessert',   label: 'Dessert' },
  { id: 'gedrenks',  label: 'Gedrénks' },
  { id: 'profil',    label: 'Profil' },
  { id: 'personal',  label: 'Donnéen' },
]

const CIRC = 34

function Stepper({ done, doneCount }: { done: Set<string>; doneCount: number }) {
  // scaleX relative to the track that runs exactly from circle-1-center to circle-5-center
  const trackScale = Math.max(0, doneCount - 1) / (STEPS.length - 1)

  return (
    <div className="pt-8 pb-6">
      {/* connecting track */}
      <div className="relative flex items-center justify-between mb-3">
        {/* grey background track — inset by half a circle on each side */}
        <div
          className="absolute"
          style={{ left: CIRC / 2, right: CIRC / 2, top: '50%', height: 2, background: '#DDE8F5', transform: 'translateY(-50%)', zIndex: 0 }}
        />
        {/* progress fill — same inset, animated via scaleX from left */}
        <motion.div
          className="absolute"
          style={{ left: CIRC / 2, right: CIRC / 2, top: '50%', height: 2, background: 'linear-gradient(90deg, #22c55e, #2558C9)', transform: 'translateY(-50%)', transformOrigin: 'left', zIndex: 1 }}
          animate={{ scaleX: trackScale }}
          transition={{ duration: 0.65, ease: EASE }}
        />
        {STEPS.map((step, i) => {
          const isDone = done.has(step.id)
          const isNext = i === doneCount
          return (
            <div key={step.id} className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
              <motion.div
                animate={{
                  background: isDone ? '#22c55e' : isNext ? '#EBF3FF' : '#F0F4FB',
                  borderColor: isDone ? '#22c55e' : isNext ? '#2558C9' : '#C3D1EC',
                  scale: isDone && i === doneCount - 1 ? [1, 1.25, 1] : 1,
                }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '2px solid',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="font-sans font-semibold" style={{ fontSize: 12, color: isNext ? '#2558C9' : '#B0BDD4' }}>
                    {i + 1}
                  </span>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
      {/* labels row */}
      <div className="flex items-start justify-between">
        {STEPS.map((step, i) => {
          const isDone = done.has(step.id)
          const isNext = i === doneCount
          return (
            <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
              <span
                className="font-sans text-center"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: isDone ? '#16a34a' : isNext ? '#2558C9' : '#B0BDD4',
                  fontWeight: isDone || isNext ? 600 : 400,
                  lineHeight: 1.3,
                }}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── main component ────────────────────────────────────────────────────────────

export function PortanovaOrbit() {
  const [fd, setFd]       = useState<FD>(BLANK)
  const [done, setDone]   = useState<Set<string>>(new Set())
  const [editing, setEditing] = useState<Set<string>>(new Set())
  const [errs, setErrs]   = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const profilRef   = useRef<HTMLDivElement>(null)
  const personalRef = useRef<HTMLDivElement>(null)
  const payRef      = useRef<HTMLDivElement>(null)

  const foodDone     = FOOD_IDS.every(id => done.has(id))
  const profilDone   = done.has('profil')
  const personalDone = done.has('personal')
  const allDone      = foodDone && profilDone && personalDone
  const doneCount    = ALL_REQUIRED.filter(id => done.has(id)).length
  const hasAlc       = fd.drinks === 'alcoholic'
  const basePrice    = fd.userType === 'proffen' ? 35 : fd.userType === 'primaner' ? 5 : 0
  const total        = basePrice + (hasAlc ? 7 : 0)

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
    if (foodDone && !profilDone) {
      setTimeout(() => profilRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500)
    }
  }, [foodDone])

  useEffect(() => {
    if (profilDone && !personalDone) {
      setTimeout(() => personalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500)
    }
  }, [profilDone])

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

  const onProfil = () => {
    if (!fd.userType) return
    markDone('profil')
  }

  const onPersonal = () => {
    const e: Record<string, string> = {}
    if (!fd.firstName.trim())                                e.firstName  = 'Requis'
    if (!fd.lastName.trim())                                 e.lastName   = 'Requis'
    if (fd.userType !== 'proffen' && !fd.classGroup.trim()) e.classGroup = 'Requis'
    if (!fd.email.includes('@'))                             e.email      = 'Email invalide'
    if (Object.keys(e).length)   { setErrs(e); return }
    setErrs({})
    markDone('personal')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setSubmitError(null)
    try {
      await redirectToRestaurantCheckout({
        firstName: fd.firstName, lastName: fd.lastName, classGroup: fd.classGroup,
        email: fd.email, phone: fd.phone,
        starter: fd.starter, main: fd.main, dessert: fd.dessert,
        drinks: fd.drinks, hasAlcohol: hasAlc,
        userType: fd.userType as 'primaner' | 'proffen',
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Feeler. Probéier nach eng Kéier.')
      setLoading(false)
    }
  }

  // ── food section renderer ─────────────────────────────────────────────────

  const renderFood = (id: FoodId, title: string, num: string) => {
    const collapsed = isCollapsed(id)
    return (
      <motion.div
        key={id}
        ref={el => { sectionRefs.current[id] = el }}
        data-section
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
      style={{
        background: 'linear-gradient(160deg, #E6F3FF 0%, #F0F8FF 30%, #FFFFFF 58%, #EEF6FF 85%, #F5FBFF 100%)',
        paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))',
      }}
    >
      {/* ── sticky progress bar ───────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(195,209,236,0.4)',
        }}
      >
        {/* thin fill line */}
        <div className="relative overflow-hidden" style={{ height: 2, background: '#EEF3FA' }}>
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ background: 'linear-gradient(90deg, #22c55e 0%, #2558C9 100%)' }}
            animate={{ width: `${(doneCount / 6) * 100}%` }}
            transition={{ duration: 0.65, ease: EASE }}
          />
        </div>
      </div>

      {/* ── page content ──────────────────────────────────────────────────────── */}
      {/* scroll-margin-top keeps sections from sliding under nav+progress bar on scrollIntoView */}
      <div className="max-w-xl mx-auto px-4 pb-28 [&_[data-section]]:scroll-mt-28">

        {/* Address */}
        <motion.p
          className="font-sans text-center"
          style={{ fontSize: 15, letterSpacing: '0.06em', color: '#1B2D52', paddingTop: 20, paddingBottom: 2, fontWeight: 500 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          14 Av. de la Faïencerie, Limpertsberg
        </motion.p>
        <motion.p
          className="font-sans text-center"
          style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#7A91B8' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          20h – 00h
        </motion.p>

        {/* Stepper */}
        <Stepper done={done} doneCount={doneCount} />

        {/* ── food sections ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {renderFood('entree',    'Entrée',    '01')}
          {renderFood('hauptplat', 'Haaptplat', '02')}
          {renderFood('dessert',   'Dessert',   '03')}

          {/* Gedrénks */}
          <motion.div
            ref={el => { sectionRefs.current['gedrenks'] = el }}
            data-section
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

        {/* ── food gate indicator ───────────────────────────────────────────── */}
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

        {/* ── profil section ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {foodDone && (
            <motion.div
              key="profil-block"
              ref={profilRef}
              data-section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="mt-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #DDE8F5)' }} />
                <span className="font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: '#7A91B8' }}>Profil</span>
                <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #DDE8F5, transparent)' }} />
              </div>
              <CardShell done={isCollapsed('profil')}>
                {isCollapsed('profil') ? (
                  <DoneRow
                    num="05" title="Profil"
                    summary={fd.userType === 'primaner' ? 'Primaner — 5 € / 12 €' : 'Proffen — 35 € / 42 €'}
                    onEdit={() => editSection('profil')}
                  />
                ) : (
                  <>
                    <CardTop />
                    <div className="px-5 pt-5 pb-6">
                      <ProfileSelector selected={fd.userType} onChange={v => setFd(d => ({ ...d, userType: v }))} />
                      <div className="mt-5">
                        <ConfirmBtn onClick={onProfil} disabled={!fd.userType} />
                      </div>
                    </div>
                  </>
                )}
              </CardShell>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── personal section ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {profilDone && (
            <motion.div
              key="personal-block"
              ref={personalRef}
              data-section
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
                        <div className="absolute -top-3 -left-2 font-resto text-[5rem] leading-none pointer-events-none select-none" style={{ color: '#EBF0FA', zIndex: 0 }}>06</div>
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
                        {fd.userType !== 'proffen' && (
                          <Field label="Classe" value={fd.classGroup} onChange={set('classGroup')} placeholder="1CM2" error={errs.classGroup} />
                        )}
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

              {/* error banner */}
              {submitError && (
                <div
                  className="mb-3 px-4 py-3 rounded-xl text-sm font-sans"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#B42318' }}
                >
                  {submitError}
                </div>
              )}

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
