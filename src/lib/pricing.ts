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
    id: "premium-mensuel",
    name: "Premium mensuel",
    price: "9 999 FCFA",
    period: "/mois",
    description: "Pour une préparation intensive avant l'examen.",
    features: [
      "Accès illimité à tous les sujets pratiques",
      "Suivi de progression par épreuve",
      "Corrections détaillées",
      "Sans engagement",
    ],
    highlighted: true,
    cta: "Choisir cette formule",
  },
  {
    id: "premium-annuel",
    name: "Premium annuel",
    price: "79 999 FCFA",
    period: "/an",
    description: "Le même accès complet, en tarif dégressif.",
    features: [
      "Tout Premium mensuel",
      "2 mois offerts par rapport au mensuel",
      "Accès prioritaire aux nouveaux sujets",
    ],
    cta: "Choisir cette formule",
  },
];
