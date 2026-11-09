import { MARK_PATH, MARK_VIEWBOX, WORD_PATH, WORD_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

/** Marca oficial (escudo + V + círculo), traçada do logotipo oficial. Latão chapado, sem degradê. */
export function LogoMark({ className, tone = "brass", title }: { className?: string; tone?: "brass" | "ink" | "light"; title?: string }) {
  const fill = tone === "brass" ? "var(--color-gold)" : tone === "ink" ? "var(--text-primary)" : "var(--text-on-dark)";
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={MARK_PATH} fill={fill} fillRule="evenodd" />
    </svg>
  );
}

/** Logotipo horizontal: marca + "VINCIT" oficiais. `onDark` = wordmark claro. */
export function Logo({ onDark = false, className }: { onDark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-auto" />
      <svg viewBox={WORD_VIEWBOX} className="h-[1.05rem] w-auto" aria-hidden>
        <path d={WORD_PATH} fill={onDark ? "var(--text-on-dark)" : "var(--text-primary)"} fillRule="evenodd" />
      </svg>
    </span>
  );
}
