import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erreur non gérée capturée par ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <AlertTriangle className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Une erreur est survenue</h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Quelque chose s'est mal passé sur cette page. Essaie de recharger, ou reviens à l'accueil.
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => window.location.reload()} className="btn-primary">
              Recharger la page
            </button>
            <a href="/" className="btn-outline">Retour à l'accueil</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
