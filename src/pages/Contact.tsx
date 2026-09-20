import { useState, type FormEvent } from "react";
import { Mail, CheckCircle2, MessageCircle, Phone, Loader2, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Seo } from "@/components/Seo";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: insertError } = await supabase.from("contact_messages").insert({ name, email, message });
    setLoading(false);
    if (insertError) {
      setError("Le message n'a pas pu être envoyé. Réessaie, ou écris directement à contact@blueticksproject.com.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:py-24">
        <Seo title="Message envoyé" description="Ton message a bien été reçu." />
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Message envoyé</h1>
        <p className="mt-2 text-sm text-muted-foreground">Merci, on te répond dès que possible par email.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <Seo title="Nous écrire" description="Contacte l'équipe de Blue Tick Project." />
      <div className="text-center">
        <span className="chip"><Mail className="h-3.5 w-3.5" /> Contact</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Entrez en contact</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Une question sur le TCF Canada, un bug, ou une suggestion ? Écris-nous.
        </p>
      </div>

      <div className="card-shell mt-10 grid overflow-hidden lg:grid-cols-2">
        <div className="flex flex-col gap-4 bg-secondary p-8 text-secondary-foreground">
          <h2 className="font-display text-lg font-bold">Informations de contact</h2>
          <a
            href="https://wa.me/447440328777"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle className="h-4 w-4" /> Écrivez-nous sur WhatsApp
          </a>
          <div className="mt-2 space-y-3 text-sm">
            <a href="mailto:contact@blueticksproject.com" className="flex items-center gap-3 text-secondary-foreground/80 hover:text-secondary-foreground">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary-foreground/10"><Mail className="h-4 w-4" /></span>
              contact@blueticksproject.com
            </a>
            <a href="tel:+447440328777" className="flex items-center gap-3 text-secondary-foreground/80 hover:text-secondary-foreground">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary-foreground/10"><Phone className="h-4 w-4" /></span>
              +44 7440 328 777
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-8">
          <h2 className="font-display text-lg font-bold">Envoyez-nous un message</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">Nom</span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-semibold">Message</span>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                Envoyer le message <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
