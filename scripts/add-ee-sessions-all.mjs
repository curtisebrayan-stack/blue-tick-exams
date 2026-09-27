// Ajout en masse des sessions Expression Écrite (31 mois, 810 sujets au total).
// Contenu parsé programmatiquement depuis les fichiers texte fournis par le client
// (dossier "EE"), nettoyé du bruit d'interface ("En cours", "Voir la proposition de
// solution") et vérifié contre la source avant import. Voir ee-all-sessions.json.
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-ee-sessions-all.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const raw = await readFile(new URL("./ee-all-sessions.json", import.meta.url), "utf-8");
  const sessions = JSON.parse(raw);
  const slugs = Object.keys(sessions);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  let totalSujets = 0;
  for (const [i, slug] of slugs.entries()) {
    const session = sessions[slug];

    const { data: row, error: sessionError } = await supabase
      .from("ee_sessions")
      .upsert({ slug, label: session.label, is_free: true }, { onConflict: "slug" })
      .select("id")
      .single();
    if (sessionError) throw new Error(`ee_sessions ${slug} : ${sessionError.message}`);

    const rows = [];
    for (const tache of [1, 2, 3]) {
      for (const sujet of session.taches[String(tache)]) {
        rows.push({
          session_id: row.id,
          tache,
          number: sujet.number,
          consigne: sujet.consigne,
          reponse: sujet.reponse,
        });
      }
    }

    const { error: sujetsError } = await supabase
      .from("ee_session_sujets")
      .upsert(rows, { onConflict: "session_id,tache,number" });
    if (sujetsError) throw new Error(`ee_session_sujets ${slug} : ${sujetsError.message}`);

    totalSujets += rows.length;
    process.stdout.write(`\r[${i + 1}/${slugs.length}] ${slug} : ${rows.length} sujets (total : ${totalSujets})`);
  }
  console.log(`\nTerminé : ${slugs.length} sessions, ${totalSujets} sujets importés.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
