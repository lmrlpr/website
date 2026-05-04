import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { CourseSelector } from './CourseSelector'
import { DrinkSelector } from './DrinkSelector'
import { STARTERS, MAINS, DESSERTS } from '../../utils/constants'
import { redirectToRestaurantCheckout } from '../../services/stripe'
import type { DrinkPackage } from '../../types/menuSelection'

type SectionId = 'entree' | 'hauptplat' | 'dessert' | 'gedrenks' | 'personal' | 'info'
type FoodId = 'entree' | 'hauptplat' | 'dessert'

const SECTIONS = [
  { id: 'entree' as SectionId,    label: 'Entrée',                    short: 'Entrée',    required: true,  angleDeg: -90  },
  { id: 'hauptplat' as SectionId, label: 'Haaptplat',                 short: 'Haaptplat', required: true,  angleDeg: -30  },
  { id: 'dessert' as SectionId,   label: 'Dessert',                   short: 'Dessert',   required: true,  angleDeg: 30   },
  { id: 'gedrenks' as SectionId,  label: 'Gedrénks',                  short: 'Gedrénks',  required: true,  angleDeg: 90   },
  { id: 'personal' as SectionId,  label: 'Perséinlech\nDonnéeën',     short: 'Donnéen',   required: true,  angleDeg: 150  },
  { id: 'info' as SectionId,      label: 'Allgemeng\nInformatiounen', short: 'Infos',     required: false, angleDeg: 210  },
]

const FOOD_MAP: Record<FoodId, { options: typeof STARTERS; field: 'starter' | 'main' | 'dessert'; num: string }> = {
  entree:    { options: STARTERS, field: 'starter', num: '01' },
  hauptplat: { options: MAINS,    field: 'main',    num: '02' },
  dessert:   { options: DESSERTS, field: 'dessert', num: '03' },
}

interface FD {
  starter: string; main: string; dessert: string
  drinks: DrinkPackage | ''
  firstName: string; lastName: string; classGroup: string; email: string; phone: string
}

const BLANK: FD = { starter: '', main: '', dessert: '', drinks: '', firstName: '', lastName: '', classGroup: '', email: '', phone: '' }

const SECTION_STYLE: Record<SectionId, { bg: string; accent: string }> = {
  entree:    { bg: 'rgba(235,243,255,0.86)', accent: '#2558C9' },
  hauptplat: { bg: 'rgba(235,243,255,0.86)', accent: '#2558C9' },
  dessert:   { bg: 'rgba(235,243,255,0.86)', accent: '#2558C9' },
  gedrenks:  { bg: 'rgba(235,243,255,0.86)', accent: '#2558C9' },
  personal:  { bg: 'rgba(232,238,252,0.88)', accent: '#1B2D52' },
  info:      { bg: 'rgba(255,251,228,0.86)', accent: '#B8860B' },
}

const COMP_PARTICLES = [
  { angle: 0,   dist: 32, color: '#22c55e' },
  { angle: 60,  dist: 36, color: '#F5C640' },
  { angle: 120, dist: 28, color: '#22c55e' },
  { angle: 180, dist: 34, color: '#F5C640' },
  { angle: 240, dist: 30, color: '#22c55e' },
  { angle: 300, dist: 38, color: '#F5C640' },
]

// ── animation variants ────────────────────────────────────────────────────────

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const orbitVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.75 } },
}

const nodeVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: (isDimmed: boolean) => ({
    opacity: isDimmed ? 0.35 : 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.35 },
      scale: { duration: 0.7, ease: EASE },
    },
  }),
}

function AnimatedCheck({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <motion.path
        d="M5 13l4 4L19 7"
        stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      />
    </svg>
  )
}

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

// ── panel content ─────────────────────────────────────────────────────────────

