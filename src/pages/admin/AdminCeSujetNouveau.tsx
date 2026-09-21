import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { createCeSujet, type NewCeItem } from "@/lib/ceSujets";
import { slugifyTitle } from "@/lib/slug";

type ItemDraft = {
  _key: string;
  imageFile: File | null;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

function emptyItem(): ItemDraft {
  return { _key: crypto.randomUUID(), imageFile: null, question: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function AdminCeSujetNouveau() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>([emptyItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  };

  const updateItem = (index: number, patch: Partial<ItemDraft>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const updateOption = (index: number, optionIndex: number, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const options = [...it.options] as [string, string, string, string];
        options[optionIndex] = value;
        return { ...it, options };
      }),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim()) {
      setError("Le titre et l'identifiant (slug) sont obligatoires.");
      return;
    }
    if (items.length === 0) {
      setError("Ajoute au moins une question.");
      return;
    }
    for (const [i, it] of items.entries()) {
      if (!it.imageFile) {
        setError(`Question ${i + 1} : l'image du document est obligatoire.`);
        return;
      }
      if (!it.question.trim()) {
        setError(`Question ${i + 1} : le texte de la question est obligatoire.`);
        return;
      }
      if (it.options.some((o) => !o.trim())) {
        setError(`Question ${i + 1} : remplis les 4 choix de réponse.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: NewCeItem[] = items.map((it, i) => ({
        number: i + 1,
        imageFile: it.imageFile as File,
        question: it.question,
        options: it.options,
        correctIndex: it.correctIndex,
      }));
      await createCeSujet(title.trim(), slug.trim(), isFree, payload);
      navigate("/admin/ce-sujets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Nouveau sujet" description="Ajouter un sujet complet de Compréhension Écrite." />
      <button type="button" onClick={() => navigate("/admin/ce-sujets")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Nouveau sujet complet — Compréhension écrite</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell p-5">
          <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Sujet 1"
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <label className="mt-4 block text-sm font-semibold" htmlFor="slug">Identifiant (slug, dans l'URL)</label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="sujet-1"
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Sujet gratuit (sinon réservé au Premium)
          </label>
        </div>

        {items.map((it, index) => (
          <div key={it._key} className="card-shell space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Question {index + 1}</h2>
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="text-xs font-semibold text-red-500">
                  <Trash2 className="h-3.5 w-3.5" /> Retirer
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">Image du document (obligatoire)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateItem(index, { imageFile: e.target.files?.[0] ?? null })}
                className="mt-1 w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">Question (ex: "Qu'est-ce que Patrick fait chez Louise ?")</label>
              <input
                type="text"
                value={it.question}
                onChange={(e) => updateItem(index, { question: e.target.value })}
                placeholder="Texte de la question"
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {it.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={it.correctIndex === optionIndex}
                    onChange={() => updateItem(index, { correctIndex: optionIndex })}
                  />
                  <span className="text-xs font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    placeholder={`Choix ${String.fromCharCode(65 + optionIndex)}`}
                    className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="button" onClick={addItem} className="btn-outline">
          <Plus className="h-4 w-4" /> Ajouter une question
        </button>

        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Envoi en cours..." : "Créer le sujet"}
        </button>
      </form>
    </section>
  );
}
