import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock, FilePenLine, Lightbulb, ListChecks, Lock, PenLine } from "lucide-react";
import { ExamTaskCards, type ExamTaskFormat } from "@/components/ExamTaskCards";
import { MonthlySessionCards } from "@/components/MonthlySessionCards";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { listEeSessions, type EeSessionSummary } from "@/lib/eeSessions";
import { listEePrompts, type WritingPromptSummary } from "@/lib/writingPrompts";

const FORMAT_STEPS: ExamTaskFormat[] = [
  {
    number: 1,
    title: "Message bref",
    description: "Rédige un message adapté à la situation : demander ou transmettre une information, inviter, remercier, t’excuser ou raconter un fait.",
    detail: "60–120 mots",
  },
  {
    number: 2,
    title: "Récit ou compte rendu",
    description: "Raconte une expérience ou un événement et partage tes impressions dans un texte clair, organisé pour son destinataire.",
    detail: "120–150 mots",
  },
  {
    number: 3,
    title: "Opinion argumentée",
    description: "Mets en relation deux points de vue, puis présente et justifie ta propre position avec des arguments et des exemples.",
    detail: "120–180 mots",
  },
];

const TIPS = [
  "Repère le destinataire et le but de chaque consigne avant de choisir le ton et le registre.",
  "Respecte la fourchette de mots demandée : les tâches ont des formats et des attentes distincts.",
  "Organise ton texte en paragraphes et relie tes idées avec des connecteurs précis.",
  "Garde quelques minutes pour vérifier la cohérence, les accords, la conjugaison et la ponctuation.",
];

export default function ExpressionEcrite() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<EeSessionSummary[] | null>(null);
  const [sessionsError, setSessionsError] = useState(false);
  const [topics, setTopics] = useState<WritingPromptSummary[] | null>(null);
  const [topicsError, setTopicsError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    listEeSessions()
      .then((result) => {
        if (!cancelled) setSessions(result);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger les sessions d’expression écrite.", error);
        if (!cancelled) setSessionsError(true);
      });

    listEePrompts()
      .then((result) => {
        if (!cancelled) setTopics(result);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger les exercices d’expression écrite.", error);
        if (!cancelled) setTopicsError(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Seo title="Expression écrite" description="Format officiel, sessions de sujets et entraînement à l’expression écrite du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--ee) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-secondary-foreground/15 bg-secondary-foreground/10">
              <PenLine className="h-7 w-7" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-foreground/65">TCF Canada · épreuve collective</span>
              <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Expression écrite</h1>
              <p className="mt-3 max-w-2xl text-secondary-foreground/75">
                Entraîne-toi à rédiger trois textes de formats différents : du message court à l’argumentation structurée.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5" /> 60 minutes au total
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5">
                  <ListChecks className="h-3.5 w-3.5" /> 3 productions écrites
                </span>
              </div>
              <Link to="/expression-ecrite/examen" className="btn-primary mt-6 inline-flex">
                Simulation d’examen chronométrée <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <span className="chip">Comprendre l’épreuve</span>
        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Trois tâches, trois objectifs d’écriture</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          L’épreuve complète dure 60 minutes. Chaque tâche a sa propre consigne et sa propre fourchette de mots.
        </p>
        <ExamTaskCards tasks={FORMAT_STEPS} accent="var(--ee)" />
      </section>

      <section className="bg-muted/60">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="chip"><CalendarDays className="h-3.5 w-3.5" /> Sujets par session</span>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Choisis une session pour t’entraîner</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Ouvre une session pour consulter les consignes des trois tâches et les propositions de réponse disponibles.
              </p>
              <Link to="/expression-ecrite/sessions" className="btn-outline mt-5 inline-flex">
                Toutes les sessions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <MonthlySessionCards sessions={sessions} skill="ee" hasError={sessionsError} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-18">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <span className="chip"><Lightbulb className="h-3.5 w-3.5" /> Méthodologie</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Écrire avec méthode</h2>
          </div>
          <ul className="space-y-3">
            {TIPS.map((tip, index) => (
              <li key={tip} className="card-shell flex gap-4 p-4 text-sm text-muted-foreground">
                <span className="font-display text-sm font-bold tabular-nums text-[var(--ee)]">0{index + 1}</span>
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
            Entraîne-toi sur une consigne précise, puis passe à une session complète ou à la simulation chronométrée.
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
                  to={`/expression-ecrite/${topic.slug}`}
                  className="card-shell group flex min-h-28 items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklch,var(--ee)_16%,transparent)] text-[var(--ee)]">
                    <FilePenLine className="h-5 w-5" />
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
