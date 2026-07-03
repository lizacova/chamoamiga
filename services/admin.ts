'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { DashboardStats, Profile, Solicitud, Review } from '@/types'

/** Ensure the current user is an admin — throws if not */
async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('No autenticado')

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single()

  if (!profile || profile.rol !== 'admin') throw new Error('Acceso denegado')

  return { user, supabase }
}

export async function getDashboardStats(): Promise<{ data: DashboardStats | null; error: string | null }> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const [
      { count: totalUsuarios },
      { count: totalPros },
      { count: totalVols },
      { count: totalOrgs },
      { count: solicitudesAbiertas },
      { count: solicitudesResueltas },
      { data: ciudadesData },
      { count: totalCategorias },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('rol', 'profesional'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('rol', 'voluntario'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('rol', 'organizacion'),
      supabase.from('solicitudes').select('*', { count: 'exact', head: true }).eq('estado', 'abierta'),
      supabase.from('solicitudes').select('*', { count: 'exact', head: true }).eq('estado', 'resuelta'),
      supabase.from('profiles').select('ciudad').not('ciudad', 'is', null),
      supabase.from('categorias').select('*', { count: 'exact', head: true }).eq('activa', true),
    ])

    const ciudades = new Set(ciudadesData?.map((p) => p.ciudad).filter(Boolean))

    return {
      data: {
        total_usuarios: totalUsuarios ?? 0,
        total_profesionales: totalPros ?? 0,
        total_voluntarios: totalVols ?? 0,
        total_organizaciones: totalOrgs ?? 0,
        solicitudes_abiertas: solicitudesAbiertas ?? 0,
        solicitudes_resueltas: solicitudesResueltas ?? 0,
        total_ciudades: ciudades.size,
        total_categorias: totalCategorias ?? 0,
      },
      error: null,
    }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Error desconocido' }
  }
}

export async function getAdminUsuarios(page = 1, limit = 20) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const from = (page - 1) * limit
    const { data, count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .range(from, from + limit - 1)
      .order('created_at', { ascending: false })

    return { data: data as Profile[] | null, count: count ?? 0, error: error?.message ?? null }
  } catch (e) {
    return { data: null, count: 0, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function bloquearUsuario(userId: string) {
  try {
    await requireAdmin()
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.updateUserById(userId, { ban_duration: '87600h' })
    if (error) return { error: error.message }

    const supabase = await createClient()
    await supabase.from('profiles').update({ activo: false }).eq('id', userId)

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function eliminarUsuario(userId: string) {
  try {
    await requireAdmin()
    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(userId)
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function getAdminSolicitudes(page = 1, limit = 20) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const from = (page - 1) * limit
    const { data, count, error } = await supabase
      .from('solicitudes')
      .select('*, categoria:categorias(nombre), creador:profiles(nombre, apellido)', { count: 'exact' })
      .range(from, from + limit - 1)
      .order('created_at', { ascending: false })

    return { data: data as Solicitud[] | null, count: count ?? 0, error: error?.message ?? null }
  } catch (e) {
    return { data: null, count: 0, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function eliminarSolicitud(id: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase.from('solicitudes').delete().eq('id', id)
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function getAdminReviews(page = 1, limit = 20) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const from = (page - 1) * limit
    const { data, count, error } = await supabase
      .from('reviews')
      .select('*, evaluador:profiles!evaluador_id(nombre, apellido), evaluado:profiles!evaluado_id(nombre, apellido)', { count: 'exact' })
      .range(from, from + limit - 1)
      .order('created_at', { ascending: false })

    return { data: data as Review[] | null, count: count ?? 0, error: error?.message ?? null }
  } catch (e) {
    return { data: null, count: 0, error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function eliminarReview(id: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error' }
  }
}

export async function aprobarProfesional(profesionalId: string) {
  try {
    await requireAdmin()
    const supabase = await createClient()
    const { error } = await supabase
      .from('profesionales')
      .update({ verificado: true })
      .eq('id', profesionalId)
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Error' }
  }
}
