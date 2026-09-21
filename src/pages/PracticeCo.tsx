import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Volume2, CheckCircle2, XCircle, Save, AlertTriangle, Maximize } from "lucide-react";
import { getListeningExercise, CO_FREE_SLUG } from "@/lib/listeningExercises";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import { ExamResults } from "@/components/ExamResults";
import { useExamIntegrity } from "@/lib/examIntegrity";
import NotFound from "./NotFound";

const MAX_PLAYS = 2;
const TIME_BUDGET_SECONDS = 240;

export default function PracticeCo() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const exercise = slug ? getListeningExercise("co", slug) : undefined;

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playCount, setPlayCount] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags } = useExamIntegrity();

  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!speechSupported) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  useEffect(() => {
    if (speechSupported) window.speechSynthesis.cancel();
    setPlayCount(0);
    setIsSpeaking(false);
    setAnswers({});
    setSubmitted(false);
    setSaveState("idle");
    setElapsedSeconds(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!exercise) return <NotFound />;

  const locked = exercise.slug !== CO_FREE_SLUG && !isPremium && !isAdmin;
  const blocked = !user || locked;

  const frenchVoice = voices.find((v) => v.lang.toLowerCase().startsWith("fr"));

  const play = () => {
    if (!speechSupported || playCount >= MAX_PLAYS) return;
    const utterance = new SpeechSynthesisUtterance(exercise.transcript);
    utterance.lang = "fr-FR";
    if (frenchVoice) utterance.voice = frenchVoice;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlayCount((c) => c + 1);
  };

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
      <Seo title={exercise.title} description={`Sujet pratique de compréhension orale TCF Canada : ${exercise.title}.`} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/comprehension-orale" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!blocked && !submitted && !fullscreenActive && (
          <button type="button" onClick={enterFullscreen} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
            <Maximize className="h-3.5 w-3.5" /> Mode examen (plein écran)
          </button>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="chip">Compréhension orale</span>
        {!blocked && !submitted && (
          <span className={`font-mono text-xs ${elapsedSeconds > TIME_BUDGET_SECONDS ? "text-amber-500" : "text-muted-foreground"}`}>
            {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, "0")}
          </span>
        )}
      </div>
      <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{exercise.title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">
        Généré par synthèse vocale du navigateur — pas un enregistrement humain. La qualité de la voix dépend de ton appareil.
      </p>

      {!user ? (
        <AuthRequired title={exercise.title} />
      ) : locked ? (
        <PremiumUpsell title={exercise.title} />
      ) : (
        <>
      {!speechSupported && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-4 text-sm text-red-500">
          <AlertTriangle className="h-4 w-4 shrink-0" /> Ton navigateur ne supporte pas la lecture audio automatique. Essaie avec Chrome ou Edge.
        </p>
      )}
      {speechSupported && !frenchVoice && voices.length > 0 && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-4 text-sm text-amber-500">
          <AlertTriangle className="h-4 w-4 shrink-0" /> Aucune voix française trouvée sur cet appareil : la prononciation peut être approximative.
        </p>
      )}

      <div className="card-shell mt-6 flex flex-col items-center gap-3 p-8 text-center">
        <button
          type="button"
          onClick={play}
          disabled={!speechSupported || isSpeaking || playCount >= MAX_PLAYS}
          className="btn-primary disabled:opacity-50"
        >
          <Volume2 className="h-4 w-4" /> {isSpeaking ? "Lecture en cours..." : "Écouter"}
        </button>
        <p className="text-xs text-muted-foreground">
          {playCount} / {MAX_PLAYS} écoutes utilisées — comme à l'examen, le document n'est diffusé qu'un nombre limité de fois.
        </p>
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

            <details className="mt-5">
              <summary className="cursor-pointer text-sm font-semibold text-primary">Voir la transcription</summary>
              <p className="mt-2 text-sm text-muted-foreground">{exercise.transcript}</p>
            </details>
          </div>

          <ExamResults
            skill="co"
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
