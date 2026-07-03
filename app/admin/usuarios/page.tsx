import type { Metadata } from 'next'
import { getAdminUsuarios } from '@/services/admin'
import { AdminUsuariosTable } from './usuarios-table'

export const metadata: Metadata = { title: 'Admin — Usuarios' }

export default async function AdminUsuariosPage({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string }>
}) {
  const { pagina } = await searchParams
  const page = parseInt(pagina ?? '1', 10)
  const { data: usuarios, count } = await getAdminUsuarios(page)

  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-extrabold text-azul-dark">Usuarios</h1>
        <p className="text-texto-suave text-sm mt-1">{count} usuario{count !== 1 ? 's' : ''} registrados en total.</p>
      </div>
      <AdminUsuariosTable usuarios={usuarios ?? []} total={count} page={page} />
    </>
  )
}
