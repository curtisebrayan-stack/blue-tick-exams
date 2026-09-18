// Migration ponctuelle : envoie le contenu jusqu'ici codé en dur pour Compréhension Écrite,
// Expression Orale et Expression Écrite vers Supabase (tables ce_exercises/ce_questions,
// eo_prompts, ee_prompts), pour que l'admin puisse tout gérer depuis /admin.
//
// Prérequis : avoir exécuté supabase-practice-content.sql, et avoir un compte admin
// (voir supabase-co-sujets.sql pour la marche à suivre, même principe).
//
// Usage (depuis la racine du projet) :
//   node --env-file=.env --env-file=.env.migration scripts/migrate-practice-content.mjs
//
// .env.migration doit contenir ADMIN_EMAIL et ADMIN_PASSWORD (voir migrate-co-sujets.mjs).

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Variables manquantes. Vérifie VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Compréhension écrite ---------------------------------------------------

const CE_FREE_SLUG = "petites-annonces";

const CE_EXERCISES = [
  {
    slug: "petites-annonces",
    title: "Petites annonces",
    text: `À LOUER — Appartement lumineux, 2 pièces, 45 m², 3e étage sans ascenseur. Proche du marché central et de l'arrêt de bus. Disponible à partir du 1er du mois prochain. Charges comprises, dépôt de garantie équivalent à un mois de loyer exigé. Visites uniquement le samedi matin, sur rendez-vous au 06 12 34 56 78. Non meublé, mais cuisine équipée (plaques, réfrigérateur).

RECHERCHE — Colocataire sérieux(se) pour partager une maison avec jardin, quartier calme. Chambre de 12 m², salle de bain commune. Loyer réduit en échange d'une aide ponctuelle pour l'entretien du jardin. Non-fumeur exigé, animaux acceptés après accord.

VENDS — Vélo de ville, bon état, révisé récemment, avec panier et antivol inclus. Prix à débattre. À récupérer directement chez le vendeur, pas de livraison possible.`,
    questions: [
      { question: "À quel étage se trouve l'appartement à louer ?", options: ["Rez-de-chaussée", "2e étage", "3e étage", "4e étage"], correctIndex: 2 },
      { question: "Que doit fournir le futur locataire de l'appartement en plus du loyer ?", options: ["Un dépôt de garantie d'un mois de loyer", "Une caution bancaire", "Deux mois de loyer d'avance", "Rien, tout est inclus"], correctIndex: 0 },
      { question: "Quand peut-on visiter l'appartement ?", options: ["N'importe quel jour", "Le samedi matin sur rendez-vous", "Le dimanche", "Uniquement en soirée"], correctIndex: 1 },
      { question: "Qu'est-ce qui est demandé en échange d'un loyer réduit pour la colocation ?", options: ["Faire les courses", "Garder les animaux", "Aider à l'entretien du jardin", "Payer les charges seul"], correctIndex: 2 },
      { question: "Comment peut-on récupérer le vélo mis en vente ?", options: ["Livraison à domicile", "Envoi par colis", "Uniquement chez le vendeur", "Au marché central"], correctIndex: 2 },
    ],
  },
  {
    slug: "articles-de-presse",
    title: "Articles de presse",
    text: `Le marché couvert du quartier Bastos rouvrira ses portes le mois prochain après six mois de travaux de rénovation. La toiture, endommagée depuis les fortes pluies de l'an dernier, a été entièrement refaite, et une trentaine de nouveaux étals ont été installés pour accueillir davantage de commerçants.

Selon la mairie, ces travaux répondaient à une demande ancienne des commerçants, qui se plaignaient depuis longtemps des infiltrations d'eau pendant la saison des pluies. Le budget initial, estimé à 40 millions de francs, a finalement dépassé cette somme en raison de la découverte de fissures dans les fondations, non prévues au départ.

Plusieurs commerçants installés temporairement sur un terrain voisin pendant les travaux ont exprimé leur impatience de retrouver leurs emplacements habituels, plus fréquentés par la clientèle du quartier. La mairie promet une cérémonie de réouverture avec les autorités locales et espère que le marché retrouvera rapidement son activité d'avant travaux.`,
    questions: [
      { question: "Pourquoi le marché a-t-il été fermé ?", options: ["Un incendie a détruit une partie du bâtiment", "Des travaux de rénovation, notamment de la toiture", "Un conflit entre commerçants", "Un manque de clients"], correctIndex: 1 },
      { question: "Qu'est-ce qui a causé le dépassement du budget initial ?", options: ["L'achat de nouveaux étals", "La hausse du prix des matériaux", "La découverte de fissures dans les fondations", "Un retard des ouvriers"], correctIndex: 2 },
      { question: "Où se trouvent les commerçants pendant la durée des travaux ?", options: ["Ils ont cessé leur activité", "Sur un terrain voisin, de façon temporaire", "Dans un autre quartier de la ville", "Chez eux"], correctIndex: 1 },
      { question: "Quel sentiment expriment les commerçants dans le texte ?", options: ["De la colère envers la mairie", "De l'indifférence", "De l'impatience de revenir", "Du soulagement d'avoir déménagé"], correctIndex: 2 },
    ],
  },
  {
    slug: "courriers-formels",
    title: "Courriers formels",
    text: `Objet : Réclamation concernant la facture n°4521-B

Madame, Monsieur,

Je me permets de vous écrire au sujet de la facture n°4521-B, reçue le 14 du mois dernier, dont le montant me semble incorrect.

En effet, cette facture indique une consommation d'eau largement supérieure à ma consommation habituelle, alors que je n'ai constaté aucune fuite ni changement dans mes habitudes. Je précise que je vis seul dans ce logement depuis trois ans, et que mes factures précédentes n'ont jamais dépassé 45 000 francs par trimestre, contre plus de 120 000 francs cette fois-ci.

Je vous serais reconnaissant de bien vouloir vérifier le relevé de mon compteur, dont le numéro figure sur la facture jointe, et de m'indiquer si une erreur de lecture a pu se produire. Dans l'attente d'une régularisation, je souhaite suspendre le prélèvement automatique prévu pour la fin du mois.

Je reste disponible pour tout renseignement complémentaire et vous remercie par avance de l'attention portée à ma demande.

Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

M. Fotso`,
    questions: [
      { question: "Quel est l'objet principal de ce courrier ?", options: ["Une demande de déménagement", "Une réclamation sur le montant d'une facture", "Une demande de raccordement à l'eau", "Une plainte contre un voisin"], correctIndex: 1 },
      { question: "Pourquoi l'auteur trouve-t-il le montant anormal ?", options: ["Il a changé de logement récemment", "Il n'a jamais reçu de facture auparavant", "Le montant est bien plus élevé que ses factures habituelles", "Il n'utilise plus l'eau depuis un an"], correctIndex: 2 },
      { question: "Que demande l'auteur à l'entreprise ?", options: ["De résilier son contrat", "De vérifier le relevé du compteur", "De lui envoyer un technicien immédiatement", "De rembourser toutes ses factures passées"], correctIndex: 1 },
      { question: "Que souhaite l'auteur concernant le prélèvement automatique ?", options: ["Le supprimer définitivement", "L'augmenter", "Le suspendre en attendant une vérification", "Le transférer sur un autre compte"], correctIndex: 2 },
    ],
  },
  {
    slug: "notices-et-modes-emploi",
    title: "Notices et modes d'emploi",
    text: `MODE D'EMPLOI — Bouilloire électrique

Avant la première utilisation, rincez l'intérieur de la bouilloire à l'eau claire et jetez cette première eau sans la consommer.

Utilisation :
1. Remplissez la bouilloire entre les repères MIN et MAX indiqués à l'intérieur. Ne dépassez jamais le repère MAX.
2. Posez la bouilloire sur son socle et appuyez sur le bouton situé sur la poignée jusqu'à ce que le voyant s'allume.
3. La bouilloire s'arrête automatiquement dès que l'eau atteint l'ébullition.
4. Attendez que le voyant s'éteigne avant de retirer la bouilloire du socle.

Entretien : détartrez l'appareil une fois par mois avec un mélange d'eau et de vinaigre blanc, puis rincez abondamment.

Attention : ne jamais faire fonctionner l'appareil sans eau, et ne jamais immerger le socle électrique dans l'eau.`,
    questions: [
      { question: "Que faut-il faire avant la toute première utilisation ?", options: ["Faire bouillir de l'eau et la boire", "Rincer l'intérieur et jeter la première eau", "Détartrer l'appareil au vinaigre", "Attendre 24 heures avant utilisation"], correctIndex: 1 },
      { question: "Que se passe-t-il quand l'eau atteint l'ébullition ?", options: ["Il faut appuyer à nouveau sur le bouton", "La bouilloire s'arrête automatiquement", "Un signal sonore retentit en continu", "Rien, il faut surveiller soi-même"], correctIndex: 1 },
      { question: "À quelle fréquence faut-il détartrer l'appareil ?", options: ["Chaque semaine", "Une fois par mois", "Une fois par an", "Jamais"], correctIndex: 1 },
      { question: "Quelle est l'interdiction la plus importante mentionnée ?", options: ["Utiliser un socle d'une autre marque", "Remplir au-dessus du repère MAX ou immerger le socle dans l'eau", "Utiliser l'appareil le soir", "Laisser l'appareil branché en permanence"], correctIndex: 1 },
    ],
  },
  {
    slug: "textes-opinion",
    title: "Textes d'opinion",
    text: `Faut-il vraiment répondre à tous les messages professionnels en dehors des heures de travail ? Depuis que le télétravail s'est généralisé, la frontière entre vie privée et vie professionnelle s'est considérablement affaiblie, et avec elle, notre capacité à réellement nous reposer.

Certains diront qu'un message envoyé un dimanche soir n'oblige personne à répondre immédiatement. C'est vrai en théorie. Mais dans la pratique, la simple présence d'une notification suffit à occuper l'esprit, à générer une forme d'anxiété diffuse, même chez ceux qui se promettent de ne "regarder que demain".

Je ne prétends pas qu'il faille couper tout lien avec son travail dès dix-sept heures. Certaines urgences existent réellement, et une rigidité totale serait tout aussi absurde qu'une disponibilité permanente. Mais il me semble urgent que les entreprises elles-mêmes posent des limites claires, plutôt que de laisser chaque salarié négocier seul, souvent au prix de sa tranquillité, le droit de ne pas répondre.

Le vrai progrès ne sera pas de nous apprendre à ignorer nos notifications, mais de repenser collectivement ce qui mérite vraiment une réponse immédiate.`,
    questions: [
      { question: "Quelle est la thèse principale défendue par l'auteur ?", options: ["Il faut répondre à tous les messages professionnels rapidement", "Le télétravail devrait être totalement supprimé", "Les entreprises devraient poser des limites claires sur la disponibilité hors travail", "Les notifications ne posent aucun problème réel"], correctIndex: 2 },
      { question: "Que pense l'auteur de l'argument « on n'est pas obligé de répondre tout de suite » ?", options: ["Il le trouve totalement convaincant", "Il reconnaît sa logique mais souligne que la notification elle-même pose problème", "Il ne l'aborde pas dans le texte", "Il pense que c'est un mensonge des entreprises"], correctIndex: 1 },
      { question: "L'auteur défend-il une déconnexion totale et rigide ?", options: ["Oui, complètement, dès 17h", "Non, il reconnaît que certaines urgences existent", "Il ne se prononce pas sur ce point", "Il pense que c'est impossible à mettre en place"], correctIndex: 1 },
      { question: "Selon l'auteur, où doit se situer le vrai changement ?", options: ["Dans la volonté individuelle d'ignorer son téléphone", "Dans une réflexion collective sur ce qui mérite une réponse immédiate", "Dans l'interdiction totale des emails le week-end", "Dans le remplacement des emails par les appels téléphoniques"], correctIndex: 1 },
    ],
  },
  {
    slug: "extraits-litteraires",
    title: "Extraits littéraires",
    text: `Le train s'était arrêté sans prévenir, quelque part entre deux gares dont elle n'avait retenu ni l'une ni l'autre. Par la fenêtre, les champs s'étendaient, immobiles sous une lumière grise qui ne semblait appartenir à aucune heure précise du jour.

Elle avait d'abord pensé à une panne, puis à un incident sur la voie, comme cela arrivait parfois. Mais personne, dans le wagon, ne semblait s'en inquiéter. L'homme assis en face d'elle continuait de tourner les pages de son journal avec une lenteur presque insultante, comme si le temps, soudain suspendu, ne le concernait pas.

C'est à ce moment précis qu'elle comprit qu'elle n'était pas pressée non plus. Depuis des mois, elle courait après des horaires, des rendez-vous, des trains à ne pas manquer. Et voilà que le hasard, ou la mécanique, lui offrait ce qu'elle n'avait jamais osé s'accorder : rien à faire, nulle part où aller, pendant un temps qui ne lui appartenait déjà plus tout à fait.

Elle ferma les yeux, et pour la première fois depuis longtemps, ne chercha pas à deviner combien de temps cela allait durer.`,
    questions: [
      { question: "Où se trouve le train au début du texte ?", options: ["Dans une gare", "Arrêté entre deux gares", "En train de rouler normalement", "À son terminus"], correctIndex: 1 },
      { question: "Comment réagissent les autres passagers à l'arrêt du train ?", options: ["Ils paniquent", "Ils descendent du train", "Ils ne semblent pas s'en inquiéter", "Ils appellent le conducteur"], correctIndex: 2 },
      { question: "Que ressent finalement le personnage principal face à cet arrêt imprévu ?", options: ["Une grande colère", "Une forme de soulagement, elle n'est pas pressée non plus", "Une peur intense", "Une indifférence totale, elle ne remarque rien"], correctIndex: 1 },
      { question: "Que suggère la dernière phrase du texte ?", options: ["Elle s'endort profondément", "Elle accepte de ne pas contrôler le temps, pour une fois", "Elle décide de descendre du train", "Elle est furieuse contre la compagnie ferroviaire"], correctIndex: 1 },
    ],
  },
];

