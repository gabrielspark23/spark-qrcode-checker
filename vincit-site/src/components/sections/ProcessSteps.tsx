import { Check } from "lucide-react";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

/** Lista de 4 passos. `full` mostra o texto completo e as ações-chave (About). */
export function ProcessSteps({ t, full = false, keyActionsLabel }: { t: Dict; full?: boolean; keyActionsLabel?: string }) {
  return (
    <ol className={cn("grid gap-x-8 gap-y-12", full ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4")}>
      {t.process.map((step) => (
        <li key={step.n} className="group relative">
          <span className="block h-0.5 w-full bg-line" aria-hidden>
            <span className="block h-full w-10 bg-brass transition-[width] duration-200 ease-[var(--ease-out)] group-hover:w-full" />
          </span>
          <p className="mt-6 text-sm tabular-nums text-ink-3">{step.n}</p>
          <h3 className="h3 mt-2">{step.title}</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{full ? step.body : step.short}</p>
          {full ? (
            <>
              {keyActionsLabel ? <p className="eyebrow mt-6 text-ink-3">{keyActionsLabel}</p> : null}
              <ul className="mt-3 space-y-2">
                {step.actions.map((a) => (
                  <li key={a} className="flex gap-3 text-[0.9375rem] text-ink-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-ink" strokeWidth={1.5} aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
