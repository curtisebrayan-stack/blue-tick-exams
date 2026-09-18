import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-24 text-center text-sm text-muted-foreground">Chargement...</div>;
  }
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }
  return <>{children}</>;
}
