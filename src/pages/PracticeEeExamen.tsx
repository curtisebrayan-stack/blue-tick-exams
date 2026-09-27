import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, ChevronDown, CheckCircle2, Type, Sparkles, ThumbsUp, AlertCircle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { getRandomSujet, type EeSessionSujet } from "@/lib/eeSessions";
import { AuthRequired } from "@/components/AuthRequired";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import NotFound from "./NotFound";

type Mode = "complet" | "tache-1" | "tache-2" | "tache-3";

const MODE_TACHES: Record<Mode, (1 | 2 | 3)[]> = {
  complet: [1, 2, 3],
  "tache-1": [1],
  "tache-2": [2],
  "tache-3": [3],
};

const MODE_DURATIONS: Record<Mode, number> = {
  complet: 60 * 60,
  "tache-1": 12 * 60,
  "tache-2": 18 * 60,
  "tache-3": 30 * 60,
};

const WORD_TARGETS: Record<1 | 2 | 3, string> = {
  1: "60-120 mots",
  2: "120-150 mots",
  3: "120-180 mots",
};

type Correction = {
  score: number;
  strengths: string[];
  improvements: string[];
  corrected_text: string;
  comment: string;
};

const ACCENTS = ["é", "è", "ê", "ë", "à", "â", "ù", "û", "ô", "ö", "î", "ï", "ÿ", "ç", "œ", "æ"];
const MAJUSCULES = ["É", "È", "À", "Ç", "Ô", "Û"];
const PONCTUATION = ["«", "»", "—", "…", "’", "“", "”"];

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeEeExamen() {
  const { mode: modeParam } = useParams<{ mode: string }>();
  const { user, isPremium, isAdmin } = useAuth();

  const mode = (modeParam ?? "") as Mode;
  const isValidMode = mode in MODE_TACHES;
  const taches = useMemo(() => (isValidMode ? MODE_TACHES[mode] : []), [isValidMode, mode]);

  const [sujets, setSujets] = useState<Partial<Record<1 | 2 | 3, { sessionLabel: string; sujet: EeSessionSujet }>> | null>(null);
  const [tacheIndex, setTacheIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<1 | 2 | 3, string>>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [showConsigne, setShowConsigne] = useState(true);
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [correcting, setCorrecting] = useState(false);
  const [corrections, setCorrections] = useState<Partial<Record<1 | 2 | 3, Correction>>>({});
  const [correctionErrors, setCorrectionErrors] = useState<Partial<Record<1 | 2 | 3, string>>>({});

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!isValidMode) return;
    let cancelled = false;
    Promise.all(taches.map((t) => getRandomSujet(t))).then((results) => {
      if (cancelled) return;
      const map: Partial<Record<1 | 2 | 3, { sessionLabel: string; sujet: EeSessionSujet }>> = {};
      taches.forEach((t, i) => {
        const r = results[i];
        if (r) map[t] = r;
      });
      setSujets(map);
      setSecondsLeft(MODE_DURATIONS[mode]);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isValidMode]);

  const handleFinish = async () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    if (!user || !sujets) return;
    setSaveState("saving");
    const submissionIds: Partial<Record<1 | 2 | 3, string>> = {};
    try {
      for (const t of taches) {
        const content = answers[t] ?? "";
        if (!content.trim()) continue;
        const { data, error } = await supabase
          .from("writing_submissions")
          .insert({
            user_id: user.id,
            email: user.email,
            skill: "ee",
            topic_slug: `examen-${mode}-tache-${t}`,
            content,
            word_count: countWords(content),
            integrity_flags: { mode, tache: t, sessionLabel: sujets[t]?.sessionLabel },
          })
          .select("id")
          .single();
        if (!error && data) submissionIds[t] = data.id;
      }
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }

    setCorrecting(true);
    await Promise.all(
      taches.map(async (t) => {
        const content = answers[t] ?? "";
        const sujet = sujets[t];
        if (!content.trim() || !sujet) return;
        const { data, error } = await supabase.functions.invoke("correct-ee", {
          body: { tache: t, consigne: sujet.sujet.consigne, text: content, submissionId: submissionIds[t] },
        });
        if (error || !data?.correction) {
          setCorrectionErrors((prev) => ({ ...prev, [t]: data?.error ?? "La correction a échoué pour cette tâche." }));
          return;
        }
        setCorrections((prev) => ({ ...prev, [t]: data.correction }));
      }),
    );
    setCorrecting(false);
  };

  useEffect(() => {
    if (!sujets || finished) return;
    if (secondsLeft <= 0) {
      void handleFinish();
      return;
    }
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sujets, finished, secondsLeft]);

  if (!isValidMode) return <NotFound />;

  const locked = !isPremium && !isAdmin;
  if (!user) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Seo title="Simulation d'expression écrite" description="Entraîne-toi en conditions d'examen." />
        <Link to="/expression-ecrite/examen" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <AuthRequired title="la simulation d'examen" />
      </section>
    );
  }
  if (locked) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Seo title="Simulation d'expression écrite" description="Entraîne-toi en conditions d'examen." />
        <Link to="/expression-ecrite/examen" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <PremiumUpsell title="la simulation d'examen" />
      </section>
    );
  }

  if (!sujets) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Préparation de l'examen...</div>;
  }

  if (finished) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Seo title="Résultat — Expression écrite" description="Résultat de ta simulation d'expression écrite." />
        <div className="card-shell p-8 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Examen terminé</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {saveState === "saving" && "Sauvegarde en cours..."}
            {saveState === "saved" && "Tes réponses sont sauvegardées dans ton profil."}
            {saveState === "error" && "Erreur de sauvegarde — tes réponses restent visibles ci-dessous."}
          </p>
          {correcting && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" /> Correction par IA en cours...
            </p>
          )}
          <div className="mt-6 space-y-5 text-left">
            {taches.map((t) => {
              const correction = corrections[t];
              const correctionError = correctionErrors[t];
              return (
                <div key={t} className="card-shell overflow-hidden">
                  <div className="border-b border-border p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Tâche {t} — {countWords(answers[t] ?? "")} mots</p>
                    <p className="mt-2 whitespace-pre-line text-sm">{answers[t] || <span className="italic text-muted-foreground">Aucune réponse rédigée.</span>}</p>
                  </div>
                  {correction && (
                    <div className="space-y-4 bg-primary/5 p-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="font-display text-lg font-bold">{correction.score}/20</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{correction.comment}</p>
                      {correction.strengths?.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-green-600">
                            <ThumbsUp className="h-3.5 w-3.5" /> Points forts
                          </p>
                          <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                            {correction.strengths.map((s, i) => <li key={i}>• {s}</li>)}
                          </ul>
                        </div>
                      )}
                      {correction.improvements?.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-600">
                            <AlertCircle className="h-3.5 w-3.5" /> À améliorer
                          </p>
                          <ul className="mt-1.5 space-y-1 text-sm text-muted-foreground">
                            {correction.improvements.map((s, i) => <li key={i}>• {s}</li>)}
                          </ul>
                        </div>
                      )}
                      {correction.corrected_text && (
                        <details>
                          <summary className="cursor-pointer text-xs font-semibold text-primary">Voir le texte corrigé</summary>
                          <p className="mt-2 whitespace-pre-line rounded-lg bg-background p-3 text-sm">{correction.corrected_text}</p>
                        </details>
                      )}
                    </div>
                  )}
                  {correctionError && !correction && (
                    <p className="flex items-center gap-1.5 bg-red-500/5 p-4 text-xs text-red-500">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {correctionError}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <Link to="/expression-ecrite" className="btn-primary mt-6 inline-flex">Retour à l'épreuve</Link>
        </div>
      </section>
    );
  }

  const currentTache = taches[tacheIndex];
  const current = sujets[currentTache];
  const isLastTache = tacheIndex === taches.length - 1;

  const insertChar = (char: string) => {
    const textarea = textareaRef.current;
    const value = answers[currentTache] ?? "";
    if (!textarea) {
      setAnswers((prev) => ({ ...prev, [currentTache]: value + char }));
      return;
    }
    const start = textarea.selectionStart ?? value.length;
    const end = textarea.selectionEnd ?? value.length;
    const next = value.slice(0, start) + char + value.slice(end);
    setAnswers((prev) => ({ ...prev, [currentTache]: next }));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    });
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <Seo title="Simulation d'expression écrite" description="Entraîne-toi en conditions d'examen : chronomètre, clavier à accents, sans correction automatique." />

      <div className="card-shell overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary p-4 text-secondary-foreground">
          <p className="font-display text-base font-bold">Expression écrite — TCF Canada</p>
          <div className={`flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5 text-sm font-bold ${secondsLeft <= 300 ? "text-amber-300" : ""}`}>
            <Clock className="h-4 w-4" /> {formatTime(secondsLeft)}
          </div>
        </div>

        {taches.length > 1 && (
          <div className="flex border-b border-border">
            {taches.map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setTacheIndex(i)}
                className={`flex-1 border-b-2 py-3 text-sm font-semibold transition ${
                  i === tacheIndex ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Tâche {t}
              </button>
            ))}
          </div>
        )}

        <div className="grid gap-0 md:grid-cols-2">
          <div className="border-b border-border p-5 md:border-b-0 md:border-r">
            <div className="flex items-center justify-between">
              <p className="font-display text-base font-bold">Tâche {currentTache}</p>
              <span className="chip">{WORD_TARGETS[currentTache]}</span>
            </div>
            {showConsigne && current && (
              <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">{current.sujet.consigne}</p>
            )}
            <button
              type="button"
              onClick={() => setShowConsigne((v) => !v)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
            >
              <ChevronDown className={`h-3.5 w-3.5 transition ${showConsigne ? "rotate-180" : ""}`} />
              {showConsigne ? "Masquer la consigne" : "Afficher la consigne"}
            </button>
          </div>

          <div className="p-5">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Type className="h-3.5 w-3.5" /> Caractères spéciaux
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex flex-wrap gap-1">
                {ACCENTS.map((c) => (
                  <button key={c} type="button" onClick={() => insertChar(c)} className="grid h-7 w-7 place-items-center rounded border border-border text-sm hover:bg-muted">
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {MAJUSCULES.map((c) => (
                  <button key={c} type="button" onClick={() => insertChar(c)} className="grid h-7 w-7 place-items-center rounded border border-border text-sm hover:bg-muted">
                    {c}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {PONCTUATION.map((c, i) => (
                  <button key={`${c}-${i}`} type="button" onClick={() => insertChar(c)} className="grid h-7 w-7 place-items-center rounded border border-border text-sm hover:bg-muted">
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={answers[currentTache] ?? ""}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [currentTache]: e.target.value }))}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              rows={10}
              placeholder="Rédigez votre réponse ici... Pensez à la structure, au registre et au nombre de mots attendu."
              className="mt-4 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{countWords(answers[currentTache] ?? "")} mot{countWords(answers[currentTache] ?? "") !== 1 ? "s" : ""}</span>
              <span>Objectif : {WORD_TARGETS[currentTache]}</span>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {!isLastTache ? (
                <button type="button" onClick={() => setTacheIndex((i) => i + 1)} className="btn-outline">
                  Tâche suivante →
                </button>
              ) : (
                <button type="button" onClick={() => void handleFinish()} className="btn-primary">
                  Terminer et corriger
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
