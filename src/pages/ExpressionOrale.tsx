import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, Lightbulb, ListChecks, Lock, Mic } from "lucide-react";
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
    detail: "Sans préparation",
  },
  {
    number: 2,
    title: "Interaction",
    description: "À partir d’une situation, pose des questions adaptées pour obtenir des informations et faire avancer l’échange avec l’examinateur.",
    detail: "2 min de préparation",
  },
  {
    number: 3,
    title: "Expression d’un point de vue",
    description: "Présente ta position sur un sujet général, développe des arguments et illustre-les avec des exemples pertinents.",
    detail: "Sans préparation",
  },
];

const TIPS = [
  "Réponds avec des phrases complètes et ajoute un détail concret pour rendre tes réponses plus naturelles.",
  "Pour l’interaction, prépare des questions ouvertes et varie les formulations : qui, quoi, où, comment, pourquoi.",
  "Pour exprimer ton point de vue, annonce ta position, développe deux idées et termine par une conclusion claire.",
  "Si tu hésites, reformule et continue : garde un débit régulier plutôt que de t’arrêter pour chercher la phrase parfaite.",
];

export default function ExpressionOrale() {
  const { user } = useAuth();
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
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--eo) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/10">
              <Mic className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-foreground/65">TCF Canada · épreuve individuelle</span>
              <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Expression orale</h1>
              <p className="mt-3 max-w-2xl text-secondary-foreground/75">
                Entraîne-toi à répondre spontanément, à obtenir des informations et à défendre ton point de vue face à un examinateur.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5" /> 12 minutes au total
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
                  <ListChecks className="h-3.5 w-3.5" /> 3 tâches · 2 min de préparation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <span className="chip">Comprendre l’épreuve</span>
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Un échange, une interaction, un point de vue</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          L’épreuve dure 12 minutes, dont 2 minutes de préparation pour la tâche d’interaction. Les trois tâches évaluent des façons différentes de communiquer.
        </p>
        <ExamTaskCards tasks={FORMAT_STEPS} accent="var(--eo)" />
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="chip"><CalendarDays className="h-3.5 w-3.5" /> Sujets par session</span>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Choisis une session pour t’entraîner</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Chaque session rassemble les sujets d’interaction et d’argumentation. La tâche 1 reste un entretien dirigé, identique dans son format.
              </p>
              <Link to="/expression-orale/sessions" className="btn-outline mt-5 inline-flex">
                Toutes les sessions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <MonthlySessionCards sessions={sessions} skill="eo" hasError={sessionsError} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="chip"><Lightbulb className="h-3.5 w-3.5" /> Méthodologie</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Des réponses claires et naturelles</h2>
          </div>
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
