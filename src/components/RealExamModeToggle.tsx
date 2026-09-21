type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  scope: string;
  disabled?: boolean;
};

export function RealExamModeToggle({ checked, onChange, scope, disabled }: Props) {
  return (
    <div className="card-shell flex items-center justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-bold">Mode examen réel ({scope})</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Désactivé par défaut. Chrono par question avec avance automatique, comme le jour de l'examen.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
