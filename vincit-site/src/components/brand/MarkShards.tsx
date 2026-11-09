import { MARK_PARTS, type MarkPart } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

/**
 * A marca oficial em estilhaços: escudo, V e círculo afastados como placas quebradas.
 * A peça em foco se encaixa no lugar e ganha o latão; `focus="all"` monta a marca inteira.
 * Transições de transform (CSS) — a troca entre públicos é contínua; sem JS, cada estado
 * aparece estático. Mesma família visual dos Exploded Modules.
 */
export type ShardFocus = MarkPart | "all";

const ORDER: MarkPart[] = ["shield", "circle", "v"];

export function MarkShards({
  focus,
  labels,
  className,
}: {
  focus: ShardFocus;
  labels: Record<MarkPart | "all", string>;
  className?: string;
}) {
  return (
    <figure className={cn("mark-shards m-0", className)} data-focus={focus}>
      <svg viewBox="-40 -30 600 560" className="h-full w-full overflow-visible" aria-hidden>
        {ORDER.map((p) => {
          const on = focus === "all" || focus === p;
          return (
            <g key={p} className={cn("shard", `shard-${p}`)} data-on={on ? "" : undefined}>
              <path d={MARK_PARTS[p]} fillRule="evenodd" />
            </g>
          );
        })}
      </svg>
      <figcaption className="mark-shards-caption">
        {(["shield", "v", "circle"] as const).map((p) => (
          <span key={p} data-on={focus === "all" || focus === p ? "" : undefined}>
            {labels[p]}
          </span>
        ))}
      </figcaption>
      <span className="sr-only">{focus === "all" ? labels.all : labels[focus]}</span>
    </figure>
  );
}
