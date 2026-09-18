import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center">
      <Seo title="Page introuvable" />
      <h1 className="text-4xl font-bold">Page introuvable</h1>
      <p className="mt-3 text-muted-foreground">Cette page n'existe pas ou plus.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">Retour à l'accueil</Link>
    </section>
  );
}