// --- Expression orale --------------------------------------------------

const EO_FREE_SLUG = "se-presenter";

const EO_PROMPTS = [
  {
    slug: "se-presenter",
    title: "Se présenter",
    instructions: "Réponds à voix haute aux questions ci-dessous, comme si tu parlais à l'examinateur. Enregistre-toi puis réécoute-toi.",
    durationSeconds: 180,
    promptLines: ["Comment t'appelles-tu et d'où viens-tu ?", "Que fais-tu dans la vie (études, travail) ?", "Qu'est-ce que tu aimes faire pendant ton temps libre ?", "Pourquoi apprends-tu le français ?"],
    checklist: ["J'ai parlé sans m'arrêter trop longtemps entre les phrases", "J'ai répondu à chaque question, même brièvement", "J'ai utilisé des phrases complètes, pas seulement des mots isolés", "Mon débit était compréhensible, ni trop rapide ni trop hésitant"],
  },
  {
    slug: "sujets-de-societe",
    title: "Sujets de société",
    instructions: "Défends un point de vue sur la question suivante, comme si tu débattais avec l'examinateur : « Faut-il interdire les sacs plastiques dans les commerces ? » Enregistre-toi puis réécoute-toi.",
    durationSeconds: 300,
    promptLines: ["Donne clairement ta position dès le début (pour ou contre)", "Justifie ta position avec au moins un argument concret", "Donne un exemple tiré de ton expérience ou de l'actualité", "Anticipe une objection possible et réponds-y"],
    checklist: ["Ma position est claire dès les premières phrases", "J'ai donné au moins un argument développé, pas juste une opinion", "J'ai utilisé un exemple concret", "J'ai employé des connecteurs d'argumentation (parce que, cependant, en revanche)"],
  },
  {
    slug: "vie-quotidienne",
    title: "Vie quotidienne",
    instructions: "Tu rencontres un nouveau voisin pour la première fois. Pose-lui à voix haute des questions pour mieux le connaître et connaître ses habitudes de vie.",
    durationSeconds: 240,
    promptLines: ["Pose une question sur son quotidien (travail, études, famille)", "Pose une question sur ses habitudes ou ses loisirs", "Pose une question sur le quartier ou la ville", "Termine par une question ouverte qui invite à en dire plus"],
    checklist: ["J'ai posé au moins quatre questions différentes", "Mes questions ne se limitent pas à des oui/non (qui, quoi, comment, pourquoi)", "L'intonation montait bien en fin de question", "J'ai enchaîné les questions naturellement, sans longs silences"],
  },
  {
    slug: "environnement",
    title: "Environnement",
    instructions: "Défends un point de vue sur la question suivante : « Le tri des déchets devrait-il être obligatoire dans tous les quartiers ? » Enregistre-toi puis réécoute-toi.",
    durationSeconds: 300,
    promptLines: ["Donne clairement ta position dès le début", "Justifie avec un argument concret (environnemental, pratique, économique)", "Donne un exemple précis", "Anticipe une objection et réponds-y"],
    checklist: ["Ma position est claire dès les premières phrases", "J'ai développé au moins un argument, pas juste une opinion", "J'ai donné un exemple concret", "J'ai répondu à une objection possible"],
  },
  {
    slug: "technologies",
    title: "Technologies",
    instructions: "Défends un point de vue sur la question suivante : « Les smartphones devraient-ils être interdits à l'école ? » Enregistre-toi puis réécoute-toi.",
    durationSeconds: 300,
    promptLines: ["Donne clairement ta position dès le début", "Justifie avec un argument concret", "Donne un exemple tiré de ton expérience ou de l'actualité", "Anticipe une objection possible et réponds-y"],
    checklist: ["Ma position est claire dès les premières phrases", "J'ai développé au moins un argument avec un exemple", "J'ai employé des connecteurs d'argumentation", "J'ai gardé un débit régulier jusqu'à la fin"],
  },
  {
    slug: "travail-et-etudes",
    title: "Travail et études",
    instructions: "Tu passes un entretien pour un stage ou un emploi. Réponds à voix haute aux questions ci-dessous comme si tu parlais au recruteur.",
    durationSeconds: 180,
    promptLines: ["Peux-tu te présenter et parler de ton parcours ?", "Pourquoi ce poste ou ce domaine t'intéresse-t-il ?", "Quelle est une de tes qualités et un point à améliorer ?", "Où te vois-tu dans quelques années ?"],
    checklist: ["J'ai répondu à chaque question de façon structurée", "J'ai donné des exemples concrets, pas seulement des généralités", "Le ton était professionnel, adapté à un entretien", "J'ai parlé avec assurance, sans trop hésiter"],
  },
];

