// Ajout ponctuel du Sujet 3 de Compréhension Écrite (format examen, 39 questions).
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-ce-sujet-3.mjs

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
  1: "De quel événement s'agit-il ?",
  2: "Qu'est-ce que Sandra fait ?",
  3: "Que veut faire Lucie après 19 h 30 ?",
  4: "Que fait Marthe le samedi à 12 heures ?",
  5: "Que recherche la société de production ?",
  6: "Que doit faire Héloïse ?",
  7: "Que veut faire Lali ?",
  8: "De quoi parle le directeur ?",
  9: "Quel est le thème du documentaire ?",
  10: "Que propose ce concours ?",
  11: "Que pourront faire les parents pendant cette journée ?",
  12: "Que conseillent ces chercheurs pour se protéger du soleil ?",
  13: "Qu'est-ce que ces jumelles ont en commun ?",
  14: "De quoi est-il dans cet article ?",
  15: "Que propose cette école ?",
  16: "Que propose la maison départementale ?",
  17: "D'après cet extrait, qu'est-ce qui favorise chez les enfants l'apprentissage d'une langue étrangère ?",
  18: "Que peut-on trouver dans ce livre ?",
  19: "Que doit faire Mme Mansion ?",
  20: "Quel est le but de cette lettre ?",
  21: "Quelle est l'originalité de ce projet ?",
  22: "Quel est le constat fait l'auteur à propos des smartphones ?",
  23: "Cet événement est présenté comme…",
  24: "Qu'est-ce qui a permis à l'espèce humaine de conquérir le monde, à part son intelligence ?",
  25: "Pourquoi Maud pense-t-il avoir de la chance ?",
  26: "Qu'a révélé le rapport de l'agence internationale de l'énergie ?",
  27: "Quel danger représentent ces déchets ?",
  28: "Que dénonce l'auteur de cet article ?",
  29: "À quoi réfère le terme « diversité » dans le texte ?",
  30: "Que fait l'auteur de cet article ?",
  31: "Quel obstacle rencontre l'automatisation des services ?",
  32: "Dans quel objectif Joël Pommerat a-t-il créé son spectacle ?",
  33: "Quel constat dresse le journaliste à propos de la réforme des rythmes scolaires ?",
  34: "Quel est l'atout principal de cette discipline artistique ?",
  35: "En adoptant la cooptation pour le recrutement, que recherchent les entreprises ?",
  36: "Selon l'intervenant, qu'est-ce qui caractérise le discours écologique actuel ?",
  37: "D'après cet extrait, quelle est la plus grande qualité du Bon Usage ?",
  38: "Que pense cet écrivain de la lecture publique d'un roman par son auteur ?",
  39: "Selon l'article, que va faire l'équipage du voilier la Boudeuse ?",
};

