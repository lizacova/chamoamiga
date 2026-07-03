import { NextResponse } from 'next/server'
import { bloquearUsuario } from '@/services/admin'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { error } = await bloquearUsuario(id)
  if (error) return NextResponse.json({ error }, { status: error === 'Acceso denegado' ? 403 : 500 })
  return NextResponse.json({ ok: true })
}
