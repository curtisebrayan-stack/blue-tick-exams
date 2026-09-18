import { useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";
import { getNclc, formatNclc, NCLC_TABLE, SKILL_MAX, SKILL_LABELS, type TcfSkill } from "@/lib/nclc";
import { Seo } from "@/components/Seo";

const SKILLS: TcfSkill[] = ["co", "ce", "eo", "ee"];

export default function CalculatriceNclc() {
  const [scores, setScores] = useState<Record<TcfSkill, string>>({ co: "", ce: "", eo: "", ee: "" });

  const results = useMemo(() => {
    const entries = SKILLS.map((skill) => {
      const raw = scores[skill];
      if (raw === "") return { skill, nclc: null as number | null, filled: false };
      const value = Math.max(0, Math.min(SKILL_MAX[skill], Number(raw)));
      return { skill, nclc: getNclc(skill, value), filled: true };
    });
    const allFilled = entries.every((e) => e.filled);
    const global = allFilled
      ? entries.reduce<number | null>((min, e) => {
          if (e.nclc === null) return null;
          if (min === null) return null;
          return Math.min(min, e.nclc);
        }, 10)
      : null;
    return { entries, allFilled, global };
  }, [scores]);

  const setScore = (skill: TcfSkill, value: string) => {
    if (value !== "" && !/^\d{0,3}$/.test(value)) return;
    setScores((prev) => ({ ...prev, [skill]: value }));
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Calculatrice NCLC" description="Estime ton niveau NCLC à partir de tes résultats aux quatre épreuves du TCF Canada." />
      <span className="chip"><Calculator className="h-3.5 w-3.5" /> Outil</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Calculatrice NCLC — TCF Canada</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        Entre tes résultats par épreuve pour estimer ton niveau NCLC selon le barème officiel IRCC.
      </p>

      <div className="mt-10 card-shell p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {SKILLS.map((skill) => (
            <label key={skill} className="block">
              <span className="text-sm font-semibold">{SKILL_LABELS[skill]}</span>
              <span className="ml-1 text-xs text-muted-foreground">(sur {SKILL_MAX[skill]})</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={scores[skill]}
                onChange={(e) => setScore(skill, e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {scores[skill] !== "" && (
                <span className="mt-1 inline-block text-xs font-bold text-primary">
                  {formatNclc(getNclc(skill, Number(scores[skill])))}
                </span>
              )}
            </label>
          ))}
        </div>

        <div className="mt-8 rounded-lg bg-muted p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Niveau global</p>
          <p className="mt-2 text-2xl font-bold">
            {results.allFilled ? formatNclc(results.global) : "Renseigne les 4 épreuves"}
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Le niveau global correspond au plus bas des 4 résultats — c'est ce que retiennent la plupart des programmes d'immigration (ex. Entrée express exige NCLC 7 sur les 4 épreuves).
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold">Barème officiel TCF Canada → NCLC</h2>
        <div className="mt-4 overflow-x-auto card-shell">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">NCLC</th>
                <th className="px-4 py-3">Compr. orale</th>
                <th className="px-4 py-3">Compr. écrite</th>
                <th className="px-4 py-3">Expr. orale</th>
                <th className="px-4 py-3">Expr. écrite</th>
              </tr>
            </thead>
            <tbody>
              {[...NCLC_TABLE].reverse().map((band) => (
                <tr key={band.nclc} className="border-t border-border">
                  <td className="px-4 py-3 font-bold">{formatNclc(band.nclc)}</td>
                  <td className="px-4 py-3">{band.co[0]}–{band.co[1]}</td>
                  <td className="px-4 py-3">{band.ce[0]}–{band.ce[1]}</td>
                  <td className="px-4 py-3">{band.eo[0]}–{band.eo[1]}</td>
                  <td className="px-4 py-3">{band.ee[0]}–{band.ee[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Barème indicatif basé sur les équivalences publiées par IRCC. Vérifie toujours ton résultat officiel sur ton attestation TCF Canada.
        </p>
      </div>
    </section>
  );
}
