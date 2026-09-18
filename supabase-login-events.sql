-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Journal des connexions, pour repérer un éventuel partage de compte entre apprenants.

create table if not exists public.login_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  ip text,
  country text,
  city text,
  device text,
  created_at timestamptz not null default now()
);

alter table public.login_events enable row level security;

-- Chacun peut voir ses propres connexions (transparence pour l'apprenant).
create policy "Users can view their own login events"
  on public.login_events for select
  using (auth.uid() = user_id);

-- Un utilisateur ne peut enregistrer une connexion que pour lui-même, avec son
-- vrai email de session (empêche de falsifier l'email affiché à l'admin).
create policy "Users can insert their own login events"
  on public.login_events for insert
  with check (auth.uid() = user_id and email = auth.email());

-- L'admin voit tout, pour repérer les schémas de partage de compte.
create policy "Admins can view all login events"
  on public.login_events for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
