-- À exécuter dans l'éditeur SQL de Supabase (même endroit que les scripts précédents)
-- Jusqu'ici personne ne pouvait relire les messages du formulaire de contact depuis le
-- site (seulement via le Table Editor Supabase). On donne cet accès à l'admin.

create policy "Admins can view contact messages"
  on public.contact_messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can delete contact messages"
  on public.contact_messages for delete
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));
