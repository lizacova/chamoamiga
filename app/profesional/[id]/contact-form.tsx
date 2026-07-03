'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { showToast } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/client'

interface ContactFormProps {
  profesionalId: string
  profesionalNombre: string
  block?: boolean
}

export function ContactForm({ profesionalId, profesionalNombre, block }: ContactFormProps) {
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !email.includes('@') || !mensaje.trim()) {
      showToast('Completa todos los campos antes de enviar.', 'error')
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Try to send as authenticated user first; fallback to anonymous message table
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('mensajes').insert({
        de_usuario_id: user.id,
        para_usuario_id: profesionalId,
        asunto: `Mensaje de ${nombre}`,
        contenido: mensaje,
        leido: false,
      })
    } else {
      // Anonymous message — stored in mensajes_anonimos
      await supabase.from('mensajes_anonimos').insert({
        para_usuario_id: profesionalId,
        nombre_remitente: nombre,
        email_remitente: email.toLowerCase(),
        contenido: mensaje,
      })
    }

    setLoading(false)
    setOpen(false)
    showToast(`Mensaje enviado. ${profesionalNombre.split(' ')[0]} lo verá en su cuenta. ✨`)
    setNombre('')
    setEmail('')
    setMensaje('')
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} block={block}>
        Escribirle a {profesionalNombre.split(' ')[0]}
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`Escribirle a ${profesionalNombre.split(' ')[0]}`}
      >
        <p className="text-texto-suave text-sm mb-5">
          Cuéntale brevemente qué necesitas. Recibirá tu mensaje y podrá responderte a tu correo.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Tu nombre"
            placeholder="Ej: Yohana Martínez"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <Input
            label="Tu correo"
            type="email"
            placeholder="tucorreo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Textarea
            label="Tu mensaje"
            placeholder="Hola, te escribo porque..."
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} block>
            Enviar mensaje
          </Button>
        </form>
      </Modal>
    </>
  )
}
