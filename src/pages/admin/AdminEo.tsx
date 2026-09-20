import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { AdminContentList } from "@/components/AdminContentList";
import { listEoPrompts, deleteEoPrompt, type SpeakingPromptSummary } from "@/lib/speakingPrompts";

export default function AdminEo() {
  const [items, setItems] = useState<SpeakingPromptSummary[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listEoPrompts().then(setItems);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement "${title}" ?`)) return;
    setDeletingId(id);
    await deleteEoPrompt(id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Administration" description="Gestion des sujets d'Expression Orale." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Sujets — Expression orale</h1>
      <AdminContentList
        items={items}
        viewPathPrefix="/expression-orale"
        editPathPrefix="/admin/eo/modifier"
        newPath="/admin/eo/nouveau"
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
