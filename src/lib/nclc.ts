// Barème officiel IRCC / France Éducation international — Test de connaissance du français pour le Canada (TCF Canada)
// Compréhension orale / écrite : notées sur 699. Expression orale / écrite : notées sur 20.
export type TcfSkill = "co" | "ce" | "eo" | "ee";

type Band = { nclc: number; co: [number, number]; ce: [number, number]; eo: [number, number]; ee: [number, number] };

const BANDS: Band[] = [
  { nclc: 4, co: [331, 368], ce: [342, 374], eo: [4, 5], ee: [4, 5] },
  { nclc: 5, co: [369, 397], ce: [375, 405], eo: [6, 6], ee: [6, 6] },
  { nclc: 6, co: [398, 457], ce: [406, 452], eo: [7, 9], ee: [7, 9] },
  { nclc: 7, co: [458, 502], ce: [453, 498], eo: [10, 11], ee: [10, 11] },
  { nclc: 8, co: [503, 522], ce: [499, 523], eo: [12, 13], ee: [12, 13] },
  { nclc: 9, co: [523, 548], ce: [524, 548], eo: [14, 15], ee: [14, 15] },
  { nclc: 10, co: [549, 699], ce: [549, 699], eo: [16, 20], ee: [16, 20] },
];

export const SKILL_MAX: Record<TcfSkill, number> = { co: 699, ce: 699, eo: 20, ee: 20 };
export const SKILL_LABELS: Record<TcfSkill, string> = {
  co: "Compréhension orale",
  ce: "Compréhension écrite",
  eo: "Expression orale",
  ee: "Expression écrite",
};

/** Retourne le niveau NCLC (4 à 10, 10 = "10+") pour un score donné sur une épreuve, ou null si sous le seuil NCLC 4. */
export function getNclc(skill: TcfSkill, score: number): number | null {
  for (let i = BANDS.length - 1; i >= 0; i--) {
    const [min] = BANDS[i][skill];
    if (score >= min) return BANDS[i].nclc;
  }
  return null;
}

export function formatNclc(nclc: number | null): string {
  if (nclc === null) return "< NCLC 4";
  return nclc >= 10 ? "NCLC 10+" : `NCLC ${nclc}`;
}

/** Équivalent CECR (A1-C2) du niveau NCLC — pour affichage grand public. */
export function getCefrLevel(nclc: number | null): string {
  if (nclc === null) return "A1";
  if (nclc >= 10) return "C1-C2";
  if (nclc === 9) return "C1";
  if (nclc >= 7) return "B2";
  if (nclc >= 5) return "B1";
  return "A2";
}

/** Estime un score sur 699 (échelle officielle TCF) à partir d'un score brut sur un
 * exercice pratique. Approximation linéaire — le vrai barème IRCC n'est pas public. */
export function estimateScaledScore(rawScore: number, maxRaw: number): number {
  if (maxRaw <= 0) return 0;
  return Math.round((rawScore / maxRaw) * 699);
}

export const NCLC_TABLE = BANDS;
