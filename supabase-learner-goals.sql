-- À exécuter dans l'éditeur SQL de Supabase.
-- Objectif de l'apprenant (NCLC visé, date d'examen) — dans une table séparée de
-- "profiles" pour ne jamais toucher aux policies is_premium/is_admin déjà en place.

create table if not exists public.learner_goals (
  id uuid primary key references auth.users(id) on delete cascade,
  objectif_nclc integer,
  date_examen date,
  updated_at timestamptz not null default now()
);

alter table public.learner_goals enable row level security;

create policy "Users can view their own goal"
  on public.learner_goals for select
  using (auth.uid() = id);

create policy "Users can upsert their own goal"
  on public.learner_goals for insert
  with check (auth.uid() = id);

create policy "Users can update their own goal"
  on public.learner_goals for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
