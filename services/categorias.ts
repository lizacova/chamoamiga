'use server'

import { createClient } from '@/lib/supabase/server'
import type { Categoria } from '@/types'

export async function getCategorias() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('nombre', { ascending: true })

  return { data: data as Categoria[] | null, error: error?.message ?? null }
}

export async function getCategoriaById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as Categoria | null, error: error?.message ?? null }
}
