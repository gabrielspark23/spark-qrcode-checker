"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { clamp, cPath, cShapeAt } from "@/lib/c-geometry";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

const noop = () => () => {};

/**
 * Who we serve — painéis editoriais (abas ARIA) com o C-Reveal como FUNDO da própria seção.
 * O C é ancorado na seção (rola junto com o conteúdo); só a forma muda com o progresso.
 * Duas camadas com o mesmo layout: a clara (real, interativa) e a grafite por cima, recortada
 * no formato do C (clip-path com o contorno do C) e transparente a cliques. Na borda do C o
 * texto inverte de cor — nunca fica ilegível. Ao fim da seção o grafite cobre tudo e continua
 * no "How we work". Sem JS / movimento reduzido: só a camada clara.
 */
export function WhoWeServeTabs({ locale, t }: { locale: Locale; t: Dict }) {
  const segs = t.segments;
  const enhanced = useSyncExternalStore(noop, () => true, () => false);
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const section = useRef<HTMLElement>(null);
  const darkLayer = useRef<HTMLDivElement>(null);
  const hairline = useRef<SVGSVGElement>(null);

  // C-Reveal vinculado ao scroll (amortecido, sem fixar a página)
  useEffect(() => {
    const el = section.current;
    const dk = darkLayer.current;
    const hl = hairline.current;
    const hlPath = hl?.querySelector("path");
    if (!el || !dk || !hl || !hlPath) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // começa quando o título está na tela; termina quando a base da seção chega à base da tela
      return clamp((0.3 * vh - r.top) / Math.max(1, r.height - 0.7 * vh));
    };
    let last = -1;
    const paint = (e: number) => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      const s = cShapeAt(e, W, H, W < 640);
      const d = cPath(s);
      dk.style.display = e <= 0.001 ? "none" : "block";
      dk.style.clipPath = s.full ? "none" : `path(evenodd, "${d}")`;
      // filete de latão acompanhando o contorno; some quando o grafite cobre tudo
      hl.setAttribute("viewBox", `0 0 ${W} ${H}`);
      hlPath.setAttribute("d", d);
      hl.style.opacity = String(e <= 0.001 ? 0 : clamp((0.86 - e) / 0.12));
    };
    // Progresso preso à posição de rolagem (sem atraso): o C acompanha o conteúdo exatamente.
    const tick = () => {
      raf = 0;
      const tg = target();
      if (Math.abs(tg - last) < 0.0005) return;
      last = tg;
      paint(tg);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      last = -1;
      req();
    };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", onResize);
    req();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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

  /** Conteúdo da seção — idêntico nas duas camadas; só a clara é interativa. */
  const content = (dark: boolean) => {
    const real = !dark;
    return (
      <Container>
        <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className={cn("eyebrow flex items-center gap-3", dark ? "text-brass" : "text-ink-2")}>
              <span className={cn("h-px w-6", dark ? "bg-brass" : "bg-line-rule")} aria-hidden />
              {t.home.serve.eyebrow}
            </p>
            <h2 id={real ? "serve-title" : undefined} className="h1 mt-6 max-w-[16ch]">{t.home.serve.title}</h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {enhanced ? (
            <div
              role={real ? "tablist" : undefined}
              aria-orientation={real ? "vertical" : undefined}
              aria-label={real ? t.home.serve.eyebrow : undefined}
              className={cn("border-t lg:col-span-5", dark ? "border-navy-line" : "border-line-soft")}
            >
              {segs.map((s, i) => {
                const on = active === i;
                const cls = cn(
                  "group flex w-full items-baseline gap-5 border-b py-5 text-left outline-none transition-colors duration-150",
                  dark ? "border-navy-line" : "border-line-soft focus-visible:bg-surface",
                  on ? (dark ? "text-on-dark" : "text-ink") : dark ? "text-on-dark-3" : "text-ink-3 hover:text-ink",
                );
                const inner = (
                  <>
                    <span className="w-7 text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-tight">{s.title}</span>
                    <span className={cn("ml-auto h-0.5 bg-brass transition-[width] duration-200", on ? "w-8" : "w-0 group-hover:w-4")} aria-hidden />
                  </>
                );
                return real ? (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    role="tab"
                    id={`seg-tab-${s.id}`}
                    aria-selected={on}
                    aria-controls={`seg-panel-${s.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onKeyDown={(e) => onKey(e, i)}
                    className={cls}
                  >
                    {inner}
                  </button>
                ) : (
                  <div key={s.id} className={cls}>
                    {inner}
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className={cn(enhanced ? "lg:col-span-7" : "lg:col-span-12", !enhanced && "space-y-16")}>
            {segs.map((s, i) => (
              <div
                key={s.id}
                id={real ? `seg-panel-${s.id}` : undefined}
                role={real && enhanced ? "tabpanel" : undefined}
                aria-labelledby={real && enhanced ? `seg-tab-${s.id}` : undefined}
                hidden={enhanced && active !== i}
                data-active={enhanced && active === i ? "" : undefined}
                className={cn("seg-panel grid gap-8 border p-8 sm:p-10", dark ? "border-navy-line bg-navy-soft" : "border-line-soft bg-surface")}
              >
                <div className="seg-copy flex flex-col">
                  {!enhanced ? <h3 className="h2">{s.title}</h3> : <p className={cn("eyebrow", dark ? "text-on-dark-3" : "text-ink-3")}>{String(i + 1).padStart(2, "0")} / 04</p>}
                  <p className="mt-6 max-w-[26ch] font-serif text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-snug">{s.short}</p>
                  <div className="mt-auto pt-10">
                    <ModuleButton href={href("whoWeServe", locale, s.id)} tone={dark ? "dark" : "light"} ariaLabel={`${t.common.howWeHelp}: ${s.title}`}>
                      {t.common.howWeHelp}
                    </ModuleButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  };

  return (
    <section ref={section} className="relative overflow-hidden border-t border-line bg-surface-muted" aria-labelledby="serve-title">
      <div className="pb-48 pt-24 sm:pb-64 sm:pt-32">
        {content(false)}
      </div>
      <div
        ref={darkLayer}
        className="on-dark pointer-events-none absolute inset-0 hidden bg-navy pb-48 pt-24 text-on-dark sm:pb-64 sm:pt-32"
        aria-hidden
        inert
      >
        {content(true)}
      </div>
      <svg ref={hairline} className="pointer-events-none absolute inset-0 z-10 h-full w-full" preserveAspectRatio="none" style={{ opacity: 0 }} aria-hidden>
        <path fill="none" stroke="var(--color-gold)" strokeOpacity="0.7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}
