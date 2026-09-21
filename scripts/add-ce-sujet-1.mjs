// Ajout ponctuel du Sujet 1 de Compréhension Écrite (format examen, 39 questions).
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-ce-sujet-1.mjs

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
  1: "Qu'est-ce que Patrick fait chez Louise ?",
  2: "À quoi sert cette affiche ?",
  3: "Quelles sont les relations entre Aline et Yvette ?",
  4: "Qu'apprend-on sur le magasin ?",
  5: "Quelle est la nationalité d'Elsa ?",
  6: "Qu'est-ce que M. et Mme Garnier écrivent à leurs voisins ?",
  7: "Qu'est-ce que Lise va fêter ?",
  8: "Que peuvent faire les associations sur ce site Internet ?",
  9: "Quel document doit fournir la femme ?",
  10: "Que propose le restaurant du 6 au 10 septembre ?",
  11: "Que propose cette annonce aux entreprises ?",
  12: "Pourquoi la librairie a-t-elle récolté de l'argent ?",
  13: "Que doit faire Madame Guilbert ?",
  14: "Dans quelle ville se trouve Mathilde d'après cette lettre ?",
  15: "Quelle est la particularité du tourisme scientifique ?",
  16: "Qu'est-il arrivé aux lapins de l'aéroport d'Orly ?",
  17: "Quel avantage présente l'enseignement supérieur dans ce pays ?",
  18: "Aujourd'hui, quel est l'inconvénient du métier de secrétaire ?",
  19: "Que dit-on de la langue anglaise dans cet article ?",
  20: "Selon l'article, que faut-il faire pour trouver un job d'été ?",
  21: "Qu'apprend-on sur les grands chefs ?",
  22: "Que présente l'auteur de l'article ?",
  23: "Selon cet article, quelle décision a été prise ?",
  24: "Qu'apprend-on sur la production d'insectes ?",
  25: "Quelle constatation ce journaliste fait-il sur le cinéma contemporain ?",
  26: "Pourquoi le droit à l'oubli sur internet est-il important ?",
  27: "Quel danger représentent ces déchets ?",
  28: "Quel est l'objectif des élèves de 2nde ?",
  29: "Dans cet extrait, qu'apprend-on sur les acheteurs ?",
  30: "Qu'est-ce que les scientifiques ont découvert concernant le manque de sommeil ?",
  31: "À quelle difficulté se heurtent les spécialistes ?",
  32: "Comment la perception des événements permet-elle d'accéder au bonheur ?",
  33: "Sur quel point porte la critique négative envers ce livre ?",
  34: "Pourquoi Virginie Sassoon est-elle choquée par les exercices proposés dans la classe de son fils ?",
  35: "Quel est le résultat de l'expérience présentée dans cet article ?",
  36: "Quel constat est dressé sur les jeux vidéo ?",
  37: "Pourquoi peut-on dire que l'UNESCO est active dans le domaine des TIC ?",
  38: "Que permet la structure d'entreprise présentée ?",
  39: "Que soutient l'auteur de ce texte à propos du contrôle ?",
};

const ANSWERS = "B A C D B B C A A B D D A A D C B B B C C B A A A D C D B D A D B C C A A A D".split(" ");

