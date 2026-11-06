import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Headphones, ListChecks, Lock, Mic, UserRound } from "lucide-react";
import { ExamTaskCards, type ExamTaskFormat } from "@/components/ExamTaskCards";
import { MonthlySessionCards } from "@/components/MonthlySessionCards";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { listEoSessions, type EoSessionSummary } from "@/lib/eoSessions";
import { listEoPrompts, type SpeakingPromptSummary } from "@/lib/speakingPrompts";

const FORMAT_STEPS: ExamTaskFormat[] = [
  {
    number: 1,
    title: "Entretien dirigé",
    description: "Réponds aux questions de l’examinateur sur ton parcours, tes activités et ton quotidien. L’objectif est d’échanger naturellement, sans préparation.",
    detail: "2 min · sans préparation",
  },
  {
    number: 2,
    title: "Exercice interactif",
    description: "Recueille des informations dans une situation de la vie quotidienne en posant des questions adaptées.",
    detail: "5 min 30 · dont 2 min de préparation",
  },
  {
    number: 3,
    title: "Expression d’un point de vue",
    description: "Exprime un point de vue sur une question générale, puis développe et justifie tes idées.",
    detail: "4 min 30 · sans préparation",
  },
];

const TIPS = [
  "Réponds avec des phrases complètes et ajoute un détail concret pour rendre tes réponses plus naturelles.",
  "Pour l’interaction, prépare des questions ouvertes et varie les formulations : qui, quoi, où, comment, pourquoi.",
  "Pour exprimer ton point de vue, annonce ta position, développe deux idées et termine par une conclusion claire.",
  "Si tu hésites, reformule et continue : garde un débit régulier plutôt que de t’arrêter pour chercher la phrase parfaite.",
];

