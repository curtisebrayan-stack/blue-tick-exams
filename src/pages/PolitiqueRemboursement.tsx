import { Seo } from "@/components/Seo";

const SECTIONS = [
  {
    title: "Compte gratuit",
    text: "L'inscription et l'accès au contenu gratuit de Blue Tick Project ne sont soumis à aucun paiement et ne sont donc concernés par aucune politique de remboursement.",
  },
  {
    title: "Abonnements Premium",
    text: "Les abonnements payants donnent accès à l'ensemble des sujets, examens blancs et corrections détaillées pour la durée indiquée au moment de la souscription (voir la page Tarifs).",
  },
  {
    title: "Droit de rétractation",
    text: "Conformément à l'usage pour les contenus numériques accessibles immédiatement, une fois qu'un accès Premium a été activé sur un compte, il n'est en principe plus remboursable. Si tu rencontres un problème technique t'ayant empêché d'utiliser le service (compte inaccessible, contenu manquant), contacte-nous dans les 48 heures suivant la souscription : nous examinons chaque situation au cas par cas.",
  },
  {
    title: "Erreur de paiement",
    text: "En cas de double prélèvement, de montant incorrect ou d'erreur technique lors du paiement (Mobile Money ou autre moyen proposé), contacte-nous immédiatement via la page Contact avec la preuve de transaction : le trop-perçu est remboursé.",
  },
  {
    title: "Comment demander un remboursement",
    text: "Toute demande se fait via la page Contact, en précisant ton adresse email de compte, la date de la transaction et le motif. Nous répondons sous quelques jours ouvrés.",
  },
];

export default function PolitiqueRemboursement() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Politique de remboursement" description="Les conditions de remboursement des abonnements Blue Tick Project." />
      <div className="text-center">
        <span className="chip">Légal</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Politique de remboursement</h1>
        <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</p>
      </div>

      <div className="mt-8 rounded-xl border-l-4 border-primary bg-primary/5 p-5 text-sm text-muted-foreground">
        Le paiement en ligne est en cours de déploiement sur Blue Tick Project. Cette page s'applique dès qu'un abonnement payant est activé sur ton compte, quel que soit le moyen de paiement utilisé.
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
