'use client'

import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, LogOut, MessageSquare, Star, Bell } from 'lucide-react'
import type { Profile, Profesional } from '@/types'

interface Props {
  profile: Profile | null
  profesional: Profesional | null
  mensajes: any[]
  solicitudesRespondidas: any[]
}

export function CuentaDashboard({ profile, profesional, mensajes, solicitudesRespondidas }: Props) {
  const router = useRouter()
  const name = profile ? `${profile.nombre} ${profile.apellido}`.trim() : 'Usuario'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    showToast('Sesión cerrada correctamente.')
    router.push('/')
    router.refresh()
  }

  return (
    <>
      {/* Profile hero */}
      <div className="bg-gradient-to-b from-[#EEF3FC] to-fondo border-b border-gris">
        <div className="max-w-content mx-auto px-6 py-10">
          <div className="flex gap-6 items-start flex-wrap">
            <Avatar name={name} fotoUrl={profile?.foto_url} size={88} className="shadow-hover" />
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-[2rem] font-extrabold mb-1">{name}</h1>
              {profesional && <p className="text-texto-suave text-[1.05rem] mb-2">{profesional.profesion}</p>}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={profile?.rol === 'profesional' ? 'blue' : 'yellow'}>
                  {profile?.rol === 'profesional' ? 'Profesional' : profile?.rol === 'voluntario' ? 'Voluntario/a' : profile?.rol ?? 'Usuario'}
                </Badge>
                {profesional?.verificado && (
                  <Badge variant="green">
                    <Check size={12} className="inline mr-1" aria-hidden /> Verificado
                  </Badge>
                )}
                {profile?.ciudad && <Badge variant="gray">{profile.ciudad}</Badge>}
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-texto-suave hover:text-rojo transition-colors"
            >
              <LogOut size={16} aria-hidden /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-6 py-10 pb-20">
        {/* Verification alert */}
        {profesional && !profesional.verificado && (
          <div className="bg-amarillo-soft border border-[#EBD69C] rounded-[var(--radius)] px-5 py-4 text-sm text-[#6B5200] mb-6">
            <strong>Tu perfil está en revisión.</strong> Nuestro equipo lo verificará en máximo 72 horas. Ya es visible para la comunidad.
          </div>
        )}

        {/* Stats band */}
        {profesional && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[18px] mb-10">
            <StatCard label="Personas ayudadas" value={String(profesional.ayudados)} accent />
            <StatCard label="Mensajes recibidos" value={String(mensajes.length)} />
            <StatCard label="Solicitudes respondidas" value={String(solicitudesRespondidas.length)} />
            <StatCard label="Estado" value={profesional.disponible ? 'Disponible' : 'No disponible'} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-9 items-start">
          {/* Main */}
          <div className="space-y-8">
            {/* Messages */}
            <section>
              <h2 className="text-[1.3rem] font-display font-extrabold mb-4 flex items-center gap-2">
                <MessageSquare size={20} className="text-azul" aria-hidden />
                Mensajes recibidos
              </h2>
              {mensajes.length === 0 ? (
                <EmptyState title="Todavía no hay mensajes" desc="Cuando alguien te escriba, aparecerá aquí." />
              ) : (
                <div className="space-y-3">
                  {mensajes.slice(0, 5).map((m: any) => (
                    <div key={m.id} className="bg-white border border-gris rounded-[var(--radius)] p-5">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <strong className="font-display text-[0.95rem] text-azul-dark">{m.nombre_remitente}</strong>
                        <span className="text-xs text-texto-suave">{formatDate(m.created_at)}</span>
                      </div>
                      <p className="text-sm text-texto-suave leading-relaxed">{m.contenido}</p>
                      <a
                        href={`mailto:${m.email_remitente}?subject=Re: Chamo Amiga`}
                        className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-azul hover:underline"
                      >
                        Responder por correo →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Solicitudes respondidas */}
            <section>
              <h2 className="text-[1.3rem] font-display font-extrabold mb-4">
                Solicitudes en las que ayudaste
              </h2>
              {solicitudesRespondidas.length === 0 ? (
                <EmptyState
                  title="Todavía no has respondido solicitudes"
                  desc="Revisa el tablero y ofrece tu ayuda a quien la necesite."
                  cta={{ href: '/solicitudes', label: 'Ver solicitudes' }}
                />
              ) : (
                <div className="space-y-3">
                  {solicitudesRespondidas.map((r: any) => (
                    <div key={r.id} className="bg-white border border-gris rounded-[var(--radius)] p-5 flex justify-between items-start gap-3">
                      <div>
                        <p className="font-display font-bold text-[0.95rem] text-azul-dark">{r.solicitud?.titulo}</p>
                        <p className="text-xs text-texto-suave mt-1">{r.solicitud?.ubicacion} · {formatDate(r.created_at)}</p>
                      </div>
                      <Badge variant={r.solicitud?.estado === 'abierta' ? 'green' : 'gray'}>
                        {r.solicitud?.estado === 'abierta' ? 'Abierta' : 'Atendida'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-7">
              <h3 className="font-display font-extrabold text-[1.05rem] mb-4">Acciones rápidas</h3>
              <div className="flex flex-col gap-3">
                <Link href="/solicitudes">
                  <Button variant="primary" block>Ver solicitudes abiertas</Button>
                </Link>
                <Link href="/necesito">
                  <Button variant="ghost" block>Publicar una solicitud</Button>
                </Link>
                {profile?.rol === 'admin' && (
                  <Link href="/admin">
                    <Button variant="danger" block>Panel de administración</Button>
                  </Link>
                )}
              </div>
            </div>

            {profile && (
              <div className="bg-white border border-gris rounded-[var(--radius-lg)] p-7">
                <h3 className="font-display font-extrabold text-[1.05rem] mb-4">Tu perfil público</h3>
                <p className="text-sm text-texto-suave mb-4">
                  Así te ve la comunidad. Mantenlo actualizado para generar más confianza.
                </p>
                {profesional && (
                  <Link href={`/profesional/${profesional.id}`}>
                    <Button variant="ghost" block size="sm">Ver mi perfil público</Button>
                  </Link>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`border border-gris rounded-[var(--radius)] p-6 text-center ${accent ? 'bg-azul-dark' : 'bg-white'}`}>
      <strong className={`font-display font-extrabold text-[1.8rem] block leading-tight ${accent ? 'text-amarillo' : 'text-azul-dark'}`}>{value}</strong>
      <span className={`text-xs ${accent ? 'text-[#B7C8DF]' : 'text-texto-suave'}`}>{label}</span>
    </div>
  )
}

function EmptyState({ title, desc, cta }: { title: string; desc: string; cta?: { href: string; label: string } }) {
  return (
    <div className="bg-white border-[1.5px] border-dashed border-gris rounded-[var(--radius)] p-8 text-center text-texto-suave">
      <strong className="block font-display text-azul-dark text-[1.05rem] mb-1.5">{title}</strong>
      {desc}
      {cta && (
        <div className="mt-4">
          <Link href={cta.href}>
            <Button size="sm">{cta.label}</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
