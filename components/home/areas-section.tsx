import Link from 'next/link'
import { FRENTES } from '@/lib/constants'
import type { Categoria } from '@/types'

interface AreasSectionProps {
  categorias: Categoria[]
  counts: Record<string, number>
}

export function AreasSection({ categorias, counts }: AreasSectionProps) {
  return (
    <section className="py-[88px] bg-gris-2">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-[640px] mx-auto text-center mb-[52px]">
          <span className="inline-block font-display font-bold text-[0.8rem] tracking-[0.08em] uppercase text-[#8A6300] mb-3">
            Frentes de ayuda
          </span>
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold mb-3">
            ¿En qué podemos ayudarte?
          </h2>
          <p className="text-texto-suave text-[1.05rem]">
            Cada área tiene profesionales y voluntarios listos para atender tu situación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          {FRENTES.map((frente, i) => {
            const cats = categorias.filter((c) => frente.categorias.includes(c.nombre))
            return (
              <div
                key={frente.titulo}
                className={`bg-white border border-gris rounded-[var(--radius-lg)] p-6 shadow-card ${i === 0 ? 'md:col-span-2' : ''}`}
              >
                <h3 className="font-display font-extrabold text-[1.02rem] mb-4 flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amarillo flex-none" aria-hidden />
                  {frente.titulo}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {cats.map((cat) => {
                    const count = counts[cat.id] ?? 0
                    return (
                      <Link
                        key={cat.id}
                        href={`/buscar?categoria=${cat.id}`}
                        className="inline-flex items-center gap-2 border-[1.5px] border-gris bg-fondo rounded-full px-4 py-[9px] text-[0.9rem] font-medium text-texto-suave hover:-translate-y-0.5 hover:border-azul hover:text-azul hover:bg-white hover:shadow-card transition-all duration-[180ms]"
                      >
                        {cat.icono && <span aria-hidden>{cat.icono}</span>}
                        {cat.nombre}
                        {count > 0 && (
                          <span className="text-[0.72rem] font-bold text-verde bg-verde-bg rounded-full px-2 py-0.5">
                            {count}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                  {cats.length === 0 &&
                    frente.categorias.map((nombre) => (
                      <Link
                        key={nombre}
                        href={`/buscar?q=${encodeURIComponent(nombre)}`}
                        className="inline-flex items-center gap-2 border-[1.5px] border-gris bg-fondo rounded-full px-4 py-[9px] text-[0.9rem] font-medium text-texto-suave hover:-translate-y-0.5 hover:border-azul hover:text-azul hover:bg-white hover:shadow-card transition-all duration-[180ms]"
                      >
                        {nombre}
                      </Link>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
