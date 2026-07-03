'use server'

import { createClient } from '@/lib/supabase/server'
import type { Solicitud } from '@/types'
import { PAGE_SIZE } from '@/lib/constants'
import { genCodigo } from '@/lib/utils'

export async function getSolicitudes({
  categoria_id,
  estado,
  page = 1,
}: {
  categoria_id?: string
  estado?: string
  page?: number
} = {}) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('solicitudes')
    .select(
      `
      *,
      categoria:categorias(*),
      creador:profiles(nombre, apellido, ciudad),
      respuestas:respuestas_solicitud(id)
    `,
      { count: 'exact' }
    )
    .range(from, to)
    .order('created_at', { ascending: false })

  if (categoria_id) query = query.eq('categoria_id', categoria_id)
  if (estado) query = query.eq('estado', estado)

  const { data, error, count } = await query

  return {
    data: data as Solicitud[] | null,
    count: count ?? 0,
    error: error?.message ?? null,
  }
}

export async function getSolicitudByCodigo(codigo: string, email: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('solicitudes')
    .select(
      `
      *,
      categoria:categorias(*),
      respuestas:respuestas_solicitud(
        *,
        profesional:profesionales(
          *,
          profile:profiles(nombre, apellido, foto_url, ciudad)
        )
      )
    `
    )
    .eq('codigo_seguimiento', codigo.toUpperCase())
    .eq('email_contacto', email.toLowerCase())
    .single()

  return { data: data as Solicitud | null, error: error?.message ?? null }
}

export async function crearSolicitud(payload: {
  titulo: string
  descripcion: string
  categoria_id: string
  ubicacion: string
  modalidad: 'en_linea' | 'presencial' | 'ambas'
  nombre_contacto: string
  email_contacto: string
  creador_id?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('solicitudes')
    .insert({
      ...payload,
      email_contacto: payload.email_contacto.toLowerCase(),
      estado: 'abierta',
      codigo_seguimiento: genCodigo(),
    })
    .select()
    .single()

  return { data: data as Solicitud | null, error: error?.message ?? null }
}

export async function responderSolicitud(solicitudId: string, profesionalId: string, mensaje: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('respuestas_solicitud')
    .insert({ solicitud_id: solicitudId, profesional_id: profesionalId, mensaje })
    .select()
    .single()

  return { data, error: error?.message ?? null }
}
