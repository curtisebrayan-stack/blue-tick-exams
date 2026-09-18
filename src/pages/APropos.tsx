import { Link } from "react-router-dom";
import { Target, ShieldCheck, Wrench, Mail, ArrowRight } from "lucide-react";
import { Seo } from "@/components/Seo";

const POINTS = [
  {
    icon: Target,
    title: "Notre mission",
    text: "Donner aux candidats au TCF Canada un parcours d'entraînement clair, centré sur les quatre épreuves réellement exigées pour l'immigration, sans contenu superflu.",
  },
  {
    icon: ShieldCheck,
    title: "Indépendance",
    text: "Blue Tick Exams est un site indépendant. Nous ne sommes affiliés ni à France Éducation international, ni à IRCC, ni à aucun organisme officiel du TCF.",
  },
  {
    icon: Wrench,
    title: "En construction",
    text: "La plateforme est en développement actif : de nouveaux sujets d'entraînement sont ajoutés régulièrement pour les quatre épreuves.",
  },
];

export default function APropos() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="À propos" description="La mission et l'indépendance de Blue Tick Exams." />
      <div className="text-center">
        <span className="chip">À propos</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Qui sommes-nous ?</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          Blue Tick Exams est né d'un constat simple : préparer le TCF Canada demande de s'entraîner sur un format précis,
          pas de réviser le français en général. Ce site propose un parcours structuré autour des quatre épreuves
          réellement notées pour un dossier d'immigration.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {POINTS.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className={`card-shell flex gap-4 p-6 ${i === POINTS.length - 1 && POINTS.length % 2 !== 0 ? "sm:col-span-2" : ""}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card-shell mt-10 flex flex-col items-start gap-4 border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">Contactez-nous</h2>
            <p className="mt-1 text-sm text-muted-foreground">Une question sur la plateforme ? Écris-nous directement.</p>
          </div>
        </div>
        <Link to="/contact" className="btn-primary shrink-0">
          Accéder à la page de contact <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
