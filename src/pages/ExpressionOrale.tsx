import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mic, Clock, ListChecks, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { listEoPrompts, type SpeakingPromptSummary } from "@/lib/speakingPrompts";

const FORMAT_STEPS = [
  {
    title: "Tâche 1 — Se présenter",
    desc: "Répondre à des questions personnelles simples : toi, ta famille, tes goûts, ton quotidien. (~3 minutes)",
  },
  {
    title: "Tâche 2 — Poser des questions",
    desc: "À partir d'un thème et de mots-clés donnés, poser des questions à l'examinateur pour obtenir des informations. (~4 minutes)",
  },
  {
    title: "Tâche 3 — Argumenter un point de vue",
    desc: "Défendre une opinion sur un sujet donné et échanger avec l'examinateur, qui peut objecter. (~5 minutes)",
  },
];

const TIPS = [
  "Parle avec assurance même en cas d'hésitation : le débit et l'aisance comptent autant que la grammaire parfaite.",
  "Sur la tâche 2, prépare des questions variées (qui, quoi, où, pourquoi) plutôt que des questions fermées.",
  "Sur la tâche 3, prends clairement position puis justifie avec un exemple concret.",
  "Reformule si tu te trompes plutôt que de t'arrêter : la fluidité prime sur la perfection.",
];

export default function ExpressionOrale() {
  const [topics, setTopics] = useState<SpeakingPromptSummary[] | null>(null);

  useEffect(() => {
    listEoPrompts().then(setTopics).catch(() => setTopics([]));
  }, []);

  return (
    <>
      <Seo title="Expression orale" description="Méthodologie et sujets pratiques pour l'épreuve d'expression orale du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--eo) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="relative mx-auto grid h-16 w-16 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-secondary-foreground/30 [animation-duration:6s]" />
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-secondary-foreground/10">
              <Mic className="h-6 w-6" />
            </span>
          </span>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-wide sm:text-5xl">Expression orale</h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
            Évalue ta capacité à t'exprimer à l'oral en français, seul face à un examinateur.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> ~12 minutes</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><ListChecks className="h-3.5 w-3.5" /> 3 tâches, notées sur 20</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Format de l'épreuve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Trois tâches enchaînées, en face à face avec l'examinateur.
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
                to={`/expression-orale/${topic.slug}`}
                className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!topic.isFree ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--eo) 18%, transparent)", color: "var(--eo)" }}>
                    <Mic className="h-4 w-4" />
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
      </section>
    </>
  );
}
