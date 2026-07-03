import type { Metadata } from 'next'
import { getDashboardStats } from '@/services/admin'
import { Users, FileText, CheckCircle, Building2, MapPin, Tag, UserCheck, Handshake } from 'lucide-react'

export const metadata: Metadata = { title: 'Admin — Dashboard' }

export const revalidate = 60

export default async function AdminPage() {
  const { data: stats, error } = await getDashboardStats()

  if (error) {
    return (
      <div className="bg-rojo-soft border border-rojo rounded-[var(--radius)] p-6 text-rojo">
        Error al cargar estadísticas: {error}
      </div>
    )
  }

  const cards = [
    { label: 'Usuarios registrados', value: stats?.total_usuarios ?? 0, icon: <Users size={22} />, color: 'text-azul bg-azul-soft' },
    { label: 'Profesionales', value: stats?.total_profesionales ?? 0, icon: <UserCheck size={22} />, color: 'text-verde bg-verde-bg' },
    { label: 'Voluntarios', value: stats?.total_voluntarios ?? 0, icon: <Handshake size={22} />, color: 'text-[#8A6300] bg-amarillo-soft' },
    { label: 'Organizaciones', value: stats?.total_organizaciones ?? 0, icon: <Building2 size={22} />, color: 'text-azul bg-azul-soft' },
    { label: 'Solicitudes abiertas', value: stats?.solicitudes_abiertas ?? 0, icon: <FileText size={22} />, color: 'text-rojo bg-rojo-soft' },
    { label: 'Solicitudes resueltas', value: stats?.solicitudes_resueltas ?? 0, icon: <CheckCircle size={22} />, color: 'text-verde bg-verde-bg' },
    { label: 'Ciudades activas', value: stats?.total_ciudades ?? 0, icon: <MapPin size={22} />, color: 'text-azul bg-azul-soft' },
    { label: 'Categorías activas', value: stats?.total_categorias ?? 0, icon: <Tag size={22} />, color: 'text-[#8A6300] bg-amarillo-soft' },
  ]

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[1.8rem] font-display font-extrabold text-azul-dark">Dashboard</h1>
        <p className="text-texto-suave text-sm mt-1">Vista general de la plataforma en tiempo real.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div key={c.label} className="bg-white border border-gris rounded-[var(--radius)] p-6">
            <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${c.color}`}>
              {c.icon}
            </div>
            <strong className="font-display font-extrabold text-[2rem] text-azul-dark block leading-tight">
              {c.value.toLocaleString('es-VE')}
            </strong>
            <span className="text-xs text-texto-suave">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-gris rounded-[var(--radius-lg)] p-6">
        <h2 className="font-display font-extrabold text-[1.1rem] mb-2">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/usuarios', label: 'Gestionar usuarios' },
            { href: '/admin/solicitudes', label: 'Moderar solicitudes' },
            { href: '/admin/resenas', label: 'Revisar reseñas' },
            { href: '/admin/categorias', label: 'Editar categorías' },
          ].map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="bg-azul text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-azul-hover transition-colors"
            >
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
