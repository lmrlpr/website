import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

export function Button({ variant = 'primary', size = 'md', children, fullWidth, className, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = {
    sm: 'text-xs px-4 py-2 rounded-lg',
    md: 'text-sm px-6 py-3 rounded-xl',
    lg: 'text-base px-8 py-4 rounded-xl',
  }
  const variants = {
    primary: 'bg-ink text-white hover:bg-ink/80',
    secondary: 'bg-transparent border border-ink text-ink hover:bg-ink hover:text-white',
    ghost: 'bg-transparent text-current hover:opacity-70',
    neon: 'bg-transparent border border-gotham-blue text-gotham-blue hover:shadow-neon hover:bg-gotham-blue/10',
  }
  return (
    <button
      className={cn(base, sizes[size], variants[variant], fullWidth ? 'w-full' : '', className)}
      {...props}
    >
      {children}
    </button>
  )
}
