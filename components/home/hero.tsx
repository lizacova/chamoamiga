'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-b from-[#EEF3FC] to-fondo"
      aria-label="Inicio"
    >
      <div className="max-w-content mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-[72px] pb-20 md:pb-[84px]">
        {/* Copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-white border border-gris rounded-full px-4 py-[7px] text-[0.825rem] font-semibold text-[#8A6300] shadow-card mb-[22px]">
            <span className="w-2 h-2 rounded-full bg-amarillo animate-[pulse-dot_2.2s_ease-in-out_infinite]" aria-hidden />
            Red de apoyo para venezolanos
          </div>

          <h1 className="font-display font-extrabold text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.15] mb-[18px]">
            Cuando más lo necesitas,{' '}
            <em className="not-italic text-azul relative whitespace-nowrap">
              nadie queda solo
              <span className="absolute left-0 right-0 bottom-1 h-3 bg-amarillo opacity-50 z-[-1] rounded-[4px]" aria-hidden />
            </em>
          </h1>

          <p className="text-[1.1rem] text-texto-suave max-w-[35rem] mb-[30px] leading-relaxed">
            Chamo Amiga conecta a venezolanos que necesitan ayuda con profesionales y voluntarios listos para tender la mano: apoyo psicológico, médico, legal, evaluación de viviendas, donaciones y más.
          </p>

          <div className="flex gap-3.5 flex-wrap mb-8">
            <Link href="/necesito">
              <Button size="lg">Necesito ayuda</Button>
            </Link>
            <Link href="/sumarme">
              <Button variant="secondary" size="lg">Quiero ayudar</Button>
            </Link>
          </div>

          {/* Trust indicators — populated from Supabase in production */}
          <div className="flex gap-8 flex-wrap" aria-label="Comunidad">
            <TrustStat value="Gratuito" label="Siempre, para todos" />
            <TrustStat value="Verificado" label="Profesionales comprobados" />
            <TrustStat value="Privado" label="Tus datos protegidos" />
          </div>
        </div>

        {/* Visual */}
        <div className="reveal relative max-w-[560px] w-full mx-auto">
          {/* Floating badge top */}
          <div
            className="absolute -top-4 right-5 z-10 bg-white rounded-[14px] shadow-hover px-4 py-3 flex items-center gap-2.5 text-[0.85rem] font-semibold text-azul-dark animate-[float_5s_ease-in-out_infinite] max-w-[min(74vw,260px)]"
            aria-hidden
          >
            <span className="w-9 h-9 rounded-full bg-azul flex items-center justify-center text-white text-xs font-extrabold flex-none">MG</span>
            <div>
              <span>María recibió apoyo legal</span>
              <span className="block font-normal text-texto-suave text-[0.78rem]">hace 12 minutos · Valencia</span>
            </div>
          </div>

          {/* Map graphic */}
          <div className="bg-azul-dark rounded-[var(--radius-lg)] shadow-[0_24px_60px_rgba(18,41,75,0.28)] p-3">
            <NetworkMap />
          </div>

          {/* Floating badge bottom */}
          <div
            className="absolute -bottom-4 -left-3 z-10 bg-white rounded-[14px] shadow-hover px-4 py-3 hidden sm:flex items-center gap-2.5 text-[0.85rem] font-semibold text-azul-dark animate-[float_5s_ease-in-out_1.4s_infinite] max-w-[260px]"
            aria-hidden
          >
            <span className="w-9 h-9 rounded-full bg-rojo flex items-center justify-center text-white text-xs font-extrabold flex-none">JR</span>
            <div>
              <span>José se sumó como voluntario</span>
              <span className="block font-normal text-texto-suave text-[0.78rem]">hace 1 hora · Barquisimeto</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-sm text-texto-suave">
      <strong className="block font-display font-extrabold text-[1.4rem] text-azul-dark leading-tight">{value}</strong>
      {label}
    </div>
  )
}

function NetworkMap() {
  return (
    <svg
      viewBox="0 0 520 380"
      fill="none"
      className="w-full h-auto rounded-[16px]"
      role="img"
      aria-label="Red de Chamo Amiga conectando venezolanos dentro y fuera del país"
    >
      <rect width="520" height="380" rx="16" fill="#12294B" />
      {/* Grid */}
      <g stroke="#22406A" strokeWidth="1">
        <path d="M0 95h520M0 190h520M0 285h520" />
        <path d="M130 0v380M260 0v380M390 0v380" />
      </g>
      {/* Connection arcs */}
      <g strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path
          d="M420 90 Q 300 40 240 190"
          stroke="#E9B44C"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'draw-arc 2.4s ease forwards' }}
        />
        <path
          d="M460 190 Q 340 150 240 190"
          stroke="#D64B45"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'draw-arc 2.4s ease 0.35s forwards' }}
        />
        <path
          d="M400 300 Q 320 300 240 190"
          stroke="#5B86D6"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'draw-arc 2.4s ease 0.7s forwards' }}
        />
        <path
          d="M120 320 Q 170 270 240 190"
          stroke="#D64B45"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'draw-arc 2.4s ease 1.05s forwards' }}
        />
        <path
          d="M70 70 Q 130 110 240 190"
          stroke="#5B86D6"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'draw-arc 2.4s ease 1.4s forwards' }}
        />
      </g>
      {/* Center — Venezuela */}
      <circle cx="240" cy="190" r="18" fill="#E9B44C" fillOpacity=".18" />
      <circle cx="240" cy="190" r="8" fill="#E9B44C" />
      {/* City dots */}
      <circle cx="420" cy="90" r="5" fill="#E9B44C" style={{ animation: 'pulse-dot 2.8s ease-in-out infinite' }} />
      <circle cx="460" cy="190" r="5" fill="#D64B45" style={{ animation: 'pulse-dot 2.8s ease-in-out 0.4s infinite' }} />
      <circle cx="400" cy="300" r="5" fill="#5B86D6" style={{ animation: 'pulse-dot 2.8s ease-in-out 0.8s infinite' }} />
      <circle cx="120" cy="320" r="5" fill="#D64B45" style={{ animation: 'pulse-dot 2.8s ease-in-out 1.2s infinite' }} />
      <circle cx="70" cy="70" r="5" fill="#5B86D6" style={{ animation: 'pulse-dot 2.8s ease-in-out 1.6s infinite' }} />
      {/* Labels */}
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#B7C8DF">
        <text x="258" y="194" fontWeight="700" fill="#E9B44C">Venezuela</text>
        <text x="432" y="86">Madrid</text>
        <text x="410" y="316">Buenos Aires</text>
        <text x="132" y="316">Santiago</text>
        <text x="82" y="66">Miami</text>
        <text x="435" y="212">Bogotá</text>
      </g>
    </svg>
  )
}
