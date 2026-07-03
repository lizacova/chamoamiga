import type { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { TrustSection } from '@/components/home/trust-section'
import { OriginSection } from '@/components/home/origin-section'
import { AreasSection } from '@/components/home/areas-section'
import { CTASection } from '@/components/home/cta-section'
import { ProfileCard } from '@/components/profesionales/profile-card'
import { getCategorias } from '@/services/categorias'
import { getProfesionales } from '@/services/profiles'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Chamo Amiga — Nadie enfrenta esto solo',
}

// Revalidate every 5 minutes
export const revalidate = 300

export default async function HomePage() {
  // Fetch categorias and featured profesionales in parallel
  const [{ data: categorias }, { data: profesionales }] = await Promise.all([
    getCategorias(),
    getProfesionales({ page: 1 }),
  ])

  // Category counts
  let counts: Record<string, number> = {}
  try {
    const supabase = await createClient()
    const { data: countData } = await supabase
      .from('profesional_categorias')
      .select('categoria_id')

    if (countData) {
      countData.forEach((row) => {
        counts[row.categoria_id] = (counts[row.categoria_id] ?? 0) + 1
      })
    }
  } catch {
    // Supabase not configured — safe to skip
  }

  const featuredPros = profesionales?.slice(0, 3) ?? []

  return (
    <>
      <Hero />
      <HowItWorks />
      <TrustSection />
      <OriginSection />

      {/* Areas */}
      <AreasSection categorias={categorias ?? []} counts={counts} />

      {/* Featured profesionales */}
      {featuredPros.length > 0 && (
        <section className="py-[88px]">
          <div className="max-w-content mx-auto px-6">
            <div className="max-w-[640px] mx-auto text-center mb-[52px]">
              <span className="inline-block font-display font-bold text-[0.8rem] tracking-[0.08em] uppercase text-[#8A6300] mb-3">
                Quiénes ayudan
              </span>
              <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)] font-extrabold mb-3">
                Profesionales y voluntarios listos para ti
              </h2>
              <p className="text-texto-suave text-[1.05rem]">
                Cada perfil ha sido verificado por nuestro equipo.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[26px] max-w-[520px] sm:max-w-none mx-auto">
              {featuredPros.map((p) => (
                <ProfileCard key={p.id} profesional={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  )
}
