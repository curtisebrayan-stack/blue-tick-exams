export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readTime: string;
  content: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "reussir-le-tcf-canada",
    title: "Comment réussir le TCF Canada : les fondamentaux",
    category: "Guide général",
    excerpt: "Les quatre épreuves ne se préparent pas de la même façon. Voici par où commencer pour construire un plan d'entraînement efficace.",
    readTime: "6 min",
    content: [
      "Le TCF Canada évalue quatre compétences distinctes : la compréhension orale, la compréhension écrite, l'expression orale et l'expression écrite. Contrairement à un examen scolaire classique, il n'y a pas de note globale à viser en premier : chaque épreuve compte séparément, et la plupart des programmes d'immigration fixent un seuil minimum sur chacune d'entre elles.",
      "La première étape consiste donc à identifier ton point faible. Beaucoup de candidats francophones natifs sous-estiment l'expression écrite, où la rigueur de la structure et de l'orthographe pèse autant que le fond. À l'inverse, les candidats non francophones ont souvent besoin de plus de temps sur la compréhension orale, qui demande une oreille entraînée aux accents et aux débits variés.",
      "Une fois ce diagnostic posé, mieux vaut répartir son temps de préparation sur plusieurs semaines courtes plutôt que sur quelques sessions longues. La régularité compte plus que l'intensité : 30 minutes par jour sur plusieurs semaines donnent de meilleurs résultats qu'une révision de dernière minute.",
      "Enfin, entraîne-toi dans les conditions réelles de l'examen dès que possible : mêmes durées, mêmes contraintes, sans dictionnaire ni pause. C'est la meilleure façon de repérer les blocages avant le jour J.",
    ],
  },
  {
    slug: "tcf-canada-immigration-nclc",
    title: "TCF Canada et immigration : comprendre le NCLC",
    category: "Immigration",
    excerpt: "Le score du TCF Canada n'est qu'une étape : c'est sa conversion en NCLC qui compte pour ton dossier d'immigration.",
    readTime: "5 min",
    content: [
      "Le NCLC (Niveaux de compétence linguistique canadiens) est l'échelle utilisée par IRCC pour évaluer le niveau de français des candidats à l'immigration, tout comme le CLB est utilisé pour l'anglais. Ton résultat au TCF Canada est converti en NCLC selon un barème officiel, épreuve par épreuve.",
      "C'est une source fréquente de confusion : un excellent score en compréhension orale ne compense pas un score plus faible en expression écrite. Pour la plupart des programmes, comme Entrée express, c'est le NCLC le plus bas de tes quatre épreuves qui détermine ton profil linguistique global.",
      "Avant de passer l'examen, il est donc utile d'estimer où tu te situes sur chacune des quatre compétences, pas seulement à l'oral ou à l'écrit dans l'ensemble. Notre calculatrice NCLC permet de faire cette estimation à partir de résultats d'entraînement ou d'un résultat officiel déjà obtenu.",
    ],
  },
  {
    slug: "combien-de-temps-pour-se-preparer",
    title: "Combien de temps pour se préparer au TCF Canada ?",
    category: "Stratégies d'examen",
    excerpt: "Il n'y a pas de durée universelle, mais quelques repères pour construire un calendrier réaliste selon ton niveau de départ.",
    readTime: "4 min",
    content: [
      "La durée de préparation dépend surtout de l'écart entre ton niveau actuel et le NCLC visé. Un candidat déjà à l'aise à l'oral et à l'écrit peut se contenter de quelques semaines de familiarisation avec le format de l'examen. Un candidat visant une progression de plusieurs niveaux NCLC doit compter plusieurs mois d'entraînement régulier.",
      "En pratique, une préparation de 4 à 8 semaines avec un entraînement quotidien court suffit généralement à se familiariser avec le format et à corriger les erreurs les plus fréquentes, sans viser une progression de niveau de langue en elle-même.",
      "Le plus important reste de tester ton niveau tôt, avec des sujets dans les conditions de l'examen, pour ajuster ton calendrier plutôt que de le fixer à l'avance sans données.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
