import { Link } from "react-router-dom";
import {
  Headphones, BookOpen, Mic, PenLine, Calculator, ArrowRight,
  Target, ListChecks, Smartphone,
  Layers, Landmark, ExternalLink,
  UserPlus, Dumbbell, FileCheck2, LineChart, ChevronDown,
} from "lucide-react";
import { Seo } from "@/components/Seo";
import { ARTICLES } from "@/lib/blog";
import { useAuth } from "@/lib/AuthContext";

const SKILLS = [
  { to: "/comprehension-orale", label: "Compréhension orale", icon: Headphones, color: "var(--co)", topics: "Sujets pratiques disponibles", duration: "~35 min à l'examen" },
  { to: "/comprehension-ecrite", label: "Compréhension écrite", icon: BookOpen, color: "var(--ce)", topics: "Sujets pratiques disponibles", duration: "~60 min à l'examen" },
  { to: "/expression-orale", label: "Expression orale", icon: Mic, color: "var(--eo)", topics: "Sujets pratiques disponibles", duration: "~12 min à l'examen" },
  { to: "/expression-ecrite", label: "Expression écrite", icon: PenLine, color: "var(--ee)", topics: "Sujets pratiques disponibles", duration: "~60 min à l'examen" },
];

const ADVANTAGES = [
  { icon: Target, title: "Format proche du test", desc: "Des exercices calqués sur les conditions réelles de l'examen TCF Canada." },
  { icon: ListChecks, title: "Les quatre épreuves", desc: "Compréhension orale, compréhension écrite, expression orale et expression écrite couvertes." },
  { icon: Smartphone, title: "Web et mobile", desc: "Un entraînement accessible depuis n'importe quel appareil, à ton rythme." },
];

const STEPS = [
  { icon: UserPlus, title: "Créez votre compte", desc: "Inscription gratuite en quelques secondes." },
  { icon: Headphones, title: "Choisissez une épreuve", desc: "Compréhension orale, écrite, expression orale ou écrite." },
  { icon: Dumbbell, title: "Entraînez-vous", desc: "Des exercices ciblés, au format proche de l'examen réel." },
  { icon: FileCheck2, title: "Faites un examen blanc", desc: "Simulation chronométrée complète, comme le jour J." },
  { icon: LineChart, title: "Suivez votre progression", desc: "Retrouve tous tes résultats sur ton profil." },
];

