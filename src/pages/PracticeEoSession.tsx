import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, AlertTriangle, Clock, FileCheck2, ListChecks, Mic } from "lucide-react";
import { getEoSession, listCompleteEoSessions, type EoSession, type EoSessionSummary } from "@/lib/eoSessions";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import NotFound from "./NotFound";

type Tache = 1 | 2 | 3;

export default function PracticeEoSession() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const userId = user?.id;
  const [session, setSession] = useState<EoSession | null | undefined>(undefined);
  const [completeSessions, setCompleteSessions] = useState<EoSessionSummary[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [tache, setTache] = useState<Tache>(2);
  const isOverview = !slug;

  useEffect(() => {
    setLoadError(false);
    setSession(undefined);
    let cancelled = false;
    const loadSession = async () => {
      const allCompleteSessions = await listCompleteEoSessions();
      const accessibleCompleteSessions = allCompleteSessions.filter(
        (item) => item.isFree || (userId && (isPremium || isAdmin)),
      );
      if (!cancelled) setCompleteSessions(accessibleCompleteSessions);

      let sessionSlug = slug;
      if (!sessionSlug) {
        sessionSlug = accessibleCompleteSessions[0]?.slug;
      }
      if (!sessionSlug) {
        if (!cancelled) setSession(null);
        return;
      }
      const result = await getEoSession(sessionSlug);
      if (!cancelled) setSession(result ?? null);
    };
    loadSession()
      .catch((error: unknown) => {
        console.error("Impossible de charger cette session d’expression orale.", error);
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, userId, isPremium, isAdmin]);

  if (loadError) {
    return (
      <div className={isOverview ? "eo-exam-theme min-h-screen" : ""}>
        <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <Link to={isOverview ? "/expression-orale" : "/expression-orale/sessions"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> {isOverview ? "Retour à l’expression orale" : "Retour aux sessions"}
          </Link>
          <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            Impossible de charger cette session. Réessaie dans quelques instants.
          </p>
        </section>
      </div>
    );
  }

  if (session === undefined) {
    return (
      <div className={isOverview ? "eo-exam-theme min-h-screen" : ""}>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>
      </div>
    );
  }
  if (!session) return <NotFound />;

  const locked = !session.isFree && !isPremium && !isAdmin;

  if (!user || locked) {
    return (
      <div className={isOverview ? "eo-exam-theme min-h-screen" : ""}>
        <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <Seo title={isOverview ? "Simulation d’expression orale" : `Expression orale — ${session.label}`} description={`Sujets d'expression orale TCF Canada, session ${session.label}.`} />
          <Link to={isOverview ? "/expression-orale" : "/expression-orale/sessions"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" /> {isOverview ? "Retour à l’expression orale" : "Retour aux sessions"}
          </Link>
          {!user ? <AuthRequired title={isOverview ? "la simulation d’expression orale" : session.label} /> : <PremiumUpsell title={session.label} />}
        </section>
      </div>
    );
  }

  const currentSujets = tache === 2 ? session.tache2 : tache === 3 ? session.tache3 : [];
  const currentSessionIsComplete = session.tache2.length > 0 && session.tache3.length > 0;
  const fullExamSession = currentSessionIsComplete ? session : completeSessions[0];
  const tasks: Array<{
    number: Tache;
    title: string;
    duration: string;
    preparation: string;
    description: string;
  }> = [
    { number: 1, title: "Entretien dirigé", duration: "2 min", preparation: "Sans préparation", description: "Échange spontanément avec l’examinateur autour de ta vie et de ton parcours." },
    { number: 2, title: "Exercice interactif", duration: "5 min 30", preparation: "2 min de préparation + 3 min 30 d’échange", description: "Recueille des informations en posant des questions dans une situation du quotidien." },
    { number: 3, title: "Expression d’un point de vue", duration: "4 min 30", preparation: "Sans préparation", description: "Exprime une opinion et développe tes idées de manière claire et convaincante." },
  ];
  const taskSessions: Record<Tache, EoSessionSummary | EoSession | undefined> = {
    1: session,
    2: session.tache2.length > 0 ? session : fullExamSession,
    3: session.tache3.length > 0 ? session : fullExamSession,
  };

  return (
    <div className={isOverview ? "eo-exam-theme min-h-screen" : ""}>
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Seo
        title={isOverview ? "Simulation d’expression orale" : `Expression orale — ${session.label}`}
        description={`Sujets d'expression orale TCF Canada, session ${session.label} : tâche 1, 2 et 3.`}
      />
      <Link to={isOverview ? "/expression-orale" : "/expression-orale/sessions"} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> {isOverview ? "Retour à l’expression orale" : "Retour aux sessions"}
      </Link>

      <div className="mt-6">
        <span className="chip"><Mic className="h-3.5 w-3.5" /> Expression orale · {session.label}</span>
        <h1 className="mt-3 text-2xl font-bold sm:text-4xl">{isOverview ? "Prépare ton examen oral" : `Sujets de la session ${session.label}`}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {isOverview
            ? "Passe les trois tâches dans l’ordre de l’épreuve ou choisis un entraînement ciblé."
            : "Choisis une tâche pour parcourir les sujets et te préparer."}
        </p>
      </div>
      {!isOverview && <p className="mt-4 flex items-start gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Ces sujets sont inspirés d'essais réels pour t'entraîner — ils ne constituent pas les sujets officiels de l'examen.
      </p>}

      {isOverview ? (
        <div className="card-shell mt-8 border-t-4 border-t-[var(--eo)] p-5 sm:p-8">
          <span className="chip"><FileCheck2 className="h-3.5 w-3.5" /> Examen complet</span>
          <h2 className="mt-4 flex items-center gap-2 font-display text-xl font-bold sm:text-2xl">
            <Mic className="h-5 w-5 text-[var(--eo)]" /> Examen complet TCF Canada
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Passe l’épreuve d’expression orale avec ses trois tâches, dans l’ordre. Chaque réponse est enregistrée pour que tu puisses la réécouter et t’autoévaluer.
          </p>
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-3">
            {["Entretien dirigé", "Exercice interactif", "Expression d’un point de vue"].map((label) => (
              <li key={label} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> {label}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 px-4 py-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4 text-primary" /> Environ 12 minutes
            </span>
            <span className="text-xs font-semibold text-muted-foreground">3 tâches · session {fullExamSession?.label ?? session.label}</span>
          </div>
          {fullExamSession ? (
            <Link to={`/expression-orale/sessions/${fullExamSession.slug}/examen`} className="btn-primary mt-4 flex w-full justify-center">
              <FileCheck2 className="h-4 w-4" /> Commencer l’examen complet
            </Link>
          ) : (
            <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Aucun sujet complet n’est publié pour le moment.
            </p>
          )}
          {fullExamSession && fullExamSession.slug !== session.slug && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Session utilisée pour les trois tâches : {fullExamSession.label}.
            </p>
          )}
        </div>
      ) : (
        <div className="card-shell mt-6 border-t-4 border-t-[var(--eo)] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="chip"><FileCheck2 className="h-3.5 w-3.5" /> 3 tâches · environ 12 minutes</span>
              <h2 className="mt-3 font-display text-xl font-bold">Simulation complète de la session</h2>
              <p className="mt-1 text-sm text-muted-foreground">Enregistre chaque réponse et réécoute-la pour t’autoévaluer.</p>
            </div>
            {fullExamSession ? (
              <Link to={`/expression-orale/sessions/${fullExamSession.slug}/examen`} className="btn-primary shrink-0">
                Commencer l’examen complet <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-center font-display text-xl font-bold">Ou pratique les tâches individuellement</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {tasks.filter((task) => taskSessions[task.number]).map((task) => {
            const taskSession = taskSessions[task.number]!;
            const content = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[color-mix(in_oklch,var(--eo)_12%,transparent)] text-[var(--eo)]">
                  <Mic className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold">{task.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{task.description}</p>
                <div className="mt-4 space-y-2 border-t border-border pt-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {task.duration}</span>
                    <span className="font-semibold text-primary">1 tâche</span>
                  </div>
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-center italic text-muted-foreground">{task.preparation}</p>
                  {task.number !== 1 && taskSession.slug !== session.slug && (
                    <p className="text-center text-muted-foreground">Sujet de la session {taskSession.label}</p>
                  )}
                  <div className="flex justify-end">
                    <span className="font-semibold text-primary">
                      Commencer <ArrowRight className="inline h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </>
            );
            return (
              <Link
                key={task.number}
                to={`/expression-orale/sessions/${taskSession.slug}/examen/${task.number}`}
                className="card-shell group flex min-h-48 flex-col p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>

      {isOverview && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ListChecks className="h-4 w-4 text-primary" /> Sujets chargés depuis la session {session.label}.
          </p>
          <Link to="/expression-orale/sessions" className="text-sm font-semibold text-primary hover:underline">
            Choisir une autre session <ArrowRight className="inline h-4 w-4" />
          </Link>
        </div>
      )}

      {!isOverview && <>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {([1, 2, 3] as Tache[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTache(t)}
            className={`rounded-xl border p-4 text-center transition ${
              tache === t ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
            }`}
          >
            <p className="text-2xl font-bold">{String(t).padStart(2, "0")}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tâche {t}</p>
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tache === 1 ? (
          <div className="card-shell p-6 sm:p-8">
            <span className="chip"><Mic className="h-3.5 w-3.5" /> Entretien dirigé</span>
            <h2 className="mt-4 font-display text-xl font-bold">Réponds aux questions de l’examinateur</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Présente-toi et parle de ton parcours, de tes activités ou de ton quotidien. L’examinateur te guide par des questions ; réponds de façon naturelle et développe tes idées avec des détails concrets.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Sans préparation
            </span>
          </div>
        ) : currentSujets.length === 0 ? (
          <div className="card-shell flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-sm text-muted-foreground">
              Aucun sujet de la tâche {tache} n’est publié pour {session.label}.
            </p>
            {fullExamSession && fullExamSession.slug !== session.slug && (
              <Link to={`/expression-orale/sessions/${fullExamSession.slug}/examen/${tache}`} className="btn-primary">
                Faire la tâche {tache} · {fullExamSession.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {currentSujets.map((sujet) => (
              <div key={sujet.number} className="card-shell overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border p-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-sm font-bold">
                    {sujet.number}
                  </span>
                  <p className="font-display text-base font-bold">Sujet {sujet.number}</p>
                </div>
                <div className="p-4">
                  <span className="chip">Consigne</span>
                  <p className="mt-2 text-sm text-muted-foreground">{sujet.consigne}</p>
                </div>
                {sujet.questions && sujet.questions.length > 0 ? (
                  <details className="group border-t border-border">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-primary">
                      Voir la proposition de questions
                      <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <ol className="space-y-2 border-t border-border p-4 text-sm text-muted-foreground">
                      {sujet.questions.map((q, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-semibold text-foreground">{i + 1}.</span> {q}
                        </li>
                      ))}
                    </ol>
                  </details>
                ) : sujet.reponse ? (
                  <details className="group border-t border-border">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-primary">
                      Voir la proposition de réponse
                      <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="whitespace-pre-line border-t border-border p-4 text-sm text-muted-foreground">{sujet.reponse}</p>
                  </details>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
      </>}
    </section>
    </div>
  );
}
