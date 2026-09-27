// Sessions mensuelles d'Expression Écrite (Tâche 1 : message court, Tâche 2 : récit/avis,
// Tâche 3 : argumentation à partir de deux documents). Voir supabase-ee-sessions.sql.

import { supabase } from "./supabase";

export type EeSessionSujet = {
  number: number;
  consigne: string;
  reponse: string | null;
};

export type EeSession = {
  id: string;
  slug: string;
  label: string;
  isFree: boolean;
  tache1: EeSessionSujet[];
  tache2: EeSessionSujet[];
  tache3: EeSessionSujet[];
};

export type EeSessionSummary = {
  id: string;
  slug: string;
  label: string;
  isFree: boolean;
};

export async function listEeSessions(): Promise<EeSessionSummary[]> {
  const { data, error } = await supabase
    .from("ee_sessions")
    .select("id, slug, label, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((s) => ({ id: s.id, slug: s.slug, label: s.label, isFree: s.is_free }));
}

export async function getEeSession(slug: string): Promise<EeSession | undefined> {
  const { data: session, error: sessionError } = await supabase
    .from("ee_sessions")
    .select("id, slug, label, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (sessionError) throw sessionError;
  if (!session) return undefined;

  const { data: sujets, error: sujetsError } = await supabase
    .from("ee_session_sujets")
    .select("tache, number, consigne, reponse")
    .eq("session_id", session.id)
    .order("number", { ascending: true });
  if (sujetsError) throw sujetsError;

  const byTache = (t: number) => (sujets ?? []).filter((s) => s.tache === t).map((s) => ({ number: s.number, consigne: s.consigne, reponse: s.reponse }));

  return {
    id: session.id,
    slug: session.slug,
    label: session.label,
    isFree: session.is_free,
    tache1: byTache(1),
    tache2: byTache(2),
    tache3: byTache(3),
  };
}

/** Pioche un sujet au hasard pour une tâche donnée, parmi toutes les sessions disponibles. */
export async function getRandomSujet(tache: 1 | 2 | 3): Promise<{ sessionLabel: string; sujet: EeSessionSujet } | undefined> {
  const { data, error } = await supabase
    .from("ee_session_sujets")
    .select("number, consigne, reponse, session:ee_sessions(label)")
    .eq("tache", tache);
  if (error) throw error;
  if (!data || data.length === 0) return undefined;
  const pick = data[Math.floor(Math.random() * data.length)];
  const session = Array.isArray(pick.session) ? pick.session[0] : pick.session;
  return {
    sessionLabel: (session as { label: string } | null)?.label ?? "",
    sujet: { number: pick.number, consigne: pick.consigne, reponse: pick.reponse },
  };
}
