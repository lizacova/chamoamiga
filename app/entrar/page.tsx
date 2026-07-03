import type { Metadata } from 'next'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
}

export default function EntrarPage() {
  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-b from-[#EEF3FC] to-fondo flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <h1 className="text-[2rem] font-display font-extrabold mb-2">Bienvenido de nuevo</h1>
          <p className="text-texto-suave">
            ¿No tienes cuenta?{' '}
            <a href="/sumarme" className="text-azul font-semibold hover:underline">
              Créala aquí
            </a>
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-texto-suave mt-5">
          <a href="/recuperar-contrasena" className="text-azul font-semibold hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p>
      </div>
    </div>
  )
}
