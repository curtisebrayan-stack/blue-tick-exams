import { describe, it, expect } from "vitest";
import { getListeningExercise } from "./listeningExercises";

const KNOWN_SLUGS = [
  "annonces-publiques",
  "messages-vocaux",
  "conversations-informelles",
  "interviews",
  "bulletins-information",
  "emissions-radio",
];

describe("listeningExercises (Compréhension orale)", () => {
  it("retourne undefined pour un slug inconnu", () => {
    expect(getListeningExercise("co", "nimporte-quoi")).toBeUndefined();
  });

  it.each(KNOWN_SLUGS)("le sujet « %s » a des données valides", (slug) => {
    const exercise = getListeningExercise("co", slug);
    expect(exercise).toBeDefined();
    expect(exercise!.transcript.length).toBeGreaterThan(20);
    expect(exercise!.questions.length).toBeGreaterThan(0);
    for (const q of exercise!.questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
  });

  it("n'a pas de slug dupliqué", () => {
    const seen = new Set<string>();
    for (const slug of KNOWN_SLUGS) {
      expect(seen.has(slug)).toBe(false);
      seen.add(slug);
    }
  });
});
