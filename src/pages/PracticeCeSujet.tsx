import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, ArrowRight, Maximize, BookOpen, Clock } from "lucide-react";
import { getCeSujet, type CeSujet } from "@/lib/ceSujets";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import { useExamIntegrity } from "@/lib/examIntegrity";
import { ExamResults } from "@/components/ExamResults";
import { RealExamModeToggle } from "@/components/RealExamModeToggle";
import { buildProgressiveTimeTable } from "@/lib/realExamMode";
import { usePerQuestionTimer } from "@/lib/usePerQuestionTimer";
import NotFound from "./NotFound";

const SLOW_ANSWER_SECONDS = 45;
const TOTAL_DURATION_SECONDS = 60 * 60;

export default function PracticeCeSujet() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [sujet, setSujet] = useState<CeSujet | null | undefined>(undefined);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_DURATION_SECONDS);
  const [finalTimeUsed, setFinalTimeUsed] = useState(0);
  const [realExamMode, setRealExamMode] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags } = useExamIntegrity();
  const slowAnswersRef = useRef(0);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    if (!slug) {
      setSujet(null);
      return;
    }
    let cancelled = false;
    getCeSujet(slug).then((result) => {
      if (!cancelled) setSujet(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    questionStartRef.current = Date.now();
    setImageLoaded(false);
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeTable = useMemo(
    () => buildProgressiveTimeTable(TOTAL_DURATION_SECONDS, sujet?.items.length ?? 0),
    [sujet?.items.length],
  );

  function handleAutoAdvance() {
    if (!sujet) return;
    setCurrentIndex((i) => {
      if (i >= sujet.items.length - 1) {
        void handleFinish();
        return i;
      }
      return i + 1;
    });
  }

  const perQuestionSecondsLeft = usePerQuestionTimer(realExamMode, timeTable, currentIndex, handleAutoAdvance);

  if (sujet === undefined) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!sujet) return <NotFound />;

  const locked = !sujet.isFree && !isPremium && !isAdmin;

  if (!user || locked) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Seo title={sujet.title} description={`Sujet pratique de compréhension écrite TCF Canada : ${sujet.title}.`} />
        <Link to="/comprehension-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!user ? <AuthRequired title={sujet.title} /> : <PremiumUpsell title={sujet.title} />}
      </section>
    );
  }

  const item = sujet.items[currentIndex];

  const score = sujet.items.reduce(
    (total, it) => (answers[it.number] === it.correctIndex ? total + 1 : total),
    0,
  );

  const goTo = (index: number) => {
    if (index < 0 || index >= sujet.items.length) return;
    setCurrentIndex(index);
  };

  const selectAnswer = (realIndex: number) => {
    if (answers[item.number] === undefined) {
      const elapsed = (Date.now() - questionStartRef.current) / 1000;
      if (elapsed > SLOW_ANSWER_SECONDS) slowAnswersRef.current += 1;
    }
    setAnswers((prev) => ({ ...prev, [item.number]: realIndex }));
  };

  const handleFinish = async () => {
    setFinished(true);
    setFinalTimeUsed(TOTAL_DURATION_SECONDS - secondsRemaining);
    if (!user) return;
    setSaveState("saving");
    const { error } = await supabase.from("practice_results").insert({
      user_id: user.id,
      email: user.email,
      skill: "ce",
      topic_slug: sujet.slug,
      score,
      max_score: sujet.items.length,
      integrity_flags: { ...baseFlags(), slowAnswers: slowAnswersRef.current },
    });
    setSaveState(error ? "error" : "saved");
  };

  if (finished) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Seo title={sujet.title} description={`Résultat du ${sujet.title} — Compréhension écrite TCF Canada.`} />
        <Link to="/comprehension-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        <div className="mt-6 card-shell p-6">
          <span className="chip">{sujet.title} — terminé</span>
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

          <div className="mt-6 grid grid-cols-8 gap-2 sm:grid-cols-13">
            {sujet.items.map((it) => {
              const answered = answers[it.number];
              const correct = answered === it.correctIndex;
              return (
                <div
                  key={it.number}
                  className={`grid h-9 place-items-center rounded-lg text-xs font-bold ${
                    correct
                      ? "bg-green-500/15 text-green-500"
                      : answered !== undefined
                        ? "bg-red-500/15 text-red-500"
                        : "bg-muted text-muted-foreground"
                  }`}
                  title={`Question ${it.number}`}
                >
                  {it.number}
                </div>
              );
            })}
          </div>
        </div>

        <ExamResults
          skill="ce"
          score={score}
          maxScore={sujet.items.length}
          timeUsedSeconds={finalTimeUsed}
          questions={sujet.items.map((it) => ({
            number: it.number,
            options: it.options,
            correctIndex: it.correctIndex,
            selectedIndex: answers[it.number],
          }))}
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 pb-28 pt-8 sm:pt-12" onContextMenu={preventContextMenu}>
      <Seo title={sujet.title} description={`Sujet pratique de compréhension écrite TCF Canada : ${sujet.title}, format examen complet (39 questions).`} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/comprehension-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!fullscreenActive && (
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
            <p className="font-display text-lg font-bold uppercase">{sujet.title}</p>
          </div>
        </div>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5 text-xs font-semibold sm:inline-flex">
          ● Examen en cours
        </span>
      </div>

      <div className="mt-4">
        <RealExamModeToggle checked={realExamMode} onChange={setRealExamMode} scope="CE" />
      </div>

      <div className="sticky top-20 z-20 mt-4 flex justify-end gap-2 lg:top-28">
        {realExamMode && (
          <div className={`card-shell flex items-center gap-2 px-4 py-2 shadow-lg ${perQuestionSecondsLeft <= 5 ? "border-amber-500/50" : ""}`}>
            <Clock className={`h-4 w-4 ${perQuestionSecondsLeft <= 5 ? "text-amber-500" : "text-accent"}`} />
            <span className="font-mono text-sm font-bold">
              Question : {Math.floor(perQuestionSecondsLeft / 60)}:{(perQuestionSecondsLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}
        <div className={`card-shell flex items-center gap-2 px-4 py-2 shadow-lg ${secondsRemaining <= 300 ? "border-amber-500/50" : ""}`}>
          <Clock className={`h-4 w-4 ${secondsRemaining <= 300 ? "text-amber-500" : "text-primary"}`} />
          <span className="font-mono text-sm font-bold">
            {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold">Progression</span>
        <span className="text-muted-foreground">{item.number}/{sujet.items.length}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(currentIndex / (sujet.items.length - 1)) * 100}%` }}
        />
      </div>

      <div className="relative mt-6">
        {!imageLoaded && <div className="aspect-[16/9] w-full animate-pulse rounded-2xl bg-muted" />}
        <img
          key={item.number}
          src={item.image}
          alt={`Document question ${item.number}`}
          onLoad={() => setImageLoaded(true)}
          className={`w-full rounded-2xl border border-border object-cover transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "absolute inset-0 opacity-0"
          }`}
        />
      </div>

      <div className="mt-4 rounded-xl border-2 p-4 text-center" style={{ borderColor: "var(--ce)" }}>
        <p className="font-display text-base font-bold">{item.question}</p>
      </div>

      <fieldset className="card-shell mt-6 p-5">
        <legend className="px-1 text-sm font-semibold">Choisissez la bonne réponse</legend>
        <div className="mt-3 space-y-2">
          {item.options.map((option, realIndex) => {
            const isSelected = answers[item.number] === realIndex;
            return (
              <label
                key={realIndex}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  isSelected ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name={`item-${item.number}`}
                  checked={isSelected}
                  onChange={() => selectAnswer(realIndex)}
                />
                <span className="font-bold">{String.fromCharCode(65 + realIndex)}.</span> {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="card-shell mt-8 p-5">
        <p className="text-sm font-semibold">
          Navigation des questions
          {realExamMode && <span className="ml-2 text-xs font-normal text-muted-foreground">(bloquée en mode examen réel)</span>}
        </p>
        <div className="mt-4 grid grid-cols-8 gap-2 sm:grid-cols-13">
          {sujet.items.map((it, i) => (
            <button
              type="button"
              key={it.number}
              onClick={() => goTo(i)}
              disabled={realExamMode}
              className={`grid h-9 place-items-center rounded-lg text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                i === currentIndex
                  ? "bg-accent text-accent-foreground"
                  : answers[it.number] !== undefined
                    ? "bg-primary/15 text-primary"
                    : "border border-border bg-transparent text-muted-foreground hover:bg-muted"
              }`}
            >
              {it.number}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-border" /> Non répondue</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary/40" /> Répondue</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> En cours</span>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <button type="button" onClick={() => goTo(currentIndex - 1)} disabled={currentIndex === 0 || realExamMode} className="btn-outline disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Précédent
          </button>
          <span className="text-sm font-semibold text-muted-foreground">Q {item.number}/{sujet.items.length}</span>
          {currentIndex === sujet.items.length - 1 ? (
            <button type="button" onClick={handleFinish} className="btn-primary">
              Terminer le sujet
            </button>
          ) : (
            <button type="button" onClick={() => goTo(currentIndex + 1)} className="btn-primary">
              Suivant <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
