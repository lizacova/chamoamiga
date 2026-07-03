import { ShieldCheck, Heart, Users, Lock } from 'lucide-react'

const PILLARS = [
  {
    icon: <ShieldCheck size={22} className="text-azul" />,
    title: 'Profesionales verificados',
    desc: 'Cada perfil pasa por una revisión manual antes de aparecer en la plataforma.',
  },
  {
    icon: <Heart size={22} className="text-rojo" />,
    title: 'Siempre gratuito',
    desc: 'Ninguna funcionalidad tiene costo. Chamo Amiga es una iniciativa sin fines de lucro.',
  },
  {
    icon: <Lock size={22} className="text-verde" />,
    title: 'Tus datos protegidos',
    desc: 'Tu correo nunca se muestra públicamente. Solo tú decides qué información compartes.',
  },
  {
    icon: <Users size={22} className="text-amarillo-strong" />,
    title: 'Comunidad venezolana',
    desc: 'Venezolanos ayudando a venezolanos, dentro y fuera del país.',
  },
]

export function TrustSection() {
  return (
    <section className="py-[88px] bg-gris-2">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-[640px] mx-auto text-center mb-[52px]">
          <span className="inline-block font-display font-bold text-[0.8rem] tracking-[0.08em] uppercase text-[#8A6300] mb-3">
            Por qué confiar en Chamo Amiga
          </span>
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold mb-3">
            Una plataforma construida con responsabilidad
          </h2>
          <p className="text-texto-suave text-[1.05rem]">
            Porque cuando alguien está en una situación difícil, merece encontrar ayuda real y confiable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-white border border-gris rounded-[var(--radius-lg)] p-7">
              <div className="w-11 h-11 rounded-[12px] bg-gris-2 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="font-display font-extrabold text-[1rem] mb-2">{p.title}</h3>
              <p className="text-texto-suave text-[0.9rem] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
