type SessionId = { id: string };
type SubjectSession = { session_id: string; tache: number };

export function filterCompleteEoSessions<T extends SessionId>(
  sessions: readonly T[],
  subjects: readonly SubjectSession[],
): T[] {
  const taskCoverage = new Map<string, Set<number>>();
  for (const subject of subjects) {
    const tasks = taskCoverage.get(subject.session_id) ?? new Set<number>();
    tasks.add(subject.tache);
    taskCoverage.set(subject.session_id, tasks);
  }
  return sessions.filter((session) => {
    const tasks = taskCoverage.get(session.id);
    return tasks?.has(2) && tasks.has(3);
  });
}
