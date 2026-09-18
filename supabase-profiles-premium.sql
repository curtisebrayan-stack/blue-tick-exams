-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Chaque utilisateur ne peut lire (et voir s'il est premium) que son propre profil.
-- Personne ne peut modifier is_premium depuis le site : ça évite qu'un utilisateur
-- se déclare premium lui-même. Pour l'activer, tu le feras manuellement dans le
-- Table Editor de Supabase (table "profiles", colonne "is_premium") en attendant
-- un vrai système de paiement.
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Crée automatiquement un profil (gratuit par défaut) à chaque nouvelle inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
