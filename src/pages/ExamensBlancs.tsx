import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Headphones, BookOpen, Lock, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listCoSujets, type CoSujetSummary } from "@/lib/coSujets";
import { listCeSujets, type CeSujetSummary } from "@/lib/ceSujets";

type Group = {
  skill: "co" | "ce";
  label: string;
  color: string;
  icon: typeof Headphones;
  duration: string;
  basePath: string;
  sujets: CoSujetSummary[] | CeSujetSummary[] | null;
};

export default function ExamensBlancs() {
  const [coSujets, setCoSujets] = useState<CoSujetSummary[] | null>(null);
  const [ceSujets, setCeSujets] = useState<CeSujetSummary[] | null>(null);

  useEffect(() => {
    listCoSujets().then(setCoSujets).catch(() => setCoSujets([]));
    listCeSujets().then(setCeSujets).catch(() => setCeSujets([]));
  }, []);

  const groups: Group[] = [
    { skill: "co", label: "Compréhension orale", color: "var(--co)", icon: Headphones, duration: "35 min", basePath: "/comprehension-orale/examens", sujets: coSujets },
    { skill: "ce", label: "Compréhension écrite", color: "var(--ce)", icon: BookOpen, duration: "60 min", basePath: "/comprehension-ecrite/examens", sujets: ceSujets },
  ];

  return (
    <>
      <Seo
        title="Examens blancs TCF Canada"
        description="Tous les sujets complets au format examen (39 questions, chronométrés) pour la compréhension orale et écrite du TCF Canada."
      />

      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="chip"><Clock className="h-3.5 w-3.5" /> Simulation complète</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">Examens blancs</h1>
          <p className="mt-4 max-w-xl text-secondary-foreground/70">
            39 questions, chronométrées, comme le jour de l'examen. Active le mode examen réel pour un chrono par
            question et une navigation bloquée.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        {groups.map((group) => (
          <div key={group.skill} className="mb-16 last:mb-0">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${group.color} 18%, transparent)`, color: group.color }}>
                <group.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">{group.label}</h2>
                <p className="text-xs text-muted-foreground">Sujets complets — {group.duration}</p>
              </div>
            </div>

            {group.sujets === null ? (
              <p className="mt-6 text-sm text-muted-foreground">Chargement...</p>
            ) : group.sujets.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">Aucun sujet disponible pour le moment.</p>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.sujets.map((sujet, i) => (
                  <Link
                    key={sujet.slug}
                    to={`${group.basePath}/${sujet.slug}`}
                    className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!sujet.isFree ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${group.color} 18%, transparent)`, color: group.color }}>
                        <group.icon className="h-4 w-4" />
                      </span>
                      <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${sujet.isFree ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">{group.label}</p>
                      <p className="font-display text-lg font-bold">{sujet.title}</p>
                    </div>
                    {sujet.isFree ? (
                      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Commencer <ArrowRight className="h-4 w-4" />
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
          </div>
        ))}
      </section>
    </>
  );
}
