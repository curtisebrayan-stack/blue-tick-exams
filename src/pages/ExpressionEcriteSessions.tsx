import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Calendar, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listEeSessions, type EeSessionSummary } from "@/lib/eeSessions";

export default function ExpressionEcriteSessions() {
  const [sessions, setSessions] = useState<EeSessionSummary[] | null>(null);

  useEffect(() => {
    listEeSessions().then(setSessions).catch(() => setSessions([]));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Seo title="Sessions Expression écrite" description="Sujets d'expression écrite TCF Canada, organisés par session mensuelle." />
      <Link to="/expression-ecrite" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à l'épreuve
      </Link>

      <span className="chip mt-6"><Calendar className="h-3.5 w-3.5" /> Sessions mensuelles</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Sujets d'expression écrite par session</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Chaque session regroupe les 3 tâches de l'épreuve, avec la consigne et une proposition de réponse.
      </p>

      {sessions === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : sessions.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucune session disponible pour le moment.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sessions.map((session) => (
            <Link
              key={session.slug}
              to={`/expression-ecrite/sessions/${session.slug}`}
              className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!session.isFree ? "opacity-60" : ""}`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--ee) 18%, transparent)", color: "var(--ee)" }}>
                <Calendar className="h-4 w-4" />
              </span>
              <p className="font-display text-base font-bold">{session.label}</p>
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
