import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { createEePrompt } from "@/lib/writingPrompts";
import { slugifyTitle } from "@/lib/slug";

export default function AdminEeNouveau() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [minWords, setMinWords] = useState(60);
  const [maxWords, setMaxWords] = useState(100);
  const [checklist, setChecklist] = useState<string[]>([""]);
  const [isFree, setIsFree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  };

  const updateChecklistItem = (i: number, value: string) => {
    setChecklist((prev) => prev.map((v, idx) => (idx === i ? value : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanChecklist = checklist.map((c) => c.trim()).filter(Boolean);

    if (!title.trim() || !slug.trim() || !instructions.trim()) {
      setError("Le titre, l'identifiant et les instructions sont obligatoires.");
      return;
    }
    if (minWords > maxWords) {
      setError("Le nombre de mots minimum doit être inférieur ou égal au maximum.");
      return;
    }
    if (cleanChecklist.length === 0) {
      setError("Ajoute au moins un point dans la grille d'auto-relecture.");
      return;
    }

    setSubmitting(true);
    try {
      await createEePrompt({
        title: title.trim(),
        slug: slug.trim(),
        instructions: instructions.trim(),
        minWords,
        maxWords,
        checklist: cleanChecklist,
        isFree,
      });
      navigate("/admin/ee");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Nouveau sujet" description="Ajouter un sujet d'Expression Écrite." />
      <button type="button" onClick={() => navigate("/admin/ee")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Nouveau sujet — Expression écrite</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell space-y-4 p-5">
          <div>
            <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Message à un collègue"
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold" htmlFor="slug">Identifiant (slug, dans l'URL)</label>
            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="message-a-un-collegue"
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold" htmlFor="instructions">Consigne</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              placeholder="Ce que l'apprenant doit rédiger..."
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-semibold" htmlFor="minWords">Mots minimum</label>
              <input
                id="minWords"
                type="number"
                min={1}
                value={minWords}
                onChange={(e) => setMinWords(Number(e.target.value))}
                className="mt-2 w-28 rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold" htmlFor="maxWords">Mots maximum</label>
              <input
                id="maxWords"
                type="number"
                min={1}
                value={maxWords}
                onChange={(e) => setMaxWords(Number(e.target.value))}
                className="mt-2 w-28 rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Sujet gratuit (sinon réservé au Premium)
          </label>
        </div>

        <div className="card-shell p-5">
          <p className="text-sm font-semibold">Grille d'auto-relecture</p>
          <div className="mt-2 space-y-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateChecklistItem(i, e.target.value)}
                  placeholder="Le message explique clairement la demande"
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
                />
                {checklist.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setChecklist((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setChecklist((prev) => [...prev, ""])}
            className="mt-2 text-xs font-semibold text-primary"
          >
            <Plus className="mr-1 inline h-3.5 w-3.5" /> Ajouter une ligne
          </button>
        </div>

        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Envoi en cours..." : "Créer le sujet"}
        </button>
      </form>
    </section>
  );
}
