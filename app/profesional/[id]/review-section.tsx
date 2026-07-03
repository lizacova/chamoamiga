'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { StarPicker, StarsDisplay } from '@/components/ui/stars'
import { Avatar } from '@/components/ui/avatar'
import { showToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Review } from '@/types'

interface ReviewSectionProps {
  profesionalId: string
  reviews: Review[]
  profesionalNombre: string
}

export function ReviewSection({ profesionalId, reviews: initialReviews, profesionalNombre }: ReviewSectionProps) {
  const [reviews, setReviews] = useState(initialReviews)
  const [open, setOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [estrellas, setEstrellas] = useState(0)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nombre.trim() || !comentario.trim() || !estrellas) {
      showToast('Completa tu nombre, valoración y experiencia.', 'error')
      return
    }
    setLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Allow anonymous reviews stored with a display name
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        evaluado_id: profesionalId,
        evaluador_id: user?.id ?? '00000000-0000-0000-0000-000000000000',
        estrellas,
        comentario,
        nombre_anonimo: user ? null : nombre,
      })
      .select()
      .single()

    setLoading(false)

    if (error) { showToast('No se pudo publicar la reseña. Intenta de nuevo.', 'error'); return }

    setReviews([{ ...review, evaluador: { nombre, apellido: '', foto_url: null } as any }, ...reviews])
    setOpen(false)
    showToast('¡Gracias! Tu reseña ya es parte de la comunidad 💙')
    setNombre(''); setEstrellas(0); setComentario('')
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[1.3rem] font-display font-extrabold">Reseñas de la comunidad</h2>
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
          Dejar reseña
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border-[1.5px] border-dashed border-gris rounded-[var(--radius)] p-10 text-center text-texto-suave">
          <strong className="block font-display text-azul-dark mb-1.5">Aún no tiene reseñas</strong>
          Sé la primera persona en trabajar con {profesionalNombre} y contarlo.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rv) => {
            const reviewerName = rv.evaluador
              ? `${rv.evaluador.nombre} ${(rv.evaluador as any).apellido ?? ''}`.trim()
              : (rv as any).nombre_anonimo ?? 'Anónimo'
            return (
              <div key={rv.id} className="bg-white border border-gris rounded-[var(--radius)] p-6">
                <div className="flex justify-between items-center gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={reviewerName} fotoUrl={rv.evaluador?.foto_url} size={36} />
                    <strong className="font-display text-[0.95rem] text-azul-dark">{reviewerName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarsDisplay value={rv.estrellas} size={14} />
                    {rv.created_at && <span className="text-xs text-texto-suave">{formatDate(rv.created_at)}</span>}
                  </div>
                </div>
                <p className="text-texto-suave text-[0.92rem] leading-relaxed">{rv.comentario}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Review modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={`Tu reseña para ${profesionalNombre}`}>
        <p className="text-texto-suave text-sm mb-5">Tu experiencia ayuda a que otras personas confíen.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input label="Tu nombre" placeholder="Ej: Karla D." value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <div className="flex flex-col gap-1.5">
            <label className="font-display font-bold text-sm text-azul-dark">Valoración</label>
            <StarPicker value={estrellas} onChange={setEstrellas} />
          </div>
          <Textarea label="¿Cómo fue tu experiencia?" placeholder="Me ayudó con..." value={comentario} onChange={(e) => setComentario(e.target.value)} required />
          <Button type="submit" loading={loading} block>Publicar reseña</Button>
        </form>
      </Modal>
    </section>
  )
}
