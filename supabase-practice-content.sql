-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Étend l'espace admin (déjà en place pour Compréhension Orale) aux 3 autres épreuves :
-- Compréhension Écrite (CE), Expression Orale (EO), Expression Écrite (EE).
-- Même principe que co_sujets/co_questions : lecture publique, écriture réservée aux admins.

-- --- Compréhension écrite --------------------------------------------------

create table if not exists public.ce_exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  text text not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ce_exercises enable row level security;

create policy "Anyone can view ce_exercises"
  on public.ce_exercises for select
  using (true);

create policy "Admins can manage ce_exercises"
  on public.ce_exercises for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create table if not exists public.ce_questions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.ce_exercises(id) on delete cascade,
  number integer not null,
  question text not null,
  options jsonb not null,
  correct_index integer not null check (correct_index between 0 and 3),
  unique (exercise_id, number)
);

alter table public.ce_questions enable row level security;

create policy "Anyone can view ce_questions"
  on public.ce_questions for select
  using (true);

create policy "Admins can manage ce_questions"
  on public.ce_questions for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- --- Expression orale --------------------------------------------------

create table if not exists public.eo_prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  instructions text not null,
  duration_seconds integer not null,
  prompt_lines jsonb not null,
  checklist jsonb not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.eo_prompts enable row level security;

create policy "Anyone can view eo_prompts"
  on public.eo_prompts for select
  using (true);

create policy "Admins can manage eo_prompts"
  on public.eo_prompts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- --- Expression écrite --------------------------------------------------

create table if not exists public.ee_prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  instructions text not null,
  min_words integer not null,
  max_words integer not null,
  checklist jsonb not null,
  is_free boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.ee_prompts enable row level security;

create policy "Anyone can view ee_prompts"
  on public.ee_prompts for select
  using (true);

create policy "Admins can manage ee_prompts"
  on public.ee_prompts for all
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
