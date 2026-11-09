import type { ReactNode } from "react";
import { Container } from "@/components/ui/Layout";
import { cn } from "@/lib/cn";

/**
 * Abertura editorial das páginas internas — quebra o padrão "selo + título à esquerda + frase embaixo".
 * - "aside": coluna estreita à esquerda (selo, frase, conteúdo extra) separada por um filete; o título,
 *   grande, ocupa a direita alinhado à direita.
 * - "stagger": o título se divide na vírgula — a primeira parte à esquerda, a segunda à direita, mais abaixo;
 *   o selo fica no canto superior direito.
 * - "compact": título à direita com o selo na mesma linha (páginas legais).
 */
export function EditorialHero({
  eyebrow,
  title,
  intro,
  aside,
  variant = "aside",
  art,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  aside?: ReactNode;
  variant?: "aside" | "stagger" | "compact";
  art?: ReactNode;
}) {
  const label = (
    <p className="eyebrow enter flex items-center gap-3 text-ink-3">
      <span className="draw h-px w-8 bg-brass" aria-hidden />
      {eyebrow}
    </p>
  );

  if (variant === "stagger") {
    const cut = title.indexOf(",");
    const a = cut > 0 ? title.slice(0, cut + 1) : title;
    const b = cut > 0 ? title.slice(cut + 1).trim() : "";
    return (
      <section className="ed-hero relative overflow-hidden border-b border-line bg-app" aria-labelledby="page-title">
        {art}
        <Container className="relative pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="flex justify-end">{label}</div>
          <h1 id="page-title" className="display mt-10 text-[clamp(2.75rem,1.4rem+5.2vw,6.75rem)] leading-[1]">
            <span className="ed-line block">{a}</span>
            {b ? <span className="ed-line ed-line-2 mt-2 block text-right text-ink-2 lg:pl-[30%]">{b}</span> : null}
          </h1>
        </Container>
      </section>
    );
  }

  const compact = variant === "compact";
  return (
    <section className="ed-hero relative overflow-hidden border-b border-line bg-app" aria-labelledby="page-title">
      {art}
      <Container className={cn("relative pt-32 sm:pt-40", compact ? "pb-14 sm:pb-16" : "pb-16 sm:pb-24")}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className={cn("lg:border-r lg:border-line-soft lg:pr-10", compact ? "lg:col-span-3 lg:self-end lg:pb-3" : "lg:col-span-4")}>
            {label}
            {intro ? <p className="enter enter-2 mt-8 max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-2">{intro}</p> : null}
            {aside ? <div className="enter enter-3 mt-10">{aside}</div> : null}
          </div>
          <h1
            id="page-title"
            className={cn(
              "display ed-line order-first self-end text-right lg:order-none",
              compact ? "text-[clamp(2.5rem,1.6rem+3vw,4.5rem)] leading-[1.02] lg:col-span-9" : "text-[clamp(2.75rem,1.4rem+5vw,6.5rem)] leading-[0.98] lg:col-span-8",
            )}
          >
            {title}
          </h1>
        </div>
      </Container>
    </section>
  );
}
