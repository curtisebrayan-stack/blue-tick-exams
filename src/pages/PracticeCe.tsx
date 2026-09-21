import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Save, Maximize, BookOpen, Clock } from "lucide-react";
import { getPracticeExercise, type PracticeExercise } from "@/lib/practiceExercises";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import { ExamResults } from "@/components/ExamResults";
import { useExamIntegrity } from "@/lib/examIntegrity";
import NotFound from "./NotFound";

const TIME_BUDGET_SECONDS = 360;

export default function PracticeCe() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [exercise, setExercise] = useState<PracticeExercise | null | undefined>(undefined);

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags } = useExamIntegrity();

  useEffect(() => {
    if (!slug) {
      setExercise(null);
      return;
    }
    let cancelled = false;
    getPracticeExercise("ce", slug).then((result) => {
      if (!cancelled) setExercise(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  if (exercise === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!exercise) return <NotFound />;

  const locked = !exercise.isFree && !isPremium && !isAdmin;
  const blocked = !user || locked;

  const score = exercise.questions.reduce(
    (total, q, i) => (answers[i] === q.correctIndex ? total + 1 : total),
    0,
  );
  const allAnswered = exercise.questions.every((_, i) => answers[i] !== undefined);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!user) return;
    setSaveState("saving");
    const { error } = await supabase.from("practice_results").insert({
      user_id: user.id,
      email: user.email,
      skill: exercise.skill,
      topic_slug: exercise.slug,
      score,
      max_score: exercise.questions.length,
      integrity_flags: { ...baseFlags(), slowAnswers: elapsedSeconds > TIME_BUDGET_SECONDS ? 1 : 0 },
    });
    setSaveState(error ? "error" : "saved");
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24" onContextMenu={preventContextMenu}>
      <Seo title={exercise.title} description={`Sujet pratique de compréhension écrite TCF Canada : ${exercise.title}.`} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/comprehension-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!blocked && !submitted && !fullscreenActive && (
          <button type="button" onClick={enterFullscreen} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
            <Maximize className="h-3.5 w-3.5" /> Mode examen (plein écran)
          </button>
        )}
      </div>

      <div
        className="mt-6 flex items-center justify-between rounded-2xl p-5 text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--ce) 30%, var(--secondary)), color-mix(in oklch, var(--primary) 30%, var(--secondary)))" }}
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-foreground/10">
            <BookOpen className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground/70">Compréhension écrite</p>
            <p className="font-display text-lg font-bold">{exercise.title}</p>
          </div>
        </div>
        {!blocked && !submitted && (
          <span className={`flex shrink-0 items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5 font-mono text-xs font-bold ${elapsedSeconds > TIME_BUDGET_SECONDS ? "text-amber-300" : ""}`}>
            <Clock className="h-3.5 w-3.5" />
            {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
          </span>
        )}
      </div>

      {!user ? (
        <AuthRequired title={exercise.title} />
      ) : locked ? (
        <PremiumUpsell title={exercise.title} />
      ) : (
        <>
      <div className="card-shell mt-8 whitespace-pre-line p-6 text-sm leading-relaxed">
        {exercise.text}
      </div>

      <div className="mt-8 space-y-6">
        {exercise.questions.map((q, i) => (
          <fieldset key={i} className="card-shell p-5">
            <legend className="px-1 text-sm font-semibold">{i + 1}. {q.question}</legend>
            <div className="mt-3 space-y-2">
              {q.options.map((option, realIndex) => {
                const isSelected = answers[i] === realIndex;
                const isCorrect = realIndex === q.correctIndex;
                const showFeedback = submitted;
                return (
                  <label
                    key={realIndex}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                      showFeedback && isCorrect
                        ? "border-green-500/60 bg-green-500/10"
                        : showFeedback && isSelected && !isCorrect
                          ? "border-red-500/60 bg-red-500/10"
                          : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      disabled={submitted}
                      checked={isSelected}
                      onChange={() => setAnswers((prev) => ({ ...prev, [i]: realIndex }))}
                    />
                    <span className="font-bold">{String.fromCharCode(65 + realIndex)}.</span> {option}
                    {showFeedback && isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
                    {showFeedback && isSelected && !isCorrect && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={handleSubmit}
          className="btn-primary mt-8 disabled:opacity-50"
        >
          Valider mes réponses
        </button>
      ) : (
        <>
          <div className="mt-8 card-shell p-6">
            <p className="text-2xl font-bold">{score} / {exercise.questions.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {score === exercise.questions.length
                ? "Excellent, toutes les réponses sont correctes !"
                : "Relis les questions en rouge pour comprendre ton erreur."}
            </p>
            {user ? (
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Save className="h-3.5 w-3.5" />
                {saveState === "saving" && "Sauvegarde en cours..."}
                {saveState === "saved" && "Résultat sauvegardé dans ton profil."}
                {saveState === "error" && "Erreur de sauvegarde — réessaie plus tard."}
              </p>
            ) : (
              <p className="mt-3 text-xs text-muted-foreground">
                <Link to="/connexion" className="font-semibold text-primary hover:underline">Connecte-toi</Link> pour sauvegarder ta progression.
              </p>
            )}
          </div>

          <ExamResults
            skill="ce"
            score={score}
            maxScore={exercise.questions.length}
            timeUsedSeconds={elapsedSeconds}
            questions={exercise.questions.map((q, i) => ({
              number: i + 1,
              options: q.options,
              correctIndex: q.correctIndex,
              selectedIndex: answers[i],
            }))}
          />
        </>
      )}
        </>
      )}
    </section>
  );
}
