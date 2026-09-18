// Migration ponctuelle : envoie les 2 sujets réels de Compréhension Orale (jusqu'ici codés en
// dur) vers Supabase (tables co_sujets / co_questions, bucket "co-content"), pour qu'ils
// deviennent gérables depuis l'espace admin comme les futurs sujets.
//
// Prérequis :
//   1. Avoir exécuté supabase-co-sujets.sql dans l'éditeur SQL de Supabase.
//   2. Avoir un compte avec is_admin = true (voir la note en bas de ce même fichier SQL).
//
// Usage (depuis la racine du projet) :
//   node --env-file=.env --env-file=.env.migration scripts/migrate-co-sujets.mjs
//
// .env.migration (à créer, ne JAMAIS committer) doit contenir :
//   ADMIN_EMAIL=email-du-compte-admin@exemple.com
//   ADMIN_PASSWORD=le-mot-de-passe-de-ce-compte

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Variables manquantes. Vérifie VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_EMAIL, ADMIN_PASSWORD.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LETTER_INDEX = { A: 0, B: 1, C: 2, D: 3 };

const SUJET1_ANSWERS =
  "B D C C B A A A B B A A B A A B D C A C A C B A C A C D A A A C C D D C A B D".split(" ");

const SUJET1_OPTIONS = {
  9: ["Acheter des médicaments.", "Envoyer une lettre.", "Prendre un transport.", "Voir un film."],
  10: ["D'arriver en retard.", "D'avoir une mauvaise note.", "De manquer de temps.", "De tomber malade."],
  11: ["La communication avec ses clients.", "La recherche d'un nouveau travail.", "L'achat d'un nouveau téléphone fixe.", "L'utilisation de son ordinateur portable."],
  12: ["Du cinéma.", "Du théâtre.", "De musique.", "De théâtre."],
  13: ["Pour annuler un achat.", "Pour modifier une commande.", "Pour réclamer un paquet.", "Pour retourner un colis."],
  14: ["L'annulation d'un cours.", "Le retard d'un professeur.", "Les horaires d'un examen.", "Un changement de salle."],
  15: ["Elle passe ses congés dans la région.", "Elle réside là depuis son enfance.", "Elle travaille dans le tourisme local.", "Elle vient participer à un concours."],
  16: ["La répartition des horaires.", "Le contact avec les élèves.", "Les activités pédagogiques.", "L'organisation des leçons."],
  17: ["Confirmer la date d'un entretien d'embauche.", "Se renseigner sur les conditions de travail.", "S'informer sur une formation professionnelle.", "Vérifier si un secteur est bien arrivé."],
  18: ["Le prix élevé des produits.", "Les délais pour être livré.", "Les difficultés en cas d'échange.", "Les tailles de vêtements différentes."],
  19: ["Les conditions de recrutement sont plus difficiles aujourd'hui.", "Les étudiants ignorent le fonctionnement de l'entreprise.", "Les jeunes étaient préparés plus sérieusement dans le passé.", "Les patrons actuels ont un degré d'exigence trop élevé."],
  20: ["D'acheter un roman.", "D'attendre son collègue.", "De réserver un livre.", "De revenir le lendemain."],
  21: ["Il fait plus beau qu'hier.", "Il fait plus mauvais qu'hier.", "Il pleut plus qu'hier.", "Il y a moins de soleil qu'hier."],
  22: ["La diffusion d'une langue qui exprime les nuances des sentiments.", "La multiplication des actions pour la défense des droits de l'homme.", "La promotion d'un moyen d'échange entre les différentes nationalités.", "La reconnaissance d'un patrimoine culturel unique par sa richesse."],
  23: ["Elles entrent dans la vie active avant les jeunes garçons.", "Elles se rebellent très vite face à l'autorité familiale au quotidien.", "Elles sont en désaccord avec leurs parents au sujet de leurs études.", "Elles sont mieux préparées aux tâches de tous les jours."],
  24: ["Découvrir une région de France.", "Partir vivre sur la Côte d'Azur.", "Rejoindre son épouse dans le Sud.", "Rendre visite à un ami français."],
  25: ["Pour conserver le poisson.", "Pour ranger leur matériel.", "Pour se réchauffer.", "Pour se reposer."],
  26: ["Elle a arrêté d'exercer sa profession.", "Elle a décidé d'enrichir son curriculum vitae.", "Elle a obtenu un congé de longue durée.", "Elle a réduit son nombre d'heures de travail."],
  27: ["Le jeu de l'acteur.", "Les dialogues.", "La musique.", "Le scénario."],
  28: ["Elle a gardé des enfants dans une famille britannique.", "Elle a passé son enfance dans un pays étranger.", "Elle a suivi des études dans un lycée bilingue.", "Elle a travaillé avec une institutrice américaine."],
  29: ["D'un appel à projets imaginaires.", "D'un examen de fin d'études.", "D'un nouveau plan d'urbanisme.", "D'une rénovation d'un monument."],
  30: ["L'attitude des touristes accélère sa dégradation.", "Le financement des travaux d'entretien est menacé.", "Les autorités restaurent actuellement les vestiges.", "L'intérêt pour l'architecture des lieux est en déclin."],
  31: ["C'est un temps de découverte et d'humanité.", "C'est une occasion de dépenser son énergie.", "C'est une opportunité d'apprécier la solitude.", "C'est une possibilité quotidienne d'évasion."],
  32: ["C'est la reproduction d'un café du siècle dernier.", "Il contient un dépôt-vente de meubles design.", "C'est à la fois un restaurant et une galerie d'art.", "Il y organise un festival de musique électronique."],
  33: ["À comparer les étapes du clonage naturel et artificiel.", "À observer l'effet des activités humaines sur la nature.", "À orienter la recherche en prenant la nature comme modèle.", "À sensibiliser les hommes à respecter leur milieu naturel."],
  34: ["Ils consomment plus que la jeune génération.", "Ils dépensent beaucoup pour leur santé.", "Ils profitent peu des effets de la croissance.", "Ils sont à l'origine de créations d'emplois."],
  35: ["Ils dégagent une odeur agréable.", "Ils ont des résultats spectaculaires.", "Ils ont l'avantage d'être peu chers.", "Ils répondent à ses convictions."],
  36: ["C'est aux parents de choisir pour leurs enfants.", "Il faut l'étendre à toutes les générations.", "Le dispositif fonctionne bien tel qu'il est.", "L'État doit l'imposer à la population."],
  37: ["La relation liant Camille Claudel et Rodin.", "La richesse du musée Auguste Rodin.", "Les difficultés rencontrées par Rodin.", "Les sources d'inspiration de Rodin."],
  38: ["Elles demandent un nouveau statut juridique.", "Elles exigent des garanties réelles et tangibles.", "Elles mettent en doute la viabilité du projet.", "Elles veulent que les terres restent intactes."],
  39: ["Elle est régie par des normes internationales strictes.", "Elle est réputée sans danger pour le milieu naturel.", "Les inconvénients qu'elle présente sont manifestes.", "Les sociétés de production en exagèrent la rentabilité."],
};

