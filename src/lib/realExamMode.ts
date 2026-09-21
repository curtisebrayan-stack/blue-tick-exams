/**
 * Répartition progressive du temps total officiel entre les questions d'un sujet.
 * Le TCF ne publie pas de grille seconde par seconde par question — seule la durée
 * totale officielle (ex: 35 min pour 39 questions en CO) est documentée, avec le
 * principe de "difficulté progressive". On modélise donc un temps croissant par
 * question dont la somme est exactement égale à la durée totale officielle.
 */
export function buildProgressiveTimeTable(totalSeconds: number, count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [totalSeconds];

  const average = totalSeconds / count;
  const min = average * 0.5;
  const max = average * 1.8;
  const raw = Array.from({ length: count }, (_, i) => min + ((max - min) * i) / (count - 1));
  const rawSum = raw.reduce((a, b) => a + b, 0);
  const scale = totalSeconds / rawSum;

  const table = raw.map((v) => Math.max(5, Math.round(v * scale)));
  const diff = totalSeconds - table.reduce((a, b) => a + b, 0);
  table[table.length - 1] = Math.max(5, table[table.length - 1] + diff);
  return table;
}
