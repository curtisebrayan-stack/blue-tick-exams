import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, Target, ListChecks, Smartphone, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { Seo } from "@/components/Seo";

const BENEFITS = [
  { icon: Target, title: "Format proche du test", desc: "Des exercices calqués sur les conditions réelles de l'examen." },
  { icon: ListChecks, title: "Les quatre épreuves", desc: "CO, CE, EO et EE couvertes dans un seul parcours." },
  { icon: Smartphone, title: "Web et mobile", desc: "Reprends ta préparation depuis n'importe quel appareil." },
];

export default function Connexion() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    navigate("/");
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
      <Seo title="Connexion" description="Accède à ton espace de préparation TCF Canada." />

      <div>
        <span className="chip">Compte</span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
          Reprenez votre préparation <span className="text-primary">là où vous l'avez laissée</span>
        </h1>
        <p className="mt-3 text-muted-foreground">Accède à ton espace personnel pour continuer ton entraînement.</p>

        <ul className="mt-8 space-y-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <form onSubmit={onSubmit} className="card-shell space-y-4 p-6">
          <div>
            <h2 className="text-xl font-bold">Connexion</h2>
            <p className="text-sm text-muted-foreground">Accédez à votre espace personnel</p>
          </div>

          <label className="block">
            <span className="text-sm font-semibold">Adresse e-mail</span>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </label>

          <label className="block">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Mot de passe</span>
              <Link to="/mot-de-passe-oublie" className="text-xs font-semibold text-primary hover:underline">Mot de passe oublié ?</Link>
            </div>
            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-9 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Connexion en cours...
              </>
            ) : (
              <>
                Se connecter <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
            Pas encore de compte ? <Link to="/inscription" className="font-semibold text-primary hover:underline">Créer un compte</Link>
          </p>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Connexion sécurisée · Vos données sont protégées
        </p>
      </div>
    </section>
  );
}