function PanelContent({ id, fd, setFd, errs, setErrs, onClose, onFood, onPersonal, onDrinks }: {
  id: SectionId; fd: FD; setFd: React.Dispatch<React.SetStateAction<FD>>
  errs: Record<string, string>; setErrs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  onClose: () => void; onFood: (id: FoodId) => void; onPersonal: () => void; onDrinks: () => void
}) {
  const set = (f: keyof FD) => (v: string) => { setFd(d => ({ ...d, [f]: v })); setErrs(e => ({ ...e, [f]: '' })) }

  if (id === 'info') {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="font-sans text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: '#7A91B8' }}>Prom Night 2026</p>
          <p className="font-resto text-xl mb-5" style={{ color: '#1B2D52', letterSpacing: '0.06em' }}>Porta Nova</p>
          {[
            { l: 'Zäit',   v: '20h – 00h' },
            { l: 'Adress', v: '14 Av. de la Faïencerie\n1510 Limpertsberg' },
            { l: 'Präis',  v: '20 € · +7 € mat Alkohol' },
            { l: 'Menu',   v: 'Entrée · Hauptplat · Dessert · Gedrénks' },
          ].map((row, i) => (
            <div key={row.l}>
              {i > 0 && <div style={{ height: 1, background: '#DDE8F5', margin: '10px 0' }} />}
              <p className="text-[10px] uppercase tracking-widest font-semibold font-sans mb-0.5" style={{ color: '#7A91B8' }}>{row.l}</p>
              <p className="text-sm font-sans whitespace-pre-line" style={{ color: '#1B2D52' }}>{row.v}</p>
            </div>
          ))}
        </div>
        <ConfirmBtn onClick={onClose} label="Verstanen" />
      </div>
    )
  }

  if (id === 'gedrenks') {
    return (
      <div className="flex flex-col gap-4">
        {errs.drinks && <p className="text-xs font-sans" style={{ color: '#EF4444' }}>{errs.drinks}</p>}
        <DrinkSelector selected={fd.drinks} onChange={pkg => { setFd(d => ({ ...d, drinks: pkg })); setErrs(e => ({ ...e, drinks: '' })) }} />
        <div className="mt-2"><ConfirmBtn onClick={onDrinks} disabled={!fd.drinks} /></div>
      </div>
    )
  }

  if (id === 'personal') {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom"  value={fd.firstName}  onChange={set('firstName')}  placeholder="Jean"   error={errs.firstName} />
          <Field label="Nom"     value={fd.lastName}   onChange={set('lastName')}   placeholder="Dupont" error={errs.lastName} />
        </div>
        <Field label="Classe" value={fd.classGroup} onChange={set('classGroup')} placeholder="1CM2"            error={errs.classGroup} />
        <Field label="Email"  value={fd.email}      onChange={set('email')}      placeholder="jean@lycee.lu"   error={errs.email} type="email" />
        <Field label="Téléphone" value={fd.phone}   onChange={set('phone')}      placeholder="+352 621 000 000" optional type="tel" />
        <div className="mt-2"><ConfirmBtn onClick={onPersonal} /></div>
      </div>
    )
  }

  const { options, field, num } = FOOD_MAP[id as FoodId]
  return (
    <div>
      <CourseSelector
        title={id === 'entree' ? 'Entrée' : id === 'hauptplat' ? 'Haaptplat' : 'Dessert'}
        options={options} selected={fd[field]}
        onChange={v => setFd(d => ({ ...d, [field]: v }))}
        courseNumber={num}
      />
      <div className="mt-6"><ConfirmBtn onClick={() => onFood(id as FoodId)} disabled={!fd[field]} /></div>
    </div>
  )
}

// ── panel shell ───────────────────────────────────────────────────────────────

