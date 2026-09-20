import { Seo } from "@/components/Seo";

const SECTIONS = [
  {
    title: "Collecte d'informations",
    text: "Lors de la création d'un compte, nous collectons ton adresse email et ton mot de passe (stocké de façon chiffrée, jamais en clair). Lorsque tu réalises un sujet pratique, nous enregistrons ton score, l'épreuve et le sujet concernés, ainsi que la date.",
  },
  {
    title: "Utilisation des informations",
    text: "Ces données servent uniquement à faire fonctionner ton compte et à t'afficher ta progression personnelle sur la page \"Ma progression\". Nous ne vendons ni ne partageons tes données avec des tiers à des fins commerciales.",
  },
  {
    title: "Hébergement",
    text: "Les comptes et résultats sont hébergés via Supabase, qui fournit l'authentification et la base de données de ce site. Chaque utilisateur ne peut accéder qu'à ses propres résultats — c'est appliqué techniquement, pas seulement une promesse.",
  },
  {
    title: "Tes droits",
    text: "Tu peux demander la suppression de ton compte et de toutes tes données associées à tout moment en nous écrivant via la page Contact.",
    isRights: true,
  },
  {
    title: "Cookies",
    text: "Ce site utilise uniquement un cookie technique nécessaire au maintien de ta session de connexion. Aucun cookie publicitaire ou de suivi tiers n'est utilisé.",
  },
];

export default function Confidentialite() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Politique de confidentialité" description="Comment Blue Tick Project collecte et protège tes données." />
      <div className="text-center">
        <span className="chip">Légal</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-primary bg-primary/5 p-5 text-sm text-muted-foreground">
        Cette page explique quelles données Blue Tick Project collecte, pourquoi, et comment elles sont protégées. Ton compte et tes résultats
        restent privés : seuls toi (et l'équipe technique, si nécessaire) peuvent y accéder.
      </div>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        {SECTIONS.map((section, i) => (
          <div key={section.title} className="border-b border-border pb-6 last:border-0">
            <h2 className="text-lg font-bold text-foreground">{i + 1}. {section.title}</h2>
            <p className="mt-2">
              {section.isRights ? (
                <>
                  Tu peux demander la suppression de ton compte et de toutes tes données associées à tout moment en nous écrivant via la page{" "}
                  <a href="/contact" className="font-semibold text-primary hover:underline">Contact</a>.
                </>
              ) : (
                section.text
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
