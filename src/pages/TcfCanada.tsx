import { Link } from "react-router-dom";
import { Headphones, BookOpen, Mic, PenLine, ArrowRight, Target, FileCheck2, Clock } from "lucide-react";
import { Seo } from "@/components/Seo";

const SKILLS = [
  { to: "/comprehension-orale", label: "Compréhension orale", icon: Headphones, color: "var(--co)", duration: "~35 min à l'examen" },
  { to: "/comprehension-ecrite", label: "Compréhension écrite", icon: BookOpen, color: "var(--ce)", duration: "~60 min à l'examen" },
  { to: "/expression-orale", label: "Expression orale", icon: Mic, color: "var(--eo)", duration: "~12 min à l'examen" },
  { to: "/expression-ecrite", label: "Expression écrite", icon: PenLine, color: "var(--ee)", duration: "~60 min à l'examen" },
];

export default function TcfCanada() {
  return (
    <>
      <Seo
        title="Préparation TCF Canada"
        description="Préparation complète au TCF Canada : les quatre épreuves, des examens blancs chronométrés et un suivi de ton objectif NCLC."
      />

      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <span className="chip">🇨🇦 Examen</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold sm:text-5xl">Préparation TCF Canada</h1>
          <p className="mt-4 max-w-xl text-secondary-foreground/70">
            Le Test de connaissance du français pour le Canada évalue quatre compétences, reconnues par IRCC pour
            l'immigration. Entraîne-toi épreuve par épreuve, puis teste-toi en conditions réelles avec les examens blancs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <h2 className="text-2xl font-bold sm:text-3xl">Les quatre épreuves</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {SKILLS.map(({ to, label, icon: Icon, color, duration }) => (
            <Link key={to} to={to} className="card-shell group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-11 w-11 place-items-center rounded-lg" style={{ backgroundColor: `color-mix(in oklch, ${color} 18%, transparent)`, color }}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{label}</h3>
              <span className="inline-flex w-fit items-center rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{duration}</span>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                <span className="text-xs font-semibold text-muted-foreground">Méthodologie et sujets</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  S'entraîner <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="card-shell flex flex-col items-start gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="chip"><FileCheck2 className="h-3.5 w-3.5" /> Examens blancs</span>
              <h2 className="mt-3 text-2xl font-bold">Teste-toi en conditions réelles</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Des sujets complets au format examen (39 questions), avec le mode examen réel pour un chrono par question
                et une navigation bloquée — exactement comme le jour J.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link to="/comprehension-orale" className="btn-primary">
                <Clock className="h-4 w-4" /> Sujets CO
              </Link>
              <Link to="/comprehension-ecrite" className="btn-outline">
                Sujets CE
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="card-shell flex flex-col items-start gap-4 border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">Définis ton objectif</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Indique le niveau NCLC que tu vises et la date prévue de ton examen pour suivre ta progression.
              </p>
            </div>
          </div>
          <Link to="/profil" className="btn-primary shrink-0">Mon objectif</Link>
        </div>
      </section>
    </>
  );
}
