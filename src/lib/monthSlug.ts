// Convertit un slug de session "mois-annee" (ex: "aout-2026") en valeur triable,
// pour afficher les sessions du plus récent au plus ancien peu importe l'ordre
// d'insertion en base.

const MONTH_ORDER: Record<string, number> = {
  janvier: 1, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, aout: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12,
};

export function monthSlugSortKey(slug: string): number {
  const match = slug.match(/^([a-z]+)-(\d{4})$/);
  if (!match) return 0;
  const [, month, year] = match;
  const monthNum = MONTH_ORDER[month] ?? 0;
  return Number(year) * 12 + monthNum;
}

export function sortByMonthSlugDesc<T extends { slug: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => monthSlugSortKey(b.slug) - monthSlugSortKey(a.slug));
}
