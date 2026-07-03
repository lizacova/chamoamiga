import type { Metadata } from 'next'
import Link from 'next/link'
import { NecesitoForm } from './necesito-form'
import { getCategorias } from '@/services/categorias'

export const metadata: Metadata = {
  title: 'Necesito ayuda',
  description: 'Publica tu solicitud de ayuda. Gratis, en menos de dos minutos.',
}

export default async function NecesitoPage() {
  const { data: categorias } = await getCategorias()

  return (
    <>
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo py-14 border-b border-gris">
        <div className="max-w-content mx-auto px-6">
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-display font-extrabold mb-2.5">
            Cuéntanos qué necesitas
          </h1>
          <p className="text-texto-suave text-[1.05rem] max-w-[40rem]">
            Publica tu solicitud con tus palabras. Los profesionales y voluntarios de esa área la
            verán y podrán ofrecerte su ayuda. También puedes{' '}
            <Link href="/buscar" className="text-azul font-semibold hover:underline">
              explorar los perfiles directamente
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-14 pb-20">
        <NecesitoForm categorias={categorias ?? []} />
      </div>
    </>
  )
}
