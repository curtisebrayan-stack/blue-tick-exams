export type ListeningQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type ListeningExercise = {
  slug: string;
  skill: "co";
  title: string;
  transcript: string;
  questions: ListeningQuestion[];
};

export const CO_FREE_SLUG = "annonces-publiques";

const CO_ANNONCES_PUBLIQUES: ListeningExercise = {
  slug: "annonces-publiques",
  skill: "co",
  title: "Annonces publiques",
  transcript:
    "Attention, s'il vous plaît. Le train à destination de Douala, initialement prévu au départ de la voie 3 à 14 heures 20, partira finalement de la voie 7, avec un retard de quinze minutes. Nous invitons les voyageurs à se rendre rapidement sur la voie 7. Les personnes ayant besoin d'assistance sont priées de se présenter au guichet d'information. Nous nous excusons pour la gêne occasionnée.",
  questions: [
    {
      question: "Quel changement concerne le train pour Douala ?",
      options: [
        "Il est annulé",
        "Il change de voie et prend du retard",
        "Il part plus tôt que prévu",
        "Il change de destination",
      ],
      correctIndex: 1,
    },
    {
      question: "De quelle voie le train partira-t-il finalement ?",
      options: ["Voie 3", "Voie 5", "Voie 7", "Voie 14"],
      correctIndex: 2,
    },
    {
      question: "De combien de temps est le retard annoncé ?",
      options: ["5 minutes", "15 minutes", "20 minutes", "30 minutes"],
      correctIndex: 1,
    },
    {
      question: "Que doivent faire les personnes ayant besoin d'assistance ?",
      options: [
        "Attendre sur le quai",
        "Se présenter au guichet d'information",
        "Appeler un numéro spécial",
        "Monter directement dans le train",
      ],
      correctIndex: 1,
    },
  ],
};

const CO_MESSAGES_VOCAUX: ListeningExercise = {
  slug: "messages-vocaux",
  skill: "co",
  title: "Messages vocaux",
  transcript:
    "Salut, c'est Aminata. Écoute, je t'appelle parce que je ne vais pas pouvoir venir chercher les enfants à l'école ce soir, j'ai une réunion qui s'est rajoutée à la dernière minute. Est-ce que tu pourrais y aller à ma place, vers 17 heures ? Sinon, appelle ma sœur, elle a dit qu'elle pouvait être disponible en cas de besoin. Rappelle-moi quand tu peux pour me dire si ça marche. Merci, à plus tard.",
  questions: [
    {
      question: "Pourquoi Aminata appelle-t-elle ?",
      options: [
        "Pour annuler un rendez-vous médical",
        "Pour demander d'aller chercher les enfants à l'école",
        "Pour prévenir d'un retard au travail",
        "Pour organiser une fête",
      ],
      correctIndex: 1,
    },
    {
      question: "Pourquoi Aminata ne peut-elle pas s'en occuper elle-même ?",
      options: [
        "Elle est malade",
        "Sa voiture est en panne",
        "Une réunion s'est ajoutée à son emploi du temps",
        "Elle est en voyage",
      ],
      correctIndex: 2,
    },
    {
      question: "Vers quelle heure faut-il aller chercher les enfants ?",
      options: ["15 heures", "16 heures", "17 heures", "18 heures"],
      correctIndex: 2,
    },
    {
      question: "Que propose Aminata si la personne ne peut pas le faire ?",
      options: [
        "Que les enfants rentrent seuls",
        "D'appeler sa sœur",
        "D'appeler une nourrice",
        "D'annuler complètement",
      ],
      correctIndex: 1,
    },
  ],
};

