import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toast'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chamoamiga.org'),
  title: {
    default: 'Chamo Amiga — Nadie enfrenta esto solo',
    template: '%s | Chamo Amiga',
  },
  description:
    'Chamo Amiga conecta a venezolanos que necesitan ayuda con profesionales, voluntarios y organizaciones que desean ayudar. Apoyo psicológico, legal, médico, logístico y más.',
  keywords: ['venezolanos', 'ayuda', 'profesionales', 'voluntarios', 'terremoto', 'apoyo'],
  openGraph: {
    title: 'Chamo Amiga — Nadie enfrenta esto solo',
    description:
      'La red de apoyo que conecta a personas venezolanas con profesionales y voluntarios listos para ayudar.',
    type: 'website',
    locale: 'es_VE',
    url: 'https://chamoamiga.org',
    siteName: 'Chamo Amiga',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chamo Amiga — Nadie enfrenta esto solo',
    description: 'La red de apoyo que conecta a venezolanos con quienes quieren ayudar.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Load current user profile for the navbar (server-side)
  let profile: Profile | null = null
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      profile = data
    }
  } catch {
    // Supabase not configured yet — safe to ignore during development
  }

  return (
    <html lang="es" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <Navbar profile={profile} />
        <main id="main-content">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
