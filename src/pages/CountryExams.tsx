import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ExternalLink, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { EXAM_DESTINATIONS } from "@/lib/countries";
import NotFound from "@/pages/NotFound";

export default function CountryExams() {
  const { slug } = useParams();
  const destination = EXAM_DESTINATIONS.find((item) => item.slug === slug);

  if (!destination) return <NotFound />;

  const availableCount = destination.exams.filter((exam) => exam.preparationPath).length;

  return (
    <>
      <Seo
        title={`Examens de langue — ${destination.name}`}
        description={`Découvre les examens de langue associés à ${destination.name} et les préparations disponibles sur Blue Tick Project.`}
      />

      <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full border border-secondary-foreground/10" />
        <div className="pointer-events-none absolute -right-8 -top-20 h-72 w-72 rounded-full border border-secondary-foreground/10" />
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-secondary-foreground/70 transition hover:text-secondary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l’accueil
          </Link>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span
              aria-hidden="true"
              className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-secondary-foreground/15 bg-secondary-foreground/5 text-5xl shadow-[0_0_0_10px_color-mix(in_oklch,var(--secondary-foreground)_5%,transparent)]"
            >
              {destination.flag}
            </span>
            <div>
              <span className="chip">Destination · {destination.summary}</span>
              <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{destination.name}</h1>
              <p className="mt-3 max-w-2xl text-secondary-foreground/70">
                Repère les examens de langue souvent associés à cette destination et vois ceux que tu peux préparer sur la plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="chip">Examens de langue</span>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Choisis ton examen</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {availableCount} préparation{availableCount === 1 ? "" : "s"} disponible{availableCount === 1 ? "" : "s"} ici
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destination.exams.map((exam, index) => {
            const available = Boolean(exam.preparationPath);
            const content = (
              <>
                <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${available ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-bold">{exam.name}</h3>
                    {exam.detail && <p className="mt-1 text-sm text-muted-foreground">{exam.detail}</p>}
                  </div>
                  {available
                    ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-label="Préparation disponible" />
                    : <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-label="Préparation bientôt disponible" />}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className={`text-xs font-semibold ${available ? "text-emerald-400" : "text-muted-foreground"}`}>
                    {available ? "Préparation disponible" : "Bientôt disponible"}
                  </span>
                  {available && <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />}
                </div>
              </>
            );

            return exam.preparationPath ? (
              <Link
                key={exam.name}
                to={exam.preparationPath}
                className="card-shell group flex min-h-48 flex-col p-5 transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {content}
              </Link>
            ) : (
              <article key={exam.name} className="card-shell flex min-h-48 flex-col p-5">
                {content}
              </article>
            );
          })}
        </div>

        <aside className="mt-8 flex gap-3 rounded-2xl border border-border bg-muted/60 p-5 text-sm text-muted-foreground">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>
            Les examens acceptés dépendent du visa, de l’établissement et de la démarche. Vérifie toujours les exigences auprès de l’organisme officiel concerné.
          </p>
        </aside>

        {destination.slug === "canada" && (
          <div className="mt-8 rounded-2xl border border-primary/25 bg-primary/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <span className="chip">Parcours phare</span>
              <h2 className="mt-3 text-xl font-bold">Tu prépares le TCF Canada ?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Retrouve les quatre épreuves, les sujets pratiques et les examens blancs.
              </p>
            </div>
            <Link to="/tcf-canada" className="btn-primary mt-5 shrink-0 sm:mt-0">
              Découvrir la préparation <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
