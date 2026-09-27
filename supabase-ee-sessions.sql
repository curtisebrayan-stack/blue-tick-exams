-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Sessions mensuelles d'Expression Écrite (Tâche 1, 2 et 3 — contrairement à l'Expression
-- Orale, les 3 tâches ont ici du contenu réel qui change par session).

create table if not exists public.ee_sessions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ee_sessions enable row level security;

create policy "Anyone can view ee_sessions"
  on public.ee_sessions for select
  using (true);

create policy "Admins can manage ee_sessions"
  on public.ee_sessions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create table if not exists public.ee_session_sujets (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ee_sessions(id) on delete cascade,
  tache integer not null check (tache in (1, 2, 3)),
  number integer not null,
  consigne text not null,
  reponse text,
  unique (session_id, tache, number)
);

alter table public.ee_session_sujets enable row level security;

create policy "Anyone can view ee_session_sujets"
  on public.ee_session_sujets for select
  using (true);

create policy "Admins can manage ee_session_sujets"
  on public.ee_session_sujets for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
