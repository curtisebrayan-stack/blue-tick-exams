import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { supabase } from "@/lib/supabase";

type IntegrityFlags = {
  tabSwitches?: number;
  fullscreenExits?: number;
  pasted?: boolean;
  fastTyping?: boolean;
  slowAnswers?: number;
};

type Row = {
  id: string;
  email: string | null;
  skill: string;
  topic_slug: string;
  created_at: string;
  integrity_flags: IntegrityFlags;
  detail: string;
};

function isSuspicious(flags: IntegrityFlags): boolean {
  return Boolean(
    flags.pasted || flags.fastTyping || (flags.tabSwitches ?? 0) >= 2 || (flags.fullscreenExits ?? 0) >= 1 || (flags.slowAnswers ?? 0) >= 3,
  );
}

function describeFlags(flags: IntegrityFlags): string {
  const parts: string[] = [];
  if (flags.pasted) parts.push("texte collé");
  if (flags.fastTyping) parts.push("frappe anormalement rapide");
  if (flags.tabSwitches) parts.push(`${flags.tabSwitches} changement${flags.tabSwitches > 1 ? "s" : ""} d'onglet`);
  if (flags.fullscreenExits) parts.push(`${flags.fullscreenExits} sortie${flags.fullscreenExits > 1 ? "s" : ""} du plein écran`);
  if (flags.slowAnswers) parts.push(`${flags.slowAnswers} réponse${flags.slowAnswers > 1 ? "s" : ""} lente${flags.slowAnswers > 1 ? "s" : ""}`);
  return parts.length > 0 ? parts.join(", ") : "aucun signal";
}

export default function AdminIntegrite() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    Promise.all([
      supabase.from("practice_results").select("id, email, skill, topic_slug, created_at, integrity_flags, score, max_score").order("created_at", { ascending: false }).limit(100),
      supabase.from("writing_submissions").select("id, email, skill, topic_slug, created_at, integrity_flags, word_count").order("created_at", { ascending: false }).limit(100),
      supabase.from("speaking_submissions").select("id, email, skill, topic_slug, created_at, integrity_flags").order("created_at", { ascending: false }).limit(100),
    ]).then(([practice, writing, speaking]) => {
      const practiceRows: Row[] = (practice.data ?? []).map((r) => ({
        id: r.id,
        email: r.email,
        skill: r.skill,
        topic_slug: r.topic_slug,
        created_at: r.created_at,
        integrity_flags: (r.integrity_flags ?? {}) as IntegrityFlags,
        detail: `${r.score}/${r.max_score}`,
      }));
      const writingRows: Row[] = (writing.data ?? []).map((r) => ({
        id: r.id,
        email: r.email,
        skill: r.skill,
        topic_slug: r.topic_slug,
        created_at: r.created_at,
        integrity_flags: (r.integrity_flags ?? {}) as IntegrityFlags,
        detail: `${r.word_count} mots`,
      }));
      const speakingRows: Row[] = (speaking.data ?? []).map((r) => ({
        id: r.id,
        email: r.email,
        skill: r.skill,
        topic_slug: r.topic_slug,
        created_at: r.created_at,
        integrity_flags: (r.integrity_flags ?? {}) as IntegrityFlags,
        detail: "enregistrement audio",
      }));
      const all = [...practiceRows, ...writingRows, ...speakingRows].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setRows(all);
    });
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      <Seo title="Intégrité" description="Signaux anti-triche sur les résultats des apprenants." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Signaux d'intégrité</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Résultats récents avec les signaux détectés pendant l'exercice (collage, frappe rapide, changement d'onglet,
        sortie du plein écran, réponses lentes). Aucun blocage automatique — ces signaux ont parfois une explication
        légitime, à vérifier au cas par cas.
      </p>

      {rows === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucun résultat pour le moment.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4">Compte</th>
                <th className="py-2 pr-4">Épreuve / sujet</th>
                <th className="py-2 pr-4">Résultat</th>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2">Signaux</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const suspicious = isSuspicious(row.integrity_flags);
                return (
                  <tr key={row.id} className={`border-b border-border/60 align-top ${suspicious ? "bg-red-500/10" : ""}`}>
                    <td className="py-2 pr-4 font-medium">{row.email ?? "—"}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{row.skill.toUpperCase()} — {row.topic_slug}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{row.detail}</td>
                    <td className="py-2 pr-4 text-muted-foreground">{new Date(row.created_at).toLocaleString("fr-FR")}</td>
                    <td className="py-2 text-muted-foreground">
                      {suspicious && <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-red-500" />}
                      {describeFlags(row.integrity_flags)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
