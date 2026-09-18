// Sujets d'Expression Écrite. Contenu géré depuis Supabase (table ee_prompts) — un admin
// peut en ajouter depuis /admin/ee, sans toucher au code. Voir supabase-practice-content.sql.

import { supabase } from "./supabase";

export type WritingPrompt = {
  id: string;
  slug: string;
  skill: "ee";
  title: string;
  instructions: string;
  minWords: number;
  maxWords: number;
  checklist: string[];
  isFree: boolean;
};

export type WritingPromptSummary = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
};

export async function listEePrompts(): Promise<WritingPromptSummary[]> {
  const { data, error } = await supabase
    .from("ee_prompts")
    .select("id, slug, title, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((p) => ({ id: p.id, slug: p.slug, title: p.title, isFree: p.is_free }));
}

export async function getWritingPrompt(skill: "ee", slug: string): Promise<WritingPrompt | undefined> {
  if (skill !== "ee") return undefined;

  const { data, error } = await supabase
    .from("ee_prompts")
    .select("id, slug, title, instructions, min_words, max_words, checklist, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return undefined;

  return {
    id: data.id,
    slug: data.slug,
    skill: "ee",
    title: data.title,
    instructions: data.instructions,
    minWords: data.min_words,
    maxWords: data.max_words,
    checklist: data.checklist as string[],
    isFree: data.is_free,
  };
}

export async function createEePrompt(input: {
  title: string;
  slug: string;
  instructions: string;
  minWords: number;
  maxWords: number;
  checklist: string[];
  isFree: boolean;
}): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("ee_prompts")
    .insert({
      title: input.title,
      slug: input.slug,
      instructions: input.instructions,
      min_words: input.minWords,
      max_words: input.maxWords,
      checklist: input.checklist,
      is_free: input.isFree,
      created_by: user?.id ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function deleteEePrompt(id: string): Promise<void> {
  const { error } = await supabase.from("ee_prompts").delete().eq("id", id);
  if (error) throw error;
}
