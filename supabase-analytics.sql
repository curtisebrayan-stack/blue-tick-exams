-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  path text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

-- Tout le monde (y compris les visiteurs non connectés) peut enregistrer un événement,
-- mais personne ne peut les lire depuis le site : seul toi, via le dashboard Supabase, le peux.
create policy "Anyone can insert analytics events"
  on public.analytics_events for insert
  with check (true);
