'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ open, onClose, title, children, maxWidth = 'max-w-[480px]' }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Trap scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-[rgba(18,41,75,0.55)] backdrop-blur-[3px] flex items-center justify-center z-[100] p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={dialogRef}
        className={cn(
          'bg-white rounded-[var(--radius-lg)] p-9 w-full shadow-hover relative max-h-[90vh] overflow-y-auto',
          maxWidth
        )}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-[18px] right-[18px] w-9 h-9 rounded-full flex items-center justify-center text-texto-suave bg-gris-2 hover:bg-gris transition-colors"
        >
          <X size={18} aria-hidden />
        </button>
        {title && (
          <h3 id="modal-title" className="text-xl font-display font-extrabold text-azul-dark mb-2">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  )
}
