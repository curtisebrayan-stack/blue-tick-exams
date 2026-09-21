import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, CheckSquare, Maximize, Ban, PenLine, Clock } from "lucide-react";
import { getWritingPrompt, type WritingPrompt } from "@/lib/writingPrompts";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import { useExamIntegrity } from "@/lib/examIntegrity";
import { RealExamModeToggle } from "@/components/RealExamModeToggle";
import NotFound from "./NotFound";

const FAST_TYPING_WPM = 80;
const EE_REAL_MODE_SECONDS = 20 * 60;

function countWords(text: string): number {
  return text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
}

export default function PracticeEe() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [prompt, setPrompt] = useState<WritingPrompt | null | undefined>(undefined);

  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [realExamMode, setRealExamMode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(EE_REAL_MODE_SECONDS);

  const { fullscreenActive, enterFullscreen, preventContextMenu, baseFlags } = useExamIntegrity();
  const pasteAttemptsRef = useRef(0);
  const typingStartRef = useRef<number | null>(null);
  const submitRef = useRef<() => void>(() => {});
  const [showPasteWarning, setShowPasteWarning] = useState(false);

  const wordCount = useMemo(() => countWords(content), [content]);

  useEffect(() => {
    if (!slug) {
      setPrompt(null);
      return;
    }
    let cancelled = false;
    getWritingPrompt("ee", slug).then((result) => {
      if (!cancelled) setPrompt(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!realExamMode || submitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          submitRef.current();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [realExamMode, submitted]);

  if (prompt === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!prompt) return <NotFound />;

  const locked = !prompt.isFree && !isPremium && !isAdmin;
  const blocked = !user || locked;

  const inRange = wordCount >= prompt.minWords && wordCount <= prompt.maxWords;

  const handleChange = (value: string) => {
    if (typingStartRef.current === null && value.length > 0) typingStartRef.current = Date.now();
    setContent(value);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    pasteAttemptsRef.current += 1;
    setShowPasteWarning(true);
    setTimeout(() => setShowPasteWarning(false), 4000);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (!user) return;
    setSaveState("saving");
    const minutesTyping = typingStartRef.current ? (Date.now() - typingStartRef.current) / 60000 : 0;
    const wpm = minutesTyping > 0 ? wordCount / minutesTyping : 0;
    const { error } = await supabase.from("writing_submissions").insert({
      user_id: user.id,
      email: user.email,
      skill: prompt.skill,
      topic_slug: prompt.slug,
      content,
      word_count: wordCount,
      integrity_flags: {
        ...baseFlags(),
        pasted: pasteAttemptsRef.current > 0,
        pasteAttempts: pasteAttemptsRef.current,
        fastTyping: wpm > FAST_TYPING_WPM && wordCount >= prompt.minWords,
      },
    });
    setSaveState(error ? "error" : "saved");
  };

  submitRef.current = () => void handleSubmit();

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24" onContextMenu={preventContextMenu}>
      <Seo title={prompt.title} description={`Sujet pratique d'expression écrite TCF Canada : ${prompt.title}.`} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/expression-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
        </Link>
        {!blocked && !submitted && !fullscreenActive && (
          <button type="button" onClick={enterFullscreen} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary">
            <Maximize className="h-3.5 w-3.5" /> Mode examen (plein écran)
          </button>
        )}
      </div>

      <div
        className="mt-6 flex items-center gap-3 rounded-2xl p-5 text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--ee) 30%, var(--secondary)), color-mix(in oklch, var(--primary) 30%, var(--secondary)))" }}
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary-foreground/10">
          <PenLine className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-secondary-foreground/70">Expression écrite</p>
          <p className="font-display text-lg font-bold">{prompt.title}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{prompt.instructions}</p>
      <p className="mt-2 text-xs text-muted-foreground">Objectif : entre {prompt.minWords} et {prompt.maxWords} mots.</p>

      {!user ? (
        <AuthRequired title={prompt.title} />
      ) : locked ? (
        <PremiumUpsell title={prompt.title} />
      ) : (
        <>
      {!submitted && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex-1">
            <RealExamModeToggle checked={realExamMode} onChange={setRealExamMode} scope="EE" />
          </div>
          {realExamMode && (
            <div className={`card-shell flex items-center gap-2 px-4 py-2 shadow-lg ${secondsLeft <= 120 ? "border-amber-500/50" : ""}`}>
              <Clock className={`h-4 w-4 ${secondsLeft <= 120 ? "text-amber-500" : "text-primary"}`} />
              <span className="font-mono text-sm font-bold">
                {Math.floor(secondsLeft / 60)}:{(secondsLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      )}
      {showPasteWarning && (
        <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-500">
          <Ban className="h-3.5 w-3.5 shrink-0" /> Le collage est désactivé pour cet exercice — rédige directement ton texte.
        </p>
      )}
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        onPaste={handlePaste}
        disabled={submitted}
        rows={10}
        placeholder="Écris ton message ici..."
        className="mt-6 w-full rounded-xl border border-border bg-background p-4 text-sm outline-none focus:border-primary disabled:opacity-70"
      />
      <p className={`mt-2 text-xs ${inRange ? "text-green-500" : "text-muted-foreground"}`}>
        {wordCount} mot{wordCount !== 1 ? "s" : ""} {inRange ? "— dans la cible" : `— cible : ${prompt.minWords}-${prompt.maxWords}`}
      </p>

      {!submitted ? (
        <button
          type="button"
          disabled={wordCount === 0}
          onClick={handleSubmit}
          className="btn-primary mt-4 disabled:opacity-50"
        >
          Envoyer ma rédaction
        </button>
      ) : (
        <div className="mt-6 card-shell p-6">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="h-4 w-4 text-primary" /> Grille d'auto-relecture
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
            Cet exercice n'est pas noté automatiquement — relis ton texte avec la grille ci-dessus. Une correction détaillée pourra être ajoutée plus tard.
          </p>
          {user ? (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save className="h-3.5 w-3.5" />
              {saveState === "saving" && "Sauvegarde en cours..."}
              {saveState === "saved" && "Ta rédaction est sauvegardée dans ton profil."}
              {saveState === "error" && "Erreur de sauvegarde — réessaie plus tard."}
            </p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              <Link to="/connexion" className="font-semibold text-primary hover:underline">Connecte-toi</Link> pour sauvegarder ta rédaction.
            </p>
          )}
        </div>
      )}
        </>
      )}
    </section>
  );
}
