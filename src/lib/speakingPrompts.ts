// Sujets d'Expression Orale. Contenu géré depuis Supabase (table eo_prompts) — un admin
// peut en ajouter depuis /admin/eo, sans toucher au code. Voir supabase-practice-content.sql.

import { supabase } from "./supabase";

export type SpeakingPrompt = {
  id: string;
  slug: string;
  skill: "eo";
  title: string;
  instructions: string;
  durationSeconds: number;
  promptLines: string[];
  checklist: string[];
  isFree: boolean;
};

export type SpeakingPromptSummary = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
};

export async function listEoPrompts(): Promise<SpeakingPromptSummary[]> {
  const { data, error } = await supabase
    .from("eo_prompts")
    .select("id, slug, title, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((p) => ({ id: p.id, slug: p.slug, title: p.title, isFree: p.is_free }));
}

export async function getSpeakingPrompt(skill: "eo", slug: string): Promise<SpeakingPrompt | undefined> {
  if (skill !== "eo") return undefined;

  const { data, error } = await supabase
    .from("eo_prompts")
    .select("id, slug, title, instructions, duration_seconds, prompt_lines, checklist, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;

  return {
    id: data.id,
    slug: data.slug,
    skill: "eo",
    title: data.title,
    instructions: data.instructions,
    durationSeconds: data.duration_seconds,
    promptLines: data.prompt_lines as string[],
    checklist: data.checklist as string[],
    isFree: data.is_free,
  };
}

export async function createEoPrompt(input: {
  title: string;
  slug: string;
  instructions: string;
  durationSeconds: number;
  promptLines: string[];
  checklist: string[];
  isFree: boolean;
}): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("eo_prompts")
    .insert({
      title: input.title,
      slug: input.slug,
      instructions: input.instructions,
      duration_seconds: input.durationSeconds,
      prompt_lines: input.promptLines,
      checklist: input.checklist,
      is_free: input.isFree,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteEoPrompt(id: string): Promise<void> {
  const { error } = await supabase.from("eo_prompts").delete().eq("id", id);
  if (error) throw error;
}
