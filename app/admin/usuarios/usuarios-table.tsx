'use client'

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'

interface Props {
  usuarios: Profile[]
  total: number
  page: number
}

export function AdminUsuariosTable({ usuarios, total, page }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleBloquear(userId: string) {
    if (!confirm('¿Estás seguro de bloquear este usuario?')) return
    setLoading(userId)
    const res = await fetch(`/api/admin/usuarios/${userId}/bloquear`, { method: 'POST' })
    setLoading(null)
    if (res.ok) { showToast('Usuario bloqueado.'); router.refresh() }
    else showToast('Error al bloquear.', 'error')
  }

  async function handleEliminar(userId: string) {
    if (!confirm('¿Eliminar permanentemente este usuario? Esta acción no se puede deshacer.')) return
    setLoading(userId)
    const res = await fetch(`/api/admin/usuarios/${userId}`, { method: 'DELETE' })
    setLoading(null)
    if (res.ok) { showToast('Usuario eliminado.'); router.refresh() }
    else showToast('Error al eliminar.', 'error')
  }

  const ROLE_LABELS: Record<string, string> = {
    persona: 'Persona', profesional: 'Profesional', voluntario: 'Voluntario',
    organizacion: 'Organización', admin: 'Admin',
  }

  return (
    <div className="bg-white border border-gris rounded-[var(--radius-lg)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gris bg-gris-2">
              <th className="text-left px-5 py-3 font-display font-bold text-azul-dark">Usuario</th>
              <th className="text-left px-4 py-3 font-display font-bold text-azul-dark">Rol</th>
              <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden md:table-cell">Ciudad</th>
              <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden lg:table-cell">Registro</th>
              <th className="text-left px-4 py-3 font-display font-bold text-azul-dark">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const name = `${u.nombre} ${u.apellido}`.trim()
              return (
                <tr key={u.id} className="border-b border-gris last:border-none hover:bg-gris-2/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={name} fotoUrl={u.foto_url} size={36} />
                      <div>
                        <p className="font-semibold text-azul-dark">{name}</p>
                        <p className="text-xs text-texto-suave">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.rol === 'admin' ? 'red' : u.rol === 'profesional' ? 'blue' : 'gray'}>
                      {ROLE_LABELS[u.rol] ?? u.rol}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-texto-suave hidden md:table-cell">{u.ciudad ?? '—'}</td>
                  <td className="px-4 py-3 text-texto-suave hidden lg:table-cell">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.activo ? 'green' : 'red'}>
                      {u.activo ? 'Activo' : 'Bloqueado'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      {u.activo && (
                        <Button
                          variant="ghost"
                          size="sm"
                          loading={loading === u.id}
                          onClick={() => handleBloquear(u.id)}
                        >
                          Bloquear
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        loading={loading === u.id}
                        onClick={() => handleEliminar(u.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-gris">
        <span className="text-sm text-texto-suave">{total} usuarios en total</span>
        <div className="flex gap-2">
          {page > 1 && (
            <a href={`?pagina=${page - 1}`}>
              <Button variant="ghost" size="sm">← Anterior</Button>
            </a>
          )}
          {total > page * 20 && (
            <a href={`?pagina=${page + 1}`}>
              <Button variant="ghost" size="sm">Siguiente →</Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