const OPTIONS = {
  1: ["Il dort", "Il travaille", "Il joue", "Il mange"],
  2: ["Annoncer un changement", "Décrire un endroit", "Donner un rendez-vous", "Organiser une réunion"],
  3: ["Professionnelles", "Familiales", "Médicales", "Commerciales"],
  4: ["Il va avoir de nouveaux horaires", "Il va changer de propriétaire", "Il va déménager en septembre", "Il va fermer pendant l'été"],
  5: ["Canadienne", "Espagnole", "Italienne", "Mexicaine"],
  6: ["Ils vont bientôt déménager", "Ils vont faire des travaux", "Ils vont organiser une soirée", "Ils vont recevoir de la visite"],
  7: ["La retraite de ses parents", "Son anniversaire de mariage", "Un nouveau logement", "Une création d'entreprise"],
  8: ["Offrir des emplois", "Participer à un forum", "Présenter leur action", "Trouver de l'argent"],
  9: ["Un document professionnel", "Un titre de transport", "Une enveloppe timbrée", "Une somme d'argent"],
  10: ["Des cours de cuisine", "Des menus différents", "Des plats à emporter", "Des tickets bon marché"],
  11: ["Un service de création de site", "Une aide informatique rapide", "Une formation sur Internet", "Une publicité à faible coût"],
  12: ["Pour acheter des meubles de bibliothèque", "Pour organiser un concours de lecture", "Pour ouvrir un salon de thé littéraire", "Pour s'installer dans un local plus vaste"],
  13: ["Acheter du matériel", "Appeler un réparateur", "Imprimer un document", "Noter un rendez-vous"],
  14: ["Il fait observer la nature de façon différente", "Il aide au développement de la recherche", "Il nécessite un bon entraînement sportif", "Il s'adresse à des spécialistes passionnés"],
  15: ["Le choix des matières est vaste", "Le nombre d'étudiants est limité", "Le prix des études est peu élevé", "L'enseignement est d'un bon niveau"],
  16: ["Fès", "Casablanca", "Marrakech", "Tanger"],
  17: ["On les a tués afin de les manger", "On les a attrapés et emmenés ailleurs", "On les a chassés de l'aéroport", "On les a soignés et relâchés"],
  18: ["La quantité de travail est importante", "Le rôle est peu valorisé", "Les postes sont supprimés", "Les tâches sont limitées"],
  19: ["Elle doit devenir la langue de l'administration publique", "Elle peut perdre son statut de langue dominante", "Elle restera la langue privilégiée dans le commerce", "Elle va provoquer la disparition de langues minoritaires"],
  20: ["Leur conception de la cuisine est passée de mode", "Leur créativité leur assure une célébrité mondiale", "Leur nom s'est transformé en label de prestige", "Leurs établissements sont cotés en bourse"],
  21: ["Bâtir une église identique dans le quartier", "Débuter le réaménagement du boulevard", "Entreprendre une rénovation du lieu", "Réhabiliter les logements sociaux existants"],
  22: ["Exposer l'ensemble de ses qualités professionnelles", "Faire la preuve de son désir de travailler", "Parler avec enthousiasme de ses projets de formation", "Parler des emplois qu'on a déjà occupés"],
  23: ["Des adaptations télévisées de Maupassant", "Des programmes d'études littéraires", "Une exposition consacrée à Maupassant", "Un ouvrage critique récemment paru"],
  24: ["C'est une réponse à des besoins alimentaires accrus", "Des recherches remettent en cause l'intérêt nutritif", "Elle s'avère moins rentable que les cultures de céréales", "Les citoyens exigent des garanties sanitaires"],
  25: ["Les producteurs évitent de prendre des risques", "Les réalisateurs sont à la recherche d'idées neuves", "Les scénaristes font preuve d'une imagination limitée", "Les spectateurs privilégient les créations classiques"],
  26: ["Un obstacle pour les bateaux de pêche", "Un réchauffement dramatique des eaux", "Un risque d'intoxication des populations du Pacifique", "Une diminution de la diversité de la faune océanique"],
  27: ["Ils donnent l'impression de vénérer les produits", "Ils ont l'air éblouis par le gigantisme des magasins", "Ils paraissent manipulés par une force supérieure", "Ils semblent perdus dans le labyrinthe des rayons"],
  28: ["Pour aider à faire le deuil du passé", "Pour alléger le stockage des données", "Pour faire obstacle aux multinationales", "Pour rester maître de sa vie privée"],
  29: ["Élaborer le budget de leur voyage à Barcelone", "Gagner de l'argent pour payer leur séjour", "Montrer aux autres classes leurs talents culinaires", "Soutenir le futur projet des élèves de terminale"],
  30: ["La gestion du stress est difficile", "La santé est mise en péril", "Le corps est moins réactif", "Le système génétique est affecté"],
  31: ["L'absence totale des signes visuels du langage", "L'opposition des familles à leurs interventions", "La nécessité de modérer le ton des échanges", "Les nombreuses remarques des participants"],
  32: ["La description du personnage", "La longueur du texte", "La qualité de l'écriture", "Le déroulement des événements"],
  33: ["Les gestes révéleraient systématiquement la langue maternelle des locuteurs", "Il existerait un ordre universel de la pensée, indépendant de l'ordre linguistique", "Il y aurait autant de façons de penser que de structures de langue différentes", "Les structures des langues seraient dépendantes de notre expérience du monde"],
  34: ["Si on les prend en compte avec lucidité", "Si on les remodèle à travers l'imagination", "Si on modifie la façon dont on les perçoit", "Si on recherche leur signification profonde"],
  35: ["Ils correspondent à des programmes scolaires obsolètes", "Ils méconnaissent l'existence des familles recomposées", "Ils présentent un partage sexiste des tâches dans le couple", "Ils se moquent du quotidien des personnes sans emploi"],
  36: ["La quasi-absence d'héroïnes", "L'appel constant à la violence", "L'atténuation des clichés", "L'uniformité des scénarios"],
  37: ["Parce qu'elle finance les programmes de développement des TIC", "Parce qu'elle organise des débats entre États membres sur les TIC", "Parce qu'elle sensibilise les établissements d'enseignement aux TIC", "Parce qu'elle habilite des formateurs à l'utilisation des TIC"],
  38: ["De concrétiser des objectifs personnels", "De fonctionner dans un cadre innovant", "De limiter la répartition des gains", "De renforcer les liens entre les générations"],
  39: ["Il contribue à améliorer les méthodes d'apprentissage", "Il est indispensable pour accéder au monde professionnel", "Il permet de certifier les compétences réelles d'un candidat", "Il perturbe le processus d'acquisition des connaissances"],
};

const SLUG = "sujet-1";
const TITLE = "Sujet 1";
const IMAGE_DIR = "C:\\Users\\Guy Mafou\\Downloads\\EE 1H\\EE 1H\\EE+S1\\EE S1 Questions";
const imageName = (n) => (n <= 15 ? `Q${n}.jpeg` : `Q${n}.png`);

async function uploadFile(storagePath, absolutePath) {
  const buffer = await readFile(absolutePath);
  const contentType = absolutePath.endsWith(".png") ? "image/png" : "image/jpeg";
  const { error } = await supabase.storage.from("ce-content").upload(storagePath, buffer, {
    contentType,
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
  console.log("\nSujet 1 CE : terminé.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
