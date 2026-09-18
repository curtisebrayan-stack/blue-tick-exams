-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Tout le monde peut envoyer un message (même sans compte), mais personne ne peut
-- les relire depuis le site : seul toi, via le dashboard Supabase, le peux.
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);
