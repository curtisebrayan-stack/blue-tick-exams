// Ajout ponctuel du Sujet 4 de Compréhension Orale.
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-co-sujet-4.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LETTER_INDEX = { A: 0, B: 1, C: 2, D: 3 };

const ANSWERS = "B A C C A A D B A D C B A B C B A B B D B B C C D A A C B A A D D D D C A D D".split(" ");

const OPTIONS = {
  10: ["Il aura la visite de sa famille.", "Il fera une compétition.", "Il pourra travailler au calme.", "Il sera en vacances."],
  11: ["Pour un achat.", "Pour un envoi.", "Pour un renseignement.", "Pour une réclamation."],
  12: ["Avoir une aide financière.", "Obtenir un logement.", "Participer à un échange.", "S'inscrire à un cours."],
  13: ["S'entretenir avec un enseignant.", "Assister à un colloque.", "S'inscrire à l'université.", "Suivre un stage."],
  14: ["Leur client.", "Leur collègue.", "Leur directeur.", "Leur professeur."],
  15: ["Il n'aime pas l'œuvre de ce peintre.", "La présentation des tableaux lui a déplu.", "Il a trouvé qu'il allait trop de visiteurs.", "Il s'est ennuyé en faisant la queue."],
  16: ["Aller chez Anne pendant ses congés.", "Passer le mois de juillet à Montpellier.", "Prêter son appartement à son amie.", "Visiter des logements en centre-ville."],
  17: ["Elle aurait aimé faire du tourisme.", "Elle aurait préféré se coucher tôt.", "Elle pensait avoir plus d'interlocuteurs.", "Elle s'attendait à un accueil plus favorable."],
  18: ["Parce qu'elle trouve ça trop bruyant.", "Parce que c'est inadapté à ses besoins.", "Parce que ça consomme trop d'eau.", "Parce que ses enfants font la vaisselle."],
  19: ["Encourager la mobilité des étudiants.", "Favoriser l'intégration des étrangers.", "Mettre en relation des francophones.", "Offrir des emplois aux mères de famille."],
  20: ["Il a associé le tourisme et le shopping.", "Il est accessible la journée entière.", "Il regroupe les personnes âgées.", "Il s'adresse aux acheteurs à Noël."],
  21: ["Des habitants ont voté pour un maire écologique.", "Les écologistes refusent la construction d'une autoroute.", "Le ministère des Transports veut faire construire une autoroute.", "Un maire propose d'ouvrir une réserve naturelle."],
  22: ["La formation professionnelle des jeunes.", "L'absence de vérification des sources.", "Le recours systématique aux technologies.", "Les mensonges de certains collègues."],
  23: ["Parce qu'elle a toujours très faim.", "Parce qu'elle surnage et stresse.", "Parce qu'elle souffre et qu'elle est fatiguée.", "Parce qu'elle veut perdre du poids."],
  24: ["D'une collection de haute couture.", "D'une exposition de peinture.", "D'une sélection de films.", "D'une tournée de chanteurs."],
  25: ["Il a répondu à une demande de ses patients.", "Il consacre son temps à son nouveau métier.", "Il s'est remis en question suite à un échec.", "Il veut éviter toute publicité personnelle."],
  26: ["Il avait du mal à accepter ses choix.", "Il essayait souvent de rivaliser avec elle.", "Il était attentif à ses centres d'intérêt.", "Il lui interdisait les activités intellectuelles."],
  27: ["La création d'un livre pour enfant de qualité est un travail d'équipe.", "Les enfants préfèrent les livres illustrés en trois dimensions.", "Pour faire un bon livre, l'auteur doit réaliser lui-même les illustrations.", "Un livre pour enfant doit comporter le moins de texte possible."],
  28: ["Des besoins énergétiques des jeunes.", "Des bons réflexes pour les repas.", "Des comportements alimentaires.", "Des conseils de préparation culinaire."],
  29: ["Jouer aux cartes.", "Aller se promener.", "Regarder la télévision.", "Visiter la région."],
  30: ["L'absence de formation sur l'élaboration d'un budget.", "Le désintérêt des jeunes pour les questions financières.", "Le manque de cours d'économie à l'université.", "Le peu d'informations des banques sur les crédits."],
  31: ["Elles ont été revendues.", "Elles seront abandonnées.", "Elles sont stockées à l'étranger.", "Elles vont être falsifiées."],
  32: ["En écoutant les gens dans la sphère privée.", "En employant des technologies innovantes.", "En interrogeant des personnes cultivées.", "En observant divers types d'interlocuteurs."],
  33: ["L'humour : elle met en scène des produits ménagers.", "La provocation : elle présente des tableaux scandaleux.", "La répétition : elle montre des toiles absolument identiques.", "Le paradoxe : elle expose une absence d'œuvres."],
  34: ["Il adhère au choix de la méthodologie retenue.", "Il approuve toutes les conclusions présentées.", "Il conteste le professionnalisme des sondeurs.", "Il met en doute l'interprétation des résultats."],
  35: ["C'est un exemple de réussite par le sport.", "C'est un modèle rare de mixité culturelle.", "C'est un symbole fort de cette province.", "C'est une référence pour son style de jeu."],
  36: ["De sa propre personnalité.", "D'un ouvrage scientifique.", "D'une action humanitaire.", "D'une période de sa vie."],
  37: ["Que les œuvres d'art soient dégradées.", "Que leur taux de fréquentation chute.", "Qu'ils deviennent des espaces désuets.", "Qu'ils soient détournés de leur objectif."],
  38: ["Améliorer la présentation des produits.", "Augmenter le nombre de clients.", "Multiplier les points de vente.", "Maintenir des tarifs compétitifs."],
  39: ["Elle tend à devenir une forme d'expression spécifique.", "Elle reste cantonnée aux frontières du continent africain.", "Elle réunit plusieurs générations au sein d'un même lectorat.", "Elle soutient la popularité du français auprès des enfants"],
};

const IMAGES = { 1: "Q1.jpeg", 2: "Q2.jpeg" };
const PROVISIONAL = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const SLUG = "sujet-4";
const TITLE = "Sujet 4";
const AUDIO_DIR = "C:\\Users\\Guy Mafou\\Downloads\\EE 1H\\CO\\Sujet 4\\Audio CO-4";
const IMAGE_DIR = "C:\\Users\\Guy Mafou\\Downloads\\EE 1H\\CO\\Sujet 4";
const audioName = (n) => `CO-S4-Question ${n}.mp3`;

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
  console.log("\nSujet 4 : terminé.");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
