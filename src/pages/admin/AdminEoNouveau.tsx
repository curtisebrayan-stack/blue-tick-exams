import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { createEoPrompt } from "@/lib/speakingPrompts";
import { slugifyTitle } from "@/lib/slug";

function StringListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, ""])} className="mt-2 text-xs font-semibold text-primary">
        <Plus className="mr-1 inline h-3.5 w-3.5" /> Ajouter une ligne
      </button>
    </div>
  );
}

export default function AdminEoNouveau() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [promptLines, setPromptLines] = useState<string[]>([""]);
  const [checklist, setChecklist] = useState<string[]>([""]);
  const [isFree, setIsFree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanLines = promptLines.map((l) => l.trim()).filter(Boolean);
    const cleanChecklist = checklist.map((c) => c.trim()).filter(Boolean);

    if (!title.trim() || !slug.trim() || !instructions.trim()) {
      setError("Le titre, l'identifiant et les instructions sont obligatoires.");
      return;
    }
    if (cleanLines.length === 0) {
      setError("Ajoute au moins une question/ligne de consigne.");
      return;
    }
    if (cleanChecklist.length === 0) {
      setError("Ajoute au moins un point dans la grille d'auto-évaluation.");
      return;
    }

    setSubmitting(true);
    try {
      await createEoPrompt({
        title: title.trim(),
        slug: slug.trim(),
        instructions: instructions.trim(),
        durationSeconds: Math.max(1, durationMinutes) * 60,
        promptLines: cleanLines,
        checklist: cleanChecklist,
        isFree,
      });
      navigate("/admin/eo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Nouveau sujet" description="Ajouter un sujet d'Expression Orale." />
      <button type="button" onClick={() => navigate("/admin/eo")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Nouveau sujet — Expression orale</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell space-y-4 p-5">
          <div>
            <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Loisirs et vacances"
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
              placeholder="loisirs-et-vacances"
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold" htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Ce que l'apprenant doit faire..."
              className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold" htmlFor="duration">Durée maximale (minutes)</label>
            <input
              id="duration"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="mt-2 w-32 rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Sujet gratuit (sinon réservé au Premium)
          </label>
        </div>

        <div className="card-shell p-5">
          <StringListEditor
            label="Questions / consignes à afficher"
            items={promptLines}
            onChange={setPromptLines}
            placeholder="Que fais-tu pendant ton temps libre ?"
          />
        </div>

        <div className="card-shell p-5">
          <StringListEditor
            label="Grille d'auto-évaluation"
            items={checklist}
            onChange={setChecklist}
            placeholder="J'ai parlé sans trop d'hésitation"
          />
        </div>

        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Envoi en cours..." : "Créer le sujet"}
        </button>
      </form>
    </section>
  );
}
