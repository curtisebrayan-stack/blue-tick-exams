import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Seo } from "@/components/Seo";

export default function ReinitialiserMotDePasse() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: updateError } = await updatePassword(password);
    setLoading(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    navigate("/profil");
  };

  return (
    <section className="mx-auto max-w-md px-4 py-16 sm:py-24">
      <Seo title="Nouveau mot de passe" description="Choisis un nouveau mot de passe pour ton compte Blue Tick Project." />
      <span className="chip"><KeyRound className="h-3.5 w-3.5" /> Compte</span>
      <h1 className="mt-4 text-3xl font-bold">Choisir un nouveau mot de passe</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tu es arrivé ici via le lien reçu par email. Choisis un nouveau mot de passe.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 card-shell p-6">
        <label className="block">
          <span className="text-sm font-semibold">Nouveau mot de passe</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <span className="mt-1 block text-xs text-muted-foreground">6 caractères minimum.</span>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </section>
  );
}
