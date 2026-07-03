export * from './database'

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Form state types
export interface RegisterProfesionalForm {
  tipo: 'profesional' | 'voluntario'
  nombre: string
  apellido: string
  email: string
  password: string
  confirmPassword: string
  foto?: File
  profesion: string
  rol_descripcion?: string
  modalidad: string[]
  ciudad: string
  biografia: string
  desplaza?: boolean
}

export interface PublicarSolicitudForm {
  titulo: string
  categoria_id: string
  ubicacion: string
  modalidad: 'en_linea' | 'presencial' | 'ambas'
  descripcion: string
  nombre_contacto: string
  email_contacto: string
}

export interface ContactarProfesionalForm {
  nombre: string
  email: string
  mensaje: string
}

export interface ReviewForm {
  estrellas: number
  comentario: string
}
