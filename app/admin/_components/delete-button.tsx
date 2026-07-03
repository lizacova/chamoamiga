'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'

interface AdminDeleteButtonProps {
  endpoint: string
  label?: string
  confirmMsg?: string
}

export function AdminDeleteButton({
  endpoint,
  label = 'Eliminar',
  confirmMsg = '¿Eliminar este elemento? Esta acción no se puede deshacer.',
}: AdminDeleteButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(confirmMsg)) return
    setLoading(true)
    const res = await fetch(endpoint, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) { showToast('Eliminado correctamente.'); router.refresh() }
    else showToast('Error al eliminar.', 'error')
  }

  return (
    <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
      {label}
    </Button>
  )
}
