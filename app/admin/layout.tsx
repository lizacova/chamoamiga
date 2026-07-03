import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, FileText, Star, Tag, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/usuarios', label: 'Usuarios', icon: <Users size={18} /> },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: <FileText size={18} /> },
  { href: '/admin/resenas', label: 'Reseñas', icon: <Star size={18} /> },
  { href: '/admin/categorias', label: 'Categorías', icon: <Tag size={18} /> },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/entrar?redirect=/admin')

  const { data: profile } = await supabase.from('profiles').select('rol').eq('id', user.id).single()
  if (!profile || profile.rol !== 'admin') redirect('/')

  return (
    <div className="flex min-h-[calc(100vh-70px)]">
      {/* Sidebar */}
      <aside className="w-56 flex-none bg-azul-dark text-[#B7C8DF] flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-display font-extrabold text-white text-sm">Panel Admin</p>
          <p className="text-xs text-[#9FB2CB] mt-0.5">Chamo Amiga</p>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-0.5 px-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-sm font-medium hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="flex items-center gap-2 text-xs text-[#9FB2CB] hover:text-white transition-colors w-full">
              <LogOut size={15} aria-hidden /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-gris-2 overflow-auto">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
