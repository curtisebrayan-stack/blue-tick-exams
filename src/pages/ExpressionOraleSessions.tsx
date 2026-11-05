import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { MonthlySessionCards } from "@/components/MonthlySessionCards";
import { Seo } from "@/components/Seo";
import { listEoSessions, type EoSessionSummary } from "@/lib/eoSessions";

export default function ExpressionOraleSessions() {
  const [sessions, setSessions] = useState<EoSessionSummary[] | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listEoSessions()
      .then((result) => {
        if (!cancelled) setSessions(result);
      })
      .catch((error: unknown) => {
        console.error("Impossible de charger les sessions d’expression orale.", error);
        if (!cancelled) setHasError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <Seo title="Sessions Expression orale" description="Sujets d’expression orale TCF Canada, organisés par session mensuelle." />
      <Link to="/expression-orale" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour à l’épreuve
      </Link>

      <span className="chip mt-6"><Calendar className="h-3.5 w-3.5" /> Sessions mensuelles</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Sujets d’expression orale par session</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Chaque session propose des sujets pour les tâches d’interaction et de point de vue. La tâche 1 est un entretien dirigé, sans sujet mensuel.
      </p>

      <MonthlySessionCards sessions={sessions} skill="eo" hasError={hasError} />
    </section>
  );
}
