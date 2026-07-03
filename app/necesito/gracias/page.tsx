'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function GraciasPage() {
  const [codigo, setCodigo] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('ca_last_solicitud')
      if (stored) {
        const parsed = JSON.parse(stored)
        setCodigo(parsed.codigo)
        setEmail(parsed.email)
        sessionStorage.removeItem('ca_last_solicitud')
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#EEF3FC] to-fondo flex items-center justify-center px-6 py-20">
      <div className="max-w-[560px] w-full text-center">
        <div className="w-20 h-20 rounded-full bg-verde-bg text-verde flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={38} aria-hidden />
        </div>

        <h1 className="text-[1.9rem] font-display font-extrabold mb-3">
          Tu solicitud ya está publicada
        </h1>

        {codigo ? (
          <>
            <div className="bg-white border-[1.5px] border-dashed border-azul rounded-[var(--radius)] px-6 py-5 mx-auto mb-5 max-w-[420px]">
              <p className="text-sm text-texto-suave mb-1">Tu código de seguimiento</p>
              <p className="font-display font-extrabold text-[2rem] tracking-[0.06em] text-azul-dark">
                {codigo}
              </p>
            </div>
            <p className="text-texto-suave mb-8 max-w-[420px] mx-auto text-sm leading-relaxed">
              <strong className="text-azul-dark">Guarda este código</strong> (anótalo o tómale captura).
              Con él y tu correo{email ? ` (${email})` : ''} podrás entrar a{' '}
              <Link href="/seguimiento" className="text-azul font-semibold hover:underline">
                Seguir mi solicitud
              </Link>{' '}
              y ver quiénes se ofrecen a ayudarte, sin crear ninguna cuenta.
            </p>
          </>
        ) : (
          <p className="text-texto-suave mb-8 max-w-[420px] mx-auto">
            Los profesionales y voluntarios de esa área ya pueden verla. Con tu código y tu correo
            puedes revisar las respuestas en{' '}
            <Link href="/seguimiento" className="text-azul font-semibold hover:underline">
              Seguir mi solicitud
            </Link>
            .
          </p>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/seguimiento">
            <Button>Seguir mi solicitud</Button>
          </Link>
          <Link href="/solicitudes">
            <Button variant="ghost">Ver el tablero</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
