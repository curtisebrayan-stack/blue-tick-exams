import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { AdminContentList } from "@/components/AdminContentList";
import { listEePrompts, deleteEePrompt, type WritingPromptSummary } from "@/lib/writingPrompts";

export default function AdminEe() {
  const [items, setItems] = useState<WritingPromptSummary[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listEePrompts().then(setItems);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement "${title}" ?`)) return;
    setDeletingId(id);
    await deleteEePrompt(id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Administration" description="Gestion des sujets d'Expression Écrite." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Sujets — Expression écrite</h1>
      <AdminContentList
        items={items}
        viewPathPrefix="/expression-ecrite"
        editPathPrefix="/admin/ee/modifier"
        newPath="/admin/ee/nouveau"
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
