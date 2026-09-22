import { Link } from "react-router-dom";
import { AlertTriangle, ExternalLink, Landmark, Calculator } from "lucide-react";
import { Seo } from "@/components/Seo";

const TESTS = [
  {
    lang: "Français",
    tests: [
      { name: "TCF Canada", desc: "Test de connaissance du français, organisé par France Éducation international. Préparation disponible sur Blue Tick Project." },
      { name: "TEF Canada", desc: "Test d'évaluation de français, organisé par la Chambre de commerce et d'industrie de Paris Île-de-France." },
    ],
  },
  {
    lang: "Anglais",
    tests: [
      { name: "IELTS General Training", desc: "Test d'anglais reconnu internationalement, version \"General Training\" pour l'immigration." },
      { name: "CELPIP-General", desc: "Test d'anglais canadien, spécifiquement conçu pour l'immigration et la citoyenneté." },
      { name: "PTE Core", desc: "Test d'anglais Pearson, plus récemment accepté par IRCC pour Entrée express." },
    ],
  },
];

const SECTIONS = [
  {
    title: "Entrée express",
    text: "Entrée express est le système de gestion des demandes pour plusieurs programmes d'immigration économique au Canada (dont le Programme des travailleurs qualifiés fédéral). Les candidats sont classés selon un système de points, le Classement global, qui prend notamment en compte les résultats aux tests de langue officiels.",
  },
  {
    title: "NCLC et CLB",
    text: "Le NCLC (Niveaux de compétence linguistique canadiens) et le CLB (Canadian Language Benchmarks) sont les échelles utilisées par IRCC pour convertir un résultat de test de langue en un niveau standardisé, de 4 à 10 et plus. Chaque test de langue (TCF, TEF, IELTS, CELPIP, PTE) a sa propre grille de conversion officielle vers ces niveaux.",
  },
];

export default function ImmigrationCanada() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo
        title="Comprendre les exigences linguistiques pour immigrer au Canada"
        description="TCF Canada, TEF Canada, IELTS, CELPIP, PTE Core, NCLC/CLB : ce qu'il faut savoir sur les exigences linguistiques d'IRCC."
      />
      <div className="text-center">
        <span className="chip"><Landmark className="h-3.5 w-3.5" /> Immigration</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
          Comprendre les exigences linguistiques <span className="text-primary">pour immigrer au Canada</span>
        </h1>
      </div>

      <div className="mt-8 flex items-start gap-3 rounded-xl border-l-4 border-amber-500 bg-amber-500/10 p-5 text-sm text-amber-600">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <p>
          Blue Tick Project est une plateforme de préparation linguistique et ne fournit pas de conseil juridique en immigration.
          Les exigences officielles d'IRCC peuvent évoluer (notamment la validité des résultats de test, actuellement limitée à
          moins de deux ans pour certaines étapes d'Entrée express) — consulte toujours{" "}
          <a href="https://www.canada.ca/" target="_blank" rel="noreferrer" className="font-semibold underline">canada.ca</a>{" "}
          pour les informations à jour.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title} className="card-shell p-6">
            <h2 className="font-display text-lg font-bold">{section.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{section.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-bold">Les tests de langue acceptés pour Entrée express</h2>
      <p className="mt-2 text-sm text-muted-foreground">D'après les informations actuellement publiées par IRCC.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {TESTS.map((group) => (
          <div key={group.lang} className="card-shell p-6">
            <span className="chip">{group.lang}</span>
            <div className="mt-4 space-y-4">
              {group.tests.map((test) => (
                <div key={test.name} className="border-t border-border pt-4 first:border-0 first:pt-0">
                  <p className="font-semibold">{test.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{test.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card-shell mt-10 flex flex-col items-start gap-4 border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Calculator className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">Estime ton niveau NCLC</h2>
            <p className="mt-1 text-sm text-muted-foreground">À partir de tes résultats (réels ou visés) au TCF Canada.</p>
          </div>
        </div>
        <Link to="/calculatrice-nclc" className="btn-primary shrink-0">Ouvrir la calculatrice</Link>
      </div>

      <a
        href="https://www.canada.ca/"
        target="_blank"
        rel="noreferrer"
        className="btn-outline mt-6 inline-flex"
      >
        Consulter le site officiel d'IRCC <ExternalLink className="h-4 w-4" />
      </a>
    </section>
  );
}
