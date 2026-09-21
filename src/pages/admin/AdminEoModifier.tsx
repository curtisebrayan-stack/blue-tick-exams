import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { getSpeakingPrompt, updateEoPrompt, type SpeakingPrompt } from "@/lib/speakingPrompts";
import NotFound from "@/pages/NotFound";

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
  const keysRef = useRef<string[]>([]);
  if (keysRef.current.length !== items.length) {
    keysRef.current = items.map((_, i) => keysRef.current[i] ?? crypto.randomUUID());
  }

  const removeAt = (i: number) => {
    keysRef.current = keysRef.current.filter((_, idx) => idx !== i);
    onChange(items.filter((_, idx) => idx !== i));
  };
  const addItem = () => {
    keysRef.current = [...keysRef.current, crypto.randomUUID()];
    onChange([...items, ""]);
  };

  return (
    <div>
      <p className="text-sm font-semibold">{label}</p>
      <div className="mt-2 space-y-2">
        {items.map((item, i) => (
          <div key={keysRef.current[i]} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => onChange(items.map((v, idx) => (idx === i ? e.target.value : v)))}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            {items.length > 1 && (
              <button type="button" onClick={() => removeAt(i)} className="text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="mt-2 text-xs font-semibold text-primary">
        <Plus className="mr-1 inline h-3.5 w-3.5" /> Ajouter une ligne
      </button>
    </div>
  );
}

export default function AdminEoModifier() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState<SpeakingPrompt | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(3);
  const [promptLines, setPromptLines] = useState<string[]>([""]);
  const [checklist, setChecklist] = useState<string[]>([""]);
  const [isFree, setIsFree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setPrompt(null);
      return;
    }
    getSpeakingPrompt("eo", slug).then((result) => {
      setPrompt(result ?? null);
      if (result) {
        setTitle(result.title);
        setInstructions(result.instructions);
        setDurationMinutes(Math.round(result.durationSeconds / 60));
        setPromptLines(result.promptLines);
        setChecklist(result.checklist);
        setIsFree(result.isFree);
      }
    });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!prompt) return;

    const cleanLines = promptLines.map((l) => l.trim()).filter(Boolean);
    const cleanChecklist = checklist.map((c) => c.trim()).filter(Boolean);

    if (!title.trim() || !instructions.trim()) {
      setError("Le titre et les instructions sont obligatoires.");
      return;
    }
    if (cleanLines.length === 0 || cleanChecklist.length === 0) {
      setError("Ajoute au moins une question/ligne de consigne et un point de grille.");
      return;
    }

    setSubmitting(true);
    try {
      await updateEoPrompt(prompt.id, {
        title: title.trim(),
        instructions: instructions.trim(),
        durationSeconds: Math.max(1, durationMinutes) * 60,
        promptLines: cleanLines,
        checklist: cleanChecklist,
        isFree,
      });
      navigate("/admin/eo");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  if (prompt === undefined) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!prompt) return <NotFound />;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Modifier le sujet" description="Modifier un sujet d'Expression Orale." />
      <button type="button" onClick={() => navigate("/admin/eo")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Modifier — {prompt.title}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell space-y-4 p-5">
          <div>
            <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <StringListEditor label="Questions / consignes à afficher" items={promptLines} onChange={setPromptLines} placeholder="Que fais-tu pendant ton temps libre ?" />
        </div>

        <div className="card-shell p-5">
          <StringListEditor label="Grille d'auto-évaluation" items={checklist} onChange={setChecklist} placeholder="J'ai parlé sans trop d'hésitation" />
        </div>

        {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </section>
  );
}
