'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Solicitud, Profile } from '@/types'

interface RequestCardProps {
  solicitud: Solicitud
  currentProfile?: Profile | null
  onOfrecer?: (id: string) => void
}

export function RequestCard({ solicitud: r, currentProfile, onOfrecer }: RequestCardProps) {
  const abierta = r.estado === 'abierta'
  const numRespuestas = r.respuestas?.length ?? 0
  const modalidadLabel = r.modalidad === 'en_linea' ? 'En línea' : r.modalidad === 'presencial' ? 'Presencial' : 'Cualquiera'

  return (
    <article className="bg-white border border-gris rounded-[var(--radius)] p-6 flex flex-col gap-3 hover:shadow-card transition-shadow duration-200">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="font-display font-extrabold text-[1.05rem] text-azul-dark leading-tight">
            {r.titulo}
          </h3>
          <p className="text-xs text-texto-suave mt-1">
            {r.creador ? `${r.creador.nombre} ${r.creador.apellido ?? ''}`.trim() : 'Anónimo'}
            {r.ubicacion && ` · ${r.ubicacion}`}
            {r.created_at && ` · ${formatDate(r.created_at)}`}
          </p>
        </div>
        <Badge variant={abierta ? 'green' : 'gray'}>
          {abierta ? 'Abierta' : 'Atendida'}
        </Badge>
      </div>

      <p className="text-[0.92rem] text-texto-suave leading-relaxed line-clamp-3">{r.descripcion}</p>

      <div className="flex justify-between items-center gap-3 mt-1.5 flex-wrap">
        <div className="flex flex-wrap gap-2">
          {r.categoria && <Badge variant="blue">{r.categoria.nombre}</Badge>}
          <Badge variant="yellow">{modalidadLabel}</Badge>
          {numRespuestas > 0 && (
            <Badge variant="gray">{numRespuestas} respuesta{numRespuestas !== 1 ? 's' : ''}</Badge>
          )}
        </div>

        {abierta ? (
          currentProfile ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOfrecer?.(r.id)}
            >
              Ofrecer mi ayuda
            </Button>
          ) : (
            <a href="/sumarme">
              <Button variant="ghost" size="sm">Súmate para responder</Button>
            </a>
          )
        ) : (
          <span className="text-xs text-texto-suave">
            Atendida por <strong className="text-azul-dark">{(r as any).por ?? 'la comunidad'}</strong> 💙
          </span>
        )}
      </div>
    </article>
  )
}
