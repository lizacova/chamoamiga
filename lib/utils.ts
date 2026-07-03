import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Generate initials from a full name */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Calculate average rating from reviews */
export function avgRating(reviews: Array<{ estrellas: number }>): string {
  if (!reviews.length) return '—'
  const avg = reviews.reduce((acc, r) => acc + r.estrellas, 0) / reviews.length
  return avg.toFixed(1)
}

/** Format a date string into a relative or absolute label */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'ahora'
  if (diffMins < 60) return `hace ${diffMins} min`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`
  if (diffDays === 1) return 'ayer'
  if (diffDays < 7) return `hace ${diffDays} días`

  return date.toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Generate a random tracking code for solicitudes */
export function genCodigo(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return (
    'CA-' +
    Array.from({ length: 4 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  )
}

/** Sanitize user input to prevent XSS */
export function esc(str: string | null | undefined): string {
  if (!str) return ''
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c)
  )
}

/** Avatar gradient by index */
const GRADIENTS = [
  'linear-gradient(135deg,#2C5CB8,#5B86D6)',
  'linear-gradient(135deg,#D64B45,#E98A6B)',
  'linear-gradient(135deg,#C68A1E,#E9B44C)',
  'linear-gradient(135deg,#12294B,#2C5CB8)',
  'linear-gradient(135deg,#2E9E6B,#67C69B)',
  'linear-gradient(135deg,#7A4FB0,#B08FD6)',
]

export function getGradient(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/** Format currency in VEF/USD */
export function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
