import { Link } from "react-router-dom";
import { ChevronDown, Mail } from "lucide-react";
import { Seo } from "@/components/Seo";

const CATEGORIES = [
  {
    title: "Examens",
    items: [
      {
        q: "TCF Canada ou TEF Canada, quelle différence ?",
        a: "Ce sont deux examens de français différents, tous les deux acceptés par IRCC pour l'immigration (notamment Entrée express). Ils évaluent les mêmes quatre compétences (compréhension orale, compréhension écrite, expression orale, expression écrite) mais avec des formats et des organismes différents. Blue Tick Project prépare actuellement au TCF Canada ; le TEF Canada est en préparation.",
      },
      {
        q: "Quel niveau viser pour mon dossier d'immigration ?",
        a: "Ça dépend du programme d'immigration visé (Entrée express, un programme provincial, etc.) et du nombre de points recherché. La calculatrice NCLC du site te donne une estimation, mais pour les exigences précises de ton dossier, consulte le site officiel d'IRCC.",
      },
      {
        q: "Les résultats du site remplacent-ils l'examen officiel ?",
        a: "Non. Les scores et niveaux estimés sur Blue Tick Project sont des outils d'entraînement pédagogique, pas des résultats officiels. Seul l'organisme certificateur (France Éducation international) délivre une attestation reconnue par IRCC.",
      },
    ],
  },
  {
    title: "Compte",
    items: [
      {
        q: "Comment créer un compte ?",
        a: "Clique sur \"Créer un compte gratuit\" en haut du site, renseigne ton email et un mot de passe, ou connecte-toi directement avec Google.",
      },
      {
        q: "Puis-je utiliser le site depuis mon téléphone ?",
        a: "Oui, le site est utilisable depuis un ordinateur, une tablette ou un smartphone, sans rien installer.",
      },
      {
        q: "J'ai oublié mon mot de passe, comment faire ?",
        a: "Sur la page de connexion, clique sur \"Mot de passe oublié\" et suis les instructions envoyées par email.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        q: "Quels moyens de paiement sont acceptés ?",
        a: "Le paiement en ligne (Mobile Money) est en cours de mise en place. En attendant, la souscription à un abonnement Premium se fait par contact direct avec l'équipe — voir la page Tarifs.",
      },
      {
        q: "Puis-je annuler mon abonnement ?",
        a: "Oui, contacte-nous via la page Contact pour toute demande liée à ton abonnement.",
      },
      {
        q: "Comment obtenir un reçu ?",
        a: "Un reçu peut être fourni sur demande via la page Contact, en précisant l'email associé à ton compte.",
      },
    ],
  },
  {
    title: "Formation",
    items: [
      {
        q: "Combien de questions comporte un sujet au format examen ?",
        a: "Les sujets \"format examen\" de compréhension orale et écrite comportent 39 questions chacun, comme le format réel du TCF Canada.",
      },
      {
        q: "Les corrections sont-elles automatiques ?",
        a: "Pour la compréhension orale et écrite, oui : la bonne réponse et un écran de résultats détaillé s'affichent immédiatement après chaque sujet. Pour l'expression orale et écrite, une grille d'auto-évaluation guide ta relecture.",
      },
      {
        q: "Puis-je refaire un exercice déjà fait ?",
        a: "Oui, tu peux refaire n'importe quel sujet autant de fois que tu veux, sauf si le \"Mode examen réel\" est activé sur un enregistrement d'expression orale (une seule tentative, comme le jour de l'examen).",
      },
    ],
  },
];

export default function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="FAQ" description="Les questions fréquentes sur Blue Tick Project : examens, compte, paiement, formation." />
      <div className="text-center">
        <span className="chip">Questions fréquentes</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Une question ?</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Retrouve les réponses aux questions les plus fréquentes sur les examens, ton compte, le paiement et la formation.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {CATEGORIES.map((category) => (
          <div key={category.title}>
            <h2 className="font-display text-lg font-bold text-primary">{category.title}</h2>
            <div className="mt-4 space-y-3">
              {category.items.map((item) => (
                <details key={item.q} className="card-shell group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                    {item.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card-shell mt-12 flex flex-col items-start gap-4 border-primary/20 bg-primary/5 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold">Une autre question ?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Écris-nous, on te répond directement.</p>
          </div>
        </div>
        <Link to="/contact" className="btn-primary shrink-0">Nous contacter</Link>
      </div>
    </section>
  );
}
