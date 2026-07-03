import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas a las preguntas más comunes sobre Chamo Amiga.',
}

const FAQS = [
  {
    q: '¿Chamo Amiga tiene algún costo?',
    a: 'No. La plataforma es completamente gratuita, tanto para quienes buscan ayuda como para los profesionales y voluntarios que se registran.',
  },
  {
    q: '¿Cómo sé que los perfiles son confiables?',
    a: 'Nuestro equipo revisa cada perfil manualmente antes de marcarlo como verificado. Sin embargo, te recomendamos revisar las reseñas de otros usuarios y conversar con el profesional antes de compartir información sensible.',
  },
  {
    q: '¿Necesito crear una cuenta para pedir ayuda?',
    a: 'No. Puedes publicar una solicitud sin crear ninguna cuenta. Solo necesitas un correo electrónico para recibir respuestas y hacer seguimiento con tu código.',
  },
  {
    q: '¿Qué pasa con mi correo electrónico?',
    a: 'Tu correo nunca se muestra públicamente. Solo lo usamos para enviarte notificaciones relacionadas con tu solicitud.',
  },
  {
    q: '¿Cómo funciona el código de seguimiento?',
    a: 'Al publicar una solicitud, recibirás un código único (ej: CA-ABCD). Con ese código y tu correo puedes consultar en cualquier momento quiénes se ofrecieron a ayudarte, sin necesidad de crear una cuenta.',
  },
  {
    q: '¿Puedo registrarme si vivo fuera de Venezuela?',
    a: 'Sí. Chamo Amiga conecta a venezolanos dentro y fuera del país. Muchos profesionales atienden en línea desde la diáspora.',
  },
  {
    q: '¿Cómo se verifican los profesionales?',
    a: 'Revisamos el perfil, la información de contacto y, cuando es posible, la credencial declarada. Los perfiles verificados tienen una insignia visible. Este proceso puede tardar hasta 72 horas.',
  },
  {
    q: '¿Qué hago si tengo un problema con un profesional?',
    a: 'Escríbenos a hola@chamoamiga.org y revisaremos el caso. También puedes dejar una reseña honesta en su perfil para informar a otros usuarios.',
  },
]

export default function FaqPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16 pb-24">
      <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-display font-extrabold mb-3">
        Preguntas frecuentes
      </h1>
      <p className="text-texto-suave text-[1.05rem] mb-10">
        Si no encuentras la respuesta que buscas, escríbenos a{' '}
        <a href="mailto:hola@chamoamiga.org" className="text-azul font-semibold hover:underline">
          hola@chamoamiga.org
        </a>
        .
      </p>

      <div className="space-y-4">
        {FAQS.map((item, i) => (
          <details
            key={i}
            className="group bg-white border border-gris rounded-[var(--radius)] overflow-hidden"
          >
            <summary className="flex justify-between items-center px-6 py-5 cursor-pointer font-display font-bold text-azul-dark text-[1rem] list-none select-none hover:bg-gris-2 transition-colors">
              {item.q}
              <span
                aria-hidden
                className="text-texto-suave ml-4 flex-none transition-transform duration-200 group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <div className="px-6 pb-5 pt-1 text-texto-suave text-[0.95rem] leading-relaxed border-t border-gris">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
