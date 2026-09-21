import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Headphones, Clock, ListChecks, Lightbulb, ArrowRight, Lock } from "lucide-react";
import { Seo } from "@/components/Seo";
import { CO_FREE_SLUG } from "@/lib/listeningExercises";
import { listCoSujets, type CoSujetSummary } from "@/lib/coSujets";
import { useAuth } from "@/lib/AuthContext";

const FORMAT_STEPS = [
  {
    title: "Partie 1 — Situations de la vie courante",
    desc: "Annonces, messages, dialogues courts liés à la vie quotidienne. Questions à choix multiple sur l'essentiel du message.",
  },
  {
    title: "Partie 2 — Échanges et dialogues",
    desc: "Conversations entre deux ou plusieurs locuteurs, un peu plus longues. Il faut suivre les points de vue et les intentions de chacun.",
  },
  {
    title: "Partie 3 — Documents longs et formels",
    desc: "Extraits radio, émissions, discours ou annonces officielles. Le vocabulaire et le débit se rapprochent du français authentique.",
  },
];

const TIPS = [
  "Lis les questions et les choix de réponse avant l'écoute quand c'est possible : tu sais déjà quoi chercher.",
  "Ne bloque pas sur un mot inconnu — reste concentré sur le sens général de la phrase.",
  "Chaque document n'est diffusé qu'une fois : entraîne-toi à prendre des notes courtes pendant l'écoute.",
  "Élimine d'abord les réponses clairement fausses avant de choisir entre les options restantes.",
];

const PRACTICE_TOPICS = [
  { label: "Annonces publiques", slug: "annonces-publiques" },
  { label: "Messages vocaux", slug: "messages-vocaux" },
  { label: "Conversations informelles", slug: "conversations-informelles" },
  { label: "Interviews", slug: "interviews" },
  { label: "Bulletins d'information", slug: "bulletins-information" },
  { label: "Émissions de radio", slug: "emissions-radio" },
];

export default function ComprehensionOrale() {
  const { user } = useAuth();
  const [sujets, setSujets] = useState<CoSujetSummary[] | null>(null);

  useEffect(() => {
    listCoSujets().then(setSujets).catch(() => setSujets([]));
  }, []);

  const freeCount = sujets?.filter((s) => s.isFree).length ?? 0;
  const lockedCount = (sujets?.length ?? 0) - freeCount;

  return (
    <>
      <Seo title="Compréhension orale" description="Méthodologie et sujets pratiques pour l'épreuve de compréhension orale du TCF Canada." />
      <section
        className="text-secondary-foreground"
        style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--co) 22%, var(--secondary)), color-mix(in oklch, var(--primary) 26%, var(--secondary)))" }}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="relative mx-auto grid h-16 w-16 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-secondary-foreground/30 [animation-duration:6s]" />
            <span className="relative grid h-12 w-12 place-items-center rounded-full bg-secondary-foreground/10">
              <Headphones className="h-6 w-6" />
            </span>
          </span>
          <h1 className="mt-4 text-3xl font-bold uppercase tracking-wide sm:text-5xl">Compréhension orale</h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
            Évalue ta capacité à comprendre des documents sonores en français, de la conversation simple au discours formel.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> ~35 minutes</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-foreground/10 px-3 py-1.5"><ListChecks className="h-3.5 w-3.5" /> 39 questions à choix multiple</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Format de l'épreuve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          L'épreuve est organisée en trois temps, avec une difficulté croissante.
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
          39 questions, vrais enregistrements audio — le format exact et complet de l'épreuve officielle.
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
                to={`/comprehension-orale/examens/${sujet.slug}`}
                className={`card-shell flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${!sujet.isFree ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--co) 18%, transparent)", color: "var(--co)" }}>
                    <Headphones className="h-4 w-4" />
                  </span>
                  <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${sujet.isFree ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted-foreground">Compréhension orale</p>
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

      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-2xl font-bold sm:text-3xl">Sujets pratiques par thème</h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Généré par synthèse vocale du navigateur, pas un enregistrement humain. Un sujet gratuit pour découvrir le format ; les autres font partie du Premium.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_TOPICS.map((topic) => {
            const isFree = topic.slug === CO_FREE_SLUG;
            return (
              <Link
                key={topic.slug}
                to={`/comprehension-orale/${topic.slug}`}
                className="card-shell flex items-center justify-between gap-3 p-4 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                {topic.label}
                {isFree ? (
                  <ArrowRight className="h-4 w-4 shrink-0" />
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"><Lock className="h-3 w-3" /> Premium</span>
                )}
              </Link>
            );
          })}
        </div>
        {!user && <Link to="/inscription" className="btn-primary mt-8 inline-flex">Créer un compte gratuit</Link>}
      </section>
    </>
  );
}
