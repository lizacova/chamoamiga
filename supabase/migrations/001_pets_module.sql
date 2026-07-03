-- ================================================================
-- CHAMO AMIGA — Mascotas Module Migration
-- Run this AFTER the base schema.sql
-- ================================================================

-- ── Enum types ──────────────────────────────────────────────────
create type pet_species as enum ('perro', 'gato', 'otro');
create type pet_sex     as enum ('macho', 'hembra', 'desconocido');
create type pet_size    as enum ('pequeno', 'mediano', 'grande');
create type pet_status  as enum ('perdido', 'encontrado', 'en_adopcion', 'adoptado', 'reunido', 'hogar_temporal');
create type pet_pub_type as enum ('perdido', 'adopcion', 'hogar_temporal');

-- ================================================================
-- PETS
-- ================================================================
create table public.pets (
  id                    uuid primary key default uuid_generate_v4(),

  -- Publication type & status
  tipo_publicacion      pet_pub_type  not null,
  estado                pet_status    not null,

  -- Basic info
  nombre                text,
  especie               pet_species   not null,
  raza                  text,
  sexo                  pet_sex       not null default 'desconocido',
  tamano                pet_size      not null default 'mediano',
  color                 text,
  edad_aprox            text,          -- e.g. "~1 año", "cachorro", "adulto"
  descripcion           text          not null,
  personalidad          text,          -- for adoption listings

  -- Lost-pet specific
  ultima_ubicacion      text,
  fecha_perdido         date,

  -- Adoption specific
  vacunado              boolean,
  esterilizado          boolean,
  requisitos_adopcion   text,

  -- Temp foster specific
  disponible_desde      date,
  duracion_estimada     text,          -- e.g. "2 semanas", "1 mes"

  -- Contact & location
  ciudad                text          not null,
  direccion_aprox       text,
  latitud               double precision,
  longitud              double precision,
  telefono_contacto     text,
  email_contacto        text,

  -- Moderation (future-proof)
  aprobado              boolean       not null default false,
  destacado             boolean       not null default false,
  visible               boolean       not null default true,

  -- Ownership
  creador_id            uuid          references public.profiles(id) on delete set null,
  organizacion_nombre   text,

  created_at            timestamptz   not null default now(),
  updated_at            timestamptz   not null default now()
);

create trigger pets_updated_at
  before update on public.pets
  for each row execute procedure public.set_updated_at();

-- Index for fast filtering
create index pets_tipo_estado_idx     on public.pets (tipo_publicacion, estado);
create index pets_especie_ciudad_idx  on public.pets (especie, ciudad);
create index pets_creador_idx         on public.pets (creador_id);

-- ================================================================
-- PET_PHOTOS
-- ================================================================
create table public.pet_photos (
  id            uuid primary key default uuid_generate_v4(),
  pet_id        uuid not null references public.pets(id) on delete cascade,
  url           text not null,
  es_principal  boolean not null default false,
  orden         smallint not null default 0,
  created_at    timestamptz not null default now()
);

create index pet_photos_pet_idx on public.pet_photos (pet_id, orden);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
alter table public.pets       enable row level security;
alter table public.pet_photos enable row level security;

-- Pets: anyone can read approved & visible
create policy "pets_public_read"
  on public.pets for select
  using (aprobado = true and visible = true);

-- Anyone can insert (moderation required → aprobado = false by default)
create policy "pets_anon_insert"
  on public.pets for insert
  with check (true);

-- Owner can update their own
create policy "pets_own_update"
  on public.pets for update
  using (auth.uid() = creador_id);

-- Owner can delete their own
create policy "pets_own_delete"
  on public.pets for delete
  using (auth.uid() = creador_id);

-- Admins can do anything
create policy "pets_admin_all"
  on public.pets for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  ));

-- Photos: public read
create policy "pet_photos_public_read"
  on public.pet_photos for select using (true);

create policy "pet_photos_auth_insert"
  on public.pet_photos for insert with check (true);

create policy "pet_photos_admin_all"
  on public.pet_photos for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  ));

-- ================================================================
-- STORAGE BUCKET — pets
-- ================================================================
insert into storage.buckets (id, name, public)
values ('pets', 'pets', true)
on conflict do nothing;

create policy "pets_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'pets');

create policy "pets_storage_auth_upload"
  on storage.objects for insert
  with check (bucket_id = 'pets');

create policy "pets_storage_own_delete"
  on storage.objects for delete
  using (bucket_id = 'pets' and auth.role() = 'authenticated');

-- ================================================================
-- ADD pets count to dashboard view (optional helper)
-- ================================================================
-- This is queried directly in the admin service — no view needed.
-- Architecture note: future modules (campaigns, vet volunteers, etc.)
-- should follow the same pattern: new table + RLS + migration file.
