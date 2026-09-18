import { describe, it, expect } from "vitest";
import { getNclc, formatNclc } from "./nclc";

describe("getNclc — barème TCF Canada -> NCLC", () => {
  it("classe correctement les bornes de compréhension orale", () => {
    expect(getNclc("co", 457)).toBe(6);
    expect(getNclc("co", 458)).toBe(7);
    expect(getNclc("co", 502)).toBe(7);
    expect(getNclc("co", 503)).toBe(8);
    expect(getNclc("co", 549)).toBe(10);
    expect(getNclc("co", 699)).toBe(10);
    expect(getNclc("co", 330)).toBeNull();
  });

  it("classe correctement les bornes d'expression orale (sur 20)", () => {
    expect(getNclc("eo", 3)).toBeNull();
    expect(getNclc("eo", 4)).toBe(4);
    expect(getNclc("eo", 9)).toBe(6);
    expect(getNclc("eo", 10)).toBe(7);
    expect(getNclc("eo", 20)).toBe(10);
  });

  it("respecte le seuil NCLC 7 (minimum Entrée express)", () => {
    // Ces valeurs viennent directement du barème IRCC publié.
    expect(getNclc("co", 458)).toBe(7);
    expect(getNclc("ce", 453)).toBe(7);
    expect(getNclc("eo", 10)).toBe(7);
    expect(getNclc("ee", 10)).toBe(7);
  });

  it("formatNclc affiche 10+ pour le niveau maximum", () => {
    expect(formatNclc(10)).toBe("NCLC 10+");
    expect(formatNclc(7)).toBe("NCLC 7");
    expect(formatNclc(null)).toBe("< NCLC 4");
  });
});
