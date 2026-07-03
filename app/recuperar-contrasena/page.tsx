import type { Metadata } from 'next'
import { ResetForm } from './reset-form'

export const metadata: Metadata = { title: 'Recuperar contraseña' }

export default function RecuperarContrasenaPage() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#EEF3FC] to-fondo flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] font-display font-extrabold mb-2">Recupera tu cuenta</h1>
          <p className="text-texto-suave">
            Te enviaremos un enlace para crear una nueva contraseña.
          </p>
        </div>
        <ResetForm />
      </div>
    </div>
  )
}
