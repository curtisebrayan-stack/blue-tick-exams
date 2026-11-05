import { Check } from "lucide-react";

export type ExamTaskFormat = {
  number: 1 | 2 | 3;
  title: string;
  description: string;
  detail: string;
};

export function ExamTaskCards({
  tasks,
  accent,
}: {
  tasks: ExamTaskFormat[];
  accent: string;
}) {
  return (
    <ol className="mt-8 grid gap-4 md:grid-cols-3">
      {tasks.map((task) => (
        <li key={task.number} className="card-shell flex flex-col p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold"
              style={{ backgroundColor: `color-mix(in oklch, ${accent} 18%, transparent)`, color: accent }}
            >
              0{task.number}
            </span>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Tâche {task.number}
            </span>
          </div>
          <h3 className="mt-5 font-display text-lg font-bold">{task.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{task.description}</p>
          <span
            className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: `color-mix(in oklch, ${accent} 12%, transparent)`, color: accent }}
          >
            <Check className="h-3.5 w-3.5" />
            {task.detail}
          </span>
        </li>
      ))}
    </ol>
  );
}
