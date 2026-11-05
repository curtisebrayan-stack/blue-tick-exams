import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  Mic,
  RotateCcw,
  Square,
  Timer,
} from "lucide-react";
import { AuthRequired } from "@/components/AuthRequired";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { getEoSession, type EoSession, type EoSessionSujet } from "@/lib/eoSessions";
import { useExamIntegrity } from "@/lib/examIntegrity";
import { supabase } from "@/lib/supabase";
import NotFound from "./NotFound";

type TaskNumber = 1 | 2 | 3;
type RunState = "ready" | "preparing" | "recording" | "recorded" | "complete";
type SaveState = "idle" | "saving" | "saved" | "error";

const TASK_DETAILS: Record<TaskNumber, { title: string; duration: number; prep: number }> = {
  1: { title: "Entretien dirigé", duration: 120, prep: 0 },
  2: { title: "Exercice interactif", duration: 210, prep: 120 },
  3: { title: "Expression d’un point de vue", duration: 270, prep: 0 },
};

const TASK_ONE_QUESTIONS = [
  "Pouvez-vous vous présenter et parler de votre parcours ?",
  "Qu’aimez-vous faire pendant votre temps libre ?",
  "Parlez-moi d’une expérience récente qui vous a marqué.",
];

const SELF_CHECK = [
  "J’ai répondu clairement à la consigne et respecté le temps.",
  "J’ai développé mes idées avec des détails ou des exemples.",
  "Mon débit était compréhensible et mes phrases étaient bien articulées.",
];

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function getTaskSubject(session: EoSession, task: TaskNumber): EoSessionSujet | undefined {
  if (task === 2) return session.tache2[0];
  if (task === 3) return session.tache3[0];
  return undefined;
}

