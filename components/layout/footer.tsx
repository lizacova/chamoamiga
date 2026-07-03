import Link from 'next/link'

const LINKS_PLATAFORMA = [
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/buscar', label: 'Buscar ayuda' },
  { href: '/necesito', label: 'Publicar una solicitud' },
  { href: '/sumarme', label: 'Quiero ayudar' },
]

const LINKS_COMUNIDAD = [
  { href: '/solicitudes', label: 'Solicitudes abiertas' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/faq', label: 'Preguntas frecuentes' },
  { href: '/privacidad', label: 'Política de privacidad' },
]

const LINKS_CONTACTO = [
  { href: 'mailto:hola@chamoamiga.org', label: 'hola@chamoamiga.org' },
  { href: 'https://instagram.com/chamoamiga', label: 'Instagram', external: true },
  { href: 'https://wa.me/message/chamoamiga', label: 'WhatsApp', external: true },
]

export function Footer() {
  return (
    <footer className="bg-azul-dark text-[#B7C8DF] pt-16 pb-8 mt-14">
      <div className="max-w-content mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display font-extrabold text-lg text-white tracking-[-0.02em] mb-3.5 focus-visible:outline-amarillo"
              aria-label="Chamo Amiga — Inicio"
            >
              <span className="w-9 h-9 bg-white rounded-[9px] p-[3px] flex-none flex items-center justify-center" aria-hidden>
                <span className="w-full h-full bg-azul rounded-[6px] flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
              </span>
              Chamo Amiga
            </Link>
            <p className="text-sm max-w-[20rem] leading-relaxed">
              La red de apoyo que conecta a venezolanos que necesitan ayuda con profesionales y voluntarios que quieren tenderles la mano.
            </p>
            <p className="text-xs text-[#9FB2CB] mt-4">Una iniciativa sin fines de lucro.</p>
          </div>

          {/* Plataforma */}
          <div>
            <h4 className="text-white text-[0.95rem] font-display font-bold mb-3.5">Plataforma</h4>
            <ul className="flex flex-col gap-2.5">
              {LINKS_PLATAFORMA.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-amarillo transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Comunidad */}
          <div>
            <h4 className="text-white text-[0.95rem] font-display font-bold mb-3.5">Comunidad</h4>
            <ul className="flex flex-col gap-2.5">
              {LINKS_COMUNIDAD.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:text-amarillo transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white text-[0.95rem] font-display font-bold mb-3.5">Contacto</h4>
            <ul className="flex flex-col gap-2.5">
              {LINKS_CONTACTO.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm hover:text-amarillo transition-colors"
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-wrap justify-between items-center gap-4 text-[0.82rem] text-[#8AA0BC]">
          <span>© {new Date().getFullYear()} Chamo Amiga.</span>
          <span>
            Hecho con{' '}
            <span className="text-rojo" aria-label="amor">
              ♥
            </span>{' '}
            por y para venezolanos.
          </span>
        </div>
      </div>
    </footer>
  )
}
