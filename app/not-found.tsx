import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-20 bg-gradient-to-b from-[#EEF3FC] to-fondo">
      <div className="text-center max-w-[480px]">
        <p className="font-display font-extrabold text-[5rem] text-azul leading-none mb-4">404</p>
        <h1 className="text-[1.8rem] font-display font-extrabold mb-3">Página no encontrada</h1>
        <p className="text-texto-suave mb-8">
          Esta página no existe o fue movida. Pero la ayuda sigue disponible.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
          <Link href="/buscar">
            <Button variant="ghost">Buscar ayuda</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