function PanelShell({ id, fd, setFd, errs, setErrs, completed, onClose, onFood, onPersonal, onDrinks, scrollH }: {
  id: SectionId; fd: FD; setFd: React.Dispatch<React.SetStateAction<FD>>
  errs: Record<string, string>; setErrs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  completed: Set<SectionId>; onClose: () => void
  onFood: (id: FoodId) => void; onPersonal: () => void; onDrinks: () => void; scrollH: string
}) {
  const sec = SECTIONS.find(s => s.id === id)!
  const { accent } = SECTION_STYLE[id]
  return (
    <>
      <div style={{ height: 3, background: accent, flexShrink: 0, borderRadius: '0 0 2px 2px' }} />
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #EEF3FA', flexShrink: 0 }}>
        <div>
          {id === 'info' && (
            <h2 className="font-resto" style={{ fontSize: 20, color: '#1B2D52', letterSpacing: '0.05em' }}>
              {sec.label.replace('\n', ' ')}
            </h2>
          )}
          {completed.has(id) && (
            <p className="text-xs font-sans mt-0.5" style={{ color: '#16a34a' }}>Änner deng Wiel</p>
          )}
        </div>
        <button
          onClick={onClose}
          style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF3FA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DDE8F8' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EEF3FA' }}
        >
          <X style={{ width: 14, height: 14, color: '#5A7AB0' }} />
        </button>
      </div>
      <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: scrollH }}>
        <PanelContent id={id} fd={fd} setFd={setFd} errs={errs} setErrs={setErrs} onClose={onClose} onFood={onFood} onPersonal={onPersonal} onDrinks={onDrinks} />
      </div>
    </>
  )
}

// ── main component ────────────────────────────────────────────────────────────

