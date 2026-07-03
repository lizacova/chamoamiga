import type { Metadata } from 'next'
import { SeguimientoForm } from './seguimiento-form'

export const metadata: Metadata = {
  title: 'Seguir mi solicitud',
  description: 'Consulta el estado de tu solicitud y ve quiénes se ofrecieron a ayudarte.',
}

export default function SeguimientoPage() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#EEF3FC] to-fondo px-6 py-16">
      <div className="max-w-[540px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] font-display font-extrabold mb-2">Seguir mi solicitud</h1>
          <p className="text-texto-suave">
            Ingresa el código que recibiste y tu correo para ver las respuestas.
          </p>
        </div>
        <SeguimientoForm />
      </div>
    </div>
  )
}