const CO_CONVERSATIONS_INFORMELLES: ListeningExercise = {
  slug: "conversations-informelles",
  skill: "co",
  title: "Conversations informelles",
  transcript:
    "Sophie : Dis, tu as vu qu'on a changé la date de la réunion d'équipe ? Marc : Ah bon, je ne savais pas. C'est pour quand maintenant ? Sophie : Jeudi après-midi au lieu de mardi matin. Apparemment la salle n'était plus disponible. Marc : D'accord, ça me va mieux en fait, j'avais un empêchement mardi. Tu sais si tout le monde est prévenu ? Sophie : Je crois que oui, mais je vais renvoyer un message pour être sûre. Marc : Merci, préviens-moi si ça change encore.",
  questions: [
    {
      question: "Qu'est-ce qui a changé concernant la réunion ?",
      options: ["Le lieu", "La date et l'heure", "Les participants", "Le sujet"],
      correctIndex: 1,
    },
    {
      question: "Pourquoi la réunion a-t-elle été déplacée ?",
      options: [
        "Trop de participants absents",
        "La salle n'était plus disponible",
        "Marc avait un empêchement",
        "Sophie était en congé",
      ],
      correctIndex: 1,
    },
    {
      question: "Comment Marc réagit-il au changement ?",
      options: [
        "Il est contrarié",
        "Cela lui convient mieux",
        "Il ne peut plus venir du tout",
        "Il propose une autre date",
      ],
      correctIndex: 1,
    },
    {
      question: "Que va faire Sophie pour être sûre que tout le monde est informé ?",
      options: [
        "Appeler chaque personne",
        "Organiser une nouvelle réunion",
        "Renvoyer un message",
        "Ne rien faire de plus",
      ],
      correctIndex: 2,
    },
  ],
};

const CO_INTERVIEWS: ListeningExercise = {
  slug: "interviews",
  skill: "co",
  title: "Interviews",
  transcript:
    "Journaliste : Vous avez ouvert votre boulangerie il y a maintenant trois ans. Comment tout a commencé ? Boulangère : En fait, j'ai appris le métier avec mon oncle, qui tenait déjà une petite boulangerie de quartier. Au départ, je voulais juste l'aider les week-ends, et petit à petit, j'ai eu envie d'avoir mon propre local. Journaliste : Et ça n'a pas été trop difficile de se lancer ? Boulangère : Si, les premiers mois ont été durs, surtout financièrement. Mais le bouche-à-oreille a bien fonctionné, les gens du quartier sont vite devenus des habitués. Journaliste : Quel est votre projet pour l'avenir ? Boulangère : J'aimerais ouvrir un deuxième point de vente d'ici deux ans, si tout continue à bien se passer.",
  questions: [
    {
      question: "Comment la boulangère a-t-elle appris le métier ?",
      options: [
        "À l'école hôtelière",
        "Avec son oncle",
        "Seule, en autodidacte",
        "Dans une grande chaîne",
      ],
      correctIndex: 1,
    },
    {
      question: "Qu'est-ce qui a été le plus difficile au début ?",
      options: [
        "Trouver un local",
        "Le plan financier",
        "Recruter du personnel",
        "Trouver des fournisseurs",
      ],
      correctIndex: 1,
    },
    {
      question: "Comment la clientèle s'est-elle développée ?",
      options: [
        "Grâce à la publicité en ligne",
        "Grâce au bouche-à-oreille",
        "Grâce à un partenariat",
        "Elle ne s'est pas développée",
      ],
      correctIndex: 1,
    },
    {
      question: "Quel est son projet pour les deux prochaines années ?",
      options: [
        "Vendre son commerce",
        "Se former à autre chose",
        "Ouvrir un deuxième point de vente",
        "Réduire son activité",
      ],
      correctIndex: 2,
    },
  ],
};

