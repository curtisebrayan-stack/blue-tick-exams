// Ajout de 13 sessions Expression Orale (Octobre 2024 à Octobre 2025), Tâche 2 et
// Tâche 3, à partir du deuxième document envoyé par le client (eo-sessions-extra2.json).
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-eo-sessions-extra2.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  const raw = await readFile(new URL("./eo-sessions-extra2.json", import.meta.url), "utf-8");
  const sessions = JSON.parse(raw);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  let totalSujets = 0;
  for (const [slug, data] of Object.entries(sessions)) {
    const { data: session, error: sessionError } = await supabase
      .from("eo_sessions")
      .upsert({ slug, label: data.label, is_free: true }, { onConflict: "slug" })
      .select("id")
      .single();
    if (sessionError) throw new Error(`eo_sessions ${slug} : ${sessionError.message}`);

    for (const sujet of data.tache2) {
      const { error } = await supabase.from("eo_session_sujets").upsert(
        { session_id: session.id, tache: 2, number: sujet.number, consigne: sujet.consigne, questions: sujet.questions, reponse: null },
        { onConflict: "session_id,tache,number" },
      );
      if (error) throw new Error(`${slug} tache2 S${sujet.number} : ${error.message}`);
      totalSujets++;
    }
    for (const sujet of data.tache3) {
      const { error } = await supabase.from("eo_session_sujets").upsert(
        { session_id: session.id, tache: 3, number: sujet.number, consigne: sujet.consigne, questions: null, reponse: sujet.reponse },
        { onConflict: "session_id,tache,number" },
      );
      if (error) throw new Error(`${slug} tache3 S${sujet.number} : ${error.message}`);
      totalSujets++;
    }
    console.log(`${slug} (${data.label}) : tache2=${data.tache2.length} tache3=${data.tache3.length}`);
  }
  console.log(`\nTerminé : ${totalSujets} sujets ajoutés sur ${Object.keys(sessions).length} sessions.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
