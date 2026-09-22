import { Seo } from "@/components/Seo";

const SECTIONS = [
  {
    title: "Objet",
    text: "Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation du site Blue Tick Project, plateforme de préparation aux épreuves du TCF Canada. En créant un compte ou en utilisant le site, tu acceptes ces conditions.",
  },
  {
    title: "Description du service",
    text: "Blue Tick Project propose des exercices d'entraînement, des sujets au format examen, des outils de suivi (résultats, progression) et une calculatrice d'estimation de niveau NCLC pour les quatre épreuves du TCF Canada (compréhension orale, compréhension écrite, expression orale, expression écrite).",
  },
  {
    title: "Compte utilisateur",
    text: "La création d'un compte nécessite une adresse email valide. Tu es responsable de la confidentialité de ton mot de passe et de toute activité effectuée depuis ton compte. Un compte est strictement personnel et ne doit pas être partagé.",
  },
  {
    title: "Usage autorisé",
    text: "Le contenu du site (exercices, corrections, sujets, articles) est destiné à un usage personnel d'entraînement. Toute reproduction, revente ou diffusion du contenu sans autorisation est interdite.",
  },
  {
    title: "Absence de garantie de résultat",
    text: "Blue Tick Project est un outil de préparation et d'entraînement. Il ne garantit ni un score minimum à l'examen officiel du TCF Canada, ni l'obtention d'un visa ou d'une résidence permanente au Canada. Les estimations de niveau (NCLC, CECR) fournies par le site sont des approximations pédagogiques, pas des résultats officiels — seul l'organisme certificateur (France Éducation international) délivre un résultat reconnu par IRCC.",
  },
  {
    title: "Abonnements et accès Premium",
    text: "Certaines fonctionnalités sont réservées aux comptes Premium. Les modalités d'abonnement et de paiement sont précisées sur la page Tarifs. Le paiement en ligne (Mobile Money) est en cours de déploiement ; en attendant, la souscription se fait par contact direct avec l'équipe.",
  },
  {
    title: "Résiliation",
    text: "Tu peux demander la suppression de ton compte à tout moment via la page Contact. Blue Tick Project se réserve le droit de suspendre un compte en cas d'usage frauduleux ou de non-respect de ces CGU.",
  },
  {
    title: "Modification des CGU",
    text: "Ces conditions peuvent être mises à jour. La date de dernière mise à jour est indiquée en haut de cette page. L'usage continu du site après modification vaut acceptation des nouvelles conditions.",
  },
  {
    title: "Contact",
    text: "Pour toute question relative à ces conditions, contacte-nous via la page Contact.",
  },
];

export default function Cgu() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Conditions générales d'utilisation" description="Les conditions générales d'utilisation de Blue Tick Project." />
      <div className="text-center">
        <span className="chip">Légal</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Conditions générales d'utilisation</h1>
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
