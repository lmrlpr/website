import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Check, X, SendHorizontal } from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const SPRING = { type: 'spring' as const, stiffness: 230, damping: 22, mass: 0.85 }

const BG: Record<Status, string> = {
  idle: '#2558C9',
  loading: 'rgba(255,255,255,0.08)',
  success: 'rgba(74,222,128,0.18)',
  error: 'rgba(248,113,113,0.18)',
}

const BORDER: Record<Status, string> = {
  idle: 'rgba(255,255,255,0.24)',
  loading: 'rgba(255,255,255,0.14)',
  success: 'rgba(74,222,128,0.5)',
  error: 'rgba(248,113,113,0.5)',
}

const TEXT_COLOR: Record<Status, string> = {
  idle: 'white',
  loading: 'rgba(255,255,255,0.75)',
  success: '#4ADE80',
  error: '#F87171',
}

interface FlipVerifyButtonProps {
  label?: string
  onSubmit: () => Promise<void>
}

export function FlipVerifyButton({ label = 'Confirmer', onSubmit }: FlipVerifyButtonProps) {
  const [status, setStatus] = useState<Status>('idle')
  const flipped = status !== 'idle'

  const handleClick = async () => {
    if (flipped) return
    setStatus('loading')
    try {
      await onSubmit()
      setStatus('success')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 1700)
    }
  }

  return (
    <div className="w-full" style={{ perspective: '1000px' }}>
      <motion.button
        onClick={handleClick}
        disabled={flipped}
        animate={{
          rotateX: flipped ? 180 : 0,
          backgroundColor: BG[status],
          borderColor: BORDER[status],
          boxShadow: status === 'idle'
            ? '0 6px 24px rgba(37,88,201,0.45)'
            : '0 2px 12px rgba(0,0,0,0.2)',
        }}
        transition={SPRING}
        whileTap={!flipped ? { scale: 0.97 } : {}}
        whileHover={!flipped ? { scale: 1.025 } : {}}
        className="w-full py-3.5 rounded-full border font-semibold font-sans text-sm cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          animate={{ rotateX: flipped ? 180 : 0, color: TEXT_COLOR[status] }}
          transition={SPRING}
          className="flex items-center justify-center gap-2.5"
        >
          {status === 'idle' && (
            <>
              <SendHorizontal size={15} strokeWidth={2.2} />
              <span>{label}</span>
            </>
          )}
          {status === 'loading' && (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Vérification…</span>
            </>
          )}
          {status === 'success' && (
            <>
              <Check size={15} />
              <span>Confirmé</span>
            </>
          )}
          {status === 'error' && (
            <>
              <X size={15} />
              <span>Code incorrect</span>
            </>
          )}
        </motion.div>
      </motion.button>
    </div>
  )
}
