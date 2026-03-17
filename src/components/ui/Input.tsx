import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  dark?: boolean
}

export function Input({ label, error, dark, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className={`text-xs font-medium tracking-wider uppercase ${dark ? 'text-resto-text/60' : 'text-gray-500'}`}>
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 text-sm outline-none transition-all duration-200',
          dark
            ? 'bg-white/5 border border-white/10 text-resto-text placeholder:text-white/20 focus:border-resto-accent rounded-lg'
            : 'bg-gray-50 border border-gray-200 text-ink placeholder:text-gray-400 focus:border-ink focus:bg-white rounded-xl',
          error ? 'border-red-400' : '',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
