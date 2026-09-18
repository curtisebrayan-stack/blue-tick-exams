-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Ajoute des signaux anti-triche (IA/partage de réponses) sur les résultats d'exercices,
-- visibles par l'admin, sans jamais bloquer automatiquement un apprenant.

alter table public.practice_results add column if not exists integrity_flags jsonb not null default '{}'::jsonb;
alter table public.writing_submissions add column if not exists integrity_flags jsonb not null default '{}'::jsonb;
alter table public.speaking_submissions add column if not exists integrity_flags jsonb not null default '{}'::jsonb;

-- Email en clair sur chaque ligne, pour que l'admin identifie facilement un compte à
-- surveiller sans avoir à recouper l'UUID (simple confort d'affichage, pas une donnée
-- de sécurité — comme pour login_events).
alter table public.practice_results add column if not exists email text;
alter table public.writing_submissions add column if not exists email text;
alter table public.speaking_submissions add column if not exists email text;

-- L'admin doit pouvoir tout relire pour surveiller ces signaux (les apprenants ne voient
-- toujours que les leurs, grâce aux policies déjà en place).
create policy "Admins can view all practice results"
  on public.practice_results for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can view all writing submissions"
  on public.writing_submissions for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can view all speaking submissions"
  on public.speaking_submissions for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
