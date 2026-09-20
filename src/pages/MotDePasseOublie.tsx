import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Seo } from "@/components/Seo";

export default function MotDePasseOublie() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: resetError } = await requestPasswordReset(email);
    setLoading(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center sm:py-24">
        <Seo title="Email envoyé" description="Lien de réinitialisation de mot de passe envoyé." />
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Email envoyé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Si un compte existe pour {email}, un lien de réinitialisation vient d'être envoyé. Vérifie ta boîte mail.
        </p>
        <Link to="/connexion" className="btn-primary mt-6 inline-flex">Retour à la connexion</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <Seo title="Mot de passe oublié" description="Réinitialise ton mot de passe Blue Tick Project." />
      <span className="chip"><KeyRound className="h-3.5 w-3.5" /> Compte</span>
      <h1 className="mt-4 text-3xl font-bold">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Indique ton email, on t'envoie un lien pour choisir un nouveau mot de passe.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 card-shell p-6">
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

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Envoi..." : "Envoyer le lien de réinitialisation"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link to="/connexion" className="font-semibold text-primary hover:underline">Retour à la connexion</Link>
      </p>
    </section>
  );
}
