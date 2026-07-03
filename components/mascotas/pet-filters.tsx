'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { PET_SPECIES_LABELS, PET_SIZE_LABELS, PET_SEX_LABELS, PET_STATUS_LABELS } from '@/lib/constants'

export function PetFilters() {
  const router = useRouter()
  const sp = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(sp.toString())
    value ? params.set(key, value) : params.delete(key)
    params.delete('pagina')
    router.push(`/mascotas?${params.toString()}`)
  }

  const selectClass =
    "bg-white border border-gris rounded-[12px] px-4 py-2.5 text-sm font-medium text-texto appearance-none pr-10 bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2355606E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center] focus:outline-none focus:border-azul min-w-[150px]"

  return (
    <div className="flex gap-3 flex-wrap items-center">
      {/* Especie */}
      <select
        className={selectClass}
        defaultValue={sp.get('especie') ?? ''}
        onChange={(e) => update('especie', e.target.value)}
        aria-label="Filtrar por especie"
      >
        <option value="">Todas las especies</option>
        {Object.entries(PET_SPECIES_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {/* Estado */}
      <select
        className={selectClass}
        defaultValue={sp.get('estado') ?? ''}
        onChange={(e) => update('estado', e.target.value)}
        aria-label="Filtrar por estado"
      >
        <option value="">Todos los estados</option>
        {Object.entries(PET_STATUS_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {/* Tamaño */}
      <select
        className={selectClass}
        defaultValue={sp.get('tamano') ?? ''}
        onChange={(e) => update('tamano', e.target.value)}
        aria-label="Filtrar por tamaño"
      >
        <option value="">Cualquier tamaño</option>
        {Object.entries(PET_SIZE_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {/* Sexo */}
      <select
        className={selectClass}
        defaultValue={sp.get('sexo') ?? ''}
        onChange={(e) => update('sexo', e.target.value)}
        aria-label="Filtrar por sexo"
      >
        <option value="">Cualquier sexo</option>
        {Object.entries(PET_SEX_LABELS).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {/* Ciudad */}
      <input
        type="text"
        placeholder="🏙️ Ciudad..."
        defaultValue={sp.get('ciudad') ?? ''}
        className="bg-white border border-gris rounded-[12px] px-4 py-2.5 text-sm text-texto focus:outline-none focus:border-azul min-w-[140px]"
        onBlur={(e) => update('ciudad', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && update('ciudad', (e.target as HTMLInputElement).value)}
        aria-label="Filtrar por ciudad"
      />

      {/* Clear */}
      {sp.toString() && (
        <button
          onClick={() => router.push('/mascotas')}
          className="text-sm text-texto-suave hover:text-rojo transition-colors font-medium"
        >
          Limpiar filtros ✕
        </button>
      )}
    </div>
  )
}
