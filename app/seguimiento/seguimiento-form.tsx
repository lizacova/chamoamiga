'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

export function SeguimientoForm() {
  const [codigo, setCodigo] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [solicitud, setSolicitud] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!codigo.trim() || !email.includes('@')) {
      showToast('Ingresa el código y tu correo.', 'error')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        categoria:categorias(nombre),
        respuestas:respuestas_solicitud(
          *,
          profesional:profesionales(
            id, profesion, biografia,
            profile:profiles(nombre, apellido, foto_url, ciudad)
          )
        )
      `)
      .eq('codigo_seguimiento', codigo.toUpperCase())
      .eq('email_contacto', email.toLowerCase())
      .single()

    setLoading(false)
    if (error || !data) {
      showToast('No encontramos una solicitud con esos datos. Revisa el código y el correo.', 'error')
      return
    }
    setSolicitud(data)
  }

  if (solicitud) {
    const abierta = solicitud.estado === 'abierta'
    const respuestas = solicitud.respuestas ?? []

    return (
      <div className="space-y-5">
        {/* Solicitud card */}
        <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-7">
          <div className="flex justify-between items-start gap-3 mb-3">
            <h2 className="font-display font-extrabold text-[1.15rem] text-azul-dark">{solicitud.titulo}</h2>
            <Badge variant={abierta ? 'green' : 'gray'}>{abierta ? 'Abierta' : solicitud.estado}</Badge>
          </div>
          <p className="text-texto-suave text-sm mb-3">{solicitud.descripcion}</p>
          <div className="flex flex-wrap gap-2">
            {solicitud.categoria && <Badge variant="blue">{solicitud.categoria.nombre}</Badge>}
            {solicitud.ubicacion && <Badge variant="gray">{solicitud.ubicacion}</Badge>}
            <Badge variant="gray">{formatDate(solicitud.created_at)}</Badge>
          </div>
        </div>

        {/* Responses */}
        <h3 className="font-display font-extrabold text-lg">
          {respuestas.length === 0
            ? 'Aún no hay respuestas'
            : `${respuestas.length} persona${respuestas.length === 1 ? '' : 's'} ofreci${respuestas.length === 1 ? 'ó' : 'eron'} ayuda`}
        </h3>

        {respuestas.length === 0 ? (
          <div className="bg-white border-[1.5px] border-dashed border-gris rounded-[var(--radius)] p-8 text-center text-texto-suave">
            <strong className="block font-display text-azul-dark mb-1.5">
              Tu solicitud está visible para la comunidad
            </strong>
            Cuando alguien se ofrezca a ayudarte, aparecerá aquí. Vuelve en unas horas.
          </div>
        ) : (
          <div className="space-y-4">
            {respuestas.map((r: any) => {
              const p = r.profesional
              const name = p?.profile ? `${p.profile.nombre} ${p.profile.apellido ?? ''}`.trim() : 'Voluntario'
              return (
                <div key={r.id} className="bg-white border border-gris rounded-[var(--radius-lg)] p-6">
                  <div className="flex gap-4 items-start">
                    <Avatar name={name} fotoUrl={p?.profile?.foto_url} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-extrabold text-[1rem] text-azul-dark">{name}</p>
                      <p className="text-sm text-texto-suave">{p?.profesion} {p?.profile?.ciudad ? `· ${p.profile.ciudad}` : ''}</p>
                      <p className="mt-2.5 text-sm text-texto leading-relaxed">{r.mensaje}</p>
                      <div className="mt-3">
                        <Link href={`/profesional/${p?.id}`}>
                          <Button variant="ghost" size="sm">Ver perfil completo</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={() => setSolicitud(null)}
          className="text-sm text-azul font-semibold hover:underline"
        >
          ← Buscar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gris rounded-[var(--radius-lg)] p-10 shadow-card"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Código de seguimiento"
          placeholder="Ej: CA-ABCD"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          required
        />
        <Input
          label="Tu correo electrónico"
          type="email"
          placeholder="El mismo que usaste al publicar"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} block>
          Ver mi solicitud
        </Button>
        <p className="text-center text-sm text-texto-suave">
          ¿Aún no publicaste?{' '}
          <Link href="/necesito" className="text-azul font-semibold hover:underline">
            Cuéntanos qué necesitas
          </Link>
        </p>
      </div>
    </form>
  )
}
