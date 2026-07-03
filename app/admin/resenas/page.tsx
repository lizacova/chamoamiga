import type { Metadata } from 'next'
import { getAdminReviews } from '@/services/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StarsDisplay } from '@/components/ui/stars'
import { formatDate } from '@/lib/utils'
import { AdminDeleteButton } from '../_components/delete-button'

export const metadata: Metadata = { title: 'Admin — Reseñas' }

export default async function AdminResenasPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>
}) {
  const { pagina } = await searchParams
  const page = parseInt(pagina ?? '1', 10)
  const { data: reviews, count } = await getAdminReviews(page)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-extrabold text-azul-dark">Reseñas</h1>
        <p className="text-texto-suave text-sm mt-1">{count} reseñas publicadas.</p>
      </div>

      <div className="bg-white border border-gris rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris bg-gris-2">
                <th className="text-left px-5 py-3 font-display font-bold text-azul-dark">De → Para</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark">Valoración</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden md:table-cell">Comentario</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((r) => {
                const evaluador = (r as any).evaluador
                const evaluado = (r as any).evaluado
                return (
                  <tr key={r.id} className="border-b border-gris last:border-none hover:bg-gris-2/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-azul-dark">
                        {evaluador ? `${evaluador.nombre} ${evaluador.apellido ?? ''}` : 'Anónimo'}
                      </p>
                      <p className="text-xs text-texto-suave">→ {evaluado ? `${evaluado.nombre} ${evaluado.apellido ?? ''}` : '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StarsDisplay value={r.estrellas} size={14} />
                    </td>
                    <td className="px-4 py-3 text-texto-suave max-w-[200px] truncate hidden md:table-cell">
                      {r.comentario}
                    </td>
                    <td className="px-4 py-3 text-texto-suave hidden lg:table-cell">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <AdminDeleteButton
                        endpoint={`/api/admin/resenas/${r.id}`}
                        confirmMsg="¿Eliminar esta reseña?"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-gris">
          <span className="text-sm text-texto-suave">{count} en total</span>
          <div className="flex gap-2">
            {page > 1 && <a href={`?pagina=${page - 1}`}><Button variant="ghost" size="sm">← Anterior</Button></a>}
            {(count ?? 0) > page * 20 && <a href={`?pagina=${page + 1}`}><Button variant="ghost" size="sm">Siguiente →</Button></a>}
          </div>
        </div>
      </div>
    </>
  )
}
