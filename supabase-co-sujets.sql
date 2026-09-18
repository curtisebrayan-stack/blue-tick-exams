-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Ajoute un espace admin pour gérer les sujets de Compréhension Orale sans passer par le code.

-- 1. Rôle admin sur le profil (même logique que is_premium : personne ne peut se
--    l'attribuer soi-même depuis le site, ça se fait manuellement dans Supabase).
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 2. Un sujet (ex: "Sujet 1", "Sujet 2", et tous ceux que l'admin ajoutera après).
create table if not exists public.co_sujets (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.co_sujets enable row level security;

-- Tout le monde peut voir la liste des sujets (accès gratuit, pas besoin de compte).
create policy "Anyone can view co_sujets"
  on public.co_sujets for select
  using (true);

-- Seuls les admins peuvent créer/modifier/supprimer des sujets.
create policy "Admins can manage co_sujets"
  on public.co_sujets for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 3. Les questions d'un sujet.
create table if not exists public.co_questions (
  id uuid primary key default gen_random_uuid(),
  sujet_id uuid not null references public.co_sujets(id) on delete cascade,
  number integer not null,
  audio_url text not null,
  image_url text,
  options jsonb,
  correct_index integer not null check (correct_index between 0 and 3),
  provisional boolean not null default false,
  unique (sujet_id, number)
);

alter table public.co_questions enable row level security;

create policy "Anyone can view co_questions"
  on public.co_questions for select
  using (true);

create policy "Admins can manage co_questions"
  on public.co_questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 4. Bucket de stockage public pour l'audio/les images des sujets (lecture libre,
--    écriture réservée aux admins).
insert into storage.buckets (id, name, public)
values ('co-content', 'co-content', true)
on conflict (id) do nothing;

create policy "Anyone can read co-content"
  on storage.objects for select
  using (bucket_id = 'co-content');

create policy "Admins can upload co-content"
  on storage.objects for insert
  with check (
    bucket_id = 'co-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can update co-content"
  on storage.objects for update
  using (
    bucket_id = 'co-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

create policy "Admins can delete co-content"
  on storage.objects for delete
  using (
    bucket_id = 'co-content'
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true)
  );

-- 5. Pour te rendre admin (ou rendre ton client admin), remplace l'email et exécute :
-- update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'email-du-client@exemple.com');
