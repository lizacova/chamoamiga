'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PetPhoto } from '@/types'

interface PetPhotoGalleryProps {
  fotos: PetPhoto[]
  nombre: string
}

export function PetPhotoGallery({ fotos, nombre }: PetPhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!fotos || fotos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gris-2 rounded-[var(--radius-lg)] flex items-center justify-center text-6xl text-texto-suave/30">
        🐾
      </div>
    )
  }

  const sorted = [...fotos].sort((a, b) => a.orden - b.orden)
  const main = sorted[0]
  const rest = sorted.slice(1, 5)

  function prev() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + sorted.length) % sorted.length)
  }
  function next() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % sorted.length)
  }

  return (
    <>
      {/* Grid */}
      <div className={`grid gap-2 ${rest.length > 0 ? 'grid-cols-[1fr_auto]' : ''}`}>
        {/* Main photo */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden cursor-zoom-in bg-gris-2 block w-full"
          aria-label={`Ver foto de ${nombre}`}
        >
          <Image
            src={main.url}
            alt={`Foto principal de ${nombre}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </button>

        {/* Thumbnails */}
        {rest.length > 0 && (
          <div className={`grid gap-2 ${rest.length === 1 ? 'grid-rows-1' : 'grid-rows-2'}`} style={{ width: '120px' }}>
            {rest.map((foto, i) => {
              const isLast = i === 3 && fotos.length > 5
              return (
                <button
                  key={foto.id}
                  onClick={() => setLightboxIndex(i + 1)}
                  className="relative rounded-[10px] overflow-hidden bg-gris-2 cursor-zoom-in aspect-square"
                  aria-label={`Ver foto ${i + 2} de ${nombre}`}
                >
                  <Image
                    src={foto.url}
                    alt={`Foto ${i + 2} de ${nombre}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/55 flex items-center justify-center text-white font-display font-extrabold text-lg">
                      +{fotos.length - 4}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-amarillo transition-colors"
            aria-label="Cerrar"
            onClick={() => setLightboxIndex(null)}
          >
            <X size={32} />
          </button>

          <button
            className="absolute left-4 text-white hover:text-amarillo transition-colors p-2"
            aria-label="Anterior"
            onClick={(e) => { e.stopPropagation(); prev() }}
          >
            <ChevronLeft size={36} />
          </button>

          <div
            className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sorted[lightboxIndex].url}
              alt={`Foto ${lightboxIndex + 1} de ${nombre}`}
              width={900}
              height={675}
              className="object-contain max-w-[90vw] max-h-[85vh] rounded-[var(--radius)]"
            />
            <p className="text-center text-white/60 text-sm mt-2">
              {lightboxIndex + 1} / {sorted.length}
            </p>
          </div>

          <button
            className="absolute right-4 text-white hover:text-amarillo transition-colors p-2"
            aria-label="Siguiente"
            onClick={(e) => { e.stopPropagation(); next() }}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      )}
    </>
  )
}
