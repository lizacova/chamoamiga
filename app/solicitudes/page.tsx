import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RequestCard } from '@/components/solicitudes/request-card'
import { getSolicitudes } from '@/services/solicitudes'
import { getCategorias } from '@/services/categorias'
import { getCurrentProfile } from '@/services/profiles'

export const metadata: Metadata = {
  title: 'Solicitudes de ayuda',
  description: 'Tablero de solicitudes abiertas. Si puedes ayudar, ofrécete.',
}

export const revalidate = 60

interface SearchParams {
  categoria?: string
  estado?: string
  pagina?: string
}

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = parseInt(params.pagina ?? '1', 10)

  const [{ data: solicitudes, count }, { data: categorias }, { data: currentProfile }] =
    await Promise.all([
      getSolicitudes({ categoria_id: params.categoria, estado: params.estado, page }),
      getCategorias(),
      getCurrentProfile(),
    ])

  const abiertas = solicitudes?.filter((s) => s.estado === 'abierta').length ?? 0

  return (
    <>
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo py-14 border-b border-gris">
        <div className="max-w-content mx-auto px-6">
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-display font-extrabold mb-2.5">
            Solicitudes de ayuda
          </h1>
          <p className="text-texto-suave text-[1.05rem] max-w-[40rem]">
            {abiertas > 0
              ? `${abiertas} persona${abiertas === 1 ? ' está' : 's están'} esperando una mano ahora mismo.`
              : 'El tablero de solicitudes abiertas.'}{' '}
            Si puedes ayudar en alguna, ofrécete — ese gesto puede cambiarle la semana a alguien.
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 pb-20">
        {/* Filters */}
        <form method="GET" className="flex gap-3 flex-wrap my-7 items-center">
          <select
            name="categoria"
            defaultValue={params.categoria ?? ''}
            className="bg-white border border-gris rounded-[12px] px-4 py-3 text-sm font-medium text-texto appearance-none pr-10 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] focus:outline-none focus:border-azul"
          >
            <option value="">Todas las especialidades</option>
            {categorias?.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          <select
            name="estado"
            defaultValue={params.estado ?? ''}
            className="bg-white border border-gris rounded-[12px] px-4 py-3 text-sm font-medium text-texto appearance-none pr-10 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] focus:outline-none focus:border-azul"
          >
            <option value="">Todos los estados</option>
            <option value="abierta">Abiertas</option>
            <option value="resuelta">Resueltas</option>
          </select>
          <button type="submit" className="bg-azul text-white font-semibold text-sm px-5 py-3 rounded-full hover:bg-azul-hover transition-colors">
            Filtrar
          </button>
          <span className="text-sm text-texto-suave ml-auto">
            {count ?? 0} solicitud{count !== 1 ? 'es' : ''}
          </span>
        </form>

        {/* Results */}
        {solicitudes && solicitudes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px]">
            {solicitudes.map((s) => (
              <RequestCard key={s.id} solicitud={s} currentProfile={currentProfile} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-[1.5px] border-dashed border-gris rounded-[var(--radius)] p-10 text-center text-texto-suave">
            <strong className="block font-display text-azul-dark mb-1.5">
              No hay solicitudes en esta categoría
            </strong>
            ¡Buena señal! Vuelve pronto o revisa otras áreas.
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-8 mt-11 flex justify-between items-center gap-5 flex-wrap">
          <div>
            <h3 className="font-display font-extrabold text-[1.05rem] mb-1.5">¿Necesitas ayuda tú?</h3>
            <p className="text-texto-suave text-[0.93rem]">
              Publica tu solicitud en menos de dos minutos. Es gratis y tu correo nunca se muestra.{' '}
              <Link href="/seguimiento" className="text-azul font-semibold hover:underline">
                ¿Ya publicaste una? Síguela con tu código.
              </Link>
            </p>
          </div>
          <Link href="/necesito">
            <Button>Publicar mi solicitud</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