// --- Expression écrite --------------------------------------------------

const EE_FREE_SLUG = "message-court";

const EE_PROMPTS = [
  {
    slug: "message-court",
    title: "Message court",
    instructions: "Tu devais retrouver un ami samedi, mais tu ne peux plus venir. Écris-lui un message pour annuler, expliquer brièvement pourquoi, et proposer une nouvelle date.",
    minWords: 40,
    maxWords: 80,
    checklist: ["Le message explique clairement l'annulation", "Une raison est donnée, même brève", "Une nouvelle date ou proposition est faite", "Le ton est adapté à un message à un ami (pas trop formel)"],
  },
  {
    slug: "recit-personnel",
    title: "Récit personnel",
    instructions: "Raconte à un correspondant un événement marquant de ta semaine (une bonne ou une mauvaise surprise). Décris ce qui s'est passé, où, quand, et explique ce que tu as ressenti.",
    minWords: 100,
    maxWords: 150,
    checklist: ["Le récit précise le contexte (où, quand, avec qui)", "Les événements sont racontés dans un ordre clair", "Les sentiments ou réactions sont exprimés, pas seulement les faits", "Les temps du passé sont utilisés correctement (passé composé, imparfait)"],
  },
  {
    slug: "description-lieu",
    title: "Description d'un lieu ou événement",
    instructions: "Décris un lieu qui compte pour toi (ta ville natale, un endroit de vacances, ton quartier). Explique à quoi il ressemble et pourquoi il est important pour toi.",
    minWords: 100,
    maxWords: 150,
    checklist: ["La description donne des détails concrets (couleurs, sons, ambiance)", "Le lieu est situé clairement (où, dans quel contexte)", "Le texte explique pourquoi ce lieu est important, pas seulement à quoi il ressemble", "Le vocabulaire descriptif est varié (adjectifs, comparaisons)"],
  },
  {
    slug: "opinion-argumentee",
    title: "Opinion argumentée",
    instructions: "Es-tu d'accord avec cette affirmation : « Les réseaux sociaux nuisent aux relations humaines » ? Donne ton opinion et justifie-la avec au moins deux arguments.",
    minWords: 120,
    maxWords: 180,
    checklist: ["La position (d'accord / pas d'accord) est claire dès l'introduction", "Au moins deux arguments distincts sont développés", "Chaque argument est illustré par un exemple", "Le texte se termine par une conclusion qui résume la position"],
  },
  {
    slug: "comparaison-points-vue",
    title: "Comparaison de points de vue",
    instructions: "Certaines personnes préfèrent travailler depuis chez elles, d'autres préfèrent aller au bureau. Compare ces deux points de vue, puis donne le tien.",
    minWords: 120,
    maxWords: 180,
    checklist: ["Les deux points de vue sont présentés de façon équilibrée", "Chaque point de vue est justifié, pas seulement mentionné", "L'opinion personnelle est clairement distinguée de la présentation des deux points de vue", "Des connecteurs de comparaison sont utilisés (d'un côté... de l'autre, tandis que, en revanche)"],
  },
  {
    slug: "lettres-formelles",
    title: "Lettres formelles",
    instructions: "Écris une lettre formelle à ton employeur pour demander un congé de deux semaines. Précise les dates souhaitées et la raison, sans entrer dans les détails personnels.",
    minWords: 100,
    maxWords: 150,
    checklist: ["La lettre utilise une formule d'appel et de politesse adaptées (Madame, Monsieur...)", "L'objet de la demande est énoncé clairement dès le début", "Les dates du congé demandé sont précisées", "Le registre reste formel du début à la fin (pas de tutoiement, pas de familiarité)"],
  },
];

