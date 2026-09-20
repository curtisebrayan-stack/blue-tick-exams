import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export function AuthRequired({ title }: { title: string }) {
  return (
    <div className="card-shell mt-6 flex flex-col items-center gap-3 p-10 text-center">
      <LogIn className="h-8 w-8 text-primary" />
      <h2 className="text-lg font-bold">Connecte-toi pour accéder à ce sujet</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        « {title} » nécessite un compte, même pour les sujets gratuits — crée-en un en quelques secondes.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/inscription" className="btn-primary">Créer un compte gratuit</Link>
        <Link to="/connexion" className="btn-outline">Se connecter</Link>
      </div>
    </div>
  );
}
