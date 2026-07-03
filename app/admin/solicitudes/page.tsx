import type { Metadata } from 'next'
import { getAdminSolicitudes } from '@/services/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { AdminDeleteButton } from '../_components/delete-button'

export const metadata: Metadata = { title: 'Admin — Solicitudes' }

export default async function AdminSolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>
}) {
  const { pagina } = await searchParams
  const page = parseInt(pagina ?? '1', 10)
  const { data: solicitudes, count } = await getAdminSolicitudes(page)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-extrabold text-azul-dark">Solicitudes</h1>
        <p className="text-texto-suave text-sm mt-1">{count} solicitudes en total.</p>
      </div>

      <div className="bg-white border border-gris rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gris bg-gris-2">
                <th className="text-left px-5 py-3 font-display font-bold text-azul-dark">Solicitud</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark">Estado</th>
                <th className="text-left px-4 py-3 font-display font-bold text-azul-dark hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {solicitudes?.map((s) => (
                <tr key={s.id} className="border-b border-gris last:border-none hover:bg-gris-2/50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-azul-dark">{s.titulo}</p>
                    <p className="text-xs text-texto-suave">{(s as any).creador ? `${(s as any).creador.nombre} ${(s as any).creador.apellido ?? ''}` : 'Anónimo'}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {(s as any).categoria && <Badge variant="blue">{(s as any).categoria.nombre}</Badge>}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={s.estado === 'abierta' ? 'green' : 'gray'}>{s.estado}</Badge>
                  </td>
                  <td className="px-4 py-3 text-texto-suave hidden lg:table-cell">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <AdminDeleteButton
                      endpoint={`/api/admin/solicitudes/${s.id}`}
                      label="Eliminar"
                      confirmMsg="¿Eliminar esta solicitud?"
                    />
                  </td>
                </tr>
              ))}
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
