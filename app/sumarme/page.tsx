import type { Metadata } from 'next'
import Link from 'next/link'
import { SumarmeForm } from './sumarme-form'
import { getCategorias } from '@/services/categorias'
import { Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quiero ayudar',
  description: 'Crea tu perfil como profesional o voluntario en Chamo Amiga.',
}

const ASIDE_ITEMS = [
  'Respondes solo lo que puedas, cuando puedas.',
  'Tu perfil guarda tus reseñas y las personas que ayudaste.',
  'Verificamos cada perfil para cuidar a la comunidad.',
  'Tu correo y datos privados nunca se muestran.',
]

export default async function SumarmePage() {
  const { data: categorias } = await getCategorias()

  return (
    <>
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo py-14 border-b border-gris">
        <div className="max-w-content mx-auto px-6">
          <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-display font-extrabold mb-2.5">
            Súmate a la red de ayuda
          </h1>
          <p className="text-texto-suave text-[1.05rem] max-w-[40rem]">
            Crea tu perfil como profesional o voluntario. Tendrás tu propia cuenta con reseñas y el registro de cada persona que ayudaste.{' '}
            <Link href="/entrar" className="text-azul font-semibold hover:underline">
              ¿Ya tienes perfil? Inicia sesión
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-11 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start max-w-[980px] mx-auto">
          {/* Form */}
          <SumarmeForm categorias={categorias ?? []} />

          {/* Aside */}
          <aside className="bg-azul-dark text-[#DCE6F3] rounded-[var(--radius-lg)] p-8 lg:sticky lg:top-[90px]">
            <h3 className="text-white font-display font-extrabold text-[1.1rem] mb-4">
              Por qué sumarte
            </h3>
            <ul className="space-y-3.5 text-[0.9rem] leading-relaxed">
              {ASIDE_ITEMS.map((item) => (
                <li key={item} className="flex gap-2.5 items-start">
                  <Check size={19} className="flex-none text-amarillo mt-0.5" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-white/10 text-[0.82rem] text-[#9FB2CB] leading-relaxed">
              En momentos como este, una hora de tu tiempo puede sostener a una familia entera.
              Gracias por estar del lado de quienes más lo necesitan. 💛
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
