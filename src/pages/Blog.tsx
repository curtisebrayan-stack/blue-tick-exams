import { Link } from "react-router-dom";
import { ArrowRight, Clock, Newspaper } from "lucide-react";
import { ARTICLES } from "@/lib/blog";
import { Seo } from "@/components/Seo";

export default function Blog() {
  return (
    <>
      <Seo title="Blog" description="Guides et articles pour réussir le TCF Canada et comprendre le barème NCLC." />
      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
          <span className="chip">Ressources</span>
          <h1 className="mt-4 text-3xl font-bold sm:text-5xl">Blog TCF Canada</h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/70">
            Guides et articles pour réussir le TCF Canada et comprendre le barème NCLC.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <Link key={article.slug} to={`/blog/${article.slug}`} className="card-shell group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
              <div
                className="relative flex h-28 items-start p-4"
                style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--primary) 35%, var(--secondary)), var(--secondary))" }}
              >
                <span className="rounded-full bg-secondary-foreground/15 px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{article.category}</span>
                <Newspaper className="absolute -bottom-4 -right-4 h-16 w-16 text-secondary-foreground/10" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs text-muted-foreground">Blue Tick Exams</p>
                <h2 className="mt-1 font-display text-lg font-bold">{article.title}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{article.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {article.readTime} de lecture
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Lire <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
