import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { createCoSujet, type NewCoQuestion } from "@/lib/coSujets";
import { slugifyTitle } from "@/lib/slug";

type QuestionDraft = {
  audioFile: File | null;
  imageFile: File | null;
  options: [string, string, string, string];
  hasOptions: boolean;
  correctIndex: number;
};

function emptyQuestion(): QuestionDraft {
  return { audioFile: null, imageFile: null, options: ["", "", "", ""], hasOptions: true, correctIndex: 0 };
}

export default function AdminSujetNouveau() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyTitle(value));
  };

  const updateQuestion = (index: number, patch: Partial<QuestionDraft>) => {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const updateOption = (index: number, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== index) return q;
        const options = [...q.options] as [string, string, string, string];
        options[optionIndex] = value;
        return { ...q, options };
      }),
    );
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);
  const removeQuestion = (index: number) => setQuestions((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !slug.trim()) {
      setError("Le titre et l'identifiant (slug) sont obligatoires.");
      return;
    }
    if (questions.length === 0) {
      setError("Ajoute au moins une question.");
      return;
    }
    for (const [i, q] of questions.entries()) {
      if (!q.audioFile) {
        setError(`Question ${i + 1} : le fichier audio est obligatoire.`);
        return;
      }
      if (q.hasOptions && q.options.some((o) => !o.trim())) {
        setError(`Question ${i + 1} : remplis les 4 choix de réponse, ou décoche "choix textuels".`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: NewCoQuestion[] = questions.map((q, i) => ({
        number: i + 1,
        audioFile: q.audioFile as File,
        imageFile: q.imageFile,
        options: q.hasOptions ? q.options : null,
        correctIndex: q.correctIndex,
      }));
      await createCoSujet(title.trim(), slug.trim(), isFree, payload);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Nouveau sujet" description="Ajouter un sujet de Compréhension Orale." />
      <button type="button" onClick={() => navigate("/admin")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Nouveau sujet — Compréhension orale</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell p-5">
          <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Sujet 3"
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
            placeholder="sujet-3"
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} />
            Sujet gratuit (sinon réservé au Premium)
          </label>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="card-shell space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Question {index + 1}</h2>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(index)} className="text-xs font-semibold text-red-600">
                  <Trash2 className="h-3.5 w-3.5" /> Retirer
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">Audio (obligatoire)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => updateQuestion(index, { audioFile: e.target.files?.[0] ?? null })}
                className="mt-1 w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground">Image (optionnelle)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => updateQuestion(index, { imageFile: e.target.files?.[0] ?? null })}
                className="mt-1 w-full text-sm"
              />
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={q.hasOptions}
                onChange={(e) => updateQuestion(index, { hasOptions: e.target.checked })}
              />
              Choix de réponse textuels (sinon, l'apprenant choisit juste A/B/C/D)
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctIndex === optionIndex}
                    onChange={() => updateQuestion(index, { correctIndex: optionIndex })}
                  />
                  <span className="text-xs font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                  {q.hasOptions ? (
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                      placeholder={`Choix ${String.fromCharCode(65 + optionIndex)}`}
                      className="flex-1 rounded-lg border border-border px-2 py-1.5 text-sm"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">Bonne réponse si sélectionné</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="button" onClick={addQuestion} className="btn-outline">
          <Plus className="h-4 w-4" /> Ajouter une question
        </button>

        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "Envoi en cours..." : "Créer le sujet"}
        </button>
      </form>
    </section>
  );
}
