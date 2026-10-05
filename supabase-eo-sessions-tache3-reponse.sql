-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- La vraie Tâche 3 d'Expression Orale (défendre un point de vue) n'est pas une liste
-- de questions comme la Tâche 2, mais une réponse argumentée unique. On ajoute donc
-- une colonne "reponse" (comme pour ee_session_sujets) et on rend "questions" optionnel,
-- puisqu'un sujet n'utilise jamais les deux à la fois.

alter table public.eo_session_sujets
  alter column questions drop not null;

alter table public.eo_session_sujets
  add column if not exists reponse text;
