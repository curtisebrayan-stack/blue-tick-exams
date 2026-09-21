// Ajout ponctuel du Sujet 2 de Compréhension Écrite (format examen, 39 questions).
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-ce-sujet-2.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LETTER_INDEX = { A: 0, B: 1, C: 2, D: 3 };

const QUESTIONS = {
  1: "Qu’est-ce que propose cette publicité ?",
  2: "Où est Christian ?",
  3: "Que propose cette entreprise ?",
  4: "Pourquoi est-ce qu’Alice attend Pierre ?",
  5: "Pourquoi Ariane écrit-elle ce message ?",
  6: "Pourquoi le forum de Paris est-il utile aux jeunes ?",
  7: "Quand peut-on se promener dans le parc après 18h30 ?",
  8: "Où trouve-t-on ces produits ?",
  9: "Que demande Ayoub à Ahmed ?",
  10: "Quelle information est donnée au sujet de la piscine ?",
  11: "Pourquoi Céline et Redah invitent-ils des amis ?",
  12: "De quoi ont besoin Clément et Pierre ?",
  13: "Dans ce message électronique, que demande-t-on aux employés ?",
  14: "Quel est l’objectif de l’article de L’internaute.fr ?",
  15: "Quel sera l’atout de ce moyen de transport ?",
  16: "Pourquoi la direction de cet établissement interdit-elle la tenue de sport en classe ?",
  17: "Quel est le conseil de cet organisateur avant de participer au marathon ?",
  18: "Quelle est la méthode de recrutement retenue par le cabinet ?",
  19: "Que proposent les Villages Vacances aux enfants ?",
  20: "L’appellation d’origine contrôlée accordée au piment d’Espelette permet aux Basques…",
  21: "La voix numérisée de Théo est d’un naturel confondant, ce qui signifie qu’elle…",
  22: "Qu’explique le texte au sujet du programme Erasmus ?",
  23: "Quel conseil donne le journaliste pour remporter la course ?",
  24: "D’après l’article, à quoi les internautes sont-ils encouragés ?",
  25: "D’après l’auteur de cet article, quelle est la particularité de cet ouvrage ?",
  26: "Quelle place occupent les algues en France ?",
  27: "Pourquoi Thierry Marc intervient-il dans les prisons ?",
  28: "Quelle est l’opinion de l’auteur ?",
  29: "D’après ce texte, pourquoi les journalistes utilisent-ils des caméras cachées ?",
  30: "Quel est le principal obstacle à l’accès au logement des étudiants selon cette analyse ?",
  31: "Qu’évoque-t-on dans cet article ?",
  32: "Quel a été l’aboutissement de la conférence ?",
  33: "Quel est le paradoxe de la taxe carbone ?",
  34: "Quel projet est présenté comme réaliste ?",
  35: "Quelle est la position de l’auteur de l’article ?",
  36: "Selon le journaliste, quel type de public pourrait s’intéresser au dernier album de F. Hardy ?",
  37: "À quel résultat la participation à cette collection conduit-elle Annie Ernaux ?",
  38: "Pourquoi la gratuité des transports publics est-elle critiquée ?",
  39: "Pourquoi Jean Claude aime-t-il les dictionnaires ?",
};

const ANSWERS = "A B B B C B C C D C C A B B B C B D C A D D C C C B C D B A D D C A B B C C A".split(" ");

