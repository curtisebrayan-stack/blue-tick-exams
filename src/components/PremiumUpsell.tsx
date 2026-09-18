import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export function PremiumUpsell({ title }: { title: string }) {
  const { user } = useAuth();

  return (
    <div className="card-shell mt-6 flex flex-col items-center gap-3 p-10 text-center">
      <Lock className="h-8 w-8 text-primary" />
      <h2 className="text-lg font-bold">Sujet réservé au Premium</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        « {title} » fait partie des sujets Premium. Passe en Premium pour débloquer l'accès illimité à tous les sujets pratiques.
      </p>
      <Link to="/tarifs" className="btn-primary">Voir les tarifs</Link>
      {!user && (
        <p className="text-xs text-muted-foreground">
          <Link to="/connexion" className="font-semibold text-primary hover:underline">Connecte-toi</Link> si tu as déjà un compte Premium.
        </p>
      )}
    </div>
  );
}
