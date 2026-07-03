import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { CuentaDashboard } from './cuenta-dashboard'

export const metadata: Metadata = { title: 'Mi cuenta' }

export default async function CuentaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar?redirect=/cuenta')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: profesional } = await supabase
    .from('profesionales')
    .select('*, categorias:profesional_categorias(categoria:categorias(*))')
    .eq('usuario_id', user.id)
    .single()

  const { data: mensajes } = await supabase
    .from('mensajes_anonimos')
    .select('*')
    .eq('para_usuario_id', user.id)
    .order('created_at', { ascending: false })

  const { data: solicitudesRespondidas } = await supabase
    .from('respuestas_solicitud')
    .select('*, solicitud:solicitudes(titulo, estado, ubicacion, created_at)')
    .eq('profesional_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <CuentaDashboard
      profile={profile}
      profesional={profesional}
      mensajes={mensajes ?? []}
      solicitudesRespondidas={solicitudesRespondidas ?? []}
    />
  )
}
