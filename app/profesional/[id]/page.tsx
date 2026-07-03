import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { StarsDisplay } from '@/components/ui/stars'
import { ContactForm } from './contact-form'
import { ReviewSection } from './review-section'
import { getProfesionalById } from '@/services/profiles'
import { avgRating } from '@/lib/utils'
import { Check, MapPin, Monitor, Users } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data: p } = await getProfesionalById(id)
  if (!p) return { title: 'Perfil no encontrado' }
  const name = `${p.profile?.nombre ?? ''} ${p.profile?.apellido ?? ''}`.trim()
  return {
    title: name,
    description: p.biografia?.slice(0, 155),
  }
}

export const revalidate = 60

export default async function ProfesionalPage({ params }: Props) {
  const { id } = await params
  const { data: p } = await getProfesionalById(id)

  if (!p) notFound()

  const name = `${p.profile?.nombre ?? ''} ${p.profile?.apellido ?? ''}`.trim()
  const r = p.reviews ? avgRating(p.reviews) : null
  const numReviews = p.reviews?.length ?? 0
  const categorias = p.categorias?.map((c) => (c as any).categoria?.nombre).filter(Boolean) ?? []
  const modalidadLabel =
    p.modalidad === 'en_linea' ? 'En línea' : p.modalidad === 'presencial' ? 'Presencial' : 'En línea y presencial'

  return (
    <>
      {/* Profile hero */}
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo border-b border-gris">
        <div className="max-w-content mx-auto px-6 pt-6 pb-10">
          <p className="text-sm text-texto-suave mb-5">
            <Link href="/buscar" className="text-azul font-semibold hover:underline">← Volver a buscar ayuda</Link>
          </p>
          <div className="flex gap-7 items-start flex-wrap">
            <Avatar name={name} fotoUrl={p.profile?.foto_url} size={110} className="shadow-hover" />
            <div className="flex-1 min-w-[200px]">
              {p.verificado && (
                <span className="inline-flex items-center gap-1.5 text-verde font-bold text-sm mb-2">
                  <Check size={17} aria-hidden /> Perfil verificado
                </span>
              )}
              <h1 className="text-[2rem] font-extrabold mb-1">{name}</h1>
              <p className="text-texto-suave text-[1.05rem] mb-3">{p.profesion}</p>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => <Badge key={cat} variant="blue">{cat}</Badge>)}
                <Badge variant="gray">
                  <Monitor size={12} className="inline mr-1" aria-hidden />{modalidadLabel}
                </Badge>
                {p.profile?.ciudad && (
                  <Badge variant="gray">
                    <MapPin size={12} className="inline mr-1" aria-hidden />{p.profile.ciudad}
                  </Badge>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <ContactForm profesionalId={p.id} profesionalNombre={name} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] my-8">
          <StatCard value={String(p.ayudados)} label="personas ayudadas" accent />
          <StatCard value={r ? `${r} ★` : '—'} label={`${numReviews} reseña${numReviews !== 1 ? 's' : ''}`} />
          <StatCard value={modalidadLabel} label="modalidad" />
          <StatCard value={p.profile?.ciudad ?? '—'} label="ubicación" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-9 items-start">
          {/* Main content */}
          <div>
            {p.biografia && (
              <section className="mb-10">
                <h2 className="text-[1.3rem] font-display font-extrabold mb-4">
                  Sobre {name.split(' ')[0]}
                </h2>
                <p className="text-texto-suave leading-relaxed whitespace-pre-line">{p.biografia}</p>
              </section>
            )}

            <ReviewSection
              profesionalId={p.id}
              reviews={p.reviews ?? []}
              profesionalNombre={name.split(' ')[0]}
            />
          </div>

          {/* Sidebar */}
          <aside className="bg-white border border-gris rounded-[var(--radius-lg)] p-7 sticky top-[90px]">
            <h3 className="font-display font-extrabold text-[1.05rem] mb-3.5">¿Cómo funciona el contacto?</h3>
            <ul className="space-y-3 text-[0.9rem] text-texto-suave">
              {[
                'Le escribes contando brevemente tu situación.',
                'Te responde en un máximo de 48 horas.',
                'Acuerdan juntos día, hora y modalidad.',
                'Al terminar, dejas tu reseña para la comunidad.',
              ].map((step) => (
                <li key={step} className="flex gap-2.5 items-start">
                  <Check size={18} className="flex-none text-azul mt-0.5" aria-hidden />
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <ContactForm profesionalId={p.id} profesionalNombre={name} block />
            </div>
          </aside>
        </div>

        {/* Mobile contact (shown at bottom on mobile) */}
        <div className="md:hidden mt-6">
          <ContactForm profesionalId={p.id} profesionalNombre={name} block />
        </div>
      </div>
    </>
  )
}

function StatCard({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className={`border border-gris rounded-[var(--radius)] p-6 text-center ${accent ? 'bg-azul-dark' : 'bg-white'}`}>
      <strong className={`font-display font-extrabold text-[2rem] block leading-tight ${accent ? 'text-amarillo' : 'text-azul-dark'}`}>
        {value}
      </strong>
      <span className={`text-[0.83rem] ${accent ? 'text-[#B7C8DF]' : 'text-texto-suave'}`}>{label}</span>
    </div>
  )
}
