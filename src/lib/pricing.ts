// Prix et contenu PLACEHOLDER — à remplacer par tes vraies formules avant mise en ligne.
export type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "gratuit",
    name: "Gratuit",
    price: "0 FCFA",
    period: "",
    description: "Pour découvrir le format du TCF Canada.",
    features: [
      "Méthodologie complète des 4 épreuves",
      "Accès limité aux sujets pratiques",
      "Calculatrice NCLC",
    ],
    cta: "Créer un compte gratuit",
  },
  {
    id: "bronze",
    name: "Bronze",
    price: "5 150 FCFA",
    period: "/ 7 jours",
    description: "Pour un entraînement ponctuel avant une échéance proche.",
    features: [
      "Accès illimité à tous les sujets pratiques",
      "Suivi de progression par épreuve",
      "Corrections détaillées",
    ],
    cta: "Choisir cette formule",
  },
  {
    id: "argent",
    name: "Argent",
    price: "10 815 FCFA",
    period: "/ 30 jours",
    description: "Pour une préparation intensive sur un mois.",
    features: [
      "Accès illimité à tous les sujets pratiques",
      "Suivi de progression par épreuve",
      "Corrections détaillées",
    ],
    highlighted: true,
    cta: "Choisir cette formule",
  },
  {
    id: "or",
    name: "Or",
    price: "20 600 FCFA",
    period: "/ 60 jours",
    description: "Pour une préparation complète sur deux mois.",
    features: [
      "Tout Argent",
      "Accès prioritaire aux nouveaux sujets",
    ],
    cta: "Choisir cette formule",
  },
  {
    id: "diamant",
    name: "Diamant",
    price: "36 050 FCFA",
    period: "/ 180 jours",
    description: "Le meilleur tarif dégressif pour une préparation longue durée.",
    features: [
      "Tout Or",
      "Accès prioritaire aux nouveaux sujets",
    ],
    cta: "Choisir cette formule",
  },
];
