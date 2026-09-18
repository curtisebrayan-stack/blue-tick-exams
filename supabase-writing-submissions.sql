-- À exécuter dans l'éditeur SQL de Supabase (même endroit que practice_results)

create table if not exists public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null check (skill in ('eo','ee')),
  topic_slug text not null,
  content text not null,
  word_count integer not null,
  created_at timestamptz not null default now()
);

alter table public.writing_submissions enable row level security;

create policy "Users can view their own submissions"
  on public.writing_submissions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own submissions"
  on public.writing_submissions for insert
  with check (auth.uid() = user_id);
