import { Search, MessageCircle, Heart } from 'lucide-react'

const STEPS = [
  {
    num: '1',
    icon: <Search size={25} />,
    iconBg: 'bg-azul-soft',
    iconColor: 'text-azul',
    title: 'Busca o publica',
    desc: 'Explora los perfiles disponibles por especialidad o publica tu solicitud en menos de dos minutos. Gratis, sin cuenta obligatoria.',
  },
  {
    num: '2',
    icon: <MessageCircle size={25} />,
    iconBg: 'bg-amarillo-soft',
    iconColor: 'text-[#8A6300]',
    title: 'Conecta directamente',
    desc: 'Escríbele al profesional o voluntario que mejor se adapte a tu situación. Ellos reciben tu mensaje y responden en hasta 48 horas.',
  },
  {
    num: '3',
    icon: <Heart size={25} />,
    iconBg: 'bg-verde-bg',
    iconColor: 'text-verde',
    title: 'Recibe la ayuda',
    desc: 'Coordinen juntos el día, hora y modalidad. Al finalizar, deja tu reseña para que otros venezolanos sepan a quién pueden acudir.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-[88px]">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-[640px] mx-auto text-center mb-[52px]">
          <span className="inline-block font-display font-bold text-[0.8rem] tracking-[0.08em] uppercase text-[#8A6300] mb-3">
            Cómo funciona
          </span>
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold mb-3">
            Pedir ayuda también es un acto de valentía
          </h2>
          <p className="text-texto-suave text-[1.05rem]">
            Tres pasos para encontrar a la persona indicada. Sin trámites eternos ni letra pequeña.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[26px] max-w-[520px] sm:max-w-none mx-auto">
          {STEPS.map((s) => (
            <article
              key={s.num}
              className="bg-white border border-gris rounded-[var(--radius-lg)] p-8 relative transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-1.5 hover:shadow-hover"
            >
              <span
                aria-hidden
                className="absolute top-6 right-6 w-[30px] h-[30px] rounded-full bg-azul-dark flex items-center justify-center font-display font-extrabold text-[0.85rem] text-white"
              >
                {s.num}
              </span>
              <div className={`w-[54px] h-[54px] rounded-[16px] flex items-center justify-center mb-5 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
              <h3 className="text-[1.15rem] font-extrabold mb-2.5">{s.title}</h3>
              <p className="text-texto-suave text-[0.94rem] leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
