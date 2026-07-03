'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'

export function ResetForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) { showToast('Ingresa un correo válido.', 'error'); return }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cuenta/nueva-contrasena`,
    })
    setLoading(false)
    if (error) { showToast(error.message, 'error'); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-10 shadow-card text-center">
        <div className="w-16 h-16 rounded-full bg-verde-bg text-verde flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 className="font-display font-extrabold text-xl mb-2">Revisa tu correo</h2>
        <p className="text-texto-suave text-sm">Te enviamos un enlace a <strong>{email}</strong>. Puede tardar unos minutos.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gris rounded-[var(--radius-lg)] p-10 shadow-card" noValidate>
      <div className="flex flex-col gap-5">
        <Input label="Tu correo electrónico" type="email" placeholder="tucorreo@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        <Button type="submit" loading={loading} block>Enviar enlace</Button>
        <a href="/entrar" className="text-center text-sm text-azul font-semibold hover:underline">Volver a iniciar sesión</a>
      </div>
    </form>
  )
}