export default function PracticeEoExam() {
  const { slug, task: taskParam } = useParams<{ slug: string; task?: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const { baseFlags } = useExamIntegrity();
  const [session, setSession] = useState<EoSession | null | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  const [taskNumber, setTaskNumber] = useState<TaskNumber>(1);
  const [runState, setRunState] = useState<RunState>("ready");
  const [secondsLeft, setSecondsLeft] = useState(TASK_DETAILS[1].duration);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const cancelledRef = useRef(false);
  const taskIsSelected = taskParam === "1" || taskParam === "2" || taskParam === "3";
  const isFullExam = !taskIsSelected;

  useEffect(() => {
    cancelledRef.current = false;
    if (!slug) {
      setSession(null);
      return;
    }

    let cancelled = false;
    getEoSession(slug)
      .then((result) => {
        if (!cancelled) setSession(result ?? null);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger la session de l’examen oral.", error);
        if (!cancelled) setLoadError(true);
      });

    return () => {
      cancelled = true;
      cancelledRef.current = true;
    };
  }, [slug]);

  useEffect(() => {
    if (taskIsSelected && taskParam) {
      const selectedTask = Number(taskParam) as TaskNumber;
      setTaskNumber(selectedTask);
      setSecondsLeft(selectedTask === 2 ? TASK_DETAILS[2].prep : TASK_DETAILS[selectedTask].duration);
    }
  }, [taskIsSelected, taskParam]);

  useEffect(() => {
    if (runState !== "preparing" && runState !== "recording") return;
    const timer = window.setInterval(() => {
      setSecondsLeft((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [runState]);

  useEffect(() => {
    if (secondsLeft !== 0) return;
    if (runState === "preparing") {
      setRunState("ready");
      setErrorMessage("Préparation terminée. Tu peux commencer à enregistrer ton échange.");
    } else if (runState === "recording" && recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, [runState, secondsLeft]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  if (loadError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16">
        <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Impossible de charger cette session. Réessaie dans quelques instants.
        </p>
      </section>
    );
  }
  if (session === undefined) {
    return <p role="status" className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement de la session…</p>;
  }
  if (!session) return <NotFound />;
  if (taskParam !== undefined && !taskIsSelected) return <NotFound />;

  const locked = !session.isFree && !isPremium && !isAdmin;
  if (!user || locked) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Seo title={`Simulation EO — ${session.label}`} description={`Simulation d’expression orale TCF Canada, session ${session.label}.`} />
        {!user ? <AuthRequired title={`la simulation EO ${session.label}`} /> : <PremiumUpsell title={`la simulation EO ${session.label}`} />}
      </section>
    );
  }

  const currentTask = TASK_DETAILS[taskNumber];
  const currentSubject = getTaskSubject(session, taskNumber);
  const missingSubject = taskNumber !== 1 && !currentSubject;
  const isLastStep = taskIsSelected || taskNumber === 3;

  const startPreparation = () => {
    setErrorMessage(null);
    setSecondsLeft(TASK_DETAILS[2].prep);
    setRunState("preparing");
  };

  const saveRecording = async (blob: Blob) => {
    if (!user || !session) return;
    setSaveState("saving");
    const subjectNumber = currentSubject?.number ?? 1;
    const path = `${user.id}/${session.slug}-tache-${taskNumber}-sujet-${subjectNumber}-${Date.now()}.webm`;

    try {
      const { error: uploadError } = await supabase.storage.from("eo-recordings").upload(path, blob, {
        contentType: "audio/webm",
      });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("speaking_submissions").insert({
        user_id: user.id,
        email: user.email,
        skill: "eo",
        topic_slug: `session-${session.slug}-tache-${taskNumber}-sujet-${subjectNumber}`,
        storage_path: path,
        integrity_flags: baseFlags(),
      });
      if (insertError) throw insertError;
      if (!cancelledRef.current) setSaveState("saved");
    } catch (error) {
      console.error("Impossible de sauvegarder l’enregistrement de cette tâche.", error);
      if (!cancelledRef.current) {
        setSaveState("error");
        setErrorMessage("L’enregistrement est disponible pour réécoute, mais n’a pas pu être sauvegardé dans ton profil.");
      }
    }
  };

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = url;
        streamRef.current?.getTracks().forEach((track) => track.stop());
        if (!cancelledRef.current) {
          setAudioUrl(url);
          setRunState("recorded");
        }
        void saveRecording(blob);
      };
      recorder.start();
      setSecondsLeft(currentTask.duration);
      setRunState("recording");
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      console.error("Impossible de démarrer le microphone.", error);
      setErrorMessage("Impossible d’accéder au micro. Vérifie son autorisation dans ton navigateur, puis réessaie.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  };

  const advanceTask = () => {
    if (taskIsSelected) {
      setRunState("complete");
      return;
    }
    if (taskNumber === 3) {
      setRunState("complete");
      return;
    }
    const nextTask = (taskNumber + 1) as TaskNumber;
    setTaskNumber(nextTask);
    setRunState("ready");
    setSaveState("idle");
    setErrorMessage(null);
    setSecondsLeft(TASK_DETAILS[nextTask].duration);
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
    if (nextTask === 2) {
      setSecondsLeft(TASK_DETAILS[2].prep);
      setRunState("preparing");
    }
  };

  const retryCurrentTask = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
    setSaveState("idle");
    setErrorMessage(null);
    if (taskNumber === 2) startPreparation();
    else {
      setSecondsLeft(currentTask.duration);
      setRunState("ready");
    }
  };

  const backToSession = `/expression-orale/sessions/${session.slug}`;

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:py-16">
      <Seo
        title={`${isFullExam ? "Examen complet EO" : `Tâche ${taskNumber}`} — ${session.label}`}
        description="Simulation d’expression orale TCF Canada avec enregistrement et auto-évaluation."
      />
      <Link to={backToSession} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à la session {session.label}
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="chip">Simulation EO · {session.label}</span>
          <h1 className="mt-3 text-2xl font-bold sm:text-4xl">
            {isFullExam ? "Examen complet" : currentTask.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isFullExam ? "Les trois tâches à la suite, comme le jour de l’examen." : `Entraînement ciblé · tâche ${taskNumber} sur 3.`}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-sm font-semibold">
          <Clock className="h-4 w-4 text-primary" /> {isFullExam ? "≈ 12 minutes" : `${Math.floor((currentTask.duration + currentTask.prep) / 60)} min ${String((currentTask.duration + currentTask.prep) % 60).padStart(2, "0")}`}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2" aria-label="Progression de l’examen">
        {([1, 2, 3] as TaskNumber[]).map((number) => (
          <div
            key={number}
            className={`rounded-xl border p-3 text-center text-xs font-semibold sm:p-4 sm:text-sm ${
              number === taskNumber ? "border-primary bg-primary/10 text-foreground" : isFullExam && number < taskNumber ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400" : "border-border text-muted-foreground"
            }`}
          >
            <span className="block text-lg font-bold">{isFullExam && number < taskNumber ? <Check className="mx-auto h-5 w-5" /> : `0${number}`}</span>
            <span>{TASK_DETAILS[number].title}</span>
          </div>
        ))}
      </div>

      {runState === "complete" ? (
        <div className="card-shell mt-8 p-6 sm:p-8">
          <span className="chip"><CheckCircle2 className="h-3.5 w-3.5" /> Simulation terminée</span>
          <h2 className="mt-4 font-display text-2xl font-bold">
            {isFullExam ? "Bravo, tu as terminé les trois tâches." : `Bravo, tu as terminé la tâche ${taskNumber}.`}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Réécoute ton enregistrement depuis ton profil et évalue ta clarté, ton vocabulaire et le développement de tes idées. Cette simulation ne produit pas de note automatique.
          </p>
          <ul className="mt-5 space-y-3">
            {SELF_CHECK.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/profil" className="btn-primary">Voir mes enregistrements</Link>
            <Link to="/expression-orale/sessions" className="btn-outline">Choisir une autre session</Link>
          </div>
        </div>
      ) : (
        <div className="card-shell mt-8 overflow-hidden">
          <div className="border-b border-border bg-muted/40 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="chip">Tâche {taskNumber} · {currentTask.title}</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Timer className="h-4 w-4" />
                {taskNumber === 2 ? "5 min 30 · 2 min de préparation + 3 min 30 d’échange" : `${currentTask.duration / 60} min · sans préparation`}
              </span>
            </div>
            {taskNumber === 1 ? (
              <>
                <h2 className="mt-5 font-display text-xl font-bold">Parle de toi et de ton quotidien</h2>
                <p className="mt-2 text-sm text-muted-foreground">L’examinateur te pose des questions personnelles. Réponds spontanément et développe tes réponses.</p>
                <ul className="mt-5 space-y-2">
                  {TASK_ONE_QUESTIONS.map((question) => (
                    <li key={question} className="flex gap-2 text-sm">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /> {question}
                    </li>
                  ))}
                </ul>
              </>
            ) : !currentSubject ? (
              <p role="alert" className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                Aucun sujet n’est disponible pour la tâche {taskNumber} dans cette session. Choisis une autre session pour continuer.
              </p>
            ) : (
              <>
                <h2 className="mt-5 font-display text-xl font-bold">Consigne · sujet {currentSubject.number}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{currentSubject.consigne}</p>
                {taskNumber === 2 && currentSubject.questions && currentSubject.questions.length > 0 && (
                  <div className="mt-5 rounded-xl border border-border bg-background/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Exemples de questions à poser</p>
                    <ol className="mt-3 space-y-2 text-sm">
                      {currentSubject.questions.map((question, index) => (
                        <li key={`${index}-${question}`} className="flex gap-2">
                          <span className="font-semibold text-primary">{index + 1}.</span> {question}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-5 sm:p-7">
            {runState === "preparing" && (
              <div role="status" className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Temps de préparation</p>
                <p className="mt-3 font-mono text-5xl font-bold tabular-nums text-primary">{formatTime(secondsLeft)}</p>
                <p className="mt-3 text-sm text-muted-foreground">Prépare tes questions. L’enregistrement commencera après le compte à rebours.</p>
              </div>
            )}

            {runState === "ready" && !missingSubject && (
              taskNumber === 2 && secondsLeft === TASK_DETAILS[2].prep ? (
                <button type="button" onClick={startPreparation} className="btn-primary w-full justify-center">
                  <Timer className="h-4 w-4" /> Lancer les 2 minutes de préparation
                </button>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Durée maximale de réponse : {Math.floor(currentTask.duration / 60)} min {String(currentTask.duration % 60).padStart(2, "0")}.
                  </p>
                  <button type="button" onClick={() => void startRecording()} className="btn-primary">
                    <Mic className="h-4 w-4" /> Commencer l’enregistrement
                  </button>
                </div>
              )
            )}

            {runState === "recording" && (
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="font-mono text-5xl font-bold tabular-nums text-primary">{formatTime(secondsLeft)}</p>
                <p className="flex items-center gap-2 text-sm text-red-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Enregistrement en cours
                </p>
                <button type="button" onClick={stopRecording} className="btn-outline">
                  <Square className="h-4 w-4" /> Terminer ma réponse
                </button>
              </div>
            )}

            {runState === "recorded" && audioUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileCheck2 className="h-4 w-4 text-primary" /> Ta réponse est enregistrée
                </div>
                <audio controls src={audioUrl} className="w-full" />
                <p role={saveState === "error" ? "alert" : "status"} className={`text-xs ${saveState === "error" ? "text-red-400" : "text-muted-foreground"}`}>
                  {saveState === "saving" && "Sauvegarde dans ton profil…"}
                  {saveState === "saved" && "Enregistrement sauvegardé dans ton profil."}
                  {saveState === "error" && errorMessage}
                </p>
                {taskNumber === 3 && currentSubject?.reponse && (
                  <details className="rounded-xl border border-border p-4">
                    <summary className="cursor-pointer text-sm font-semibold text-primary">Voir une proposition de réponse</summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{currentSubject.reponse}</p>
                  </details>
                )}
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={retryCurrentTask} className="btn-outline">
                    <RotateCcw className="h-4 w-4" /> Recommencer cette tâche
                  </button>
                  {isLastStep ? (
                    <button type="button" onClick={advanceTask} className="btn-primary">
                      Terminer la simulation <CheckCircle2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={advanceTask} className="btn-primary">
                      Tâche suivante <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {errorMessage && runState !== "recorded" && (
              <p role="alert" className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{errorMessage}</p>
            )}
          </div>
        </div>
      )}

      {!isFullExam && runState !== "complete" && !missingSubject && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Mode entraînement : cette réponse est enregistrée pour réécoute, sans correction automatique.
        </p>
      )}
    </section>
  );
}
