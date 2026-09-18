-- À exécuter une fois dans l'éditeur SQL de Supabase (dashboard > Éditeur SQL > New query)

create table if not exists public.practice_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null check (skill in ('co','ce','eo','ee')),
  topic_slug text not null,
  score integer not null,
  max_score integer not null,
  created_at timestamptz not null default now()
);

alter table public.practice_results enable row level security;

create policy "Users can view their own results"
  on public.practice_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own results"
  on public.practice_results for insert
  with check (auth.uid() = user_id);
