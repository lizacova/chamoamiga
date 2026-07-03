'use server'

import { createClient } from '@/lib/supabase/server'
import type { Profile, Profesional } from '@/types'
import { PAGE_SIZE } from '@/lib/constants'

export async function getProfileById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Profile | null, error: error?.message ?? null }
}

export async function getCurrentProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: null }

  return getProfileById(user.id)
}

export async function getProfesionales({
  categoria,
  modalidad,
  page = 1,
}: {
  categoria?: string
  modalidad?: string
  page?: number
}) {
  const supabase = await createClient()
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('profesionales')
    .select(
      `
      *,
      profile:profiles(*),
      categorias:profesional_categorias(categoria:categorias(*)),
      reviews(estrellas)
    `,
      { count: 'exact' }
    )
    .eq('disponible', true)
    .range(from, to)
    .order('ayudados', { ascending: false })

  if (modalidad) {
    query = query.or(`modalidad.eq.${modalidad},modalidad.eq.ambas`)
  }

  const { data, error, count } = await query

  return {
    data: data as Profesional[] | null,
    count: count ?? 0,
    error: error?.message ?? null,
  }
}

export async function getProfesionalById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profesionales')
    .select(
      `
      *,
      profile:profiles(*),
      categorias:profesional_categorias(categoria:categorias(*)),
      reviews(*, evaluador:profiles(nombre, apellido, foto_url))
    `
    )
    .eq('id', id)
    .single()

  return { data: data as Profesional | null, error: error?.message ?? null }
}

export async function updateProfile(
  id: string,
  updates: Partial<Pick<Profile, 'nombre' | 'apellido' | 'telefono' | 'ciudad' | 'pais' | 'descripcion' | 'foto_url'>>
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  return { data: data as Profile | null, error: error?.message ?? null }
}