const SUJET1_IMAGES = { 1: "Q1.jpeg", 2: "Q2.jpeg" };
const PROVISIONAL_SUJET1 = new Set([1, 2, 3, 4, 5, 6, 7, 8]);

const SUJET2_ANSWERS =
  "C C B A C A B B C B C D B B B A D A C A C C A C D A C A A C C C B A A D B A C".split(" ");

const SUJET2_OPTIONS = {
  10: ["Écrire.", "Téléphoner.", "Lire.", "Écouter."],
  11: ["Il eut un accident sur la route.", "Il fait une chute à la montagne.", "Il est tombé dans son escalier.", "Il s'est battu avec un ami."],
  12: ["De faire des rencontres.", "De manger gratuitement.", "De trouver un travail.", "De vivre chez quelqu'un."],
  13: ["De l'actualité européenne.", "Du dernier film qu'elles ont vu.", "D'un trafic de documents.", "D'un vieil ami commun."],
  14: ["Conseiller les parents en matière d'alimentation.", "Créer l'occasion de se retrouver en famille.", "Découvrir des recettes de grand-mère.", "Ressembler des enfants du monde entier."],
  15: ["Féliciter les acteurs dans leur loge.", "Remettre un vêtement du vestiaire.", "Retourner à la salle de spectacle.", "S'informer sur la programmation."],
  16: ["D'essayer un vêtement près du corps.", "De changer la taille de l'article choisi.", "De choisir une tenue multicolore.", "De compléter son achat avec un pull."],
  17: ["À un couturier.", "À un jardinier.", "À un traiteur.", "À un décorateur."],
  18: ["De déjeuner ensemble.", "De faire une soirée.", "De participer à un jeu.", "De rencontrer un invité."],
  19: ["Avoir de l'expérience dans la vente.", "Habiter près de Sainton-les-Tonges.", "Pratiquer régulièrement du sport.", "Savoir gérer un site internet."],
  20: ["La circulation routière est coupée.", "La commande s'est perdue.", "Le transporteur est en grève.", "Les marchandises ont été volées."],
  21: ["Interviewer un réalisateur.", "Participer à un festival.", "Tourner un film.", "Visiter des studios de cinéma."],
  22: ["Visiter des studios de cinéma.", "Lui apporter un livre.", "Lui présenter son travail.", "Lui proposer une interview."],
  23: ["Ils déplorent un manque d'information.", "Ils refusent de participer à la collecte.", "Ils s'inquiètent de la sécurité sanitaire.", "Ils souhaitent rencontrer des soignants."],
  24: ["La voiture est interdite en centre-ville.", "Le sens de la circulation est modifié.", "Le stationnement est devenu payant.", "Les embouteillages sont fréquents."],
  25: ["L'organisation d'ateliers vidéo.", "La présence de réalisateurs étrangers.", "La projection de documentaire.", "La variété de la programmation."],
  26: ["La recherche d'un appartement est rapide.", "Le système de la colocation est encouragé.", "Les habitations proposées sont de qualité.", "Les logements sont bon marché en banlieue."],
  27: ["Parce qu'elles étaient difficiles à mettre en œuvre.", "Parce qu'elles ignoraient la particularité des contextes.", "Parce qu'elles avaient lieu tôt dans l'année scolaire.", "Parce qu'elles proposaient des exercices complexes."],
  28: ["L'état actuel de la biodiversité.", "L'existence de plantes menaçantes.", "La découverte de nouvelles espèces menacées.", "Le rôle de l'ONU dans la préservation des espèces."],
  29: ["D'apprendre à élaborer des itinéraires de visites.", "D'expérimenter une manière différente de voyager.", "De découvrir des adresses d'hôpital à l'étranger.", "De participer à des actions de solidarité internationale."],
  30: ["À classer les établissements selon un taux de performance.", "À communiquer sur les progrès de l'élève dans chaque matière.", "À créer une échelle lisible de classification des élèves.", "À susciter chez l'élève l'envie de devenir le meilleur de la classe."],
  31: ["De la législation en vigueur.", "De la paye des employés.", "Du bon vouloir du client.", "Du type d'établissement."],
  32: ["Elle concerne de moins en moins d'articles.", "Elle est maîtrisée grâce aux contrôles.", "Elle met en danger le marché du travail.", "Elle se concentre sur des objets précieux."],
  33: ["La télévision touche des droits importants sur les compétitions.", "Les comportements machistes perdurent dans l'univers sportif.", "Les fédérations sont souvent impliquées dans des scandales.", "Les grandes équipes concentrent la majorité des financements."],
  34: ["Un aménagement territorial en fonction des données météorologiques.", "Un programme de réduction des différentes sources de pollution.", "Une analyse comparative entre les modes de vie citadins et ruraux.", "Une proposition de prévention renforcée des grands cataclysmes."],
  35: ["De l'absurdité qu'il y a valorisé leur manque de culture scientifique.", "De la nécessité de mieux défendre les acquis de la culture classique.", "Du besoin qu'ont les mathématiciens d'avoir une culture générale.", "Du refus des valeurs humanistes par les milieux scientifiques."],
  36: ["Ses créations sont très romantiques.", "Ses décors sont créés par des artistes américains.", "Ses membres sont d'origines variées.", "Ses spectacles sont donnés dans des sites insolites."],
  37: ["De consulter un médecin psychothérapeute.", "D'attendre que le temps ait fait son œuvre.", "De prescrire un traitement médicamenteux.", "D'informer les utilisateurs sur leurs dangers."],
  38: ["De la tranquillité et de l'intimité.", "Des facilités de réservation.", "Un contrat privilégié avec son hôte.", "Un tarif intéressant toute l'année."],
  39: ["L'absence de temps morts.", "L'ennui des distractions.", "L'insuffisance de repos.", "Le manque d'action."],
};

const SUJET2_IMAGES = { 1: "Q1.jpeg", 2: "Q2.jpeg", 3: "Q3.jpeg" };
const PROVISIONAL_SUJET2 = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const SUJETS = [
  {
    slug: "sujet-1",
    title: "Sujet 1",
    answers: SUJET1_ANSWERS,
    options: SUJET1_OPTIONS,
    images: SUJET1_IMAGES,
    provisional: PROVISIONAL_SUJET1,
    audioDir: "public/audio/co-sujet-1",
    imageDir: "public/images/co-sujet-1",
    audioName: (n) => `CO-Q${n}.mp3`,
  },
  {
    slug: "sujet-2",
    title: "Sujet 2",
    answers: SUJET2_ANSWERS,
    options: SUJET2_OPTIONS,
    images: SUJET2_IMAGES,
    provisional: PROVISIONAL_SUJET2,
    audioDir: "public/audio/co-sujet-2",
    imageDir: "public/images/co-sujet-2",
    audioName: (n) => `CO-S2-Q${n}.mp3`,
  },
];

async function uploadFile(storagePath, absolutePath) {
  const buffer = await readFile(absolutePath);
  const contentType = absolutePath.endsWith(".mp3") ? "audio/mpeg" : "image/jpeg";
  const { error } = await supabase.storage.from("co-content").upload(storagePath, buffer, {
    contentType,
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`Upload ${storagePath} : ${error.message}`);
  return supabase.storage.from("co-content").getPublicUrl(storagePath).data.publicUrl;
}

async function migrateSujet(def) {
  console.log(`\n--- ${def.title} (${def.slug}) ---`);

  const { data: sujet, error: sujetError } = await supabase
    .from("co_sujets")
    .upsert({ slug: def.slug, title: def.title }, { onConflict: "slug" })
    .select("id")
    .single();
  if (sujetError) throw new Error(`co_sujets ${def.slug} : ${sujetError.message}`);

  for (let i = 0; i < 39; i++) {
    const number = i + 1;
    const audioAbsPath = path.resolve(def.audioDir, def.audioName(number));
    const audioStoragePath = `${def.slug}/audio/CO-Q${number}.mp3`;
    const audioUrl = await uploadFile(audioStoragePath, audioAbsPath);

    let imageUrl = null;
    const imageName = def.images[number];
    if (imageName) {
      const imageAbsPath = path.resolve(def.imageDir, imageName);
      const imageStoragePath = `${def.slug}/images/${imageName}`;
      imageUrl = await uploadFile(imageStoragePath, imageAbsPath);
    }

    const { error: questionError } = await supabase.from("co_questions").upsert(
      {
        sujet_id: sujet.id,
        number,
        audio_url: audioUrl,
        image_url: imageUrl,
        options: def.options[number] ?? null,
        correct_index: LETTER_INDEX[def.answers[i]],
        provisional: def.provisional.has(number),
      },
      { onConflict: "sujet_id,number" },
    );
    if (questionError) throw new Error(`co_questions ${def.slug} Q${number} : ${questionError.message}`);

    process.stdout.write(`\rQuestion ${number}/39 migrée`);
  }
  console.log(`\n${def.title} : terminé.`);
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

  for (const def of SUJETS) {
    await migrateSujet(def);
  }

  console.log("\nMigration terminée.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur pendant la migration :", err.message);
  process.exit(1);
});