const FAQ_TEASER = [
  { q: "TCF Canada ou TEF Canada, quelle différence ?", a: "Ce sont deux examens de français différents, tous les deux acceptés par IRCC pour l'immigration. Blue Tick Project prépare actuellement au TCF Canada ; le TEF Canada est en préparation." },
  { q: "Puis-je utiliser le site depuis mon téléphone ?", a: "Oui, le site est utilisable depuis un ordinateur, une tablette ou un smartphone, sans rien installer." },
  { q: "Les corrections sont-elles automatiques ?", a: "Pour la compréhension orale et écrite, oui : la bonne réponse et un écran de résultats détaillé s'affichent immédiatement après chaque sujet." },
  { q: "Quels moyens de paiement sont acceptés ?", a: "Le paiement en ligne est en cours de mise en place. En attendant, la souscription à un abonnement Premium se fait par contact direct avec l'équipe." },
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <Seo
        title="Blue Tick Project"
        description="Préparation structurée aux quatre épreuves du TCF Canada : compréhension orale, compréhension écrite, expression orale, expression écrite."
      />
      {/* HERO */}
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="chip">Préparation TCF Canada</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-6xl">
            Prépare ton TCF Canada, <span className="text-primary">une épreuve à la fois</span>
          </h1>
          <p className="mt-4 max-w-xl text-secondary-foreground/70">
            Un parcours d'entraînement structuré pour les quatre épreuves du TCF Canada, du niveau débutant aux sujets avancés.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <Link
                key={skill.to}
                to={skill.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/20 px-3 py-1.5 text-xs font-semibold transition hover:border-primary"
              >
                <span style={{ color: skill.color }}><skill.icon className="h-3.5 w-3.5" /></span>
                {skill.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {!user && <Link to="/inscription" className="btn-primary">Créer un compte gratuit</Link>}
            <Link to="/tarifs" className="btn-outline">Voir les tarifs</Link>
          </div>
        </div>
      </section>

      {/* 3 AVANTAGES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-shell p-6">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
        {!user && (
          <div className="mt-8 border-t border-border pt-6 text-center">
            <Link to="/inscription" className="text-sm font-semibold text-primary hover:underline">Créer un compte gratuit →</Link>
          </div>
        )}
      </section>

      {/* 4 ÉPREUVES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <span className="chip">Parcours par épreuve</span>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Choisissez une épreuve pour <span className="text-primary">commencer</span></h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {SKILLS.map(({ to, label, icon: Icon, color, topics, duration }) => (
            <Link key={to} to={to} className="card-shell group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)`, color }}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{label}</h3>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{topics}</span>
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{duration}</span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="text-xs font-semibold text-muted-foreground">Méthodologie</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Voir les sujets <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* COMMENT ÇA FONCTIONNE */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="chip">Le parcours</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Comment ça fonctionne ?</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-5">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="card-shell relative flex flex-col items-center p-5 text-center">
                <span className="absolute -top-3 left-1/2 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="mt-3 grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 font-display text-sm font-bold">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS TEASER */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="chip">Abonnements</span>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Choisis ton parcours</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Commence gratuitement, passe en Premium quand tu es prêt à t'entraîner sans limite.</p>
          <Link to="/tarifs" className="btn-outline mt-6 inline-flex">Voir les tarifs</Link>
        </div>
      </section>

      {/* BLOG TEASER */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <span className="chip">Ressources</span>
        <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Derniers articles</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {ARTICLES.slice(0, 3).map((article) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} className="card-shell p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="font-display text-base font-bold">{article.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{article.excerpt}</p>
              <p className="mt-4 text-xs font-semibold text-primary">{article.readTime} de lecture</p>
            </Link>
          ))}
        </div>
        <Link to="/blog" className="btn-outline mt-6 inline-flex">Voir le blog</Link>
      </section>

      {/* FAQ TEASER */}
      <section className="bg-muted">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <span className="chip">Questions fréquentes</span>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Une question ?</h2>
          </div>
          <div className="mt-10 space-y-3">
            {FAQ_TEASER.map((item) => (
              <details key={item.q} className="card-shell group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/faq" className="text-sm font-semibold text-primary hover:underline">Voir toute la FAQ →</Link>
          </div>
        </div>
      </section>

      {/* PLATEFORME TEF CANADA */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="card-shell flex flex-col items-start gap-4 border-accent/30 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="chip !bg-accent !text-accent-foreground"><Layers className="h-3.5 w-3.5" /> Autre test</span>
              <h2 className="mt-3 text-2xl font-bold">Tu prépares plutôt le <span className="text-accent">TEF Canada</span> ?</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Une préparation miroir pour le TEF Canada arrive prochainement sur web et mobile.
              </p>
            </div>
            <span className="btn-outline shrink-0 cursor-default opacity-70">Bientôt disponible</span>
          </div>
        </div>
      </section>

      {/* CALCULATRICE NCLC */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="card-shell flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="chip"><Calculator className="h-3.5 w-3.5" /> Outil</span>
            <h2 className="mt-3 text-2xl font-bold">Calculatrice NCLC</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Estime ton niveau NCLC à partir de tes résultats aux quatre épreuves du TCF Canada.</p>
          </div>
          <Link to="/calculatrice-nclc" className="btn-primary shrink-0">Calculer mon NCLC</Link>
        </div>
      </section>

      {/* INFOS OFFICIELLES IRCC */}
      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="card-shell flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="chip"><Landmark className="h-3.5 w-3.5" /> Ressource officielle</span>
              <h2 className="mt-3 text-2xl font-bold">Informations officielles sur l'immigration au Canada</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Pour consulter les exigences, procédures et informations officielles, rendez-vous sur le site d'Immigration, Réfugiés et Citoyenneté Canada (IRCC).
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link to="/immigration-canada" className="btn-primary">
                Voir les exigences linguistiques
              </Link>
              <a
                href="https://www.canada.ca/"
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                Site officiel d'IRCC <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
