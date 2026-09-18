import { useEffect, useState } from "react";
import { Trash2, Mail } from "lucide-react";
import { Seo } from "@/components/Seo";
import { AdminTabs } from "@/components/AdminTabs";
import { supabase } from "@/lib/supabase";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    supabase
      .from("contact_messages")
      .select("id, name, email, message, created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    setDeletingId(id);
    await supabase.from("contact_messages").delete().eq("id", id);
    setDeletingId(null);
    load();
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Messages" description="Messages reçus via le formulaire de contact." />
      <AdminTabs />
      <h1 className="mt-6 text-2xl font-bold sm:text-3xl">Messages de contact</h1>
      <p className="mt-2 text-sm text-muted-foreground">Reçus via le formulaire de la page Contact.</p>

      {messages === null ? (
        <p className="mt-8 text-sm text-muted-foreground">Chargement...</p>
      ) : messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Aucun message pour le moment.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className="card-shell p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{msg.name}</p>
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <Mail className="h-3 w-3" /> {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleString("fr-FR")}</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="text-red-500 hover:text-red-400 disabled:opacity-50"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
