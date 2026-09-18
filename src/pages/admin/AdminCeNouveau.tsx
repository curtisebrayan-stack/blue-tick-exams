import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { Seo } from "@/components/Seo";
import { createCeExercise, type NewCeQuestion } from "@/lib/practiceExercises";
import { slugifyTitle } from "@/lib/slug";

type QuestionDraft = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

function emptyQuestion(): QuestionDraft {
  return { question: "", options: ["", "", "", ""], correctIndex: 0 };
}

export default function AdminCeNouveau() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [text, setText] = useState("");
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

    if (!title.trim() || !slug.trim() || !text.trim()) {
      setError("Le titre, l'identifiant et le texte sont obligatoires.");
      return;
    }
    for (const [i, q] of questions.entries()) {
      if (!q.question.trim() || q.options.some((o) => !o.trim())) {
        setError(`Question ${i + 1} : remplis l'énoncé et les 4 choix de réponse.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: NewCeQuestion[] = questions.map((q) => ({
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
      }));
      await createCeExercise(title.trim(), slug.trim(), text.trim(), isFree, payload);
      navigate("/admin/ce");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du sujet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title="Nouveau sujet" description="Ajouter un sujet de Compréhension Écrite." />
      <button type="button" onClick={() => navigate("/admin/ce")} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour
      </button>

      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Nouveau sujet — Compréhension écrite</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="card-shell p-5">
          <label className="block text-sm font-semibold" htmlFor="title">Titre</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Fiches techniques"
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
            placeholder="fiches-techniques"
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <label className="mt-4 block text-sm font-semibold" htmlFor="text">Texte à lire</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Colle ici le texte que l'apprenant doit lire..."
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

            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(index, { question: e.target.value })}
              placeholder="Énoncé de la question"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${index}`}
                    checked={q.correctIndex === optionIndex}
                    onChange={() => updateQuestion(index, { correctIndex: optionIndex })}
                  />
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