const OPTIONS = {
  1: ["Des cours", "Des emplois", "Des livres", "Des voyages"],
  2: ["À la gare", "À la maison", "Au cinéma", "Au travail"],
  3: ["De stocker des marchandises", "De transporter des colis", "De vendre des cartons", "De voyager a l'étranger"],
  4: ["Pour des excuses", "Pour un repas", "Pour un travail", "Pour un rendez-vous"],
  5: ["Elle veut parler au téléphone.", "Elle propose un déplacement.", "Elle souhaite parler à François.", "Elle veut visiter une entreprise."],
  6: ["Il leur explique des informations.", "Il leur permet de trouver un emploi.", "Il leur présente des stages en entreprise.", "Il leur propose des logements étudiants."],
  7: ["En décembre", "En février", "En été", "En avril"],
  8: ["Dans une boucherie", "Dans une boulangerie", "Dans une épicerie", "Dans une poissonnerie"],
  9: ["Apporter le déjeuner", "Préparer la réunion", "Consulter les documents", "Prévenir les collègues"],
  10: ["Elle sera fermée au mois de mars.", "Il y aura des travaux à l’intérieur.", "L’entrée se fera par une autre porte.", "Le service municipal change les horaires."],
  11: ["Pour un anniversaire", "Pour un mariage", "Pour un réveillon", "Pour un spectacle"],
  12: ["D’argent pour leur voyage", "De place pour leur voiture", "De produits pour le repas", "D’une salle pour leur voyage"],
  13: ["De participer à la fête de l’entreprise", "De poser leurs jours de vacances", "De remplir un formulaire en ligne", "De respecter les règles de sécurité"],
  14: ["Alerter les citoyens sur les nouvelles publicités de magasins", "Donner des conseils pour éviter de recevoir des publicités", "Présenter le résultat d’une étude sur les effets de la publicité", "Vendre l’autocollant « Stop Pub » du ministère de l’Écologie"],
  15: ["Il modifiera son parcours à la demande des usagers.", "Il permettra d’éviter les embouteillages en ville.", "Il sera adapté à différentes situations de circulation.", "Il sera très facile d’entretien et peu coûteux."],
  16: ["Pour aider les élèves à ne pas se fatiguer.", "Pour enseigner le droit à la tolérance.", "Pour respecter des normes d’hygiène.", "Pour supprimer les différences sociales."],
  17: ["Avoir couru assez pour terminer l’épreuve.", "Pratiquer la course à pied plusieurs fois par semaine.", "Prendre régulièrement des médicaments anti-douleur.", "Se donner de longues périodes de récupération."],
  18: ["Auditionner plusieurs candidats au même temps.", "Faire passer l’entretien du candidat par un chef d’équipe.", "Laisser les candidats s’exprimer sans les interrompre.", "Rencontrer les candidats avec un cas donné."],
  19: ["De découvrir la région", "De goûter des spécialités", "De pratiquer un sport", "D’organiser un spectacle"],
  20: ["De lutter contre les imitations.", "D’accroître la production.", "De développer sa culture.", "De faire des nouvelles recettes."],
  21: ["A un timbre qui n’est pas naturel.", "Se confond avec la voix de l’enfant qui joue.", "Enregistre et reproduit les voix environnantes.", "Imite à la perfection la voix d’un enfant."],
  22: ["Il est financé par des autorités publiques.", "Il est remplacé par un autre programme.", "Il facilite l’accès au monde de l’entreprise.", "Son succès auprès des étudiants se dégrade."],
  23: ["Connaître ses adversaires", "Cultiver sa concentration", "Bien récupérer", "Ménager son effort"],
  24: ["Aider à la rénovation en travaillant au château", "Aider en contactant les responsables du château", "Financer les travaux du château par un don", "Visiter le château, le jardin et l’exposition"],
  25: ["L’originalité des pays visités", "La description des habitudes quotidiennes", "La diversité des parcours présentés", "Les qualités littéraires des récits"],
  26: ["Elles font partie de la gastronomie régionale.", "Les gens en mangent plus qu’auparavant.", "Les médecins conseillent leur usage en cuisine.", "Leur culture augmente rapidement."],
  27: ["Pour améliorer les méthodes de travail de la cuisine.", "Pour encourager la création des formations professionnelles.", "Pour faire naître l’envie de s’ouvrir dans un milieu fermé.", "Pour sensibiliser le grand public à la réalité de la vie carcérale."],
  28: ["L’importance de l’école doit être calquée sur le modèle familial.", "L’autorité du professeur doit être compensée par sa gentillesse.", "L’apprentissage de l’enfant doit primer sur la réussite.", "L’importance doit être donnée à la qualité pédagogique du maître."],
  29: ["Pour analyser la qualité des documents.", "Pour dissimuler la pauvreté des contenus.", "Pour moderniser leurs méthodes de travail.", "Pour savoir les gens aidés par les enquêtes."],
  30: ["La sélection des propriétaires", "Le niveau élevé des loyers", "L’absence d’engagement de l’État", "Le montant de la caution exigée"],
  31: ["L’inauguration d’une exposition temporaire", "L’inscription d’un site au patrimoine mondial", "L’ouverture au public d’une zone dangereuse", "Une expérience de réouverture contrôlée"],
  32: ["L’affrontement entre partenaires sociaux", "L’annonce rapide des retraites", "La présentation de décisions importantes", "L’absence de prise de décisions effectives"],
  33: ["Elle concerne uniquement les économies fortes.", "Elle freine l’utilisation de ressources non renouvelables.", "Elle permet le déplacement des coûts dédiés.", "Elle ralentit le progrès dans les États européens."],
  34: ["La création d’un système de climatisation à tout un quartier.", "L’installation de parcs sur les toits des bâtiments publics.", "La construction de pistes cyclables au sommet des immeubles.", "La création de jardins communaux pour planter des légumes."],
  35: ["Il constate la faillite des journaux d’Internet.", "Il critique la surabondance de l’information.", "Il dénonce la médiocrité de la presse écrite.", "Il doute de l’intérêt des médias traditionnels."],
  36: ["Les acheteurs opposés au téléchargement illégal", "Les amateurs de célébrité et de raffinement musical", "Les admirateurs inconditionnels de l’artiste", "Les curieux en quête de musique expérimentale"],
  37: ["À acquérir un enseignement moral", "À se défaire d’un sentiment de culpabilité", "À affirmer d’une histoire intime", "À se justifier d’une action peu glorieuse"],
  38: ["Elle coûte moins cher aux collectivités.", "Elle permet aux plus démunis de se déplacer.", "Elle entraîne des déplacements inutiles.", "Elle réduit l’offre des transports publics."],
  39: ["Pour découvrir de nouvelles références.", "Pour posséder une bibliothèque fournie.", "Pour enrichir son vocabulaire littéraire.", "Pour trouver des réponses à ses maux."],
};

