// Sujets complets de Compréhension Écrite (format examen, 39 questions indépendantes,
// chacune avec sa propre image de document). Contenu géré depuis Supabase (tables
// ce_sujets / ce_items, bucket de stockage "ce-content") — un admin peut en ajouter
// depuis /admin, sans toucher au code. Voir supabase-ce-sujets.sql pour le schéma.

import { supabase } from "./supabase";

export type CeItem = {
  number: number;
  image: string;
  options: string[];
  correctIndex: number;
};

export type CeSujet = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
  items: CeItem[];
};

export type CeSujetSummary = {
  id: string;
  slug: string;
  title: string;
  isFree: boolean;
};

export async function listCeSujets(): Promise<CeSujetSummary[]> {
  const { data, error } = await supabase
    .from("ce_sujets")
    .select("id, slug, title, is_free")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((s) => ({ id: s.id, slug: s.slug, title: s.title, isFree: s.is_free }));
}

export async function getCeSujet(slug: string): Promise<CeSujet | undefined> {
  const { data: sujet, error: sujetError } = await supabase
    .from("ce_sujets")
    .select("id, slug, title, is_free")
    .eq("slug", slug)
    .maybeSingle();
  if (sujetError) throw sujetError;
  if (!sujet) return undefined;

  const { data: items, error: itemsError } = await supabase
    .from("ce_items")
    .select("number, image_url, options, correct_index")
    .eq("sujet_id", sujet.id)
    .order("number", { ascending: true });
  if (itemsError) throw itemsError;

  return {
    id: sujet.id,
    slug: sujet.slug,
    title: sujet.title,
    isFree: sujet.is_free,
    items: (items ?? []).map((it) => ({
      number: it.number,
      image: it.image_url,
      options: it.options as string[],
      correctIndex: it.correct_index,
    })),
  };
}

export type NewCeItem = {
  number: number;
  imageFile: File;
  options: string[];
  correctIndex: number;
};

function fileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "bin";
}

export async function createCeSujet(
  title: string,
  slug: string,
  isFree: boolean,
  items: NewCeItem[],
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: sujet, error: sujetError } = await supabase
    .from("ce_sujets")
    .insert({ title, slug, is_free: isFree, created_by: user?.id ?? null })
    .select("id")
    .single();
  if (sujetError) throw sujetError;

  for (const it of items) {
    const imagePath = `${slug}/images/Q${it.number}.${fileExtension(it.imageFile.name)}`;
    const { error: imageError } = await supabase.storage
      .from("ce-content")
      .upload(imagePath, it.imageFile, { upsert: true, cacheControl: "31536000" });
    if (imageError) throw imageError;
    const imageUrl = supabase.storage.from("ce-content").getPublicUrl(imagePath).data.publicUrl;

    const { error: itemError } = await supabase.from("ce_items").insert({
      sujet_id: sujet.id,
      number: it.number,
      image_url: imageUrl,
      options: it.options,
      correct_index: it.correctIndex,
    });
    if (itemError) throw itemError;
  }

  return sujet.id as string;
}

export type EditableCeItem = {
  number: number;
  existingImageUrl: string;
  newImageFile: File | null;
  options: string[];
  correctIndex: number;
};

export async function updateCeSujet(
  id: string,
  slug: string,
  title: string,
  isFree: boolean,
  items: EditableCeItem[],
): Promise<void> {
  const { error: sujetError } = await supabase
    .from("ce_sujets")
    .update({ title, is_free: isFree })
    .eq("id", id);
  if (sujetError) throw sujetError;

  for (const it of items) {
    let imageUrl = it.existingImageUrl;
    if (it.newImageFile) {
      const imagePath = `${slug}/images/Q${it.number}.${fileExtension(it.newImageFile.name)}`;
      const { error } = await supabase.storage
        .from("ce-content")
        .upload(imagePath, it.newImageFile, { upsert: true, cacheControl: "31536000" });
      if (error) throw error;
      imageUrl = supabase.storage.from("ce-content").getPublicUrl(imagePath).data.publicUrl;
    }

    const { error: itemError } = await supabase
      .from("ce_items")
      .update({ image_url: imageUrl, options: it.options, correct_index: it.correctIndex })
      .eq("sujet_id", id)
      .eq("number", it.number);
    if (itemError) throw itemError;
  }
}

export async function deleteCeSujet(id: string): Promise<void> {
  const { error } = await supabase.from("ce_sujets").delete().eq("id", id);
  if (error) throw error;
}
