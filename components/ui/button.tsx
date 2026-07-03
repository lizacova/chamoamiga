import * as React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'rojo' | 'light' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  block?: boolean
  asChild?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-azul text-white shadow-[0_6px_18px_rgba(44,92,184,0.28)] hover:bg-azul-hover',
  secondary:
    'bg-amarillo text-azul-dark shadow-[0_6px_18px_rgba(233,180,76,0.35)] hover:bg-[#DFA53A]',
  ghost:
    'bg-transparent text-azul-dark border border-gris hover:border-azul hover:text-azul',
  rojo:
    'bg-amarillo text-azul-dark shadow-[0_6px_18px_rgba(233,180,76,0.35)] hover:bg-[#DFA53A]',
  light: 'bg-white text-azul-dark hover:shadow-card',
  danger: 'bg-rojo text-white hover:bg-rojo-hover',
}

const sizes: Record<Size, string> = {
  sm: 'px-[18px] py-[9px] text-sm',
  md: 'px-[26px] py-[13px] text-[0.95rem]',
  lg: 'px-8 py-4 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      block = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'font-display font-bold leading-tight text-center',
          'rounded-full transition-[transform,box-shadow,background] duration-[180ms]',
          'hover:-translate-y-0.5 active:translate-y-0',
          'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-azul focus-visible:rounded-md',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variants[variant],
          sizes[size],
          block && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4 flex-none"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Cargando…
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
