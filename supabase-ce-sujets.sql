-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Ajoute la Compréhension Écrite "format examen" : 39 questions indépendantes,
-- chacune avec sa propre image de document (contrairement aux sujets CE existants,
-- qui partagent un seul texte pour plusieurs questions). Même principe que co_sujets,
-- avec une image obligatoire à la place de l'audio.

create table if not exists public.ce_sujets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ce_sujets enable row level security;

create policy "Anyone can view ce_sujets"
  on public.ce_sujets for select
  using (true);

create policy "Admins can manage ce_sujets"
  on public.ce_sujets for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create table if not exists public.ce_items (
  id uuid primary key default gen_random_uuid(),
  sujet_id uuid not null references public.ce_sujets(id) on delete cascade,
  number integer not null,
  image_url text not null,
  options jsonb not null,
  correct_index integer not null check (correct_index between 0 and 3),
  unique (sujet_id, number)
);

alter table public.ce_items enable row level security;

create policy "Anyone can view ce_items"
  on public.ce_items for select
  using (true);

create policy "Admins can manage ce_items"
  on public.ce_items for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Bucket de stockage public pour les images de documents (lecture libre, écriture admin).
insert into storage.buckets (id, name, public)
values ('ce-content', 'ce-content', true)
on conflict (id) do nothing;

create policy "Anyone can read ce-content"
  on storage.objects for select
  using (bucket_id = 'ce-content');

create policy "Admins can upload ce-content"
  on storage.objects for insert
  with check (
    bucket_id = 'ce-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update ce-content"
  on storage.objects for update
  using (
    bucket_id = 'ce-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete ce-content"
  on storage.objects for delete
  using (
    bucket_id = 'ce-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );
