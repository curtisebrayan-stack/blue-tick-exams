// Ajout ponctuel du Sujet 3 de Compréhension Orale.
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-co-sujet-3.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LETTER_INDEX = { A: 0, B: 1, C: 2, D: 3 };

const ANSWERS = "B C B D B B A A B A C A D A C A C C D D C C C B A B D A A D D B A C A B A A D".split(" ");

const OPTIONS = {
  8: ["À la piscine.", "À la poste.", "Au cinéma.", "Au marché."],
  9: ["Acheter un magazine.", "Choisir un sport.", "Trouver un logement.", "Visiter un quartier."],
  10: ["Il accepte la proposition de son ami.", "Il offre son aide à son ami.", "Il propose une sortie à son ami.", "Il refuse l'invitation de son ami."],
  11: ["Elle a besoin de réparations urgentes.", "Elle est localisée loin des commerces.", "Elle est située dans une rue bruyante.", "Elle possède un garage trop étroit."],
  12: ["Il a été très agréablement surpris.", "Il préfère attendre pour se prononcer.", "Il aurait aimé se mettre déjà au travail.", "Il a trouvé son supérieur peu disponible."],
  13: ["Inviter des amis chez elle.", "Rendre visite à un ami.", "Faire des courses.", "Manger en plein air."],
  14: ["Elle n'existe plus depuis un moment.", "Il n'est pas dans la bonne rue.", "Il s'est trompé d'adresse et de nom.", "Le passant ignore où elle se trouve."],
  15: ["Pour conseiller un livre.", "Pour discuter d'écologie.", "Pour parler de sa ville.", "Pour raconter un voyage."],
  16: ["À quel moment il pourra poser des congés.", "Dans quelle ville il devra partir en mission.", "Qui sera de permanence au mois d'août.", "S'il sera autorisé à suivre un stage en été."],
  17: ["Pour retirer le chéquier arrivé une semaine avant.", "Pour vérifier le renouvellement de son chéquier.", "Pour savoir quand il aura son carnet de chèques.", "Pour corriger l'orthographe de son nom sur son chéquier."],
  18: ["Pour confirmer un rendez-vous.", "Pour demander un entretien.", "Pour proposer un service.", "Pour signaler un retard."],
  19: ["Il dînera au restaurant.", "Il ira au cinéma.", "Il restera chez lui.", "Il se rendra au théâtre."],
  20: ["Les jouets éloignent ses enfants de leurs camarades de classe.", "Les derniers jeux offerts à ses enfants sont décevants.", "Ses enfants jouent beaucoup et travaillent moins à l'école.", "Un de ses enfants a du mal à respecter les règles du jeu."],
  21: ["De changer leurs pneus.", "De réviser leur voiture.", "De se montrer prudent.", "De suivre une formation."],
  22: ["La chute de la production de miel.", "La diminution du nombre d'apiculteurs.", "La mutation de l'habitat des abeilles.", "Les menaces d'attaques d'essaims en ville."],
  23: ["La créativité.", "La disponibilité.", "La mobilité.", "La persuasion."],
  24: ["Il intéresse très peu les vacanciers.", "Il offre des services de qualité supérieure.", "Il permet le développement des campagnes.", "Il souffre d'une augmentation des tarifs."],
  25: ["Elle a d'abord une vocation caritative.", "Elle concerne une seule branche d'activité.", "Elle est issue d'une initiative régionale.", "Elle permet la réduction du gaspillage."],
  26: ["Il faut obtenir l'accord de la famille.", "Il faut prouver la nécessité de la démarche.", "Il y a de nombreux documents à rassembler.", "Il y a des frais de procédure élevés."],
  27: ["Il trouve que cela lui coûte trop cher.", "Il pense que cela ne lui est plus utile.", "Il trouve que l'augmentation est injustifiée.", "Il pense qu'il aurait dû être prévenu."],
  28: ["Les critères de sélection sont particulièrement stricts.", "Les diplômes sont tous obtenus avec une mention.", "Les enseignants sont recrutés dans le monde entier.", "Les étudiants sont inscrits à des cours particuliers."],
  29: ["De maigrir plus rapidement.", "De manger sans compter.", "De s'entraîner moins souvent.", "De vivre plus longtemps."],
  30: ["Aujourd'hui, être à la mode est une préoccupation superficielle.", "Il faut porter des vêtements adaptés à toutes circonstances.", "La société actuelle donne trop de place à l'apparence.", "La tenue vestimentaire influence l'état psychologique."],
  31: ["Ils habitent plus longtemps en location.", "Ils perçoivent un salaire plus élevé.", "Ils s'investissent dans des associations.", "Ils sont tentés par les dépenses."],
  32: ["Des prédispositions pour les professions techniques.", "L'aspect magique de la métamorphose de la matière.", "Le désintérêt pour les métiers soi-disant intellectuels.", "Une rémunération à la hauteur du talent de chacun."],
  33: ["Donner des conseils de préparation.", "Éviter de faire attendre les acheteurs.", "Faire connaître des aliments oubliés.", "Respecter le goût des consommateurs."],
  34: ["La publicité diffusée par les entreprises.", "L'attirance pour des produits innovants.", "Le besoin de ressembler aux autres.", "L'imitation des attitudes des adultes."],
  35: ["La qualité croissante des résultats.", "Les aménagements hydrauliques.", "L'expérience de ses collègues.", "L'importance de pieds de vigne."],
  36: ["Un cours de musique sensorielle.", "Une école de danse pluridisciplinaire.", "Un emploi de professeur vacataire.", "Un stage de gymnastiques rythmiques."],
  37: ["De la mise en vente libre de jouets sans contrôle sanitaire.", "De la tendance des adultes à s'approprier les jouets des enfants.", "De l'intérêt croissant suscité par les jouets tout au long de l'année.", "Du niveau de toxicité maximal toléré dans la fabrication des jouets."],
  38: ["Elle est trop éloignée des orientations politiques actuelles.", "Elle fait référence à des événements historiques douloureux.", "Elle fait ressurgir des rivalités ou des antagonismes oubliés.", "Elle remet en cause la domination faite de certains pays."],
  39: ["Acheter des livres sur le bonheur rend heureux.", "Chacun de nous est prédisposé au bonheur.", "Des cours de bonheur s'imposent dès l'enfance.", "L'accès au bonheur nécessite du travail."],
};

const IMAGES = { 1: "Q1.jpeg", 2: "Q2.jpeg" };
const PROVISIONAL = new Set([1, 2, 3, 4, 5, 6, 7]);

const SLUG = "sujet-3";
const TITLE = "Sujet 3";
const AUDIO_DIR = "C:\\Users\\Guy Mafou\\Downloads\\EE 1H\\CO\\Sujet 3\\Audio CO-3";
const IMAGE_DIR = "C:\\Users\\Guy Mafou\\Downloads\\EE 1H\\CO\\Sujet 3";
const audioName = (n) => `CO-S3-Question ${n}.mp3`;

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
    .from("co_sujets")
    .upsert({ slug: SLUG, title: TITLE, is_free: true }, { onConflict: "slug" })
    .select("id")
    .single();
  if (sujetError) throw new Error(`co_sujets : ${sujetError.message}`);

  for (let number = 1; number <= 39; number++) {
    const audioAbsPath = path.resolve(AUDIO_DIR, audioName(number));
    const audioStoragePath = `${SLUG}/audio/CO-Q${number}.mp3`;
    const audioUrl = await uploadFile(audioStoragePath, audioAbsPath);

    let imageUrl = null;
    const imageName = IMAGES[number];
    if (imageName) {
      const imageAbsPath = path.resolve(IMAGE_DIR, imageName);
      const imageStoragePath = `${SLUG}/images/${imageName}`;
      imageUrl = await uploadFile(imageStoragePath, imageAbsPath);
    }

    const { error: questionError } = await supabase.from("co_questions").upsert(
      {
        sujet_id: sujet.id,
        number,
        audio_url: audioUrl,
        image_url: imageUrl,
        options: OPTIONS[number] ?? null,
        correct_index: LETTER_INDEX[ANSWERS[number - 1]],
        provisional: PROVISIONAL.has(number),
      },
      { onConflict: "sujet_id,number" },
    );
    if (questionError) throw new Error(`co_questions Q${number} : ${questionError.message}`);

    process.stdout.write(`\rQuestion ${number}/39 ajoutée`);
  }
  console.log("\nSujet 3 : terminé.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
