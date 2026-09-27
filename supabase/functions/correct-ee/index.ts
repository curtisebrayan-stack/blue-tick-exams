// Correction automatique d'une rédaction Expression Écrite (TCF Canada) par IA.
// Tourne côté serveur (Supabase Edge Function) : la clé Anthropic n'est jamais
// exposée au navigateur. Usage : supabase.functions.invoke("correct-ee", {...}).

import { createClient } from "jsr:@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const MODEL = "claude-haiku-4-5-20251001";
// Doit rester synchronisé avec MONTHLY_EXAM_QUOTA dans src/lib/examQuota.ts.
const MONTHLY_EXAM_QUOTA = 30;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TACHE_LABELS: Record<number, string> = {
  1: "Tâche 1 (message court, 60-120 mots)",
  2: "Tâche 2 (récit ou description, 120-150 mots)",
  3: "Tâche 3 (argumentation à partir de documents, 120-180 mots)",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS_HEADERS });

  if (!ANTHROPIC_API_KEY) {
    return jsonResponse({ error: "Correction indisponible : clé IA non configurée." }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return jsonResponse({ error: "Non authentifié." }, 401);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return jsonResponse({ error: "Non authentifié." }, 401);
  const user = userData.user;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_premium && !profile?.is_admin) {
    return jsonResponse({ error: "La correction automatique est réservée aux comptes Premium." }, 403);
  }

  // Quota mensuel de corrections, indépendamment de ce que dit le client.
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from("writing_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .not("corrected_at", "is", null)
    .gte("corrected_at", startOfMonth.toISOString());
  if ((count ?? 0) >= MONTHLY_EXAM_QUOTA) {
    return jsonResponse({ error: `Quota de ${MONTHLY_EXAM_QUOTA} examens corrigés atteint pour ce mois. Ça se réinitialise le 1er du mois prochain.` }, 429);
  }

  let body: { tache?: number; consigne?: string; text?: string; submissionId?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "Requête invalide." }, 400);
  }
  const { tache, consigne, text, submissionId } = body;
  if (!tache || !consigne || !text || !text.trim()) {
    return jsonResponse({ error: "Données manquantes." }, 400);
  }

  const systemPrompt = `Tu es un correcteur expert du TCF Canada (Test de connaissance du français), épreuve d'Expression écrite. Tu évalues la production d'un candidat pour ${TACHE_LABELS[tache] ?? "une tâche d'expression écrite"}, dans le contexte d'un dossier d'immigration au Canada.

Analyse le texte selon : grammaire, orthographe, vocabulaire, structure/cohérence, respect de la consigne et du nombre de mots attendu.

Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format exact :
{
  "score": <entier 0-20>,
  "strengths": ["point fort 1", "point fort 2"],
  "improvements": ["point à améliorer 1", "point à améliorer 2", "point à améliorer 3"],
  "corrected_text": "<le texte corrigé, avec les erreurs de grammaire/orthographe corrigées>",
  "comment": "<2-3 phrases de synthèse en français, ton bienveillant mais honnête, dans le contexte de la préparation à l'immigration>"
}`;

  const userMessage = `Consigne donnée au candidat :\n${consigne}\n\nTexte rédigé par le candidat :\n${text}`;

  let correction;
  try {
    const aiRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("Anthropic API error:", aiRes.status, errText);
      return jsonResponse({ error: "La correction a échoué. Réessaie dans un instant." }, 502);
    }
    const aiData = await aiRes.json();
    const rawText = aiData.content?.[0]?.text ?? "";
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Réponse IA non structurée.");
    correction = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Correction parsing error:", err);
    return jsonResponse({ error: "La correction a échoué. Réessaie dans un instant." }, 502);
  }

  if (submissionId) {
    await supabase
      .from("writing_submissions")
      .update({ correction, corrected_at: new Date().toISOString() })
      .eq("id", submissionId)
      .eq("user_id", user.id);
  }

  return jsonResponse({ correction });
});
