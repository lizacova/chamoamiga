import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const LISTA_NECESITO = [
  'Elige la especialidad que necesitas',
  'Publica tu caso en minutos',
  'Recibe respuestas de profesionales disponibles',
]

const LISTA_AYUDO = [
  'Crea tu perfil gratuito en minutos',
  'Responde solicitudes a tu ritmo',
  'Construye tu reputación en la comunidad',
]

export function CTASection() {
  return (
    <section className="py-[88px]">
      <div className="max-w-content mx-auto px-6">
        <div className="bg-gradient-to-br from-azul to-azul-dark rounded-[var(--radius-lg)] p-[56px_52px] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center text-white shadow-[0_24px_60px_rgba(18,41,75,0.32)]">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-white mb-3">
              ¿Listo para dar el primer paso?
            </h2>
            <p className="opacity-95 max-w-[32rem] text-[0.95rem] leading-relaxed">
              Sea que necesites ayuda o quieras darla — Chamo Amiga es el lugar donde eso pasa.
            </p>
            <ul className="mt-5 space-y-3.5">
              {LISTA_NECESITO.map((item) => (
                <li key={item} className="flex gap-3 items-start text-[0.95rem]">
                  <Check size={20} className="flex-none mt-0.5 text-amarillo" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3.5">
            <Link href="/necesito">
              <Button variant="secondary" size="lg" block>
                Necesito ayuda
              </Button>
            </Link>
            <Link href="/sumarme">
              <Button variant="light" size="lg" block>
                Quiero ayudar
              </Button>
            </Link>
            <ul className="mt-2 space-y-2">
              {LISTA_AYUDO.map((item) => (
                <li key={item} className="flex gap-2 items-start text-[0.85rem] opacity-90">
                  <Check size={16} className="flex-none mt-0.5 text-amarillo" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
