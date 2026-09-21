import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { AdminContentList } from "@/components/AdminContentList";
import { listCeSujets, deleteCeSujet, type CeSujetSummary } from "@/lib/ceSujets";

export default function AdminCeSujets() {
  const [sujets, setSujets] = useState<CeSujetSummary[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    listCeSujets().then(setSujets);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Supprimer définitivement "${title}" et toutes ses questions ?`)) return;
    setDeletingId(id);
    await deleteCeSujet(id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Administration" description="Gestion des sujets complets de Compréhension Écrite." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Sujets complets — Compréhension écrite</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Format examen : 39 questions indépendantes, chacune avec sa propre image de document.
      </p>
      <AdminContentList
        items={sujets}
        viewPathPrefix="/comprehension-ecrite/examens"
        editPathPrefix="/admin/ce-sujets/modifier"
        newPath="/admin/ce-sujets/nouveau"
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
