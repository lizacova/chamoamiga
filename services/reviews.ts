'use server'

import { createClient } from '@/lib/supabase/server'
import type { Review } from '@/types'

export async function crearReview(payload: {
  evaluado_id: string
  solicitud_id?: string
  estrellas: number
  comentario: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'Debes iniciar sesión para dejar una reseña.' }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ ...payload, evaluador_id: user.id })
    .select()
    .single()

  return { data: data as Review | null, error: error?.message ?? null }
}

export async function getReviewsByProfesional(profesionalId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('*, evaluador:profiles(nombre, apellido, foto_url)')
    .eq('evaluado_id', profesionalId)
    .order('created_at', { ascending: false })

  return { data: data as Review[] | null, error: error?.message ?? null }
}
