// Sujets de Compréhension Écrite. Contenu géré depuis Supabase (tables ce_exercises /
// ce_questions) — un admin peut en ajouter depuis /admin/ce, sans toucher au code.
// Voir supabase-practice-content.sql pour le schéma.

import { supabase } from "./supabase";

export type QcmQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export type PracticeExercise = {
  id: string;
  slug: string;
  skill: "ce";
  title: string;
  text: string;
  isFree: boolean;
  questions: QcmQuestion[];
};

export type PracticeExerciseSummary = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
};

export async function listCeExercises(): Promise<PracticeExerciseSummary[]> {
  const { data, error } = await supabase
    .from("ce_exercises")
    .select("id, slug, title, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((e) => ({ id: e.id, slug: e.slug, title: e.title, isFree: e.is_free }));
}

export async function getPracticeExercise(skill: "ce", slug: string): Promise<PracticeExercise | undefined> {
  if (skill !== "ce") return undefined;

  const { data: exercise, error: exerciseError } = await supabase
    .from("ce_exercises")
    .select("id, slug, title, text, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (exerciseError) throw exerciseError;
  if (!exercise) return undefined;

  const { data: questions, error: questionsError } = await supabase
    .from("ce_questions")
    .select("question, options, correct_index")
    .eq("exercise_id", exercise.id)
    .order("number", { ascending: true });
  if (questionsError) throw questionsError;

  return {
    id: exercise.id,
    slug: exercise.slug,
    skill: "ce",
    title: exercise.title,
    text: exercise.text,
    isFree: exercise.is_free,
    questions: (questions ?? []).map((q) => ({
      question: q.question,
      options: q.options as string[],
      correctIndex: q.correct_index,
    })),
  };
}

export type NewCeQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

export async function createCeExercise(
  title: string,
  slug: string,
  text: string,
  isFree: boolean,
  questions: NewCeQuestion[],
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: exercise, error: exerciseError } = await supabase
    .from("ce_exercises")
    .insert({ title, slug, text, is_free: isFree, created_by: user?.id ?? null })
    .select("id")
    .single();
  if (exerciseError) throw exerciseError;

  const rows = questions.map((q, i) => ({
    exercise_id: exercise.id,
    number: i + 1,
    question: q.question,
    options: q.options,
    correct_index: q.correctIndex,
  }));
  const { error: questionsError } = await supabase.from("ce_questions").insert(rows);
  if (questionsError) throw questionsError;

  return exercise.id as string;
}

export async function deleteCeExercise(id: string): Promise<void> {
  const { error } = await supabase.from("ce_exercises").delete().eq("id", id);
  if (error) throw error;
}
