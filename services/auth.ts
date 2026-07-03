'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types'

export async function signUp(payload: {
  email: string
  password: string
  nombre: string
  apellido: string
  rol: UserRole
  ciudad?: string
  pais?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: payload.email.toLowerCase(),
    password: payload.password,
    options: {
      data: {
        nombre: payload.nombre,
        apellido: payload.apellido,
        rol: payload.rol,
        ciudad: payload.ciudad ?? null,
        pais: payload.pais ?? null,
      },
    },
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  })

  if (error) return { user: null, error: error.message }
  return { user: data.user, error: null }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function resetPassword(email: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/cuenta/nueva-contrasena`,
  })
  return { error: error?.message ?? null }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error: error?.message ?? null }
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error: error?.message ?? null }
}
