import type { Metadata } from 'next'
import { getCategorias } from '@/services/categorias'
import { AdminCategoriasClient } from './categorias-client'

export const metadata: Metadata = { title: 'Admin — Categorías' }

export default async function AdminCategoriasPage() {
  const { data: categorias } = await getCategorias()
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-extrabold text-azul-dark">Categorías</h1>
        <p className="text-texto-suave text-sm mt-1">Gestiona las especialidades disponibles en la plataforma.</p>
      </div>
      <AdminCategoriasClient categorias={categorias ?? []} />
    </>
  )
}
