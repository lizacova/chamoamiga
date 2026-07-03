'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'
import type { Categoria } from '@/types'

export function AdminCategoriasClient({ categorias }: { categorias: Categoria[] }) {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [icono, setIcono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim()) { showToast('Escribe un nombre.', 'error'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('categorias').insert({ nombre, icono: icono || null, descripcion: descripcion || null, activa: true })
    setLoading(false)
    if (error) { showToast(error.message, 'error'); return }
    showToast('Categoría creada.')
    setNombre(''); setIcono(''); setDescripcion('')
    router.refresh()
  }

  async function handleToggle(cat: Categoria) {
    const supabase = createClient()
    await supabase.from('categorias').update({ activa: !cat.activa }).eq('id', cat.id)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar esta categoría?')) return
    const supabase = createClient()
    await supabase.from('categorias').delete().eq('id', id)
    router.refresh()
    showToast('Categoría eliminada.')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      {/* Table */}
      <div className="bg-white border border-gris rounded-[var(--radius-lg)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gris bg-gris-2">
              <th className="text-left px-5 py-3 font-display font-bold text-azul-dark">Categoría</th>
              <th className="text-left px-4 py-3 font-display font-bold text-azul-dark">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id} className="border-b border-gris last:border-none hover:bg-gris-2/50">
                <td className="px-5 py-3">
                  <p className="font-semibold text-azul-dark">
                    {c.icono && <span className="mr-1.5">{c.icono}</span>}{c.nombre}
                  </p>
                  {c.descripcion && <p className="text-xs text-texto-suave">{c.descripcion}</p>}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={c.activa ? 'green' : 'gray'}>{c.activa ? 'Activa' : 'Inactiva'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleToggle(c)}>
                      {c.activa ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-white border border-gris rounded-[var(--radius-lg)] p-6 sticky top-6 space-y-4">
        <h3 className="font-display font-extrabold text-[1.05rem]">Nueva categoría</h3>
        <Input label="Nombre" placeholder="Ej: Psicología" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <Input label="Emoji / ícono" hint="Opcional" placeholder="🧠" value={icono} onChange={(e) => setIcono(e.target.value)} />
        <Input label="Descripción" hint="Opcional" placeholder="Apoyo emocional y salud mental" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        <Button type="submit" loading={loading} block>Crear categoría</Button>
      </form>
    </div>
  )
}
