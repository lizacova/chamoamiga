import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarsDisplay } from '@/components/ui/stars'
import { avgRating } from '@/lib/utils'
import type { Profesional } from '@/types'

interface ProfileCardProps {
  profesional: Profesional
}

export function ProfileCard({ profesional: p }: ProfileCardProps) {
  const name = `${p.profile?.nombre ?? ''} ${p.profile?.apellido ?? ''}`.trim()
  const r = p.reviews ? avgRating(p.reviews) : '—'
  const numReviews = p.reviews?.length ?? 0
  const categorias = p.categorias?.map((c) => (c as any).categoria?.nombre).filter(Boolean) ?? []

  return (
    <article className="bg-white border border-gris rounded-[var(--radius-lg)] p-7 flex flex-col gap-4 transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-hover">
      {/* Header */}
      <div className="flex gap-4 items-center">
        <Avatar name={name} fotoUrl={p.profile?.foto_url} size={60} />
        <div className="min-w-0">
          <p className="font-display font-extrabold text-[1.06rem] text-azul-dark leading-tight truncate">
            {name}
          </p>
          <p className="text-sm text-texto-suave mt-0.5 truncate">{p.profesion}</p>
          {p.verificado && (
            <span className="inline-flex items-center gap-1 text-verde font-bold text-xs mt-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Verificado
            </span>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {categorias.slice(0, 2).map((cat) => (
          <Badge key={cat} variant="blue">{cat}</Badge>
        ))}
        <Badge variant="gray">
          {p.modalidad === 'en_linea' ? 'En línea' : p.modalidad === 'presencial' ? 'Presencial' : 'En línea · Presencial'}
        </Badge>
        {p.profile?.ciudad && <Badge variant="gray">{p.profile.ciudad}</Badge>}
      </div>

      {/* Bio */}
      {p.biografia && (
        <p className="text-sm text-texto-suave line-clamp-3 leading-relaxed">{p.biografia}</p>
      )}

      {/* Stats */}
      <div className="flex gap-[18px] text-[0.83rem] text-texto-suave border-t border-gris pt-3.5 flex-wrap">
        <div>
          <strong className="font-display text-azul-dark text-base block leading-tight">{p.ayudados}</strong>
          personas ayudadas
        </div>
        {r !== '—' && (
          <div>
            <strong className="font-display text-azul-dark text-base block leading-tight flex items-center gap-1">
              {r} <StarsDisplay value={parseFloat(r)} size={13} />
            </strong>
            {numReviews} reseña{numReviews !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* CTA */}
      <Link href={`/profesional/${p.id}`} className="mt-auto">
        <Button variant="ghost" size="sm" block>
          Ver perfil
        </Button>
      </Link>
    </article>
  )
}
