import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { getCeSujet, updateCeSujet, type CeSujet, type EditableCeItem } from "@/lib/ceSujets";
import NotFound from "@/pages/NotFound";

type ItemDraft = {
  number: number;
  existingImageUrl: string;
  newImageFile: File | null;
  question: string;
  options: string[];
  correctIndex: number;
};

export default function AdminCeSujetModifier() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sujet, setSujet] = useState<CeSujet | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [items, setItems] = useState<ItemDraft[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setSujet(null);
      return;
    }
    getCeSujet(slug).then((result) => {
      setSujet(result ?? null);
      if (result) {
        setTitle(result.title);
        setIsFree(result.isFree);
        setItems(
          result.items.map((it) => ({
            number: it.number,
            existingImageUrl: it.image,
            newImageFile: null,
            question: it.question,
            options: it.options,
            correctIndex: it.correctIndex,
          })),
        );
      }
    });
  }, [slug]);

  const updateItem = (index: number, patch: Partial<ItemDraft>) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const updateOption = (index: number, optionIndex: number, value: string) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== index) return it;
        const options = [...it.options];
        options[optionIndex] = value;
        return { ...it, options };
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!sujet) return;
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: EditableCeItem[] = items.map((it) => ({
        number: it.number,
        existingImageUrl: it.existingImageUrl,
        newImageFile: it.newImageFile,
        question: it.question,
        options: it.options,
        correctIndex: it.correctIndex,
      }));
      await updateCeSujet(sujet.id, sujet.slug, title.trim(), isFree, payload);
      navigate("/admin/ce-sujets");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sujet === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!sujet) return <NotFound />;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Modifier le sujet" description="Modifier un sujet complet de Compréhension Écrite." />
      <button type="button" onClick={() => navigate("/admin/ce-sujets")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Modifier — {sujet.title}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell p-5">
          <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Sujet gratuit (sinon réservé au Premium)
          </label>
        </div>

        {items.map((it, index) => (
          <div key={it.number} className="card-shell space-y-3 p-5">
            <h2 className="font-semibold">Question {it.number}</h2>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">
                Remplacer l'image (laisse vide pour garder l'actuelle)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateItem(index, { newImageFile: e.target.files?.[0] ?? null })}
                className="mt-1 w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">Question</label>
              <input
                type="text"
                value={it.question}
                onChange={(e) => updateItem(index, { question: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {[0, 1, 2, 3].map((optionIndex) => (
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
                    value={it.options[optionIndex] ?? ""}
                    onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                    placeholder={`Choix ${String.fromCharCode(65 + optionIndex)}`}
                    className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
}
