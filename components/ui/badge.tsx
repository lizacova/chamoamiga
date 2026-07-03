import * as React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'blue' | 'yellow' | 'green' | 'gray' | 'red'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variants: Record<BadgeVariant, string> = {
  blue: 'bg-azul-soft text-azul',
  yellow: 'bg-amarillo-soft text-[#8A6300]',
  green: 'bg-verde-bg text-verde',
  gray: 'bg-gris text-texto-suave',
  red: 'bg-rojo-soft text-rojo',
}

export function Badge({ variant = 'blue', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block text-xs font-semibold px-3 py-[5px] rounded-full leading-tight',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
