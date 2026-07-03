import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  PET_STATUS_LABELS,
  PET_STATUS_COLORS,
  PET_SIZE_LABELS,
  PET_SEX_LABELS,
  PET_SPECIES_LABELS,
} from '@/lib/constants'
import type { Pet } from '@/types'

interface PetCardProps {
  pet: Pet
}

export function PetCard({ pet }: PetCardProps) {
  const mainPhoto = pet.fotos?.find((f) => f.es_principal) ?? pet.fotos?.[0]
  const statusColor = (PET_STATUS_COLORS[pet.estado] ?? 'gray') as any
  const nombreDisplay = pet.nombre ?? (pet.especie === 'perro' ? 'Perro sin nombre' : pet.especie === 'gato' ? 'Gato sin nombre' : 'Mascota sin nombre')

  return (
    <article className="bg-white border border-gris rounded-[var(--radius-lg)] overflow-hidden flex flex-col transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-hover">
      {/* Photo */}
      <Link href={`/mascotas/${pet.id}`} className="block relative aspect-[4/3] bg-gris-2 overflow-hidden flex-none">
        {mainPhoto ? (
          <Image
            src={mainPhoto.url}
            alt={`Foto de ${nombreDisplay}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-texto-suave/40">
            {pet.especie === 'perro' ? '🐶' : pet.especie === 'gato' ? '🐱' : '🐾'}
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute top-3 left-3">
          <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full shadow-card ${
            pet.estado === 'perdido' ? 'bg-rojo text-white' :
            pet.estado === 'reunido' || pet.estado === 'adoptado' ? 'bg-verde text-white' :
            'bg-white text-azul-dark'
          }`}>
            {PET_STATUS_LABELS[pet.estado] ?? pet.estado}
          </span>
        </div>

        {/* Destacado star */}
        {pet.destacado && (
          <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-amarillo flex items-center justify-center text-sm shadow-card" aria-label="Destacado">
            ⭐
          </div>
        )}

        {/* Photo count */}
        {(pet.fotos?.length ?? 0) > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full">
            +{pet.fotos!.length} fotos
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <Link href={`/mascotas/${pet.id}`}>
            <h3 className="font-display font-extrabold text-[1.05rem] text-azul-dark leading-tight hover:text-azul transition-colors">
              {nombreDisplay}
            </h3>
          </Link>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="blue">{PET_SPECIES_LABELS[pet.especie]}</Badge>
            <Badge variant="gray">{PET_SIZE_LABELS[pet.tamano]}</Badge>
            <Badge variant="gray">{PET_SEX_LABELS[pet.sexo]}</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-xs text-texto-suave">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} className="flex-none" aria-hidden /> {pet.ciudad}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} className="flex-none" aria-hidden /> {formatDate(pet.created_at)}
          </span>
        </div>

        <p className="text-sm text-texto-suave line-clamp-2 leading-relaxed flex-1">
          {pet.descripcion}
        </p>

        <Link href={`/mascotas/${pet.id}`} className="mt-auto">
          <Button variant="ghost" size="sm" block>
            Ver detalle
          </Button>
        </Link>
      </div>
    </article>
  )
}
