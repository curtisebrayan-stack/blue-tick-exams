import { describe, it, expect } from "vitest";
import { slugifyTitle } from "./slug";

describe("slugifyTitle", () => {
  it("met en minuscules et remplace les espaces par des tirets", () => {
    expect(slugifyTitle("Sujet 3")).toBe("sujet-3");
  });

  it("retire les accents", () => {
    expect(slugifyTitle("Épreuve Générale")).toBe("epreuve-generale");
  });

  it("retire les caractères spéciaux et les tirets superflus", () => {
    expect(slugifyTitle("  Sujet : édition #4 !! ")).toBe("sujet-edition-4");
  });
});
