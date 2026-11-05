import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronDown, AlertTriangle, Clock, FileCheck2, Mic } from "lucide-react";
import { getEoSession, type EoSession } from "@/lib/eoSessions";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import NotFound from "./NotFound";

type Tache = 1 | 2 | 3;

export default function PracticeEoSession() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [session, setSession] = useState<EoSession | null | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  const [tache, setTache] = useState<Tache>(2);

  useEffect(() => {
    if (!slug) {
      setSession(null);
      return;
    }
    setLoadError(false);
    setSession(undefined);
    let cancelled = false;
    getEoSession(slug)
      .then((result) => {
        if (!cancelled) setSession(result ?? null);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger cette session d’expression orale.", error);
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loadError) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Link to="/expression-orale/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour aux sessions
        </Link>
        <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          Impossible de charger cette session. Réessaie dans quelques instants.
        </p>
      </section>
    );
  }

  if (session === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!session) return <NotFound />;

  const locked = !session.isFree && !isPremium && !isAdmin;

  if (!user || locked) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Seo title={`Expression orale — ${session.label}`} description={`Sujets d'expression orale TCF Canada, session ${session.label}.`} />
        <Link to="/expression-orale/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour aux sessions
        </Link>
        {!user ? <AuthRequired title={session.label} /> : <PremiumUpsell title={session.label} />}
      </section>
    );
  }

  const currentSujets = tache === 2 ? session.tache2 : tache === 3 ? session.tache3 : [];

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title={`Expression orale — ${session.label}`} description={`Sujets d'expression orale TCF Canada, session ${session.label} : tâche 1, 2 et 3.`} />
      <Link to="/expression-orale/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour aux sessions
      </Link>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Expression orale — Sujets de {session.label}</h1>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Ces sujets sont inspirés d'essais réels pour t'entraîner — ils ne constituent pas les sujets officiels de l'examen.
      </p>

      <div className="card-shell mt-6 border-t-4 border-t-[var(--eo)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="chip"><FileCheck2 className="h-3.5 w-3.5" /> 3 tâches · environ 12 minutes</span>
            <h2 className="mt-3 font-display text-xl font-bold">Simulation complète de la session</h2>
            <p className="mt-1 text-sm text-muted-foreground">Enregistre chaque réponse et réécoute-la pour t’autoévaluer.</p>
          </div>
          <Link to={`/expression-orale/sessions/${session.slug}/examen`} className="btn-primary shrink-0">
            Commencer l’examen complet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-center font-display text-xl font-bold">Ou pratique les tâches individuellement</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {([
            { number: 1 as Tache, title: "Entretien dirigé", duration: "2 min", description: "Réponds aux questions personnelles de l’examinateur.", available: true },
            { number: 2 as Tache, title: "Exercice interactif", duration: "5 min 30 · 2 min de préparation", description: "Prépare des questions pour obtenir des informations.", available: session.tache2.length > 0 },
            { number: 3 as Tache, title: "Expression d’un point de vue", duration: "4 min 30", description: "Développe et justifie ton opinion sur le sujet proposé.", available: session.tache3.length > 0 },
          ]).map((task) => {
            const content = (
              <>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[color-mix(in_oklch,var(--eo)_12%,transparent)] text-[var(--eo)]">
                  <Mic className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display font-bold">{task.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{task.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  <span className="text-muted-foreground">{task.duration}</span>
                  <span className={task.available ? "font-semibold text-primary" : "text-muted-foreground"}>
                    {task.available ? <>Commencer <ArrowRight className="inline h-3.5 w-3.5" /></> : "Bientôt disponible"}
                  </span>
                </div>
              </>
            );
            return task.available ? (
              <Link
                key={task.number}
                to={`/expression-orale/sessions/${session.slug}/examen/${task.number}`}
                className="card-shell group flex min-h-48 flex-col p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                {content}
              </Link>
            ) : (
              <article key={task.number} className="card-shell flex min-h-48 flex-col p-5 opacity-60">{content}</article>
            );
          })}
        </div>
      </div>

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
          <p className="card-shell p-6 text-sm text-muted-foreground">
            Les sujets de la tâche {tache} pour cette session arrivent bientôt.
          </p>
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
    </section>
  );
}
