import { describe, expect, it } from "vitest";
import { filterCompleteEoSessions } from "./eoSessionAvailability";

describe("filterCompleteEoSessions", () => {
  it("skips the newest session when it has no subject for one of the exam tasks", () => {
    const sessions = [
      { id: "august", slug: "aout-2026" },
      { id: "june", slug: "juin-2026" },
      { id: "may", slug: "mai-2026" },
    ];
    const subjects = [
      { session_id: "august", tache: 2 },
      { session_id: "june", tache: 2 },
      { session_id: "june", tache: 3 },
      { session_id: "may", tache: 2 },
      { session_id: "may", tache: 3 },
    ];

    expect(filterCompleteEoSessions(sessions, subjects)).toEqual([
      { id: "june", slug: "juin-2026" },
      { id: "may", slug: "mai-2026" },
    ]);
  });
});
