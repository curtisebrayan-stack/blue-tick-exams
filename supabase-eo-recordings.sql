-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les fois précédentes)

-- 1. Bucket de stockage privé pour les enregistrements audio
insert into storage.buckets (id, name, public)
values ('eo-recordings', 'eo-recordings', false)
on conflict (id) do nothing;

-- 2. Chaque utilisateur ne peut lire/écrire que dans son propre dossier (nommé par son user_id)
create policy "Users can upload their own recordings"
  on storage.objects for insert
  with check (bucket_id = 'eo-recordings' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can view their own recordings"
  on storage.objects for select
  using (bucket_id = 'eo-recordings' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete their own recordings"
  on storage.objects for delete
  using (bucket_id = 'eo-recordings' and (storage.foldername(name))[1] = auth.uid()::text);

-- 3. Table qui référence chaque enregistrement (sujet, date, chemin du fichier)
create table if not exists public.speaking_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null check (skill in ('eo')),
  topic_slug text not null,
  storage_path text not null,
  created_at timestamptz not null default now()
);

alter table public.speaking_submissions enable row level security;

create policy "Users can view their own speaking submissions"
  on public.speaking_submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own speaking submissions"
  on public.speaking_submissions for insert
  with check (auth.uid() = user_id);
