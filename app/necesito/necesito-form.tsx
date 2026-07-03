'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'
import { genCodigo, isValidEmail } from '@/lib/utils'
import type { Categoria } from '@/types'

interface NecesitoFormProps {
  categorias: Categoria[]
}

export function NecesitoForm({ categorias }: NecesitoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    titulo: '',
    categoria_id: '',
    ubicacion: '',
    modalidad: 'en_linea' as 'en_linea' | 'presencial' | 'ambas',
    descripcion: '',
    nombre_contacto: '',
    email_contacto: '',
  })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.titulo.trim()) e.titulo = 'Cuéntanos en una frase qué necesitas.'
    if (!form.categoria_id) e.categoria_id = 'Elige el tipo de ayuda.'
    if (!form.ubicacion.trim()) e.ubicacion = 'Indícanos dónde estás.'
    if (!form.descripcion.trim()) e.descripcion = 'Cuéntanos un poco más de tu situación.'
    if (!form.nombre_contacto.trim()) e.nombre_contacto = 'Escribe tu nombre o «Anónimo».'
    if (!isValidEmail(form.email_contacto)) e.email_contacto = 'Necesitamos un correo válido.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) { showToast('Revisa los campos marcados.', 'error'); return }
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('solicitudes')
      .insert({
        ...form,
        email_contacto: form.email_contacto.toLowerCase(),
        estado: 'abierta',
        codigo_seguimiento: genCodigo(),
        creador_id: user?.id ?? null,
      })
      .select()
      .single()

    setLoading(false)

    if (error || !data) {
      showToast('Ocurrió un error al publicar. Intenta de nuevo.', 'error')
      return
    }

    // Store tracking code for the success page
    sessionStorage.setItem('ca_last_solicitud', JSON.stringify({
      codigo: data.codigo_seguimiento,
      email: form.email_contacto,
    }))

    router.push('/necesito/gracias')
  }

  const categoriaOptions = categorias.map((c) => ({ value: c.id, label: c.nombre }))
  const modalidadOptions = [
    { value: 'en_linea', label: 'En línea' },
    { value: 'presencial', label: 'Presencial' },
    { value: 'ambas', label: 'Cualquiera de las dos' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gris rounded-[var(--radius-lg)] p-10 shadow-card max-w-[640px] mx-auto"
      noValidate
    >
      <div className="flex flex-col gap-5">
        <Input
          label="¿Qué necesitas?"
          hint="Un título corto y claro"
          placeholder="Ej: Necesito que revisen si mi casa quedó habitable"
          value={form.titulo}
          onChange={set('titulo')}
          error={errors.titulo}
          required
        />

        <Select
          label="¿Qué tipo de ayuda buscas?"
          options={categoriaOptions}
          placeholder="Elige la especialidad más cercana"
          value={form.categoria_id}
          onChange={set('categoria_id')}
          error={errors.categoria_id}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="¿En qué ciudad estás?"
            placeholder="Ej: Mérida"
            value={form.ubicacion}
            onChange={set('ubicacion')}
            error={errors.ubicacion}
            required
          />
          <Select
            label="Modalidad preferida"
            options={modalidadOptions}
            value={form.modalidad}
            onChange={set('modalidad')}
          />
        </div>

        <Textarea
          label="Cuéntanos un poco más"
          hint="Mientras más contexto, mejor podrán ayudarte"
          placeholder="Desde el terremoto..."
          value={form.descripcion}
          onChange={set('descripcion')}
          error={errors.descripcion}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Tu nombre"
            hint="Puedes escribir «Anónimo»"
            placeholder="Ej: Yohana M."
            value={form.nombre_contacto}
            onChange={set('nombre_contacto')}
            error={errors.nombre_contacto}
            required
          />
          <Input
            label="Tu correo"
            hint="Para recibir respuestas"
            type="email"
            placeholder="tucorreo@email.com"
            value={form.email_contacto}
            onChange={set('email_contacto')}
            error={errors.email_contacto}
            required
          />
        </div>

        <Button type="submit" loading={loading} block size="lg">
          Publicar mi solicitud
        </Button>

        <p className="text-center text-xs text-texto-suave">
          Tu correo nunca se muestra públicamente. Al publicar recibirás un código para hacer seguimiento sin crear una cuenta.
        </p>
      </div>
    </form>
  )
}
