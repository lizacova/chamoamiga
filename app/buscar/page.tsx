import type { Metadata } from 'next'
import Link from 'next/link'
import { ProfileCard } from '@/components/profesionales/profile-card'
import { Button } from '@/components/ui/button'
import { getProfesionales } from '@/services/profiles'
import { getCategorias } from '@/services/categorias'

export const metadata: Metadata = {
  title: 'Buscar ayuda',
  description: 'Encuentra profesionales y voluntarios venezolanos listos para ayudarte.',
}

export const revalidate = 120

interface SearchParams {
  categoria?: string
  modalidad?: string
  pagina?: string
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = parseInt(params.pagina ?? '1', 10)

  const [{ data: profesionales, count }, { data: categorias }] = await Promise.all([
    getProfesionales({
      categoria: params.categoria,
      modalidad: params.modalidad,
      page,
    }),
    getCategorias(),
  ])

  const totalPages = Math.ceil((count ?? 0) / 12)

  return (
    <>
      {/* Page header */}
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo py-14 border-b border-gris">
        <div className="max-w-content mx-auto px-6">
          <p className="text-sm text-texto-suave mb-3.5">
            <Link href="/" className="text-azul font-semibold hover:underline">Inicio</Link>
            {' / '}Buscar ayuda
          </p>
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-display font-extrabold mb-2.5">
            Buscar ayuda
          </h1>
          <p className="text-texto-suave text-[1.05rem] max-w-[40rem]">
            Explora los perfiles de profesionales y voluntarios. Todos han sido verificados por nuestro equipo.
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 pb-20">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap my-7 items-center">
          <form method="GET" className="flex gap-3 flex-wrap flex-1">
            <select
              name="categoria"
              defaultValue={params.categoria ?? ''}
              className="bg-white border border-gris rounded-[12px] px-4 py-3 text-sm font-medium text-texto appearance-none pr-10 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] focus:outline-none focus:border-azul"
              onChange={(e) => {}}
            >
              <option value="">Todas las especialidades</option>
              {categorias?.map((c) => (
                <option key={c.id} value={c.id} selected={params.categoria === c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <select
              name="modalidad"
              defaultValue={params.modalidad ?? ''}
              className="bg-white border border-gris rounded-[12px] px-4 py-3 text-sm font-medium text-texto appearance-none pr-10 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] focus:outline-none focus:border-azul"
            >
              <option value="">Cualquier modalidad</option>
              <option value="en_linea">En línea</option>
              <option value="presencial">Presencial</option>
            </select>

            <button
              type="submit"
              className="bg-azul text-white font-semibold text-sm px-5 py-3 rounded-full hover:bg-azul-hover transition-colors"
            >
              Filtrar
            </button>
          </form>

          <span className="text-sm text-texto-suave">
            {count ?? 0} perfil{count !== 1 ? 'es' : ''} encontrado{count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Results */}
        {profesionales && profesionales.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[26px]">
            {profesionales.map((p) => (
              <ProfileCard key={p.id} profesional={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-[1.5px] border-dashed border-gris rounded-[var(--radius)] p-10 text-center text-texto-suave">
            <strong className="block font-display text-azul-dark text-[1.05rem] mb-1.5">
              No encontramos perfiles con estos filtros
            </strong>
            Publica tu solicitud y te avisamos cuando alguien pueda ayudarte.
            <div className="mt-5">
              <Link href="/necesito">
                <Button size="sm">Publicar mi solicitud</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {page > 1 && (
              <Link href={`/buscar?${new URLSearchParams({ ...params, pagina: String(page - 1) })}`}>
                <Button variant="ghost" size="sm">← Anterior</Button>
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-texto-suave">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/buscar?${new URLSearchParams({ ...params, pagina: String(page + 1) })}`}>
                <Button variant="ghost" size="sm">Siguiente →</Button>
              </Link>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-8 mt-11 flex justify-between items-center gap-5 flex-wrap">
          <div>
            <h3 className="font-display font-extrabold text-[1.05rem] mb-1.5">¿No encuentras lo que buscas?</h3>
            <p className="text-texto-suave text-[0.93rem]">
              Publica tu solicitud y deja que la ayuda llegue a ti.
            </p>
          </div>
          <Link href="/necesito">
            <Button>Cuéntanos qué necesitas</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
