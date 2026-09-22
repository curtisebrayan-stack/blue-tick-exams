import { Seo } from "@/components/Seo";

const SECTIONS = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    text: "Un cookie est un petit fichier stocké par ton navigateur qui permet à un site de te reconnaître d'une visite à l'autre.",
  },
  {
    title: "Les cookies utilisés sur Blue Tick Project",
    text: "Ce site utilise uniquement un cookie technique indispensable, géré par Supabase, pour maintenir ta session de connexion active. Sans ce cookie, tu serais déconnecté à chaque changement de page.",
  },
  {
    title: "Aucun cookie publicitaire ou de suivi",
    text: "Blue Tick Project n'utilise aucun cookie publicitaire, aucun cookie de mesure d'audience tiers (type Google Analytics ou Facebook Pixel) et ne revend aucune donnée de navigation.",
  },
  {
    title: "Gestion des cookies",
    text: "Le cookie de session étant strictement nécessaire au fonctionnement du site (connexion à ton compte), il ne peut pas être désactivé sans empêcher l'usage du service. Tu peux à tout moment supprimer les cookies via les réglages de ton navigateur — cela te déconnectera simplement de ton compte.",
  },
];

export default function PolitiqueCookies() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Politique de cookies" description="Les cookies utilisés par Blue Tick Project." />
      <div className="text-center">
        <span className="chip">Légal</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Politique de cookies</h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        {SECTIONS.map((section, i) => (
          <div key={section.title} className="border-b border-border pb-6 last:border-0">
            <h2 className="text-lg font-bold text-foreground">{i + 1}. {section.title}</h2>
            <p className="mt-2">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
