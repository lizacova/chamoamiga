-- ================================================================
-- CHAMO AMIGA — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================

-- ── Extensions ──────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Enum types ──────────────────────────────────────────────────
create type user_role as enum ('persona', 'profesional', 'voluntario', 'organizacion', 'admin');
create type request_status as enum ('abierta', 'en_proceso', 'resuelta', 'cerrada');
create type modalidad_atencion as enum ('en_linea', 'presencial', 'ambas');

-- ================================================================
-- PROFILES
-- Extends auth.users — one row per user
-- ================================================================
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nombre        text not null,
  apellido      text,
  email         text not null,
  telefono      text,
  foto_url      text,
  pais          text default 'Venezuela',
  ciudad        text,
  descripcion   text,
  rol           user_role not null default 'persona',
  activo        boolean not null default true,
  verificado    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nombre, apellido, email, rol, ciudad)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'apellido',
    new.email,
    coalesce((new.raw_user_meta_data->>'rol')::user_role, 'persona'),
    new.raw_user_meta_data->>'ciudad'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- CATEGORIAS
-- ================================================================
create table public.categorias (
  id          uuid primary key default uuid_generate_v4(),
  nombre      text not null unique,
  icono       text,
  descripcion text,
  activa      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seed default categories
insert into public.categorias (nombre, icono, descripcion) values
  ('Psicología',       '🧠', 'Apoyo emocional y salud mental'),
  ('Medicina',         '🏥', 'Atención médica general y telemedicina'),
  ('Abogacía',         '⚖️', 'Asesoría legal y documentación'),
  ('Trabajo Social',   '🤝', 'Apoyo comunitario y familiar'),
  ('Ingeniería Civil', '🏗️', 'Evaluación de estructuras y viviendas'),
  ('Enfermería',       '💊', 'Cuidados y atención de salud'),
  ('Educación',        '📚', 'Apoyo escolar y pedagógico'),
  ('Logística',        '🚛', 'Transporte y distribución de donaciones'),
  ('Donaciones',       '🎁', 'Artículos, alimentos y recursos materiales'),
  ('Voluntariado',     '🙌', 'Ayuda general sin especialidad requerida'),
  ('Migración',        '✈️', 'Trámites migratorios y asesoría'),
  ('Emprendimiento',   '💡', 'Apoyo a negocios y proyectos'),
  ('Tecnología',       '💻', 'Desarrollo de software y TI'),
  ('Nutrición',        '🥗', 'Orientación nutricional y alimentaria'),
  ('Arquitectura',     '🏛️', 'Diseño y evaluación de espacios');

-- ================================================================
-- PROFESIONALES
-- ================================================================
create table public.profesionales (
  id              uuid primary key default uuid_generate_v4(),
  usuario_id      uuid not null unique references public.profiles(id) on delete cascade,
  profesion       text not null,
  experiencia     text,
  biografia       text not null,
  modalidad       modalidad_atencion not null default 'en_linea',
  disponible      boolean not null default true,
  verificado      boolean not null default false,
  ayudados        integer not null default 0,
  rating_promedio numeric(3,2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger profesionales_updated_at
  before update on public.profesionales
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- PROFESIONAL_CATEGORIAS (many-to-many)
-- ================================================================
create table public.profesional_categorias (
  id              uuid primary key default uuid_generate_v4(),
  profesional_id  uuid not null references public.profesionales(id) on delete cascade,
  categoria_id    uuid not null references public.categorias(id) on delete cascade,
  unique(profesional_id, categoria_id)
);

-- ================================================================
-- ORGANIZACIONES
-- ================================================================
create table public.organizaciones (
  id          uuid primary key default uuid_generate_v4(),
  usuario_id  uuid not null unique references public.profiles(id) on delete cascade,
  nombre      text not null,
  descripcion text not null,
  logo_url    text,
  ubicacion   text,
  sitio_web   text,
  verificada  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger organizaciones_updated_at
  before update on public.organizaciones
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- SOLICITUDES
-- ================================================================
create table public.solicitudes (
  id                   uuid primary key default uuid_generate_v4(),
  titulo               text not null,
  descripcion          text not null,
  categoria_id         uuid references public.categorias(id) on delete set null,
  ubicacion            text,
  modalidad            modalidad_atencion not null default 'en_linea',
  estado               request_status not null default 'abierta',
  creador_id           uuid references public.profiles(id) on delete set null,
  nombre_contacto      text not null,
  email_contacto       text not null,
  codigo_seguimiento   text not null unique,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger solicitudes_updated_at
  before update on public.solicitudes
  for each row execute procedure public.set_updated_at();

-- ================================================================
-- RESPUESTAS_SOLICITUD
-- ================================================================
create table public.respuestas_solicitud (
  id              uuid primary key default uuid_generate_v4(),
  solicitud_id    uuid not null references public.solicitudes(id) on delete cascade,
  profesional_id  uuid not null references public.profiles(id) on delete cascade,
  mensaje         text not null,
  created_at      timestamptz not null default now(),
  unique(solicitud_id, profesional_id)
);

-- ================================================================
-- REVIEWS
-- ================================================================
create table public.reviews (
  id              uuid primary key default uuid_generate_v4(),
  evaluador_id    uuid not null references public.profiles(id) on delete cascade,
  evaluado_id     uuid not null references public.profiles(id) on delete cascade,
  solicitud_id    uuid references public.solicitudes(id) on delete set null,
  estrellas       smallint not null check (estrellas between 1 and 5),
  comentario      text not null,
  nombre_anonimo  text,  -- for unauthenticated reviews
  created_at      timestamptz not null default now()
);

-- Auto-update rating average on profesionales
create or replace function public.update_rating_promedio()
returns trigger language plpgsql as $$
begin
  update public.profesionales
  set rating_promedio = (
    select avg(estrellas)::numeric(3,2)
    from public.reviews
    where evaluado_id = coalesce(new.evaluado_id, old.evaluado_id)
  )
  where usuario_id = coalesce(new.evaluado_id, old.evaluado_id);
  return new;
end;
$$;

create trigger reviews_update_rating
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_rating_promedio();

-- ================================================================
-- MENSAJES (authenticated)
-- ================================================================
create table public.mensajes (
  id                uuid primary key default uuid_generate_v4(),
  de_usuario_id     uuid not null references public.profiles(id) on delete cascade,
  para_usuario_id   uuid not null references public.profiles(id) on delete cascade,
  asunto            text,
  contenido         text not null,
  leido             boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ================================================================
-- MENSAJES_ANONIMOS (from unauthenticated visitors)
-- ================================================================
create table public.mensajes_anonimos (
  id                uuid primary key default uuid_generate_v4(),
  para_usuario_id   uuid not null references public.profiles(id) on delete cascade,
  nombre_remitente  text not null,
  email_remitente   text not null,
  contenido         text not null,
  leido             boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ================================================================
-- FAVORITOS
-- ================================================================
create table public.favoritos (
  id              uuid primary key default uuid_generate_v4(),
  usuario_id      uuid not null references public.profiles(id) on delete cascade,
  profesional_id  uuid not null references public.profesionales(id) on delete cascade,
  created_at      timestamptz not null default now(),
  unique(usuario_id, profesional_id)
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

-- Enable RLS on all tables
alter table public.profiles              enable row level security;
alter table public.categorias            enable row level security;
alter table public.profesionales         enable row level security;
alter table public.profesional_categorias enable row level security;
alter table public.organizaciones        enable row level security;
alter table public.solicitudes           enable row level security;
alter table public.respuestas_solicitud  enable row level security;
alter table public.reviews               enable row level security;
alter table public.mensajes              enable row level security;
alter table public.mensajes_anonimos     enable row level security;
alter table public.favoritos             enable row level security;

-- ── Profiles ────────────────────────────────────────────────────
create policy "profiles_public_read"
  on public.profiles for select using (true);

create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Categorias (public read, admin write) ───────────────────────
create policy "categorias_public_read"
  on public.categorias for select using (activa = true);

create policy "categorias_admin_all"
  on public.categorias for all
  using (exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin'));

-- ── Profesionales ───────────────────────────────────────────────
create policy "profesionales_public_read"
  on public.profesionales for select using (disponible = true);

create policy "profesionales_own_insert"
  on public.profesionales for insert
  with check (auth.uid() = usuario_id);

create policy "profesionales_own_update"
  on public.profesionales for update
  using (auth.uid() = usuario_id);

create policy "profesionales_admin_all"
  on public.profesionales for all
  using (exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin'));

-- ── Profesional categorias ──────────────────────────────────────
create policy "prof_cats_public_read"
  on public.profesional_categorias for select using (true);

create policy "prof_cats_own_manage"
  on public.profesional_categorias for all
  using (exists (
    select 1 from public.profesionales p
    where p.id = profesional_id and p.usuario_id = auth.uid()
  ));

-- ── Solicitudes ─────────────────────────────────────────────────
create policy "solicitudes_public_read"
  on public.solicitudes for select using (true);

create policy "solicitudes_anon_insert"
  on public.solicitudes for insert with check (true);

create policy "solicitudes_own_update"
  on public.solicitudes for update
  using (auth.uid() = creador_id);

create policy "solicitudes_own_delete"
  on public.solicitudes for delete
  using (auth.uid() = creador_id);

create policy "solicitudes_admin_all"
  on public.solicitudes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin'));

-- ── Respuestas ──────────────────────────────────────────────────
create policy "respuestas_public_read"
  on public.respuestas_solicitud for select using (true);

create policy "respuestas_auth_insert"
  on public.respuestas_solicitud for insert
  with check (auth.uid() = profesional_id);

-- ── Reviews ─────────────────────────────────────────────────────
create policy "reviews_public_read"
  on public.reviews for select using (true);

create policy "reviews_auth_insert"
  on public.reviews for insert with check (true);  -- allow anonymous too

create policy "reviews_admin_delete"
  on public.reviews for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin'));

-- ── Mensajes ────────────────────────────────────────────────────
create policy "mensajes_own_read"
  on public.mensajes for select
  using (auth.uid() = de_usuario_id or auth.uid() = para_usuario_id);

create policy "mensajes_auth_insert"
  on public.mensajes for insert with check (auth.uid() = de_usuario_id);

-- ── Mensajes anónimos ───────────────────────────────────────────
create policy "mensajes_anonimos_insert"
  on public.mensajes_anonimos for insert with check (true);

create policy "mensajes_anonimos_own_read"
  on public.mensajes_anonimos for select
  using (auth.uid() = para_usuario_id);

-- ── Favoritos ───────────────────────────────────────────────────
create policy "favoritos_own_all"
  on public.favoritos for all using (auth.uid() = usuario_id);

-- ================================================================
-- STORAGE BUCKETS
-- Run in Supabase Dashboard → Storage → New bucket
-- ================================================================
-- Buckets to create manually:
--   avatars   (public)
--   logos     (public)
--   documents (private)
--   solicitudes (public)

-- Storage policies (run after creating buckets):
insert into storage.buckets (id, name, public) values
  ('avatars', 'avatars', true),
  ('logos', 'logos', true),
  ('solicitudes', 'solicitudes', true)
on conflict do nothing;

create policy "avatars_public_read"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "avatars_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_own_update"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "logos_public_read"
  on storage.objects for select using (bucket_id = 'logos');

create policy "logos_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'logos' and auth.role() = 'authenticated');
