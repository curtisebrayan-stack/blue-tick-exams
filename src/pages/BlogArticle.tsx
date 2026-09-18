import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { getArticleBySlug } from "@/lib/blog";
import { Seo } from "@/components/Seo";
import NotFound from "./NotFound";

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) return <NotFound />;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <Seo title={article.title} description={article.excerpt} />
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="h-4 w-4" /> Retour au blog
      </Link>
      <span className="chip mt-6">{article.category}</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{article.title}</h1>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" /> {article.readTime} de lecture
      </span>
      <div className="prose mt-8 space-y-4 text-sm leading-relaxed text-foreground sm:text-base">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
