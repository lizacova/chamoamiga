# Chamo Amiga

> **Nadie enfrenta esto solo.** La red de apoyo que conecta a venezolanos que necesitan ayuda con profesionales, voluntarios y organizaciones que desean ayudar.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | Supabase + PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Deploy | Netlify |

---

## Estructura del proyecto

```
chamo-amiga/
├── app/                    # App Router — páginas y layouts
│   ├── layout.tsx          # Layout raíz (Navbar, Footer, Toaster)
│   ├── page.tsx            # Landing page
│   ├── buscar/             # Búsqueda de profesionales
│   ├── profesional/[id]/   # Perfil detallado
│   ├── solicitudes/        # Tablero de solicitudes
│   ├── necesito/           # Formulario + página de gracias
│   ├── seguimiento/        # Seguimiento por código
│   ├── sumarme/            # Registro de profesionales/voluntarios
│   ├── entrar/             # Login
│   ├── recuperar-contrasena/
│   ├── cuenta/             # Dashboard del usuario
│   ├── admin/              # Panel administrativo (rol: admin)
│   ├── quienes-somos/
│   ├── faq/
│   ├── privacidad/
│   ├── api/admin/          # API Routes para acciones de admin
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                 # Button, Input, Textarea, Select, Avatar, Badge, Modal, Toast, Stars
│   ├── layout/             # Navbar, Footer
│   ├── home/               # Hero, HowItWorks, Trust, Origin, Areas, CTA
│   ├── profesionales/      # ProfileCard
│   └── solicitudes/        # RequestCard
├── lib/
│   ├── supabase/           # client.ts, server.ts, admin.ts, middleware.ts
│   ├── utils.ts            # cn, initials, avgRating, formatDate, etc.
│   └── constants.ts        # Categorías, frentes, roles
├── services/               # Lógica de acceso a datos (Server Actions)
│   ├── auth.ts
│   ├── profiles.ts
│   ├── solicitudes.ts
│   ├── categorias.ts
│   ├── reviews.ts
│   ├── mensajes.ts
│   ├── storage.ts
│   └── admin.ts
├── types/
│   ├── database.ts         # Tipos del schema de Supabase
│   └── index.ts
├── middleware.ts            # Protección de rutas + refresco de sesión
└── supabase/
    └── schema.sql          # Schema completo con RLS y políticas
```

---

## Configuración inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` como `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://chamoamiga.org
```

Obtén los valores en [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto → Settings → API.

### 3. Configurar la base de datos

Abre el **SQL Editor** en Supabase y ejecuta el archivo `supabase/schema.sql` completo. Esto crea:

- Todas las tablas
- Enums (`user_role`, `request_status`, `modalidad_atencion`)
- Triggers (auto-create profile, auto-update `updated_at`, recalcular rating)
- Row Level Security (RLS) con todas las políticas
- Storage buckets (`avatars`, `logos`, `solicitudes`)
- Categorías por defecto

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Crear el primer administrador

1. Regístrate normalmente en `/sumarme` o `/entrar`.
2. En Supabase → Table Editor → `profiles`, busca tu usuario y cambia `rol` a `admin`.
3. Accede a `/admin` — solo los perfiles con `rol = 'admin'` tienen acceso.

---

## Deploy en Netlify

1. Conecta tu repositorio en [Netlify](https://netlify.com).
2. Configura las variables de entorno (mismas que `.env.local`).
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Instala el plugin de Next.js para Netlify si es necesario: `@netlify/plugin-nextjs`.

---

## Seguridad

- **RLS habilitado** en todas las tablas — ninguna tabla es pública sin política explícita.
- **Service Role Key** solo se usa en el servidor (nunca en el cliente).
- Las rutas `/admin` y `/cuenta` están protegidas por middleware.
- Los correos de contacto **nunca se exponen** en las respuestas públicas.
- Las contraseñas son manejadas completamente por Supabase Auth.

---

## Licencia

Proyecto sin fines de lucro. Hecho con ♥ por y para venezolanos.
