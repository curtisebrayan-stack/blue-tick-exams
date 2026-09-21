import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, ListChecks, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listCeExercises, type PracticeExerciseSummary } from "@/lib/practiceExercises";
import { listCeSujets, type CeSujetSummary } from "@/lib/ceSujets";

const FORMAT_STEPS = [
  {
    title: "Partie 1 — Textes courts et signalétique",
    desc: "Panneaux, petites annonces, messages courts. Il faut repérer une information précise rapidement.",
  },
  {
    title: "Partie 2 — Articles et documents moyens",
    desc: "Extraits de presse, courriers, notices. Le vocabulaire se diversifie et les phrases s'allongent.",
  },
  {
    title: "Partie 3 — Textes longs et argumentatifs",
    desc: "Articles d'opinion, textes littéraires ou spécialisés. Il faut comprendre l'implicite, le ton et l'intention de l'auteur.",
  },
];

const TIPS = [
  "Repère d'abord le type de texte et sa source (titre, chapô) avant de lire en détail.",
  "Lis les questions avant le texte pour savoir quelles informations chercher en priorité.",
  "Ne traduis pas mot à mot : cherche le sens général du paragraphe.",
  "Sur les textes longs, repère les connecteurs logiques (mais, donc, en revanche) qui indiquent les changements d'idée.",
];

export default function ComprehensionEcrite() {
  const [topics, setTopics] = useState<PracticeExerciseSummary[] | null>(null);
  const [sujets, setSujets] = useState<CeSujetSummary[] | null>(null);

  useEffect(() => {
    listCeExercises().then(setTopics).catch(() => setTopics([]));
    listCeSujets().then(setSujets).catch(() => setSujets([]));
  }, []);

  const freeCount = sujets?.filter((s) => s.isFree).length ?? 0;
  const lockedCount = (sujets?.length ?? 0) - freeCount;

  return (
    <>
      <Seo title="Compréhension écrite" description="Méthodologie et sujets pratiques pour l'épreuve de compréhension écrite du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--ce) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="relative mx-auto grid h-16 w-16 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-secondary-foreground/30 [animation-duration:6s]" />
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-secondary-foreground/10">
              <BookOpen className="h-6 w-6" />
            </span>
          </span>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-wide sm:text-5xl">Compréhension écrite</h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
            Évalue ta capacité à comprendre des textes écrits en français, du message simple à l'article argumentatif.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> ~60 minutes</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><ListChecks className="h-3.5 w-3.5" /> 39 questions à choix multiple</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Format de l'épreuve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trois niveaux de textes, du plus court au plus complexe.
        </p>
        <div className="mt-8 space-y-4">
          {FORMAT_STEPS.map((step) => (
            <div key={step.title} className="card-shell p-6">
              <h3 className="font-display text-base font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h2 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Lightbulb className="h-6 w-6 text-primary" /> Méthodologie
          </h2>
          <ul className="mt-6 space-y-3">
            {TIPS.map((tip) => (
              <li key={tip} className="card-shell flex gap-3 p-4 text-sm text-muted-foreground">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Sujets complets (format examen)</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          39 questions indépendantes, chacune avec son propre document — le format exact et complet de l'épreuve officielle.
        </p>

        {sujets !== null && sujets.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-500">
              ● {freeCount} sujet{freeCount > 1 ? "s" : ""} disponible{freeCount > 1 ? "s" : ""}
            </span>
            {lockedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                <Lock className="h-3 w-3" /> {lockedCount} réservé{lockedCount > 1 ? "s" : ""} aux abonnés
              </span>
            )}
          </div>
        )}

        {sujets === null ? (
          <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
        ) : sujets.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">Aucun sujet disponible pour le moment.</p>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sujets.map((sujet, i) => (
              <Link
                key={sujet.slug}
                to={`/comprehension-ecrite/examens/${sujet.slug}`}
                className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!sujet.isFree ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--ce) 18%, transparent)", color: "var(--ce)" }}>
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${sujet.isFree ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Compréhension écrite</p>
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
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <h2 className="text-2xl font-bold sm:text-3xl">Sujets pratiques par thème</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Un sujet gratuit pour découvrir le format ; les autres font partie du Premium.
          </p>
          {topics === null ? (
            <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
          ) : topics.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">Aucun sujet disponible pour le moment.</p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {topics.map((topic, i) => (
                <Link
                  key={topic.slug}
                  to={`/comprehension-ecrite/${topic.slug}`}
                  className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!topic.isFree ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--ce) 18%, transparent)", color: "var(--ce)" }}>
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${topic.isFree ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </span>
                  </div>
                  <p className="font-display text-lg font-bold">{topic.title}</p>
                  {topic.isFree ? (
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
          <Link to="/inscription" className="btn-primary mt-8 inline-flex">Créer un compte gratuit</Link>
        </div>
      </section>
    </>
  );
}
