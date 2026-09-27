import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, AlertTriangle } from "lucide-react";
import { getEeSession, type EeSession } from "@/lib/eeSessions";
import { Seo } from "@/components/Seo";
import { useAuth } from "@/lib/AuthContext";
import { PremiumUpsell } from "@/components/PremiumUpsell";
import { AuthRequired } from "@/components/AuthRequired";
import NotFound from "./NotFound";

type Tache = 1 | 2 | 3;

export default function PracticeEeSession() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isPremium, isAdmin } = useAuth();
  const [session, setSession] = useState<EeSession | null | undefined>(undefined);
  const [tache, setTache] = useState<Tache>(1);

  useEffect(() => {
    if (!slug) {
      setSession(null);
      return;
    }
    let cancelled = false;
    getEeSession(slug).then((result) => {
      if (!cancelled) setSession(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (session === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!session) return <NotFound />;

  const locked = !session.isFree && !isPremium && !isAdmin;

  if (!user || locked) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <Seo title={`Expression écrite — ${session.label}`} description={`Sujets d'expression écrite TCF Canada, session ${session.label}.`} />
        <Link to="/expression-ecrite/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Retour aux sessions
        </Link>
        {!user ? <AuthRequired title={session.label} /> : <PremiumUpsell title={session.label} />}
      </section>
    );
  }

  const currentSujets = tache === 1 ? session.tache1 : tache === 2 ? session.tache2 : session.tache3;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title={`Expression écrite — ${session.label}`} description={`Sujets d'expression écrite TCF Canada, session ${session.label} : tâche 1, 2 et 3.`} />
      <Link to="/expression-ecrite/sessions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour aux sessions
      </Link>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Expression écrite — Sujets de {session.label}</h1>
      <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
        Ces sujets sont inspirés d'essais réels pour t'entraîner — ils ne constituent pas les sujets officiels de l'examen.
      </p>

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
        {currentSujets.length === 0 ? (
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
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{sujet.consigne}</p>
                </div>
                {sujet.reponse ? (
                  <details className="group border-t border-border">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-primary">
                      Voir la proposition de réponse
                      <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
                    </summary>
                    <p className="whitespace-pre-line border-t border-border p-4 text-sm text-muted-foreground">{sujet.reponse}</p>
                  </details>
                ) : (
                  <p className="border-t border-border p-4 text-xs italic text-muted-foreground">
                    Pas de proposition de réponse disponible pour ce sujet.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