const SLUG = "sujet-2";
const TITLE = "Sujet 2";
const IMAGE_DIR =
  "C:\\Users\\GUYMAF~1\\AppData\\Local\\Temp\\claude\\c--Users-Guy-Mafou-nodie-ia-academy\\64733a12-1d14-40a6-bcd2-49070d240ca8\\scratchpad\\ce-s2-compressed";
const imageName = (n) => `Q${n}.jpeg`;

async function uploadFile(storagePath, absolutePath) {
  const buffer = await readFile(absolutePath);
  const { error } = await supabase.storage.from("ce-content").upload(storagePath, buffer, {
    contentType: "image/jpeg",
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Upload ${storagePath} : ${error.message}`);
  return supabase.storage.from("ce-content").getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  const { data: sujet, error: sujetError } = await supabase
    .from("ce_sujets")
    .upsert({ slug: SLUG, title: TITLE, is_free: true }, { onConflict: "slug" })
    .select("id")
    .single();
  if (sujetError) throw new Error(`ce_sujets : ${sujetError.message}`);

  for (let number = 1; number <= 39; number++) {
    const imageAbsPath = path.resolve(IMAGE_DIR, imageName(number));
    const imageStoragePath = `${SLUG}/images/${imageName(number)}`;
    const imageUrl = await uploadFile(imageStoragePath, imageAbsPath);

    const { error: itemError } = await supabase.from("ce_items").upsert(
      {
        sujet_id: sujet.id,
        number,
        image_url: imageUrl,
        question: QUESTIONS[number],
        options: OPTIONS[number],
        correct_index: LETTER_INDEX[ANSWERS[number - 1]],
      },
      { onConflict: "sujet_id,number" },
    );
    if (itemError) throw new Error(`ce_items Q${number} : ${itemError.message}`);

    process.stdout.write(`\rQuestion ${number}/39 ajoutée`);
  }
  console.log("\nSujet 2 CE : terminé.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
