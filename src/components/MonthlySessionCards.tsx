import { ArrowRight, CalendarDays, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import type { EoSessionSummary } from "@/lib/eoSessions";
import type { EeSessionSummary } from "@/lib/eeSessions";

type SessionSummary = EoSessionSummary | EeSessionSummary;
type Skill = "eo" | "ee";

export function MonthlySessionCards({
  sessions,
  skill,
  hasError = false,
}: {
  sessions: SessionSummary[] | null;
  skill: Skill;
  hasError?: boolean;
}) {
  const basePath = skill === "eo" ? "/expression-orale" : "/expression-ecrite";
  const accent = skill === "eo" ? "var(--eo)" : "var(--ee)";

  if (hasError) {
    return (
      <p role="alert" className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        Impossible de charger les sessions pour le moment. Réessaie dans quelques instants.
      </p>
    );
  }

  if (sessions === null) {
    return <p role="status" className="mt-6 text-sm text-muted-foreground">Chargement des sessions…</p>;
  }

  if (sessions.length === 0) {
    return <p className="mt-6 rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">Aucune session disponible pour le moment.</p>;
  }

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session, index) => (
        <Link
          key={session.slug}
          to={`${basePath}/sessions/${session.slug}`}
          className="card-shell group flex min-h-48 flex-col p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl"
              style={{ backgroundColor: `color-mix(in oklch, ${accent} 16%, transparent)`, color: accent }}
            >
              <CalendarDays className="h-5 w-5" />
            </span>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">{session.label}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {skill === "eo" ? "Expression orale · tâches 2 et 3" : "Expression écrite · tâches 1, 2 et 3"}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${session.isFree ? "text-emerald-400" : "text-muted-foreground"}`}>
              {session.isFree ? "Gratuite · connexion requise" : <><Lock className="h-3.5 w-3.5" /> Premium</>}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
