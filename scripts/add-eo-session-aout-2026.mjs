// Ajout ponctuel de la session Expression Orale — Août 2026, Tâche 2 (20 sujets).
// La Tâche 3 n'a pas encore été fournie par le client — la session est créée sans,
// on la complétera avec un script séparé dès réception.
// Usage : node --env-file=.env --env-file=.env.migration scripts/add-eo-session-aout-2026.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SLUG = "aout-2026";
const LABEL = "Août 2026";

async function main() {
  const raw = await readFile(new URL("./eo-aout-2026-tache2.json", import.meta.url), "utf-8");
  const sujets = JSON.parse(raw);

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (signInError) {
    console.error(`Connexion admin échouée : ${signInError.message}`);
    process.exit(1);
  }

  const { data: session, error: sessionError } = await supabase
    .from("eo_sessions")
    .upsert({ slug: SLUG, label: LABEL, is_free: true }, { onConflict: "slug" })
    .select("id")
    .single();
  if (sessionError) throw new Error(`eo_sessions : ${sessionError.message}`);

  for (const sujet of sujets) {
    const { error: itemError } = await supabase.from("eo_session_sujets").upsert(
      {
        session_id: session.id,
        tache: 2,
        number: sujet.number,
        consigne: sujet.consigne,
        questions: sujet.questions,
      },
      { onConflict: "session_id,tache,number" },
    );
    if (itemError) throw new Error(`eo_session_sujets S${sujet.number} : ${itemError.message}`);
    process.stdout.write(`\rSujet ${sujet.number}/${sujets.length} ajouté`);
  }
  console.log(`\nSession ${LABEL} — Tâche 2 : ${sujets.length}/${sujets.length} sujets ajoutés.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\nErreur :", err.message);
  process.exit(1);
});
