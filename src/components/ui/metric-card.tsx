import * as React from "react";

type Tone = "primary" | "success" | "sky" | "violet" | "amber" | "rose";

const TONE: Record<Tone, string> = {
  primary: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

// Card de métrica padrão CRM: ícone tonalizado, valor em destaque, rótulo e dica.
export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "primary",
  delay = 0,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  delay?: number;
}) {
  return (
    <div
      className="surface fluid fluid-lift animate-rise rounded-xl p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && (
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-lg ${TONE[tone]}`}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
