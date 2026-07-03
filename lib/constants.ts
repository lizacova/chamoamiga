/** Application-wide constants */

export const APP_NAME = 'Chamo Amiga'
export const APP_TAGLINE = 'Nadie enfrenta esto solo'
export const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://chamoamiga.org'
export const APP_EMAIL = 'hola@chamoamiga.org'

// ─── Taxonomía de profesiones y áreas de ayuda ─────────────────────
export const CATEGORIAS_DEFAULT = [
  { nombre: 'Psicología', icono: '🧠', descripcion: 'Apoyo emocional y salud mental' },
  { nombre: 'Medicina', icono: '🏥', descripcion: 'Atención médica general y telemedicina' },
  { nombre: 'Abogacía', icono: '⚖️', descripcion: 'Asesoría legal y documentación' },
  { nombre: 'Trabajo Social', icono: '🤝', descripcion: 'Apoyo comunitario y familiar' },
  { nombre: 'Ingeniería Civil', icono: '🏗️', descripcion: 'Evaluación de estructuras y viviendas' },
  { nombre: 'Enfermería', icono: '💊', descripcion: 'Cuidados y atención de salud' },
  { nombre: 'Educación', icono: '📚', descripcion: 'Apoyo escolar y pedagógico' },
  { nombre: 'Logística', icono: '🚛', descripcion: 'Transporte y distribución de donaciones' },
  { nombre: 'Donaciones', icono: '🎁', descripcion: 'Artículos, alimentos y recursos materiales' },
  { nombre: 'Voluntariado', icono: '🙌', descripcion: 'Ayuda general sin especialidad requerida' },
  { nombre: 'Migración', icono: '✈️', descripcion: 'Trámites migratorios y asesoría' },
  { nombre: 'Emprendimiento', icono: '💡', descripcion: 'Apoyo a negocios y proyectos' },
  { nombre: 'Tecnología', icono: '💻', descripcion: 'Desarrollo de software y TI' },
  { nombre: 'Nutrición', icono: '🥗', descripcion: 'Orientación nutricional y alimentaria' },
  { nombre: 'Arquitectura', icono: '🏛️', descripcion: 'Diseño y evaluación de espacios' },
]

// ─── Frentes de ayuda (agrupados para la landing) ──────────────────
export const FRENTES = [
  {
    titulo: 'Salud y contención',
    categorias: ['Psicología', 'Medicina', 'Enfermería', 'Nutrición'],
  },
  {
    titulo: 'Apoyo legal y social',
    categorias: ['Abogacía', 'Trabajo Social', 'Migración'],
  },
  {
    titulo: 'Reconstrucción y logística',
    categorias: ['Ingeniería Civil', 'Arquitectura', 'Logística'],
  },
  {
    titulo: 'Educación y tecnología',
    categorias: ['Educación', 'Tecnología', 'Emprendimiento'],
  },
  {
    titulo: 'Donaciones y voluntariado',
    categorias: ['Donaciones', 'Voluntariado'],
  },
]

// ─── Roles ─────────────────────────────────────────────────────────
export const ROLES_LABELS: Record<string, string> = {
  persona: 'Persona que necesita ayuda',
  profesional: 'Profesional',
  voluntario: 'Voluntario/a',
  organizacion: 'Organización',
  admin: 'Administrador',
}

// ─── Pagination defaults ───────────────────────────────────────────
export const PAGE_SIZE = 12

// ─── Storage buckets ──────────────────────────────────────────────
export const STORAGE_BUCKETS = {
  avatars: 'avatars',
  logos: 'logos',
  documents: 'documents',
  solicitudes: 'solicitudes',
  pets: 'pets',
} as const

// ─── Mascotas module constants ─────────────────────────────────────
export const PET_SPECIES_LABELS: Record<string, string> = {
  perro: '🐶 Perro',
  gato: '🐱 Gato',
  otro: '🐾 Otro',
}

export const PET_SIZE_LABELS: Record<string, string> = {
  pequeno: 'Pequeño',
  mediano: 'Mediano',
  grande: 'Grande',
}

export const PET_SEX_LABELS: Record<string, string> = {
  macho: 'Macho',
  hembra: 'Hembra',
  desconocido: 'No sé',
}

export const PET_STATUS_LABELS: Record<string, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  en_adopcion: 'En adopción',
  adoptado: 'Adoptado',
  reunido: 'Reunido con su familia',
  hogar_temporal: 'Busca hogar temporal',
}

export const PET_STATUS_COLORS: Record<string, string> = {
  perdido: 'red',
  encontrado: 'yellow',
  en_adopcion: 'blue',
  adoptado: 'green',
  reunido: 'green',
  hogar_temporal: 'yellow',
}

export const PET_TYPE_LABELS: Record<string, string> = {
  perdido: '🔍 Busco a mi mascota',
  adopcion: '🏡 Dar en adopción',
  hogar_temporal: '❤️ Quiero ser hogar temporal',
}
