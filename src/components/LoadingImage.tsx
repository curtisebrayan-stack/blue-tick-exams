import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/** Image avec un skeleton pendant le chargement — évite un rendu vide ou bloqué
 * sur connexion lente, notamment pour les grandes infographies du site. */
export function LoadingImage({ src, alt, className }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative">
      {!loaded && !failed && <div className={`animate-pulse rounded-2xl bg-muted ${className ?? "aspect-[4/3] w-full"}`} />}
      {failed ? (
        <div className={`grid place-items-center rounded-2xl border border-dashed border-border bg-muted text-xs text-muted-foreground ${className ?? "aspect-[4/3] w-full"}`}>
          Image indisponible pour le moment
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`${className ?? "w-full"} transition-opacity duration-200 ${loaded ? "opacity-100" : "absolute inset-0 opacity-0"}`}
        />
      )}
    </div>
  );
}