export default function ExpressionOrale() {
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<EoSessionSummary[] | null>(null);
  const [sessionsError, setSessionsError] = useState(false);
  const [topics, setTopics] = useState<SpeakingPromptSummary[] | null>(null);
  const [topicsError, setTopicsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    listEoSessions()
      .then((result) => {
        if (!cancelled) setSessions(result);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger les sessions d’expression orale.", error);
        if (!cancelled) setSessionsError(true);
      });

    listEoPrompts()
      .then((result) => {
        if (!cancelled) setTopics(result);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger les exercices d’expression orale.", error);
        if (!cancelled) setTopicsError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Seo title="Expression orale" description="Format officiel, sessions de sujets et entraînement à l’expression orale du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--eo) 18%, var(--secondary)), var(--secondary))" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-foreground/60">Épreuve du TCF Canada</span>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Expression orale</h1>
          <p className="mt-3 max-w-2xl text-secondary-foreground/75">
            Entraîne-toi aux trois tâches du TCF Canada, écoute un exemple et retrouve les sujets classés par session.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
              <ListChecks className="h-3.5 w-3.5" /> 3 tâches
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5" /> 12 minutes
            </span>
            <a href="#format" className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5 font-semibold hover:bg-secondary-foreground/15">
              Méthodologie EO <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="card-shell mx-auto max-w-5xl overflow-hidden border-t-4 p-6 sm:p-8" style={{ borderTopColor: "var(--eo)" }}>
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[color-mix(in_oklch,var(--eo)_18%,transparent)] text-[var(--eo)]">
              <Mic className="h-7 w-7" />
            </span>
            <div>
              <span className="chip">Examen complet · 3 tâches</span>
              <h2 className="mt-3 font-display text-xl font-bold sm:text-2xl">Examen TCF d’expression orale</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Entraîne-toi dans les conditions de l’épreuve : entretien dirigé, exercice interactif et expression d’un point de vue.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/40 p-4">
            {authLoading ? (
              <p role="status" className="text-sm text-muted-foreground">Vérification de ta connexion…</p>
            ) : (
              <p className="flex items-center gap-2 text-sm font-semibold">
                <UserRound className="h-4 w-4 text-primary" />
                {user
                  ? "L’examen s’ouvre sur une page dédiée où tu peux lancer les trois tâches ou t’entraîner séparément."
                  : "Connecte-toi pour démarrer l’examen et retrouver tes enregistrements dans ton profil."}
              </p>
            )}
            {!authLoading && (
              <div className="flex flex-wrap gap-3">
                <Link to="/expression-orale/examen" className="btn-primary flex-1 justify-center">
                  Commencer l’examen <ArrowRight className="h-4 w-4" />
                </Link>
                {!user && <Link to="/connexion" className="btn-outline flex-1 justify-center">Se connecter</Link>}
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Tes réponses sont enregistrées pour réécoute et auto-évaluation. La plateforme ne fournit pas encore de note automatique par IA.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="max-w-2xl">
          <span className="chip"><Mic className="h-3.5 w-3.5" /> Préparation · tâche 1</span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Exemples pour la tâche 1</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Écoute l’exemple audio avant de t’entraîner à répondre naturellement et à développer tes idées.
          </p>
        </div>
        <div className="card-shell mt-6 grid gap-5 overflow-hidden p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[color-mix(in_oklch,var(--eo)_16%,transparent)] text-[var(--eo)]">
            <Headphones className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-bold">Question 1 · exemple audio</h3>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-semibold text-muted-foreground">Tâche 1</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Lance l’écoute quand tu es prêt. Tu peux la mettre en pause ou la réécouter.</p>
            <audio
              controls
              preload="none"
              src="/audio/eo-question-1.mp3"
              aria-label="Écouter l’exemple audio EO, question 1"
              className="mt-4 block w-full max-w-2xl"
            >
              Ton navigateur ne permet pas de lire cet audio.
            </audio>
          </div>
        </div>
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="chip"><CalendarDays className="h-3.5 w-3.5" /> Liste des sujets</span>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Choisis une session pour commencer</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Choisis une session pour ouvrir l’examen complet ou t’entraîner à une tâche précise.
              </p>
            </div>
            <Link to="/expression-orale/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Voir toutes les sessions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <MonthlySessionCards sessions={sessions} skill="eo" hasError={sessionsError} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <span id="format" className="chip scroll-mt-24">Méthodologie EO</span>
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Comprendre les trois tâches</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          L’épreuve dure 12 minutes, dont 2 minutes de préparation pour la tâche d’interaction.
        </p>
        <ExamTaskCards tasks={FORMAT_STEPS} accent="var(--eo)" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <h3 className="font-display text-xl font-bold">Des réponses claires et naturelles</h3>
          <ul className="space-y-3">
            {TIPS.map((tip, index) => (
              <li key={tip} className="card-shell flex gap-4 p-4 text-sm text-muted-foreground">
                <span className="font-display text-sm font-bold tabular-nums text-[var(--eo)]">0{index + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <span className="chip">En complément</span>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Exercices ciblés</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Travaille une situation précise avant de passer à une session complète.
          </p>
          {topicsError ? (
            <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              Impossible de charger les exercices pour le moment. Réessaie dans quelques instants.
            </p>
          ) : topics === null ? (
            <p role="status" className="mt-6 text-sm text-muted-foreground">Chargement des exercices…</p>
          ) : topics.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">Aucun exercice ciblé disponible pour le moment.</p>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic, index) => (
                <Link
                  key={topic.slug}
                  to={`/expression-orale/${topic.slug}`}
                  className="card-shell group flex min-h-28 items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklch,var(--eo)_16%,transparent)] text-[var(--eo)]">
                    <Mic className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold">{topic.title}</span>
                    <span className={`mt-1 inline-flex items-center gap-1 text-xs font-semibold ${topic.isFree ? "text-emerald-400" : "text-muted-foreground"}`}>
                      {topic.isFree ? "Gratuit après connexion" : <><Lock className="h-3.5 w-3.5" /> Premium</>}
                    </span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">0{index + 1}</span>
                </Link>
              ))}
            </div>
          )}
          {!user && <Link to="/inscription" className="btn-primary mt-7 inline-flex">Créer un compte gratuit</Link>}
        </div>
      </section>
    </>
  );
}
