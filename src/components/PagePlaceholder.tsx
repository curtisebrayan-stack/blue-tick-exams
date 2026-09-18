import type { ReactNode } from "react";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
      <span className="chip">{eyebrow}</span>
      <h1 className="mt-4 text-3xl font-bold sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">{description}</p>
      <div className="mt-8 card-shell p-6 text-sm text-muted-foreground">
        Contenu à venir.
      </div>
      {children}
    </section>
  );
}
