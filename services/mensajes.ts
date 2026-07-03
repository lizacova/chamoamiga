'use server'

import { createClient } from '@/lib/supabase/server'
import type { Mensaje } from '@/types'

export async function enviarMensaje(payload: {
  para_usuario_id: string
  asunto?: string
  contenido: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'Debes iniciar sesión para enviar mensajes.' }

  const { data, error } = await supabase
    .from('mensajes')
    .insert({ ...payload, de_usuario_id: user.id, leido: false })
    .select()
    .single()

  return { data: data as Mensaje | null, error: error?.message ?? null }
}

export async function getMisConversaciones() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { data: null, error: 'No autenticado.' }

  const { data, error } = await supabase
    .from('mensajes')
    .select('*, de:profiles!de_usuario_id(nombre, apellido, foto_url), para:profiles!para_usuario_id(nombre, apellido, foto_url)')
    .or(`de_usuario_id.eq.${user.id},para_usuario_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  return { data: data as Mensaje[] | null, error: error?.message ?? null }
}

export async function marcarLeido(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('mensajes')
    .update({ leido: true })
    .eq('id', id)

  return { error: error?.message ?? null }
}