const OPTIONS = {
  1: ["D'un anniversaire", "D'un décès", "D'un mariage", "D'une naissance"],
  2: ["Elle étudie son français", "Elle invite son ami Rémi", "Elle reste chez elle", "Elle va à la bibliothèque"],
  3: ["Aller voir un film", "Dîner avec Paul", "Passer chez un ami", "Retour au travail"],
  4: ["Elle chante", "Elle court", "Elle étudie", "Elle nage"],
  5: ["De jeunes enfants", "Des femmes et des enfants", "De jeunes mamans", "Des parents avec leurs enfants"],
  6: ["Bien choisir ses vêtements", "Chercher les horaires du bus", "Envoyer un courrier à Sam", "Trouver une location de vacances"],
  7: ["Aller à un anniversaire", "Dîner avec son amie", "Partir en week-end", "Regarder des films"],
  8: ["De l'inscription des élèves", "Des horaires de sortie", "Des repas à la cantine", "Du temps de repos"],
  9: ["L'alimentation", "L'éducation", "La cuisine", "Le commerce"],
  10: ["Donner des photos", "D'inventer une recette", "De créer un spectacle", "De découvrir une langue"],
  11: ["Dialoguer avec le personnel enseignant", "Écouter une présentation du directeur", "Participer à une conférence sur l'éducation", "Répondre à un questionnaire sur les cours"],
  12: ["D'utiliser des crèmes solaires à base de chocolat", "De préparer sa consommation de chocolat", "De manger quotidiennement du chocolat", "De suivre un traitement de plusieurs au chocolat"],
  13: ["Elles se sont retrouvées sur Facebook", "Elles enseignent dans la même école", "Elles habitent dans le même pays", "Elles ont la même famille adoptive"],
  14: ["La difficulté de trouver un stage à travailler", "La nécessité de s'expatrier pour pouvoir travailler", "Le manque de formation des jeunes diplômés", "Le niveau trop faible des salaires proposés"],
  15: ["D'alléger les emplois du temps de travail pour les professeurs", "De permettre aux enfants de faire leur travail du soir en classe", "De supprimer totalement le travail à la maison pour les élèves", "D'inviter les parents à des visites régulières de l'établissement"],
  16: ["De faciliter les rencontres avec des sportifs handicapés", "De trouver des entraîneurs spécialisés en handicap", "D'accompagner les personnes handicapées à faire du sport", "D'organiser des activités avec des sportifs handicapés"],
  17: ["Leur curiosité", "Leur imagination", "Leur mémoire", "Leur adolescence"],
  18: ["Des idées de stages en entreprises", "Un guide des démarches d'inscription", "Une méthode pour choisir une formation", "Une sélection des meilleures universités"],
  19: ["Annuler un rendez-vous", "Chercher des documents", "Envoyer un curriculum vitae", "Téléphoner à l'entreprise"],
  20: ["Annoncer l'achat d'un appartement", "Donner des nouvelles à des amis", "Envoyer des vœux de nouvel an", "Organiser un voyage en Corse"],
  21: ["La priorité donnée à l'aspect écologique", "La prise en compte de l'opinion publique", "Le caractère provisoire de l'installation", "Le choix très moderne de fabrication"],
  22: ["Ils éloignent les jeunes du monde des adultes.", "Ils entraînent des comportements de type addictif.", "Ils ont tendance à éloigner les adolescents du réel.", "Ils peuvent être utilisés comme outil de contrôle."],
  23: ["La réussite d'une lutte menée par des gens orgueilleux et intolérants.", "Le triomphe d'une opinion donnée par Apollinaire mais autorisant combattue.", "Un obstacle lié à la provenance des archéologues sur plusieurs continents.", "La consécration des œuvres européennes jusqu'alors considérées dans les musées."],
  24: ["La fréquence de ses congénères", "L'amélioration des habitats naturels", "Les mutations de son organisme", "L'augmentation des autres espèces"],
  25: ["Elle aura un meilleur pouvoir d'achat par mois.", "Elle se débrouille sans l'aide de personne.", "Elle trouvera facilement un emploi après l'université.", "Elle va pouvoir rester près de chez ses parents."],
  26: ["La consommation de gaz dans le monde augmente.", "La demande croissante en gaz a des effets sur le climat.", "Les besoins en gaz des Américains sont supérieurs à l'offre.", "Les ressources en gaz à l'échelle mondiale s'accroissent."],
  27: ["Un obstacle pour les bateaux de pêche.", "Un réchauffement dramatique des eaux.", "Un risque de disparition des populations du Pacifique.", "Une diminution de la diversité de la faune océanique."],
  28: ["La manipulation des clients par les industriels.", "L'attitude irréprochable des consommateurs.", "L'uniformisation des saveurs des goûts.", "L'utilisation abusive des produits de synthèse."],
  29: ["Aux hôtes du parlement.", "Aux idées débattues.", "Aux pays représentés.", "Aux projets de loi votés."],
  30: ["Il commente une loi.", "Il donne un conseil.", "Il formule une plainte.", "Il raconte une anecdote."],
  31: ["Les coûts élevés des investissements.", "Les faibles qualifications des employés.", "Les réticences émises par les clients.", "Les spécificités de certains métiers."],
  32: ["Aider les femmes à se battre pour améliorer leur situation familiale.", "Amener les spectateurs à s'identifier à une condition douloureuse.", "Démontrer que la condition de la femme dans les cités est désastreuse.", "Informer des difficultés que peuvent rencontrer les enfants des cités."],
  33: ["Les familles sont opposées à toute modification.", "Les impacts financiers demeurent incontournables.", "Les intérêts du jeu sont difficilement compatibles.", "Les opinions des experts sont tout antant désaccord."],
  34: ["Donner une dimension nouvelle aux lieux mis en scène.", "Permettre la réhabilitation des monuments historiques.", "Transformer de manière durable les bâtiments urbains.", "Rénover techniquement des œuvres urbaines détruites."],
  35: ["À gagner du temps.", "À minimiser les aléas.", "À réduire les frais.", "À simplifier les procédures."],
  36: ["Il apaise les tensions de la société.", "Il insiste sur le point de vue matériel.", "Il propose des programmes utopiques.", "Il traite les problèmes liés aux sols."],
  37: ["Il est complet.", "Il est concis.", "Il est innovant.", "Il est infaillible."],
  38: ["Elle demande de posséder des talents d'acteur.", "Elle dessert le travail d'écriture du romancier.", "Elle est particulièrement adaptée au public citadin.", "Elle rend les émissions littéraires plus intéressantes."],
  39: ["Former des scientifiques à la prévention des risques écologiques.", "Innover dans les moyens de lutter contre les pollutions fluviales.", "Observer l'écosystème dans une région de grands fleuves.", "Représenter le gouvernement français lors d'une rencontre."],
};

const ANSWERS = {
  1: "D", 2: "C", 3: "A", 4: "D", 5: "C", 6: "A", 7: "D", 8: "B", 9: "A", 10: "A",
  11: "A", 12: "C", 13: "C", 14: "B", 15: "B", 16: "C", 17: "A", 18: "C", 19: "D", 20: "C",
  21: "B", 22: "D", 23: "B", 24: "A", 25: "A", 26: "D", 27: "D", 28: "A", 29: "B", 30: "B",
  31: "C", 32: "B", 33: "C", 34: "A", 35: "B", 36: "B",
  37: "A", 38: "B", 39: "C",
};

const SLUG = "sujet-3";
const TITLE = "Sujet 3";
const IMAGE_DIR =
  "C:\\Users\\GUYMAF~1\\AppData\\Local\\Temp\\claude\\c--Users-Guy-Mafou-nodie-ia-academy\\64733a12-1d14-40a6-bcd2-49070d240ca8\\scratchpad\\ce-s3-compressed";
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

  const numbers = Object.keys(QUESTIONS).map(Number).sort((a, b) => a - b);

  for (const number of numbers) {
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
        correct_index: LETTER_INDEX[ANSWERS[number]],
      },
      { onConflict: "sujet_id,number" },
    );
    if (itemError) throw new Error(`ce_items Q${number} : ${itemError.message}`);

    process.stdout.write(`\rQuestion ${number}/39 ajoutée`);
  }
  console.log(`\nSujet 3 CE : ${numbers.length}/39 questions ajoutées.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
