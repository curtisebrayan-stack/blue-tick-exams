-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Ajoute le stockage de la correction IA sur les rédactions déjà soumises.

alter table public.writing_submissions add column if not exists correction jsonb;
alter table public.writing_submissions add column if not exists corrected_at timestamptz;