const CO_BULLETINS_INFORMATION: ListeningExercise = {
  slug: "bulletins-information",
  skill: "co",
  title: "Bulletins d'information",
  transcript:
    "Et voici les informations de la mi-journée. La circulation reste difficile ce matin sur l'axe principal menant au centre-ville, en raison de travaux qui devraient se poursuivre jusqu'à vendredi. Les autorités recommandent d'emprunter les itinéraires secondaires aux heures de pointe. Côté météo, un temps sec est attendu cet après-midi, avec des températures autour de 27 degrés, avant un retour des pluies prévu en soirée. Enfin, la mairie annonce l'ouverture d'un nouveau centre de santé de quartier dès le mois prochain, destiné à réduire l'affluence dans les hôpitaux principaux de la ville.",
  questions: [
    {
      question: "Pourquoi la circulation est-elle difficile ?",
      options: [
        "Un accident",
        "Des travaux",
        "Une manifestation",
        "Une panne de feux tricolores",
      ],
      correctIndex: 1,
    },
    {
      question: "Jusqu'à quand ces perturbations sont-elles annoncées ?",
      options: ["Aujourd'hui", "Mercredi", "Vendredi", "La semaine prochaine"],
      correctIndex: 2,
    },
    {
      question: "Que prévoit la météo pour la soirée ?",
      options: ["Un temps sec", "Un retour de la pluie", "De la neige", "Une canicule"],
      correctIndex: 1,
    },
    {
      question: "Que va ouvrir la mairie le mois prochain ?",
      options: [
        "Une nouvelle école",
        "Un centre de santé de quartier",
        "Une bibliothèque",
        "Un marché couvert",
      ],
      correctIndex: 1,
    },
  ],
};

const CO_EMISSIONS_RADIO: ListeningExercise = {
  slug: "emissions-radio",
  skill: "co",
  title: "Émissions de radio",
  transcript:
    "Bonjour à toutes et à tous, bienvenue dans votre émission hebdomadaire consacrée aux initiatives locales. Aujourd'hui, on s'intéresse à un sujet qui revient souvent dans vos messages : le gaspillage alimentaire. Saviez-vous qu'une partie importante de la nourriture produite dans notre région finit à la poubelle, alors que de nombreuses familles peinent à se nourrir correctement ? Plusieurs associations tentent d'y remédier en récupérant les invendus des marchés en fin de journée pour les redistribuer gratuitement. C'est notamment le cas d'un collectif de bénévoles qui intervient trois fois par semaine sur le grand marché du centre-ville. Nous les avons rencontrés, et vous allez découvrir leur témoignage juste après cette page de publicité.",
  questions: [
    {
      question: "Quel est le thème principal de cette émission ?",
      options: [
        "La cuisine traditionnelle",
        "Le gaspillage alimentaire",
        "L'agriculture biologique",
        "Les prix du marché",
      ],
      correctIndex: 1,
    },
    {
      question: "D'où vient le sujet abordé aujourd'hui ?",
      options: [
        "D'une étude officielle",
        "Des messages envoyés par les auditeurs",
        "D'un livre récent",
        "D'une décision du gouvernement",
      ],
      correctIndex: 1,
    },
    {
      question: "Que font les bénévoles mentionnés dans l'émission ?",
      options: [
        "Ils cuisinent pour les marchés",
        "Ils récupèrent les invendus pour les redistribuer",
        "Ils forment des agriculteurs",
        "Ils vendent des produits bio",
      ],
      correctIndex: 1,
    },
    {
      question: "Où interviennent-ils, et à quelle fréquence ?",
      options: [
        "Au marché du centre-ville, trois fois par semaine",
        "Dans les écoles, une fois par mois",
        "Dans les hôpitaux, tous les jours",
        "Chez les particuliers, le week-end",
      ],
      correctIndex: 0,
    },
  ],
};

const CO_EXERCISES: ListeningExercise[] = [
  CO_ANNONCES_PUBLIQUES,
  CO_MESSAGES_VOCAUX,
  CO_CONVERSATIONS_INFORMELLES,
  CO_INTERVIEWS,
  CO_BULLETINS_INFORMATION,
  CO_EMISSIONS_RADIO,
];

export function getListeningExercise(skill: "co", slug: string): ListeningExercise | undefined {
  if (skill === "co") return CO_EXERCISES.find((e) => e.slug === slug);
  return undefined;
}
