import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quiénes somos',
  description: 'Conoce el origen y la misión de Chamo Amiga.',
}

export default function QuienesSomosPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16 pb-24">
      <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-display font-extrabold mb-3">
        Quiénes somos
      </h1>
      <p className="text-texto-suave text-[1.05rem] mb-10">
        Una iniciativa sin fines de lucro nacida de la comunidad venezolana.
      </p>

      <div className="prose prose-slate max-w-none space-y-6 text-[1rem] leading-relaxed text-texto-suave">
        <p>
          <strong className="text-azul-dark">Chamo Amiga</strong> nació como respuesta directa a
          la crisis que dejó el terremoto del 24 de junio en Venezuela. En medio del caos, miles
          de personas no sabían a quién llamar: no había psicólogo para el trauma, ni ingeniero
          que dijera si era seguro quedarse en casa, ni abogado para reponer los documentos
          perdidos entre escombros.
        </p>
        <p>
          Un grupo de venezolanos — dentro y fuera del país — decidió que la respuesta podía
          organizarse mejor. Que si había profesionales dispuestos a ayudar, lo que faltaba era
          la plataforma que los conectara con quienes los necesitaban.
        </p>
        <p>
          No somos una institución gubernamental ni una ONG tradicional. Somos una red de
          personas que creen que la ayuda llega más rápido cuando está bien organizada, y que
          la diáspora venezolana tiene un rol activo que cumplir en los momentos difíciles.
        </p>

        <h2 className="font-display font-extrabold text-azul-dark text-[1.4rem] mt-8 mb-2">
          Nuestra misión
        </h2>
        <p>
          Conectar a venezolanos que necesitan ayuda con profesionales, voluntarios y
          organizaciones que deseen brindarla — de forma gratuita, segura y sin burocracia.
        </p>

        <h2 className="font-display font-extrabold text-azul-dark text-[1.4rem] mt-8 mb-2">
          Nuestros valores
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-azul-dark">Gratuidad.</strong> Ninguna funcionalidad tiene costo para quien la necesita.</li>
          <li><strong className="text-azul-dark">Confianza.</strong> Verificamos cada perfil antes de publicarlo.</li>
          <li><strong className="text-azul-dark">Privacidad.</strong> Tu correo y datos sensibles nunca se muestran públicamente.</li>
          <li><strong className="text-azul-dark">Comunidad.</strong> Venezolanos ayudando a venezolanos, sin importar dónde estén.</li>
        </ul>

        <h2 className="font-display font-extrabold text-azul-dark text-[1.4rem] mt-8 mb-2">
          Contacto
        </h2>
        <p>
          ¿Tienes preguntas, sugerencias o quieres sumarte al equipo?{' '}
          <a href="mailto:hola@chamoamiga.org" className="text-azul font-semibold hover:underline">
            hola@chamoamiga.org
          </a>
        </p>
      </div>
    </div>
  )
}
