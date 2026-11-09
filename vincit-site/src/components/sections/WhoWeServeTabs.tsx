"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ModuleButton } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { MarkShards, type ShardFocus } from "@/components/brand/MarkShards";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

type Seg = "families" | "business" | "crossborder" | "retirement";
const FOCUS: Record<Seg, ShardFocus> = { families: "shield", business: "all", crossborder: "v", retirement: "circle" };
const noop = () => () => {};

/**
 * Painéis editoriais (padrão ARIA de abas): clique e teclado (setas, Home, End).
 * Sem JS, os quatro públicos aparecem em sequência, completos.
 */
export function WhoWeServeTabs({ locale, t }: { locale: Locale; t: Dict }) {
  const segs = t.segments;
  // false no servidor e na hidratação; true depois — sem JS, todos os públicos ficam visíveis
  const enhanced = useSyncExternalStore(noop, () => true, () => false);
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (i: number, focus = false) => {
    const n = (i + segs.length) % segs.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: segs.length - 1 };
    if (e.key in keys) {
      e.preventDefault();
      select(keys[e.key], true);
    }
  };

  return (
    <section className="border-t border-line bg-surface-muted py-24 sm:py-32" aria-labelledby="serve-title">
      <Container>
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Eyebrow>{t.home.serve.eyebrow}</Eyebrow>
            <h2 id="serve-title" className="h1 mt-6 max-w-[16ch]">{t.home.serve.title}</h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Abas: tipografia grande */}
          {enhanced ? (
            <div role="tablist" aria-orientation="vertical" aria-label={t.home.serve.eyebrow} className="border-t border-line-soft lg:col-span-5">
              {segs.map((s, i) => (
                <button
                  key={s.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`seg-tab-${s.id}`}
                  aria-selected={active === i}
                  aria-controls={`seg-panel-${s.id}`}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn(
                    "group flex w-full items-baseline gap-5 border-b border-line-soft py-5 text-left outline-none transition-colors duration-150 focus-visible:bg-surface",
                    active === i ? "text-ink" : "text-ink-3 hover:text-ink",
                  )}
                >
                  <span className="w-7 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-tight">{s.title}</span>
                  <span
                    className={cn("ml-auto h-0.5 bg-brass transition-[width] duration-200", active === i ? "w-8" : "w-0 group-hover:w-4")}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className={cn("relative", enhanced ? "lg:col-span-7" : "lg:col-span-12", !enhanced && "space-y-16")}>
            {/* Composição única que se reorganiza entre públicos (só no modo de abas) */}
            {enhanced ? (
              <MarkShards
                focus={FOCUS[segs[active].id as Seg]}
                labels={t.home.parts}
                className="pointer-events-none absolute right-6 top-1/2 z-10 hidden w-72 -translate-y-1/2 sm:block"
              />
            ) : null}
            {segs.map((s, i) => (
              <div
                key={s.id}
                id={`seg-panel-${s.id}`}
                role={enhanced ? "tabpanel" : undefined}
                aria-labelledby={enhanced ? `seg-tab-${s.id}` : undefined}
                hidden={enhanced && active !== i}
                data-active={enhanced && active === i ? "" : undefined}
                className="seg-panel grid min-h-[26rem] gap-8 border border-line-soft bg-surface p-8 sm:grid-cols-[1fr_18rem] sm:p-10"
              >
                <div className="seg-copy flex flex-col">
                  {!enhanced ? <h3 className="h2">{s.title}</h3> : <p className="eyebrow text-ink-3">{String(i + 1).padStart(2, "0")} / 04</p>}
                  <p className="mt-6 max-w-[22ch] font-serif text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-snug text-ink">{s.short}</p>
                  <div className="mt-auto pt-10">
                    <ModuleButton href={href("whoWeServe", locale, s.id)} ariaLabel={`${t.common.howWeHelp}: ${s.title}`}>
                      {t.common.howWeHelp}
                    </ModuleButton>
                  </div>
                </div>
                {!enhanced ? <MarkShards focus={FOCUS[s.id as Seg]} labels={t.home.parts} className="hidden w-64 self-center sm:block" /> : null}
              </div>
            ))}
          </div>
        </div>

      </Container>
    </section>
  );
}
