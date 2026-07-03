'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

// Global toast state — simple pub/sub
let listeners: Array<(toasts: ToastItem[]) => void> = []
let toasts: ToastItem[] = []

function notify(toastList: ToastItem[]) {
  toasts = toastList
  listeners.forEach((l) => l(toastList))
}

export function showToast(message: string, type: ToastType = 'success') {
  const id = Math.random().toString(36).slice(2)
  const item: ToastItem = { id, message, type }
  notify([...toasts, item])
  setTimeout(() => {
    notify(toasts.filter((t) => t.id !== id))
  }, 3800)
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([])

  useEffect(() => {
    listeners.push(setItems)
    return () => {
      listeners = listeners.filter((l) => l !== setItems)
    }
  }, [])

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2.5 w-[min(92vw,440px)]"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            'flex items-center gap-2.5 px-5 py-[15px] rounded-[14px] text-sm font-medium text-white shadow-hover',
            'animate-[toastIn_0.35s_ease]',
            t.type === 'success' && 'bg-verde',
            t.type === 'error' && 'bg-rojo',
            t.type === 'info' && 'bg-azul-dark'
          )}
        >
          {t.type === 'success' && <CheckCircle size={20} className="flex-none" aria-hidden />}
          {t.type === 'error' && <XCircle size={20} className="flex-none" aria-hidden />}
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => notify(toasts.filter((x) => x.id !== t.id))}
            aria-label="Cerrar notificación"
            className="flex-none opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
