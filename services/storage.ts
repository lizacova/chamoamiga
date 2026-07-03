'use server'

import { createClient } from '@/lib/supabase/server'
import { STORAGE_BUCKETS } from '@/lib/constants'

/**
 * Upload a file to Supabase Storage and return its public URL.
 */
export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient()
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, { upsert: true })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}

export async function uploadLogo(orgId: string, file: File) {
  const supabase = await createClient()
  const ext = file.name.split('.').pop()
  const path = `${orgId}/logo.${ext}`

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.logos)
    .upload(path, file, { upsert: true })

  if (error) return { url: null, error: error.message }

  const { data } = supabase.storage.from(STORAGE_BUCKETS.logos).getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}
