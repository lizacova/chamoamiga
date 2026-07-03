import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Cómo Chamo Amiga maneja tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16 pb-24">
      <h1 className="text-[clamp(2rem,4vw,2.8rem)] font-display font-extrabold mb-3">
        Política de privacidad
      </h1>
      <p className="text-texto-suave mb-10 text-sm">Última actualización: julio de 2026.</p>

      <div className="space-y-8 text-[0.97rem] leading-relaxed text-texto-suave">
        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">1. Qué información recopilamos</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Nombre, correo electrónico y ciudad (al registrarte o publicar una solicitud).</li>
            <li>Foto de perfil (opcional, solo si la subes).</li>
            <li>Contenido que publiques: solicitudes, reseñas, mensajes.</li>
            <li>Datos técnicos: dirección IP, tipo de navegador, páginas visitadas.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">2. Cómo usamos tu información</h2>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Para conectarte con profesionales o voluntarios relevantes.</li>
            <li>Para enviarte notificaciones sobre tu solicitud (solo si las activaste).</li>
            <li>Para mejorar la plataforma y detectar usos indebidos.</li>
          </ul>
          <p className="mt-3">
            <strong className="text-azul-dark">Nunca vendemos ni compartimos tu información</strong> con terceros con fines comerciales.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">3. Qué se muestra públicamente</h2>
          <p>
            En los perfiles de profesionales: nombre, foto, ciudad, profesión y reseñas. El correo electrónico <strong className="text-azul-dark">nunca</strong> es visible para otros usuarios.
          </p>
          <p className="mt-2">
            En las solicitudes: título, descripción, categoría y ciudad. El nombre puede mostrarse como «Anónimo» si así lo eliges.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">4. Almacenamiento y seguridad</h2>
          <p>
            Toda la información se almacena en Supabase con cifrado en reposo y en tránsito. Aplicamos políticas de seguridad a nivel de fila (RLS) para garantizar que cada usuario solo acceda a sus propios datos.
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">5. Tus derechos</h2>
          <p>Puedes en cualquier momento:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-2">
            <li>Solicitar la eliminación de tu cuenta y datos.</li>
            <li>Editar tu información de perfil.</li>
            <li>Pedir una copia de tus datos.</li>
          </ul>
          <p className="mt-3">
            Para ejercer estos derechos, escríbenos a{' '}
            <a href="mailto:hola@chamoamiga.org" className="text-azul font-semibold hover:underline">
              hola@chamoamiga.org
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display font-extrabold text-azul-dark text-[1.3rem] mb-3">6. Contacto</h2>
          <p>
            Cualquier duda sobre esta política puede enviarse a{' '}
            <a href="mailto:hola@chamoamiga.org" className="text-azul font-semibold hover:underline">
              hola@chamoamiga.org
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
