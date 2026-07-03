'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface StarsDisplayProps {
  value: number
  max?: number
  size?: number
  className?: string
}

export function StarsDisplay({ value, max = 5, size = 15, className }: StarsDisplayProps) {
  return (
    <span className={cn('inline-flex gap-0.5', className)} aria-label={`${value} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < Math.round(value) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={i < Math.round(value) ? 0 : 1.5}
          className="text-amarillo"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

interface StarPickerProps {
  value: number
  onChange: (value: number) => void
  max?: number
  size?: number
}

export function StarPicker({ value, onChange, max = 5, size = 28 }: StarPickerProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <span className="inline-flex gap-1" role="radiogroup" aria-label="Valoración">
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} estrella${star === 1 ? '' : 's'}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="transition-transform hover:scale-110"
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 1.5}
              className="text-amarillo"
              aria-hidden
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </span>
  )
}
