import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ModuleButton } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { serviceIcons } from "./icons";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

/**
 * Composição modular assimétrica num grid de 12 colunas. O planejamento é o módulo-âncora
 * (o centro); os demais têm proporções diferentes conforme o peso de cada linha.
 * Hover/foco: uma máscara sobe e revela "o que fazemos" (informação adicional, não essencial:
 * título, frase e link ficam sempre visíveis — no touch também).
 */
const AREA: Record<string, string> = {
  planning: "lg:col-span-7 lg:row-span-2",
  protection: "lg:col-span-5",
  wealth: "lg:col-span-5",
  tax: "lg:col-span-4",
  offshore: "lg:col-span-5",
  estate: "sm:col-span-2 lg:col-span-3",
};

export function Expertise({ locale, t }: { locale: Locale; t: Dict }) {
  const e = t.home.expertise;
  const [core, ...rest] = t.services;
  const CoreIcon = serviceIcons[core.id];
  return (
    <section className="bg-app py-24 sm:py-32" aria-labelledby="expertise-title">
      <Container>
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{e.eyebrow}</Eyebrow>
            <h2 id="expertise-title" className="h1 mt-6 max-w-[18ch]">{e.title}</h2>
          </div>
        </div>

        {/* linhas estruturais = o gap de 1 px sobre a cor da régua */}
        <div className="grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-12">
          {/* Módulo-âncora */}
          <article className={cn("relative flex flex-col bg-surface p-8 sm:col-span-2 sm:p-12", AREA.planning)} aria-labelledby="mod-planning">
            <div className="flex items-start justify-between">
              <p className="eyebrow text-ink-3">{e.core} · {core.brand}</p>
              <CoreIcon className="h-7 w-7 text-ink" strokeWidth={1.25} aria-hidden />
            </div>
            <h3 id="mod-planning" className="h1 mt-16 max-w-[12ch]">{core.title}</h3>
            <p className="lead mt-6 max-w-[46ch] text-ink-2">{core.short}</p>
            <div className="mt-auto flex flex-wrap items-center gap-6 pt-12">
              <ModuleButton href={href("services", locale, core.id)} tone="ink">{e.explore}</ModuleButton>
              <Link href={href("services", locale)} className="link-arrow">
                <span>{e.all}</span>
              </Link>
            </div>
          </article>

          {rest.map((s, i) => {
            const Icon = serviceIcons[s.id];
            return (
              <Link
                key={s.id}
                href={href("services", locale, s.id)}
                className={cn("mod group relative flex min-h-56 flex-col overflow-hidden bg-surface p-8 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-10", AREA[s.id])}
              >
                {/* marcação de canto em latão */}
                <span className="mod-tick absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-brass" aria-hidden />
                <div className="flex items-start justify-between">
                  <span className="text-xs tabular-nums text-ink-3">{String(i + 2).padStart(2, "0")}</span>
                  <Icon className="h-6 w-6 text-ink" strokeWidth={1.25} aria-hidden />
                </div>
                <p className="eyebrow mt-10 text-ink-3">{s.brand}</p>
                <h3 className="mt-2 font-serif text-[1.75rem] leading-tight">{s.title}</h3>
                <ArrowUpRight className="mt-auto h-5 w-5 self-end text-ink-3 transition-colors duration-150 group-hover:text-ink" strokeWidth={1.5} aria-hidden />

                {/* informação adicional revelada por máscara (hover/foco) */}
                <div className="mod-reveal on-dark absolute inset-0 flex flex-col bg-navy p-8 text-on-dark sm:p-10" aria-hidden>
                  <p className="eyebrow text-brass">{s.brand}</p>
                  <p className="h3 mt-2">{s.title}</p>
                  <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-on-dark-2">{s.short}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
                    {t.common.learnMore}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
