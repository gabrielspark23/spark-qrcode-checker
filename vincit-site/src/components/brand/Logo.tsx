import { MARK_PATH, MARK_VIEWBOX, WORD_PATH, WORD_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

/** Marca oficial (escudo-vincit.svg). Latão chapado da paleta do site, sem degradê. */
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
      <path d={MARK_PATH} fill={fill} />
    </svg>
  );
}

/** Lockup oficial: escudo + "VINCIT CAPITAL" em duas linhas. `onDark` = wordmark claro. */
export function Logo({ onDark, className }: { onDark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-10 w-auto" />
      <svg viewBox={WORD_VIEWBOX} className="h-[1.85rem] w-auto" aria-hidden>
        <path d={WORD_PATH} fill={onDark === undefined ? "currentColor" : onDark ? "var(--text-on-dark)" : "var(--text-primary)"} fillRule="evenodd" />
      </svg>
    </span>
  );
}
