'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'
import { isValidEmail } from '@/lib/utils'
import { Camera } from 'lucide-react'
import type { Categoria } from '@/types'

interface SumarmeFormProps {
  categorias: Categoria[]
}

type Tipo = 'profesional' | 'voluntario' | null
type Modalidad = 'en_linea' | 'presencial' | 'ambas'

export function SumarmeForm({ categorias }: SumarmeFormProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [tipo, setTipo] = useState<Tipo>(null)
  const [modalidad, setModalidad] = useState<Modalidad[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', confirmPassword: '',
    categoria_id: '', rol_descripcion: '', ciudad: '', biografia: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }))

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 4 * 1024 * 1024) { showToast('La imagen supera 4 MB. Elige una más liviana.', 'error'); return }
    setPhotoFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function toggleModalidad(val: 'en_linea' | 'presencial') {
    setModalidad((prev) =>
      prev.includes(val) ? prev.filter((m) => m !== val) : [...prev, val]
    )
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!tipo) e.tipo = 'Elige cómo quieres participar.'
    if (!form.nombre.trim()) e.nombre = 'Escribe tu nombre.'
    if (!form.apellido.trim()) e.apellido = 'Escribe tu apellido.'
    if (!isValidEmail(form.email)) e.email = 'Necesitamos un correo válido.'
    if (form.password.length < 6) e.password = 'Usa al menos 6 caracteres.'
    if (form.confirmPassword !== form.password) e.confirmPassword = 'Las contraseñas no coinciden.'
    if (!form.categoria_id) e.categoria_id = 'Elige tu profesión o tipo de ayuda.'
    if (!modalidad.length) e.modalidad = 'Marca al menos una opción.'
    if (!form.ciudad.trim()) e.ciudad = 'Indícanos tu ciudad.'
    if (!form.biografia.trim()) e.biografia = 'Escribe una breve presentación.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) { showToast('Revisa los campos marcados.', 'error'); return }
    setLoading(true)

    const supabase = createClient()

    // 1. Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email.toLowerCase(),
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          apellido: form.apellido,
          rol: tipo === 'profesional' ? 'profesional' : 'voluntario',
          ciudad: form.ciudad,
        },
      },
    })

    if (authError || !authData.user) {
      setLoading(false)
      showToast(authError?.message ?? 'Error al crear la cuenta.', 'error')
      return
    }

    const userId = authData.user.id

    // 2. Upload photo if provided
    let fotoUrl: string | null = null
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(`${userId}/avatar.${ext}`, photoFile, { upsert: true })
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar.${ext}`)
        fotoUrl = urlData.publicUrl
      }
    }

    // 3. Update profile with foto_url
    if (fotoUrl) {
      await supabase.from('profiles').update({ foto_url: fotoUrl }).eq('id', userId)
    }

    // 4. Create profesional record
    const modalidadValue: Modalidad =
      modalidad.includes('en_linea') && modalidad.includes('presencial') ? 'ambas'
        : modalidad[0] as Modalidad

    await supabase.from('profesionales').insert({
      usuario_id: userId,
      profesion: form.rol_descripcion || categorias.find((c) => c.id === form.categoria_id)?.nombre || '',
      biografia: form.biografia,
      modalidad: modalidadValue,
      disponible: true,
      verificado: false,
      ayudados: 0,
    })

    // 5. Link category
    await supabase.from('profesional_categorias').insert({
      profesional_id: userId,
      categoria_id: form.categoria_id,
    })

    setLoading(false)
    showToast('¡Perfil creado! Está visible de inmediato. Te verificaremos pronto 💙')
    router.push('/cuenta')
    router.refresh()
  }

  const stepNum = (n: string, title: string, subtitle?: string) => (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-7 h-7 rounded-full bg-azul-soft text-azul font-display font-extrabold text-[0.85rem] flex items-center justify-center flex-none" aria-hidden>
        {n}
      </span>
      <div>
        <h3 className="font-display font-extrabold text-[1.05rem]">{title}</h3>
        {subtitle && <p className="text-xs text-texto-suave">{subtitle}</p>}
      </div>
    </div>
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gris rounded-[var(--radius-lg)] px-9 pb-9 shadow-card"
      noValidate
    >
      {/* Step 1 — Tipo */}
      <section className="pt-8">
        {stepNum('1', '¿Cómo quieres ayudar?', 'Elige la opción que mejor te describe.')}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(['profesional', 'voluntario'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`border-[1.5px] rounded-[14px] p-4 text-left transition-all ${
                tipo === t
                  ? t === 'profesional'
                    ? 'border-azul bg-azul-soft'
                    : 'border-amarillo-strong bg-amarillo-soft'
                  : 'border-gris bg-white hover:border-azul'
              }`}
            >
              <span className={`font-display font-extrabold text-[0.95rem] block ${tipo === t ? (t === 'profesional' ? 'text-azul' : 'text-[#8A6300]') : 'text-azul-dark'}`}>
                {t === 'profesional' ? 'Soy profesional' : 'Soy voluntario/a'}
              </span>
              <span className="text-xs text-texto-suave mt-0.5 block">
                {t === 'profesional' ? 'Ofrezco mis servicios (con o sin costo)' : 'Ayudo sin costo con lo que puedo'}
              </span>
            </button>
          ))}
        </div>
        {errors.tipo && <p className="text-[#B93B37] text-xs font-semibold mt-2">{errors.tipo}</p>}
      </section>

      {/* Step 2 — Datos */}
      <section className="pt-8 mt-8 border-t border-gris">
        {stepNum('2', 'Tus datos', 'Así te conocerá la comunidad.')}

        {/* Photo */}
        <div className="flex items-center gap-4 mb-5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-[92px] h-[92px] rounded-full border-2 border-dashed border-gris bg-gris-2 flex items-center justify-center overflow-hidden flex-none hover:border-azul hover:text-azul text-texto-suave transition-colors"
            aria-label="Subir foto de perfil"
          >
            {previewUrl ? (
              <Image src={previewUrl} alt="Vista previa" width={92} height={92} className="w-full h-full object-cover" />
            ) : (
              <Camera size={30} aria-hidden />
            )}
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
          <div>
            <p className="font-display font-bold text-[0.9rem] text-azul-dark">Foto de perfil</p>
            <p className="text-xs text-texto-suave">Opcional · genera más confianza. JPG o PNG, hasta 4 MB.</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="text-sm font-bold text-azul mt-1.5">
              Elegir imagen
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input label="Nombre" placeholder="Andreína" value={form.nombre} onChange={set('nombre')} error={errors.nombre} required />
          <Input label="Apellido" placeholder="Castillo" value={form.apellido} onChange={set('apellido')} error={errors.apellido} required />
          <Input label="Correo electrónico" type="email" placeholder="tucorreo@email.com" value={form.email} onChange={set('email')} error={errors.email} required />
          <Input label="Ciudad" placeholder="Ej: Caracas" value={form.ciudad} onChange={set('ciudad')} error={errors.ciudad} required />
          <Input label="Contraseña" hint="Mínimo 6 caracteres" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" required />
          <Input label="Repite la contraseña" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" required />
        </div>
      </section>

      {/* Step 3 — Especialidad */}
      <section className="pt-8 mt-8 border-t border-gris">
        {stepNum('3', 'Tu forma de ayudar', 'Elige tu profesión o cómo puedes colaborar.')}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="font-display font-bold text-sm text-azul-dark">
              Profesión o tipo de ayuda
            </label>
            <select
              value={form.categoria_id}
              onChange={set('categoria_id')}
              className="bg-gris-2 border-[1.5px] border-gris rounded-[12px] px-4 py-[13px] text-[0.95rem] text-texto appearance-none focus:outline-none focus:border-azul focus:bg-white focus:shadow-[0_0_0_4px_rgba(44,92,184,0.12)] transition-all"
            >
              <option value="" disabled>Selecciona una opción</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errors.categoria_id && <p className="text-[#B93B37] text-xs font-semibold">{errors.categoria_id}</p>}
          </div>

          <Input
            label="Título o credencial"
            hint="Opcional · aparece bajo tu nombre"
            placeholder="Ej: Psicóloga clínica · UCV"
            value={form.rol_descripcion}
            onChange={set('rol_descripcion')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="font-display font-bold text-sm text-azul-dark">
              ¿Desde dónde quieres ayudar?{' '}
              <span className="font-body font-normal text-xs text-texto-suave">(Puedes marcar ambas)</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['en_linea', 'presencial'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleModalidad(m)}
                  className={`border-[1.5px] rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    modalidad.includes(m) ? 'bg-azul border-azul text-white' : 'border-gris text-texto-suave bg-white hover:border-azul hover:text-azul'
                  }`}
                >
                  {m === 'en_linea' ? 'En línea' : 'Presencial'}
                </button>
              ))}
            </div>
            {errors.modalidad && <p className="text-[#B93B37] text-xs font-semibold">{errors.modalidad}</p>}
          </div>
        </div>
      </section>

      {/* Step 4 — Presentación */}
      <section className="pt-8 mt-8 border-t border-gris">
        {stepNum('4', 'Preséntate', 'Unas líneas cálidas y claras.')}
        <Textarea
          placeholder="Acompaño a las personas afectadas por el terremoto con..."
          value={form.biografia}
          onChange={set('biografia')}
          error={errors.biografia}
          required
        />
      </section>

      <div className="mt-8">
        <Button type="submit" variant="secondary" loading={loading} block size="lg">
          Crear mi perfil
        </Button>
        <p className="text-center text-xs text-texto-suave mt-3.5">
          Tu perfil se publica de inmediato. Nuestro equipo lo verifica en máximo 72 horas.
        </p>
      </div>
    </form>
  )
}
