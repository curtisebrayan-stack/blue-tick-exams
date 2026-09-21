import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, Clock, ListChecks, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listEePrompts, type WritingPromptSummary } from "@/lib/writingPrompts";
import { useAuth } from "@/lib/AuthContext";

const FORMAT_STEPS = [
  {
    title: "Tâche 1 — Message court",
    desc: "Rédiger un message simple (mail, mot, formulaire) dans un contexte quotidien. Environ 60 mots.",
  },
  {
    title: "Tâche 2 — Récit ou description",
    desc: "Raconter un événement, décrire une situation ou exprimer un point de vue personnel. Environ 120 mots.",
  },
  {
    title: "Tâche 3 — Argumentation",
    desc: "Comparer des points de vue et défendre une opinion argumentée sur un sujet donné. Environ 120 mots.",
  },
];

const TIPS = [
  "Respecte le nombre de mots demandé : trop court pénalise autant que trop long.",
  "Structure toujours ton texte en paragraphes avec une idée par paragraphe.",
  "Utilise des connecteurs logiques (d'abord, ensuite, cependant, en conclusion) pour montrer la cohérence de ton texte.",
  "Réserve 2 minutes à la fin pour te relire et corriger les fautes évidentes (accords, conjugaison).",
];

export default function ExpressionEcrite() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<WritingPromptSummary[] | null>(null);

  useEffect(() => {
    listEePrompts().then(setTopics).catch(() => setTopics([]));
  }, []);

  return (
    <>
      <Seo title="Expression écrite" description="Méthodologie et sujets pratiques pour l'épreuve d'expression écrite du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--ee) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="relative mx-auto grid h-16 w-16 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-secondary-foreground/30 [animation-duration:6s]" />
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-secondary-foreground/10">
              <PenLine className="h-6 w-6" />
            </span>
          </span>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-wide sm:text-5xl">Expression écrite</h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
            Évalue ta capacité à rédiger en français, du message court à l'argumentation structurée.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> ~60 minutes</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><ListChecks className="h-3.5 w-3.5" /> 3 tâches, notées sur 20</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Format de l'épreuve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trois productions écrites de longueur et de complexité croissantes.
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
        <h2 className="text-2xl font-bold sm:text-3xl">Liste des sujets</h2>
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
                to={`/expression-ecrite/${topic.slug}`}
                className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!topic.isFree ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--ee) 18%, transparent)", color: "var(--ee)" }}>
                    <PenLine className="h-4 w-4" />
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
        {!user && <Link to="/inscription" className="btn-primary mt-8 inline-flex">Créer un compte gratuit</Link>}
      </section>
    </>
  );
}
