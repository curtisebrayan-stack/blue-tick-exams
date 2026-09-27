import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listEoSessions, type EoSessionSummary } from "@/lib/eoSessions";

export default function ExpressionOraleSessions() {
  const [sessions, setSessions] = useState<EoSessionSummary[] | null>(null);

  useEffect(() => {
    listEoSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Seo title="Sessions Expression orale" description="Sujets d'expression orale TCF Canada, organisés par session mensuelle." />
      <Link to="/expression-orale" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
      </Link>

      <span className="chip mt-6"><Calendar className="h-3.5 w-3.5" /> Sessions mensuelles</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Sujets d'expression orale par session</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Chaque session regroupe les 3 tâches de l'épreuve : se présenter, poser des questions, argumenter.
      </p>

      {sessions === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : sessions.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucune session disponible pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Link
              key={session.slug}
              to={`/expression-orale/sessions/${session.slug}`}
              className={`card-shell flex flex-col gap-3 p-6 transition hover:-translate-y-0.5 hover:shadow-lg ${!session.isFree ? "opacity-60" : ""}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--eo) 18%, transparent)", color: "var(--eo)" }}>
                <Calendar className="h-5 w-5" />
              </span>
              <h2 className="font-display text-lg font-bold">{session.label}</h2>
              <p className="text-xs text-muted-foreground">Tâches 1, 2 et 3</p>
              {session.isFree ? (
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Voir les sujets <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" /> Abonnement requis
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
