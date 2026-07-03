'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types'

const NAV_LINKS = [
  { href: '/#como-funciona', label: 'Cómo funciona' },
  { href: '/buscar', label: 'Buscar ayuda' },
  { href: '/solicitudes', label: 'Solicitudes' },
  { href: '/mascotas', label: '🐾 Mascotas' },
  { href: '/sumarme', label: 'Quiero ayudar' },
]

interface NavbarProps {
  profile?: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-fondo/90 backdrop-blur-[12px] border-b border-gris">
      <div className="max-w-content mx-auto px-6 flex items-center justify-between h-[70px] gap-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-extrabold text-[1.18rem] text-azul-dark tracking-[-0.02em] flex-none focus-visible:outline-azul focus-visible:outline-2 rounded-md"
          aria-label="Chamo Amiga — Inicio"
        >
          <LogoMark />
          Chamo Amiga
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden md:flex">
          <ul className="flex gap-[22px] items-center list-none">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    'text-[0.925rem] font-medium text-texto-suave hover:text-azul transition-colors',
                    pathname === l.href && 'text-azul'
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA */}
        <div className="flex gap-2.5 items-center">
          {profile ? (
            <>
              <Link href="/necesito" className="hidden md:inline-flex">
                <Button size="sm">Necesito ayuda</Button>
              </Link>
              <Link
                href="/cuenta"
                className="flex items-center gap-2.5 bg-white border border-gris rounded-full py-[5px] pl-[5px] pr-3.5 font-semibold text-[0.85rem] text-azul-dark hover:shadow-card transition-shadow"
                aria-label="Mi cuenta"
              >
                <Avatar
                  name={`${profile.nombre} ${profile.apellido}`}
                  fotoUrl={profile.foto_url}
                  size={32}
                />
                {profile.nombre}
              </Link>
            </>
          ) : (
            <>
              <Link href="/entrar" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/sumarme" className="hidden md:inline-flex">
                <Button variant="ghost" size="sm">Quiero ayudar</Button>
              </Link>
              <Link href="/necesito">
                <Button size="sm">Necesito ayuda</Button>
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-[10px] text-azul-dark"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden flex flex-col px-6 pb-[18px] pt-2 bg-fondo border-b border-gris"
          aria-label="Menú móvil"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-3.5 px-1 font-semibold text-azul-dark border-b border-gris last:border-none"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          {profile ? (
            <Link href="/cuenta" className="py-3.5 px-1 font-semibold text-azul-dark" onClick={() => setOpen(false)}>
              Mi cuenta
            </Link>
          ) : (
            <>
              <Link href="/entrar" className="py-3.5 px-1 font-semibold text-azul-dark border-b border-gris" onClick={() => setOpen(false)}>
                Entrar
              </Link>
              <Link href="/mascotas" className="py-3.5 px-1 font-semibold text-azul-dark border-b border-gris" onClick={() => setOpen(false)}>
                🐾 Mascotas
              </Link>
              <Link href="/necesito" className="py-3.5 px-1 font-semibold text-azul" onClick={() => setOpen(false)}>
                Necesito ayuda
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

function LogoMark() {
  return (
    <span
      className="w-9 h-9 flex-none rounded-[9px] bg-azul flex items-center justify-center"
      aria-hidden="true"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </span>
  )
}
