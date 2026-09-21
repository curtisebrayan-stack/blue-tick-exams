-- À exécuter dans l'éditeur SQL de Supabase
-- Ajoute le texte de la question (ex: "Qu'est-ce que Patrick fait chez Louise ?"),
-- oublié lors de la création de ce_items — jusqu'ici seules les options A/B/C/D
-- étaient stockées, sans la question elle-même.

alter table public.ce_items add column if not exists question text not null default '';
