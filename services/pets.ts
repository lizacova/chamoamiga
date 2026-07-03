'use server'

import { createClient } from '@/lib/supabase/server'
import { STORAGE_BUCKETS, PAGE_SIZE } from '@/lib/constants'
import type { Pet, PetPhoto, PetPublicationType, PetSpecies, PetStatus } from '@/types'

// ─── Read ──────────────────────────────────────────────────────────

export async function getPets(filters: {
  tipo?: PetPublicationType
  especie?: PetSpecies
  estado?: PetStatus
  ciudad?: string
  tamano?: string
  sexo?: string
  page?: number
} = {}) {
  const supabase = await createClient()
  const page = filters.page ?? 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('pets')
    .select('*, fotos:pet_photos(*)', { count: 'exact' })
    .eq('aprobado', true)
    .eq('visible', true)
    .range(from, to)
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.tipo)    query = query.eq('tipo_publicacion', filters.tipo)
  if (filters.especie) query = query.eq('especie', filters.especie)
  if (filters.estado)  query = query.eq('estado', filters.estado)
  if (filters.tamano)  query = query.eq('tamano', filters.tamano)
  if (filters.sexo)    query = query.eq('sexo', filters.sexo)
  if (filters.ciudad)  query = query.ilike('ciudad', `%${filters.ciudad}%`)

  const { data, error, count } = await query
  return { data: data as Pet[] | null, count: count ?? 0, error: error?.message ?? null }
}

export async function getPetById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pets')
    .select('*, fotos:pet_photos(* order by orden asc), creador:profiles(nombre, apellido, foto_url)')
    .eq('id', id)
    .single()
  return { data: data as Pet | null, error: error?.message ?? null }
}

// ─── Create ────────────────────────────────────────────────────────

export async function createPet(payload: Omit<Pet, 'id' | 'created_at' | 'updated_at' | 'fotos' | 'creador' | 'aprobado' | 'destacado' | 'visible'>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('pets')
    .insert({
      ...payload,
      creador_id: user?.id ?? null,
      aprobado: false,   // requires admin approval
      destacado: false,
      visible: true,
    })
    .select()
    .single()

  return { data: data as Pet | null, error: error?.message ?? null }
}

// ─── Photos ────────────────────────────────────────────────────────

export async function uploadPetPhoto(petId: string, file: File, index: number) {
  const supabase = await createClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${petId}/${Date.now()}_${index}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.pets)
    .upload(path, file, { upsert: false })

  if (uploadError) return { url: null, error: uploadError.message }

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKETS.pets).getPublicUrl(path)

  const { error: dbError } = await supabase.from('pet_photos').insert({
    pet_id: petId,
    url: urlData.publicUrl,
    es_principal: index === 0,
    orden: index,
  })

  return { url: urlData.publicUrl, error: dbError?.message ?? null }
}

// ─── Update ────────────────────────────────────────────────────────

export async function updatePetStatus(id: string, estado: PetStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('pets')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
  return { error: error?.message ?? null }
}

export async function updatePet(id: string, payload: Partial<Pet>) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pets')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  return { data: data as Pet | null, error: error?.message ?? null }
}

// ─── Admin ─────────────────────────────────────────────────────────

export async function getAdminPets(page = 1, limit = 20) {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const { data, count, error } = await supabase
    .from('pets')
    .select('*, fotos:pet_photos(*)', { count: 'exact' })
    .range(from, from + limit - 1)
    .order('created_at', { ascending: false })

  return { data: data as Pet[] | null, count: count ?? 0, error: error?.message ?? null }
}

export async function adminApprovePet(id: string, aprobado: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('pets').update({ aprobado }).eq('id', id)
  return { error: error?.message ?? null }
}

export async function adminToggleDestacado(id: string, destacado: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('pets').update({ destacado }).eq('id', id)
  return { error: error?.message ?? null }
}

export async function adminToggleVisible(id: string, visible: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('pets').update({ visible }).eq('id', id)
  return { error: error?.message ?? null }
}

export async function deletePet(id: string) {
  const supabase = await createClient()
  // Photos cascade-deleted via FK
  const { error } = await supabase.from('pets').delete().eq('id', id)
  return { error: error?.message ?? null }
}
