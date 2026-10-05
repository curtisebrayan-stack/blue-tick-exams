// Ajout de la session Expression Écrite — Septembre 2023 (le mois le plus ancien
// couvert jusqu'ici était Décembre 2023). Tâche 3, sujets 3 et 4 : le document
// source ne contenait pas de "Solution proposée" pour ces deux sujets (reponse=null).
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-ee-session-septembre-2023.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SLUG = "septembre-2023";
const LABEL = "Septembre 2023";

async function main() {
  const raw = await readFile(new URL("./ee-sept-2023.json", import.meta.url), "utf-8");
  const data = JSON.parse(raw);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  const { data: session, error: sessionError } = await supabase
    .from("ee_sessions")
    .upsert({ slug: SLUG, label: LABEL, is_free: true }, { onConflict: "slug" })
    .select("id")
    .single();
  if (sessionError) throw new Error(`ee_sessions : ${sessionError.message}`);

  let total = 0;
  for (const [key, tache] of [["tache1", 1], ["tache2", 2], ["tache3", 3]]) {
    for (const sujet of data[key]) {
      const { error } = await supabase.from("ee_session_sujets").upsert(
        { session_id: session.id, tache, number: sujet.number, consigne: sujet.consigne, reponse: sujet.reponse },
        { onConflict: "session_id,tache,number" },
      );
      if (error) throw new Error(`${key} S${sujet.number} : ${error.message}`);
      total++;
    }
  }
  console.log(`${LABEL} : ${total} sujets ajoutés (tache1=${data.tache1.length}, tache2=${data.tache2.length}, tache3=${data.tache3.length}).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
