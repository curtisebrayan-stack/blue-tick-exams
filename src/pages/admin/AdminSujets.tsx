import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { AdminContentList } from "@/components/AdminContentList";
import { listCoSujets, deleteCoSujet, type CoSujetSummary } from "@/lib/coSujets";

export default function AdminSujets() {
  const [sujets, setSujets] = useState<CoSujetSummary[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listCoSujets().then(setSujets);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement "${title}" et toutes ses questions ?`)) return;
    setDeletingId(id);
    await deleteCoSujet(id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Administration" description="Gestion des sujets de Compréhension Orale." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Sujets — Compréhension orale</h1>
      <AdminContentList
        items={sujets}
        viewPathPrefix="/comprehension-orale/examens"
        editPathPrefix="/admin/sujets/modifier"
        newPath="/admin/sujets/nouveau"
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
