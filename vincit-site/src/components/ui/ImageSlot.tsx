import { BrandMark } from "@/components/brand/BrandMark";
import { cn } from "@/lib/cn";

/**
 * Espaço de foto com proporção fixa (PRD §8.5). Enquanto as fotos reais não chegam (§6.2),
 * mostra uma superfície neutra com o escudo e a legenda do que vai ali.
 * Trocar por <Image> com `alt` real quando houver foto aprovada.
 */
export function ImageSlot({
  ratio = "4/5",
  label,
  caption,
  onDark,
  className,
}: {
  ratio?: "4/5" | "16/9" | "1/1" | "3/2";
  label: string;
  caption?: string;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("m-0", className)}>
      <div
        role="img"
        aria-label={label}
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden border",
          onDark ? "border-navy-line bg-navy-soft" : "border-line bg-surface-muted",
        )}
        style={{ aspectRatio: ratio }}
      >
        <div className="texture-lines absolute inset-0 opacity-60" aria-hidden />
        <BrandMark className="relative h-10 w-10 opacity-40" tone={onDark ? "brass" : "ink"} />
        <span
          className={cn(
            "absolute bottom-3 left-3 text-[0.6875rem] font-medium tracking-wide",
            onDark ? "text-on-dark-3" : "text-ink-3",
          )}
        >
          {label}
        </span>
      </div>
      {caption ? <figcaption className={cn("mt-3 text-sm", onDark ? "text-on-dark-3" : "text-ink-3")}>{caption}</figcaption> : null}
    </figure>
  );
}
