import { NextResponse } from 'next/server'
import { eliminarUsuario } from '@/services/admin'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await eliminarUsuario(id)
  if (error) return NextResponse.json({ error }, { status: error === 'Acceso denegado' ? 403 : 500 })
  return NextResponse.json({ ok: true })
}
