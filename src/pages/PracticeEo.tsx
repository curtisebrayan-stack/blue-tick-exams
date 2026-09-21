import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mic, Square, RotateCcw, CheckSquare, AlertTriangle, Save, Maximize } from "lucide-react";
import { getSpeakingPrompt, type SpeakingPrompt } from "@/lib/speakingPrompts";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import { useExamIntegrity } from "@/lib/examIntegrity";
import { RealExamModeToggle } from "@/components/RealExamModeToggle";
import NotFound from "./NotFound";

type RecordingState = "idle" | "recording" | "recorded" | "error";
type SaveState = "idle" | "saving" | "saved" | "error";

export default function PracticeEo() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [prompt, setPrompt] = useState<SpeakingPrompt | null | undefined>(undefined);

  const [state, setState] = useState<RecordingState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [realExamMode, setRealExamMode] = useState(false);

  const { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags } = useExamIntegrity();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setPrompt(undefined);
    setState("idle");
    setErrorMessage(null);
    setSaveState("idle");
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (timerRef.current) clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (!slug) {
      setPrompt(null);
      return;
    }
    let cancelled = false;
    getSpeakingPrompt("eo", slug).then((result) => {
      if (cancelled) return;
      setPrompt(result ?? null);
      if (result) setSecondsLeft(result.durationSeconds);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (prompt === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!prompt) return <NotFound />;

  const locked = !prompt.isFree && !isPremium && !isAdmin;
  const blocked = !user || locked;

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const uploadRecording = async (blob: Blob) => {
    if (!user || !prompt) return;
    setSaveState("saving");
    const path = `${user.id}/${prompt.slug}-${Date.now()}.webm`;
    const { error: uploadError } = await supabase.storage.from("eo-recordings").upload(path, blob, {
      contentType: "audio/webm",
    });
    if (uploadError) {
      setSaveState("error");
      return;
    }
    const { error: insertError } = await supabase.from("speaking_submissions").insert({
      user_id: user.id,
      email: user.email,
      skill: prompt.skill,
      topic_slug: prompt.slug,
      storage_path: path,
      integrity_flags: baseFlags(),
    });
    setSaveState(insertError ? "error" : "saved");
  };

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        streamRef.current?.getTracks().forEach((t) => t.stop());
        setState("recorded");
        void uploadRecording(blob);
      };

      recorder.start();
      setState("recording");
      setSecondsLeft(prompt.durationSeconds);
      timerRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            stopRecording();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } catch {
      setState("error");
      setErrorMessage("Impossible d'accéder au micro. Vérifie que tu as autorisé l'accès dans ton navigateur.");
    }
  };

  const reset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setSaveState("idle");
    setSecondsLeft(prompt.durationSeconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24" onContextMenu={preventContextMenu}>
      <Seo title={prompt.title} description={`Sujet pratique d'expression orale TCF Canada : ${prompt.title}.`} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/expression-orale" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!blocked && !fullscreenActive && (
          <button type="button" onClick={enterFullscreen} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
            <Maximize className="h-3.5 w-3.5" /> Mode examen (plein écran)
          </button>
        )}
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-2xl p-5 text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--eo) 30%, var(--secondary)), color-mix(in oklch, var(--primary) 30%, var(--secondary)))" }}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-foreground/10">
          <Mic className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground/70">Expression orale</p>
          <p className="font-display text-lg font-bold">{prompt.title}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{prompt.instructions}</p>

      {!user ? (
        <AuthRequired title={prompt.title} />
      ) : locked ? (
        <PremiumUpsell title={prompt.title} />
      ) : (
        <>
      <div className="card-shell mt-6 p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Questions</p>
        <ul className="mt-3 space-y-2">
          {prompt.promptLines.map((line) => (
            <li key={line} className="flex gap-2 text-sm">
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {line}
            </li>
          ))}
        </ul>
      </div>

      {state === "idle" && (
        <div className="mt-6">
          <RealExamModeToggle checked={realExamMode} onChange={setRealExamMode} scope="EO" />
        </div>
      )}

      <div className="card-shell mt-6 flex flex-col items-center gap-4 p-8 text-center">
        {state === "idle" && (
          <>
            <p className="text-sm text-muted-foreground">Durée : {Math.round(prompt.durationSeconds / 60)} minutes maximum.</p>
            <button type="button" onClick={startRecording} className="btn-primary">
              <Mic className="h-4 w-4" /> Démarrer l'enregistrement
            </button>
          </>
        )}

        {state === "recording" && (
          <>
            <p className="font-mono text-3xl font-bold text-primary">{minutes}:{seconds.toString().padStart(2, "0")}</p>
            <p className="flex items-center gap-2 text-sm text-red-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> Enregistrement en cours...
            </p>
            <button type="button" onClick={stopRecording} className="btn-outline">
              <Square className="h-4 w-4" /> Arrêter
            </button>
          </>
        )}

        {state === "recorded" && audioUrl && (
          <>
            <audio controls src={audioUrl} className="w-full" />
            {realExamMode ? (
              <p className="text-xs text-muted-foreground">Mode examen réel : une seule tentative, comme à l'examen.</p>
            ) : (
              <button type="button" onClick={reset} className="btn-outline">
                <RotateCcw className="h-4 w-4" /> Recommencer
              </button>
            )}
          </>
        )}

        {state === "error" && (
          <p className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="h-4 w-4" /> {errorMessage}
          </p>
        )}
      </div>

      {state === "recorded" && (
        <div className="mt-6 card-shell p-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="h-4 w-4 text-primary" /> Grille d'auto-évaluation
          </p>
          <ul className="mt-3 space-y-2">
            {prompt.checklist.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Réécoute-toi avec cette grille en tête.
          </p>
          {user ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save className="h-3.5 w-3.5" />
              {saveState === "saving" && "Sauvegarde de l'enregistrement en cours..."}
              {saveState === "saved" && "Enregistrement sauvegardé dans ton profil."}
              {saveState === "error" && "Erreur de sauvegarde — l'enregistrement reste disponible ci-dessus seulement."}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              <Link to="/connexion" className="font-semibold text-primary hover:underline">Connecte-toi</Link> pour sauvegarder tes enregistrements.
            </p>
          )}
        </div>
      )}
        </>
      )}
    </section>
  );
}
