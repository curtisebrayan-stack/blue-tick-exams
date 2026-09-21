import { useState } from "react";
import { Trophy, Award, CheckCircle2, XCircle, Clock, Target, Gauge } from "lucide-react";
import { getNclc, formatNclc, getCefrLevel, estimateScaledScore, NCLC_TABLE, type TcfSkill } from "@/lib/nclc";

export type ResultQuestion = {
  number: number;
  options: string[] | null;
  correctIndex: number;
  selectedIndex: number | undefined;
};

export function ExamResults({
  skill,
  score,
  maxScore,
  timeUsedSeconds,
  questions,
}: {
  skill: TcfSkill;
  score: number;
  maxScore: number;
  timeUsedSeconds: number;
  questions: ResultQuestion[];
}) {
  const [showCorrections, setShowCorrections] = useState(false);

  const successRate = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const scaledScore = estimateScaledScore(score, maxScore);
  const nclc = getNclc(skill, scaledScore);
  const cefr = getCefrLevel(nclc);
  const incorrect = maxScore - score;
  const minutes = Math.floor(timeUsedSeconds / 60);
  const seconds = timeUsedSeconds % 60;

  const level = successRate >= 70 ? "good" : successRate >= 40 ? "medium" : "low";
  const subtitle =
    level === "good" ? "Excellent travail !" : level === "medium" ? "Tu progresses, continue." : "Il faut plus de pratique.";
  const levelColor =
    level === "good" ? "var(--co)" : level === "medium" ? "oklch(0.7 0.15 85)" : "oklch(0.6 0.22 25)";

  return (
    <div className="mt-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-500/15">
          <Trophy className="h-8 w-8 text-amber-500" />
        </span>
        <h2 className="mt-3 text-2xl font-bold">Test terminé !</h2>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Award className="h-4 w-4" /> {subtitle}
        </p>
      </div>

      <div
        className="mt-6 overflow-hidden rounded-2xl p-6 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${levelColor}, color-mix(in oklch, ${levelColor} 70%, black))` }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
          <Gauge className="h-3.5 w-3.5" /> Votre niveau
        </span>
        <p className="mt-3 text-5xl font-bold">{cefr}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">Cadre Européen Commun de Référence</p>

        <div className="mt-5 overflow-x-auto rounded-lg bg-white/10">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/20 text-white/70">
                <th className="px-2 py-2">NCLC</th>
                <th className="px-2 py-2">CECR</th>
                <th className="px-2 py-2">{skill.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody>
              {[...NCLC_TABLE].reverse().map((band) => (
                <tr
                  key={band.nclc}
                  className={`border-b border-white/10 ${nclc === band.nclc ? "bg-white/20 font-bold" : ""}`}
                >
                  <td className="px-2 py-1.5">{formatNclc(band.nclc)}</td>
                  <td className="px-2 py-1.5">{getCefrLevel(band.nclc)}</td>
                  <td className="px-2 py-1.5">{band[skill][0]}-{band[skill][1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card-shell p-4 text-center">
          <Target className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-2 text-lg font-bold">{score}/{maxScore}</p>
          <p className="text-xs text-muted-foreground">Questions correctes</p>
        </div>
        <div className="card-shell p-4 text-center">
          <Award className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-2 text-lg font-bold">{scaledScore}/699</p>
          <p className="text-xs text-muted-foreground">Points estimés</p>
        </div>
        <div className="card-shell p-4 text-center">
          <Clock className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-2 text-lg font-bold">{minutes} min {seconds.toString().padStart(2, "0")} s</p>
          <p className="text-xs text-muted-foreground">Temps utilisé</p>
        </div>
        <div className="card-shell p-4 text-center">
          <Gauge className="mx-auto h-4 w-4 text-primary" />
          <p className="mt-2 text-lg font-bold">{successRate}%</p>
          <p className="text-xs text-muted-foreground">Taux de réussite</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card-shell p-5">
          <p className="text-sm font-semibold">Précision des réponses</p>
          <div className="mt-3 flex items-center gap-4">
            <div
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-sm font-bold"
              style={{ background: `conic-gradient(var(--co) ${successRate}%, var(--muted) 0)` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-card">{successRate}%</span>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-green-500">{score} correctes</span>
              <span className="text-red-500">{incorrect} incorrectes</span>
            </div>
          </div>
        </div>
        <div className="card-shell p-5">
          <p className="text-sm font-semibold">Score détaillé</p>
          <div className="mt-3 space-y-2 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Points estimés</span><span>{scaledScore}/699</span></div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (scaledScore / 699) * 100)}%` }} />
            </div>
            <div className="flex justify-between"><span>Questions répondues</span><span>{questions.filter((q) => q.selectedIndex !== undefined).length}/{maxScore}</span></div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowCorrections((v) => !v)}
        className="btn-primary mt-6 w-full"
      >
        {showCorrections ? "Masquer les corrections" : "Voir les corrections"}
      </button>

      {showCorrections && (
        <div className="mt-6 space-y-4">
          {questions.map((q) => {
            const isCorrect = q.selectedIndex === q.correctIndex;
            const options = q.options ?? ["A", "B", "C", "D"];
            return (
              <div key={q.number} className="card-shell p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Question {q.number} — {isCorrect ? "Correcte" : "Incorrecte"}
                </p>
                <div className="mt-3 space-y-2">
                  {options.map((option, index) => {
                    const isRightAnswer = index === q.correctIndex;
                    const isUserPick = index === q.selectedIndex;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm ${
                          isRightAnswer
                            ? "border-green-500/60 bg-green-500/10"
                            : isUserPick
                              ? "border-red-500/60 bg-red-500/10"
                              : "border-border"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-current text-xs font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          {option}
                        </span>
                        {isRightAnswer && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />}
                        {!isRightAnswer && isUserPick && <XCircle className="h-4 w-4 shrink-0 text-red-500" />}
                      </div>
                    );
                  })}
                </div>
                {!isCorrect && (
                  <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-xs text-red-500">
                    {q.selectedIndex === undefined
                      ? "Vous n'avez pas répondu."
                      : "Incorrect."} La bonne réponse est {String.fromCharCode(65 + q.correctIndex)}.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
