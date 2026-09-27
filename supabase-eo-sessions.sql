-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Sessions mensuelles d'Expression Orale (Tâche 2 et Tâche 3 — la Tâche 1 est une
-- méthodologie fixe affichée en dur dans le code, pas de contenu variable par session).

create table if not exists public.eo_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.eo_sessions enable row level security;

create policy "Anyone can view eo_sessions"
  on public.eo_sessions for select
  using (true);

create policy "Admins can manage eo_sessions"
  on public.eo_sessions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create table if not exists public.eo_session_sujets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.eo_sessions(id) on delete cascade,
  tache integer not null check (tache in (2, 3)),
  number integer not null,
  consigne text not null,
  questions jsonb not null,
  unique (session_id, tache, number)
);

alter table public.eo_session_sujets enable row level security;

create policy "Anyone can view eo_session_sujets"
  on public.eo_session_sujets for select
  using (true);

create policy "Admins can manage eo_session_sujets"
  on public.eo_session_sujets for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
