// Quota mensuel de corrections IA pour la simulation d'examen d'Expression Écrite.
// Un seul quota pour tous les comptes Premium (pas de différenciation par palier) —
// la vraie limite est appliquée côté serveur dans supabase/functions/correct-ee ;
// ce module ne fait que relire le même compteur pour l'affichage. Les deux valeurs
// doivent rester synchronisées.

import { supabase } from "./supabase";

export const MONTHLY_EXAM_QUOTA = 30;

function startOfMonthIso(): string {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getRemainingExams(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("writing_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("corrected_at", "is", null)
    .gte("corrected_at", startOfMonthIso());
  if (error) throw error;
  return Math.max(0, MONTHLY_EXAM_QUOTA - (count ?? 0));
}
