/**
 * Types generated from the Supabase schema.
 * Run `supabase gen types typescript` to regenerate after schema changes.
 */

export type UserRole = 'persona' | 'profesional' | 'voluntario' | 'organizacion' | 'admin'

export type RequestStatus = 'abierta' | 'en_proceso' | 'resuelta' | 'cerrada'

export type ModalidadAtencion = 'en_linea' | 'presencial' | 'ambas'

export interface Profile {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string | null
  foto_url: string | null
  pais: string | null
  ciudad: string | null
  descripcion: string | null
  rol: UserRole
  activo: boolean
  verificado: boolean
  created_at: string
  updated_at: string
}

export interface Profesional {
  id: string
  usuario_id: string
  profesion: string
  experiencia: string | null
  biografia: string
  modalidad: ModalidadAtencion
  disponible: boolean
  verificado: boolean
  ayudados: number
  rating_promedio: number | null
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
  categorias?: Categoria[]
  reviews?: Review[]
}

export interface Organizacion {
  id: string
  usuario_id: string
  nombre: string
  descripcion: string
  logo_url: string | null
  ubicacion: string | null
  sitio_web: string | null
  verificada: boolean
  created_at: string
  updated_at: string
  // joined
  profile?: Profile
}

export interface Categoria {
  id: string
  nombre: string
  icono: string | null
  descripcion: string | null
  activa: boolean
  created_at: string
}

export interface Solicitud {
  id: string
  titulo: string
  descripcion: string
  categoria_id: string
  ubicacion: string | null
  modalidad: ModalidadAtencion
  estado: RequestStatus
  creador_id: string
  codigo_seguimiento: string
  created_at: string
  updated_at: string
  // joined
  categoria?: Categoria
  creador?: Profile
  respuestas?: RespuestaSolicitud[]
}

export interface RespuestaSolicitud {
  id: string
  solicitud_id: string
  profesional_id: string
  mensaje: string
  created_at: string
  // joined
  profesional?: Profesional
}

export interface Review {
  id: string
  evaluador_id: string
  evaluado_id: string
  solicitud_id: string | null
  estrellas: number
  comentario: string
  created_at: string
  // joined
  evaluador?: Profile
}

export interface Mensaje {
  id: string
  de_usuario_id: string
  para_usuario_id: string
  asunto: string | null
  contenido: string
  leido: boolean
  created_at: string
  // joined
  de?: Profile
  para?: Profile
}

export interface Favorito {
  id: string
  usuario_id: string
  profesional_id: string
  created_at: string
  // joined
  profesional?: Profesional
}

// ================================================================
// MASCOTAS MODULE
// ================================================================

export type PetSpecies = 'perro' | 'gato' | 'otro'
export type PetSex = 'macho' | 'hembra' | 'desconocido'
export type PetSize = 'pequeno' | 'mediano' | 'grande'
export type PetStatus =
  | 'perdido'
  | 'encontrado'
  | 'en_adopcion'
  | 'adoptado'
  | 'reunido'
  | 'hogar_temporal'

/** Publication type: lost pet, adoption, or temp foster offer */
export type PetPublicationType = 'perdido' | 'adopcion' | 'hogar_temporal'

export interface Pet {
  id: string
  tipo_publicacion: PetPublicationType
  estado: PetStatus
  nombre: string | null
  especie: PetSpecies
  raza: string | null
  sexo: PetSex
  tamano: PetSize
  color: string | null
  edad_aprox: string | null
  descripcion: string
  personalidad: string | null
  // Lost-specific
  ultima_ubicacion: string | null
  fecha_perdido: string | null
  // Adoption-specific
  vacunado: boolean | null
  esterilizado: boolean | null
  requisitos_adopcion: string | null
  // Temp foster–specific
  disponible_desde: string | null
  duracion_estimada: string | null
  // Contact & location
  ciudad: string
  direccion_aprox: string | null
  latitud: number | null
  longitud: number | null
  telefono_contacto: string | null
  email_contacto: string | null
  // Moderation
  aprobado: boolean
  destacado: boolean
  visible: boolean
  // Ownership
  creador_id: string | null
  organizacion_nombre: string | null
  created_at: string
  updated_at: string
  // joined
  fotos?: PetPhoto[]
  creador?: Profile
}

export interface PetPhoto {
  id: string
  pet_id: string
  url: string
  es_principal: boolean
  orden: number
  created_at: string
}

// ─── Stats for admin dashboard ─────────────────────────────────────
export interface DashboardStats {
  total_usuarios: number
  total_profesionales: number
  total_voluntarios: number
  total_organizaciones: number
  solicitudes_abiertas: number
  solicitudes_resueltas: number
  total_ciudades: number
  total_categorias: number
}