export function PortanovaOrbit() {
  const [active, setActive]               = useState<SectionId | null>(null)
  const [done, setDone]                   = useState<Set<SectionId>>(new Set())
  const [fd, setFd]                       = useState<FD>(BLANK)
  const [errs, setErrs]                   = useState<Record<string, string>>({})
  const [loading, setLoading]             = useState(false)
  const [orbitR, setOrbitR]               = useState(185)
  const [isMobile, setIsMobile]           = useState(false)
  const [ringReady, setRingReady]         = useState(false)
  const [centerVisible, setCenterVisible] = useState(false)
  const [justDone, setJustDone]           = useState<SectionId | null>(null)

  useEffect(() => {
    const upd = () => {
      const w = window.innerWidth
      setIsMobile(w < 640)
      setOrbitR(w < 380 ? 112 : w < 480 ? 130 : w < 640 ? 148 : 185)
    }
    upd()
    window.addEventListener('resize', upd)
    return () => window.removeEventListener('resize', upd)
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setRingReady(true), 150)
    const t2 = setTimeout(() => setCenterVisible(true), 1500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const NODE      = isMobile ? 44 : 56
  const allDone   = SECTIONS.every(s => !s.required || done.has(s.id))
  const doneCount = SECTIONS.filter(s => s.required && done.has(s.id)).length
  const hasAlc    = fd.drinks === 'alcoholic'
  const total     = 20 + (hasAlc ? 7 : 0)

  // Required node angles in clockwise order (-90° = 12 o'clock start)
  const REQUIRED_ANGLES = [-90, -30, 30, 90, 150]

  const circumference = 2 * Math.PI * orbitR
  // Arc tip: the angle of the NEXT required node (points toward what to do next)
  const arcEndAngleDeg = doneCount === 0 ? -90 : doneCount < 5 ? REQUIRED_ANGLES[doneCount] : -90
  const arcSpanDeg     = doneCount === 0 ? 0 : doneCount === 5 ? 360 : ((arcEndAngleDeg - (-90)) + 360) % 360
  const progressOffset = circumference * (1 - arcSpanDeg / 360)
  const tipRad         = (arcEndAngleDeg * Math.PI) / 180
  const ringColor      = doneCount === 4 ? '#F5C640' : '#2558C9'
  const cx = orbitR + 2
  const cy = orbitR + 2

  const pos = (deg: number) => {
    const r = (deg * Math.PI) / 180
    return { x: Math.round(orbitR * Math.cos(r)), y: Math.round(orbitR * Math.sin(r)) }
  }

  const close = () => { setActive(null); setErrs({}) }

  const markDone = (id: SectionId) => {
    setDone(p => new Set([...p, id]))
    setJustDone(id)
    setTimeout(() => setJustDone(null), 750)
    close()
  }

  const onFood = (id: FoodId) => {
    const val = id === 'entree' ? fd.starter : id === 'hauptplat' ? fd.main : fd.dessert
    if (!val) return
    markDone(id)
  }

  const onPersonal = () => {
    const e: Record<string, string> = {}
    if (!fd.firstName.trim())    e.firstName  = 'Requis'
    if (!fd.lastName.trim())     e.lastName   = 'Requis'
    if (!fd.classGroup.trim())   e.classGroup = 'Requis'
    if (!fd.email.includes('@')) e.email      = 'Email invalide'
    if (Object.keys(e).length)   { setErrs(e); return }
    markDone('personal')
  }

  const onDrinks = () => {
    if (!fd.drinks) { setErrs(e => ({ ...e, drinks: 'Wielt deng Gedrénks' })); return }
    markDone('gedrenks')
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

  const shellProps = { fd, setFd, errs, setErrs, completed: done, onClose: close, onFood, onPersonal, onDrinks }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #E6F3FF 0%, #F0F8FF 30%, #FFFFFF 58%, #EEF6FF 85%, #F5FBFF 100%)' }}
    >
      {/* ── background blobs ──────────────────────────────────────────────────── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '50vw', height: '50vw', maxWidth: 420, maxHeight: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,88,201,0.08) 0%, transparent 70%)',
          top: '-8%', left: '-6%',
        }}
        animate={{ x: [0, 22, -12, 0], y: [0, -18, 22, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '42vw', height: '42vw', maxWidth: 360, maxHeight: 360, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,198,64,0.07) 0%, transparent 65%)',
          bottom: '-4%', right: '-4%',
        }}
        animate={{ x: [0, -28, 12, 0], y: [0, 22, -12, 0], scale: [1, 0.91, 1.09, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '32vw', height: '32vw', maxWidth: 300, maxHeight: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,88,201,0.05) 0%, transparent 70%)',
          top: '18%', right: '12%',
        }}
        animate={{ x: [0, 16, -10, 0], y: [0, 14, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5, repeatType: 'mirror' }}
      />

      {/* ── grain texture ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
          mixBlendMode: 'multiply',
        }}
      />

      {/* ── decorative outer rings ────────────────────────────────────────────── */}
      <svg
        className="absolute pointer-events-none"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        width={(orbitR + 140) * 2} height={(orbitR + 140) * 2} overflow="visible"
      >
        <circle cx={orbitR + 140} cy={orbitR + 140} r={orbitR + 55}
          stroke="#2558C9" strokeWidth="1" strokeDasharray="3 10" fill="none"
          style={{ opacity: ringReady ? 0.09 : 0, transition: 'opacity 1s 0.4s' }} />
        <circle cx={orbitR + 140} cy={orbitR + 140} r={orbitR + 115}
          stroke="#2558C9" strokeWidth="0.5" fill="none"
          style={{ opacity: ringReady ? 0.05 : 0, transition: 'opacity 1.4s 0.7s' }} />
      </svg>

      {/* ── orbit origin ──────────────────────────────────────────────────────── */}
      <motion.div
        variants={orbitVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', width: 0, height: 0 }}
      >
        {/* Orbit ring: track + progress arc + tip dot */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: 0, top: 0, transform: `translate(${-cx}px, ${-cy}px)` }}
          width={cx * 2} height={cy * 2}
        >
          <defs>
            <filter id="ring-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Track — draws in clockwise on mount */}
          <circle
            cx={cx} cy={cy} r={orbitR}
            stroke="#C3D1EC" strokeWidth="1" fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={ringReady ? 0 : circumference}
            transform={`rotate(-90, ${cx}, ${cy})`}
            style={{
              opacity: active ? 0.22 : 0.65,
              transition: `stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.35s`,
            }}
          />

          {/* Progress arc */}
          {doneCount > 0 && (
            <circle
              cx={cx} cy={cy} r={orbitR}
              stroke={ringColor}
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${cx}, ${cy})`}
              filter="url(#ring-glow)"
              style={{
                opacity: active ? 0.45 : 1,
                transition: `stroke-dashoffset 0.75s cubic-bezier(0.22,1,0.36,1), stroke 0.5s ease, opacity 0.35s`,
              }}
            />
          )}

          {/* Tip dot — follows progress arc endpoint (hidden when full circle) */}
          {doneCount > 0 && doneCount < 5 && (
            <circle
              cx={cx + orbitR * Math.cos(tipRad)}
              cy={cy + orbitR * Math.sin(tipRad)}
              r={4}
              fill={ringColor}
              filter="url(#ring-glow)"
              style={{
                opacity: active ? 0.45 : 1,
                transition: `cx 0.75s cubic-bezier(0.22,1,0.36,1), cy 0.75s cubic-bezier(0.22,1,0.36,1), fill 0.5s ease, opacity 0.35s`,
              }}
            />
          )}
        </svg>

        {/* Center: PORTANOVA label or BESTÄTEGEN button */}
        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-50%,-50%)', zIndex: 5 }}>
          <AnimatePresence mode="wait">
            {allDone ? (
              <motion.button
                key="submit"
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.65 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleSubmit} disabled={loading}
                whileHover={loading ? {} : { scale: 1.07 }}
                whileTap={loading ? {} : { scale: 0.95 }}
                className="flex flex-col items-center justify-center rounded-full"
                style={{
                  width: isMobile ? 90 : 112, height: isMobile ? 90 : 112,
                  background: 'linear-gradient(145deg, #1B2D52 0%, #2558C9 100%)',
                  boxShadow: '0 8px 36px rgba(37,88,201,0.4)',
                  border: 'none', cursor: loading ? 'default' : 'pointer',
                }}
              >
                {loading
                  ? <Loader2 className="animate-spin" style={{ color: 'white', width: 24, height: 24 }} />
                  : <>
                      <span className="font-sans font-bold text-white uppercase tracking-widest" style={{ fontSize: isMobile ? 8 : 9 }}>Bestätegen</span>
                      <span className="font-resto text-white mt-0.5" style={{ fontSize: isMobile ? 18 : 23, lineHeight: 1.1 }}>{total} €</span>
                    </>
                }
              </motion.button>
            ) : (
              <motion.div
                key="label"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: centerVisible ? (active ? 0.28 : 1) : 0, scale: centerVisible ? 1 : 0.7 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center pointer-events-none select-none text-center"
                style={{ width: isMobile ? 80 : 100 }}
              >
                <motion.p
                  className="font-resto"
                  style={{ fontSize: isMobile ? 17 : 22, color: '#1B2D52', lineHeight: 1.2 }}
                  animate={{ letterSpacing: ['0.18em', '0.26em', '0.18em'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  PORTANOVA
                </motion.p>
                <div style={{ height: 1, width: 38, margin: '5px auto', background: 'linear-gradient(90deg, transparent, #F5C640, transparent)' }} />
                <div className="flex gap-1.5 mt-0.5">
                  {SECTIONS.filter(s => s.required).map(s => (
                    <div key={s.id} style={{ width: 5, height: 5, borderRadius: '50%', background: done.has(s.id) ? '#22c55e' : '#D1DDEF', transition: 'background 0.4s' }} />
                  ))}
                </div>
                <p className="font-sans mt-1" style={{ fontSize: 8, color: '#9AAACF' }}>{doneCount}/5</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nodes */}
        {SECTIONS.map(sec => {
          const { x, y } = pos(sec.angleDeg)
          const isDone   = done.has(sec.id)
          const isActive = active === sec.id
          const isDimmed = !!(active && !isActive)

          return (
            <motion.div
              key={sec.id}
              variants={nodeVariants}
              custom={isDimmed}
              style={{ position: 'absolute', left: x, top: y, zIndex: isActive ? 6 : 4 }}
            >
              <div style={{ transform: 'translate(-50%, -50%)' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <motion.button
                  onClick={() => setActive(sec.id)}
                  whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.91 }}
                  style={{
                    height: NODE, padding: `0 ${Math.round(NODE * 0.28)}px`, borderRadius: NODE / 2,
                    whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `2px solid ${isDone ? '#16a34a' : isActive ? '#2558C9' : '#C3D1EC'}`,
                    background: isDone ? '#22c55e' : isActive ? '#2558C9' : 'white',
                    boxShadow: isDone ? '0 4px 14px rgba(34,197,94,0.38)' : isActive ? '0 4px 14px rgba(37,88,201,0.38)' : '0 2px 8px rgba(37,88,201,0.09)',
                    cursor: 'pointer', transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
                  }}
                >
                  {isDone
                    ? <AnimatedCheck size={NODE * 0.42} />
                    : <span style={{
                        color: isActive ? 'white' : '#2558C9',
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 600,
                        fontFamily: 'var(--font-sans, system-ui)',
                        letterSpacing: '0.02em',
                      }}>
                        {sec.short}
                      </span>
                  }
                </motion.button>

                {/* Completion celebration: pulse ring + particles */}
                <AnimatePresence>
                  {justDone === sec.id && (
                    <motion.div
                      key="celebration"
                      style={{ position: 'absolute', inset: -10, pointerEvents: 'none' }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                    >
                      <motion.div
                        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2.5px solid #22c55e' }}
                        initial={{ opacity: 0.9, scale: 0.85 }}
                        animate={{ opacity: 0, scale: 1.9 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                      />
                      {COMP_PARTICLES.map(({ angle, dist, color }, pi) => {
                        const rad = (angle * Math.PI) / 180
                        const center = 10 + NODE / 2
                        return (
                          <motion.div
                            key={pi}
                            style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: color, top: center - 2.5, left: center - 2.5 }}
                            initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                            animate={{ x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, opacity: 0, scale: 0.3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, delay: pi * 0.025, ease: 'easeOut' }}
                          />
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── backdrop ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            className="fixed inset-0"
            style={{ background: 'rgba(14,26,58,0.22)', backdropFilter: 'blur(4px)', zIndex: 15 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* ── mobile bottom sheet ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && isMobile && (
          <motion.div
            key={`sheet-${active}`}
            className="fixed left-0 right-0 bottom-0 overflow-hidden"
            style={{
              maxHeight: '88vh', borderTopLeftRadius: 24, borderTopRightRadius: 24, zIndex: 20,
              boxShadow: '0 -8px 48px rgba(37,88,201,0.17)',
              background: SECTION_STYLE[active].bg,
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
            }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div style={{ width: 36, height: 4, borderRadius: 2, background: '#C3D1EC' }} />
            </div>
            <PanelShell id={active} {...shellProps} scrollH="calc(88vh - 52px)" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── desktop centered card ─────────────────────────────────────────────── */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 20 }}>
        <AnimatePresence mode="wait">
          {active && !isMobile && (
            <motion.div
              key={`card-${active}`}
              className="overflow-hidden pointer-events-auto"
              style={{
                width: 'min(468px, 92vw)', maxHeight: '82vh', borderRadius: 22,
                boxShadow: '0 28px 88px rgba(37,88,201,0.18)',
                border: `1.5px solid ${SECTION_STYLE[active].accent}33`,
                background: SECTION_STYLE[active].bg,
                backdropFilter: 'blur(20px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              }}
              initial={{ opacity: 0, y: 22, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              <PanelShell id={active} {...shellProps} scrollH="calc(82vh - 72px)" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
