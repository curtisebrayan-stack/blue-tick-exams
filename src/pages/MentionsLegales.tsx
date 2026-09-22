import { Seo } from "@/components/Seo";

const SECTIONS = [
  {
    title: "Éditeur du site",
    text: "Blue Tick Project — [Raison sociale / forme juridique / numéro d'immatriculation à compléter]. Adresse : [à compléter]. Contact : contact@blueticksproject.com.",
  },
  {
    title: "Directeur de publication",
    text: "[Nom du responsable de publication à compléter].",
  },
  {
    title: "Hébergement",
    text: "Le site web est hébergé par Vercel Inc. (340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis). La base de données, l'authentification et le stockage des fichiers sont assurés par Supabase.",
  },
  {
    title: "Nom de domaine",
    text: "Le nom de domaine blueticksproject.com est enregistré via OVH.",
  },
  {
    title: "Propriété intellectuelle",
    text: "L'ensemble des contenus présents sur Blue Tick Project (textes, exercices, sujets, mise en page, logo) est protégé et ne peut être reproduit sans autorisation préalable, à l'exception d'un usage personnel d'entraînement.",
  },
  {
    title: "Contact",
    text: "Pour toute question relative à ces mentions légales, écris-nous via la page Contact.",
  },
];

export default function MentionsLegales() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Mentions légales" description="Les mentions légales de Blue Tick Project." />
      <div className="text-center">
        <span className="chip">Légal</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Mentions légales</h1>
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
