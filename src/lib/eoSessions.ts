// Sessions mensuelles d'Expression Orale (Tâche 2 : poser des questions, Tâche 3 :
// argumenter). La Tâche 1 (se présenter) est une méthodologie fixe, affichée en dur
// dans la page — elle ne varie pas d'une session à l'autre, donc pas de contenu en
// base pour elle. Voir supabase-eo-sessions.sql pour le schéma.

import { supabase } from "./supabase";
import { sortByMonthSlugDesc } from "./monthSlug";

export type EoSessionSujet = {
  number: number;
  consigne: string;
  // Tâche 2 (poser des questions) utilise "questions" ; Tâche 3 (défendre un
  // point de vue) utilise "reponse" — un sujet ne renseigne jamais les deux.
  questions: string[] | null;
  reponse: string | null;
};

export type EoSession = {
  id: string;
  slug: string;
  label: string;
  isFree: boolean;
  tache2: EoSessionSujet[];
  tache3: EoSessionSujet[];
};

export type EoSessionSummary = {
  id: string;
  slug: string;
  label: string;
  isFree: boolean;
};

export async function listEoSessions(): Promise<EoSessionSummary[]> {
  const { data, error } = await supabase
    .from("eo_sessions")
    .select("id, slug, label, is_free");
  if (error) throw error;
  const sessions = (data ?? []).map((s) => ({ id: s.id, slug: s.slug, label: s.label, isFree: s.is_free }));
  return sortByMonthSlugDesc(sessions);
}

export async function getEoSession(slug: string): Promise<EoSession | undefined> {
  const { data: session, error: sessionError } = await supabase
    .from("eo_sessions")
    .select("id, slug, label, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) return undefined;

  const { data: sujets, error: sujetsError } = await supabase
    .from("eo_session_sujets")
    .select("tache, number, consigne, questions, reponse")
    .eq("session_id", session.id)
    .order("number", { ascending: true });
  if (sujetsError) throw sujetsError;

  const toSujet = (s: { number: number; consigne: string; questions: unknown; reponse: string | null }): EoSessionSujet => ({
    number: s.number,
    consigne: s.consigne,
    questions: (s.questions as string[] | null) ?? null,
    reponse: s.reponse,
  });
  const tache2 = (sujets ?? []).filter((s) => s.tache === 2).map(toSujet);
  const tache3 = (sujets ?? []).filter((s) => s.tache === 3).map(toSujet);

  return {
    id: session.id,
    slug: session.slug,
    label: session.label,
    isFree: session.is_free,
    tache2,
    tache3,
  };
}