async function migrateCe() {
  console.log("\n--- Compréhension écrite ---");
  for (const ex of CE_EXERCISES) {
    const { data: exercise, error: exerciseError } = await supabase
      .from("ce_exercises")
      .upsert({ slug: ex.slug, title: ex.title, text: ex.text, is_free: ex.slug === CE_FREE_SLUG }, { onConflict: "slug" })
      .select("id")
      .single();
    if (exerciseError) throw new Error(`ce_exercises ${ex.slug} : ${exerciseError.message}`);

    const rows = ex.questions.map((q, i) => ({
      exercise_id: exercise.id,
      number: i + 1,
      question: q.question,
      options: q.options,
      correct_index: q.correctIndex,
    }));
    const { error: questionsError } = await supabase.from("ce_questions").upsert(rows, { onConflict: "exercise_id,number" });
    if (questionsError) throw new Error(`ce_questions ${ex.slug} : ${questionsError.message}`);
    console.log(`  ${ex.title} : ${ex.questions.length} questions.`);
  }
}

async function migrateEo() {
  console.log("\n--- Expression orale ---");
  for (const p of EO_PROMPTS) {
    const { error } = await supabase.from("eo_prompts").upsert(
      {
        slug: p.slug,
        title: p.title,
        instructions: p.instructions,
        duration_seconds: p.durationSeconds,
        prompt_lines: p.promptLines,
        checklist: p.checklist,
        is_free: p.slug === EO_FREE_SLUG,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`eo_prompts ${p.slug} : ${error.message}`);
    console.log(`  ${p.title} migré.`);
  }
}

async function migrateEe() {
  console.log("\n--- Expression écrite ---");
  for (const p of EE_PROMPTS) {
    const { error } = await supabase.from("ee_prompts").upsert(
      {
        slug: p.slug,
        title: p.title,
        instructions: p.instructions,
        min_words: p.minWords,
        max_words: p.maxWords,
        checklist: p.checklist,
        is_free: p.slug === EE_FREE_SLUG,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`ee_prompts ${p.slug} : ${error.message}`);
    console.log(`  ${p.title} migré.`);
  }
}

async function main() {
  const { error: signInError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  await migrateCe();
  await migrateEo();
  await migrateEe();

  console.log("\nMigration terminée.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur pendant la migration :", err.message);
  process.exit(1);
});
