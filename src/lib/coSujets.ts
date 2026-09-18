// Sujets complets de Compréhension Orale (format examen, 39 questions type).
// Le contenu (audio, images, choix de réponse) vit dans Supabase (tables co_sujets /
// co_questions, bucket de stockage "co-content") — un admin peut en ajouter depuis /admin,
// sans toucher au code. Voir supabase-co-sujets.sql pour le schéma.

import { supabase } from "./supabase";

export type CoQuestion = {
  number: number;
  audio: string;
  image?: string;
  options: string[] | null;
  correctIndex: number;
  provisional?: boolean;
};

export type CoSujet = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
  questions: CoQuestion[];
};

export type CoSujetSummary = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
};

export async function listCoSujets(): Promise<CoSujetSummary[]> {
  const { data, error } = await supabase
    .from("co_sujets")
    .select("id, slug, title, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((s) => ({ id: s.id, slug: s.slug, title: s.title, isFree: s.is_free }));
}

export async function getCoSujet(slug: string): Promise<CoSujet | undefined> {
  const { data: sujet, error: sujetError } = await supabase
    .from("co_sujets")
    .select("id, slug, title, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (sujetError) throw sujetError;
  if (!sujet) return undefined;

  const { data: questions, error: questionsError } = await supabase
    .from("co_questions")
    .select("number, audio_url, image_url, options, correct_index, provisional")
    .eq("sujet_id", sujet.id)
    .order("number", { ascending: true });
  if (questionsError) throw questionsError;

  return {
    id: sujet.id,
    slug: sujet.slug,
    title: sujet.title,
    isFree: sujet.is_free,
    questions: (questions ?? []).map((q) => ({
      number: q.number,
      audio: q.audio_url,
      image: q.image_url ?? undefined,
      options: q.options as string[] | null,
      correctIndex: q.correct_index,
      provisional: q.provisional,
    })),
  };
}

export type NewCoQuestion = {
  number: number;
  audioFile: File;
  imageFile: File | null;
  options: string[] | null;
  correctIndex: number;
};

function fileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "bin";
}

export async function createCoSujet(
  title: string,
  slug: string,
  isFree: boolean,
  questions: NewCoQuestion[],
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sujet, error: sujetError } = await supabase
    .from("co_sujets")
    .insert({ title, slug, is_free: isFree, created_by: user?.id ?? null })
    .select("id")
    .single();
  if (sujetError) throw sujetError;

  for (const q of questions) {
    const audioPath = `${slug}/audio/Q${q.number}.${fileExtension(q.audioFile.name)}`;
    const { error: audioError } = await supabase.storage
      .from("co-content")
      .upload(audioPath, q.audioFile, { upsert: true, cacheControl: "31536000" });
    if (audioError) throw audioError;
    const audioUrl = supabase.storage.from("co-content").getPublicUrl(audioPath).data.publicUrl;

    let imageUrl: string | null = null;
    if (q.imageFile) {
      const imagePath = `${slug}/images/Q${q.number}.${fileExtension(q.imageFile.name)}`;
      const { error: imageError } = await supabase.storage
        .from("co-content")
        .upload(imagePath, q.imageFile, { upsert: true, cacheControl: "31536000" });
      if (imageError) throw imageError;
      imageUrl = supabase.storage.from("co-content").getPublicUrl(imagePath).data.publicUrl;
    }

    const { error: questionError } = await supabase.from("co_questions").insert({
      sujet_id: sujet.id,
      number: q.number,
      audio_url: audioUrl,
      image_url: imageUrl,
      options: q.options,
      correct_index: q.correctIndex,
      provisional: false,
    });
    if (questionError) throw questionError;
  }

  return sujet.id as string;
}

export async function deleteCoSujet(id: string): Promise<void> {
  const { error } = await supabase.from("co_sujets").delete().eq("id", id);
  if (error) throw error;
}
