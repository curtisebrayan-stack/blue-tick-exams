import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { AdminContentList } from "@/components/AdminContentList";
import { listCeExercises, deleteCeExercise, type PracticeExerciseSummary } from "@/lib/practiceExercises";

export default function AdminCe() {
  const [items, setItems] = useState<PracticeExerciseSummary[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listCeExercises().then(setItems);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement "${title}" et ses questions ?`)) return;
    setDeletingId(id);
    await deleteCeExercise(id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Administration" description="Gestion des sujets de Compréhension Écrite." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Sujets — Compréhension écrite</h1>
      <AdminContentList
        items={items}
        viewPathPrefix="/comprehension-ecrite"
        editPathPrefix="/admin/ce/modifier"
        newPath="/admin/ce/nouveau"
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
