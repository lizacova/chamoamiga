'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/cuenta'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const newErrors: typeof errors = {}
    if (!email.includes('@')) newErrors.email = 'Ingresa un correo válido.'
    if (password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres.'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      showToast(
        error.message.includes('Invalid login')
          ? 'Correo o contraseña incorrectos.'
          : error.message,
        'error'
      )
      return
    }

    showToast('¡Bienvenido de nuevo! 💙')
    router.push(redirect)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gris rounded-[var(--radius-lg)] p-10 shadow-card"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="tucorreo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          required
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
          required
        />
        <Button type="submit" loading={loading} block>
          Iniciar sesión
        </Button>
      </div>
    </form>
  )
}
