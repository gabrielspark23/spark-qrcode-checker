"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ModuleButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Service = { id: string; brand: string; title: string; short: string; body: string; situations: string[]; whatWeDo: string[] };
type Labels = {
  service: string;
  overview: string;
  situations: string;
  whatWeDo: string;
  expand: string;
  collapse: string;
  talk: string;
  index: string;
  contactHref: string;
};

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Superfícies por capítulo: claro → latão → claro → grafite → claro → grafite.
 * O latão aparece uma vez, entre dois claros (nunca saindo do escuro); o último é grafite para emendar com o rodapé.
 */
type Tone = "light" | "dark" | "gold";
const TONES: Tone[] = ["light", "gold", "light", "dark", "light", "dark"];

/**
 * Serviços como capítulos de uma mesma estrutura (inspiração editorial em grade, adaptada à Vincit).
 * - Faixa grafite com os seis capítulos: no desktop fica fixa sob o header; a célula do capítulo em leitura
 *   acende e um filete de latão mostra o progresso daquele capítulo.
 * - Cada capítulo: linha de metadados, título serifado enorme (fixo à esquerda) e, à direita, visão geral,
 *   situações típicas e "o que fazemos" com expansão controlada.
 * - Superfícies alternadas (claro, latão, claro, grafite, claro, grafite) para ritmo e leitura; cada capítulo sobe
 *   sobre o capítulo anterior com cantos arredondados (mesma transição do Manifesto na Home).
 * - Rolagem: o filete do capítulo se desenha, o título se revela por máscara (direção alterna entre capítulos)
 *   e a superfície do capítulo ativo muda de leve. Sem JS ou com movimento reduzido: tudo visível e aberto.
 */
export function ServicesChapters({ services, labels }: { services: Service[]; labels: Labels }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.dataset.js = "";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) el.dataset.motion = "";
    const chapters = Array.from(el.querySelectorAll<HTMLElement>(".sc-chapter"));
    const cells = Array.from(el.querySelectorAll<HTMLElement>(".sc-cell"));

    // entrada (uma vez por capítulo)
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && ((e.target as HTMLElement).dataset.in = "")),
      { rootMargin: "0px 0px -20% 0px" },
    );
    chapters.forEach((c) => io.observe(c));

    // capítulo ativo + progresso de leitura
    let raf = 0;
    const paint = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let a = -1;
      chapters.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
        cells[i]?.style.setProperty("--sp", p.toFixed(4));
        if (r.top <= line && r.bottom > line) a = i;
      });
      setActive(a);
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);

  return (
    <div ref={root} className="sc-root">
      {/* faixa grafite: navegação entre capítulos */}
      <nav aria-label={labels.index} className="sc-band on-dark bg-navy text-on-dark">
        <ol className="sc-cells mx-auto grid max-w-7xl grid-flow-col auto-cols-[minmax(11rem,1fr)] overflow-x-auto lg:grid-cols-6 lg:overflow-visible">
          {services.map((s, i) => (
            <li key={s.id} className="sc-cell" data-active={i === active || undefined}>
              <a href={`#${s.id}`} className="flex h-full flex-col justify-between gap-6 px-5 py-5" aria-current={i === active ? "true" : undefined}>
                <span className="flex items-center justify-between text-xs tabular-nums">
                  <span className="sc-cell-num">{num(i)}</span>
                  <svg className="sc-cell-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M7 7l10 10M17 9v8H9" />
                  </svg>
                </span>
                <span className="font-serif text-[1.125rem] leading-tight">{s.title}</span>
              </a>
              <span className="sc-cell-bar" aria-hidden />
            </li>
          ))}
        </ol>
      </nav>

      {services.map((s, i) => (
        <Chapter key={s.id} s={s} i={i} active={i === active} labels={labels} />
      ))}
    </div>
  );
}

function Chapter({ s, i, active, labels }: { s: Service; i: number; active: boolean; labels: Labels }) {
  const [open, setOpen] = useState(false);
  const tone: Tone = TONES[i] ?? "light";
  const panel = useId();
  return (
    <section
      id={s.id}
      aria-labelledby={`${s.id}-title`}
      className={cn("sc-chapter scroll-mt-24 lg:scroll-mt-40", i % 2 ? "sc-from-right" : "sc-from-left", tone === "dark" && "on-dark")}
      data-tone={tone}
      data-active={active || undefined}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* metadados, sobre um filete que se desenha */}
        <div className="sc-meta relative grid grid-cols-2 py-4 text-xs uppercase tracking-[0.14em] sc-muted lg:grid-cols-12">
          <span className="sc-rule" aria-hidden />
          <span className="lg:col-span-5">
            {labels.service} — <span className="tabular-nums sc-main">{num(i)}</span>
          </span>
          <span className="justify-self-end lg:col-span-7 lg:justify-self-start lg:pl-10">{s.brand}</span>
        </div>

        <div className="grid gap-10 pb-20 pt-8 sm:pb-28 lg:grid-cols-12 lg:gap-0 lg:pt-12">
          <div className="lg:col-span-5 lg:pr-10">
            <div className="lg:sticky lg:top-44">
              <h2 id={`${s.id}-title`} className="sc-title font-serif text-[clamp(2.75rem,1.6rem+3.6vw,5.5rem)] leading-[0.98]">
                <span className="sc-title-in block">{s.title}</span>
              </h2>
              <p className="sc-short mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed sc-sub">{s.short}</p>
            </div>
          </div>

          <div className="sc-body sc-divider lg:col-span-7 lg:border-l lg:pl-10">
            <p className="sc-item eyebrow sc-muted">{labels.overview}</p>
            <p className="sc-item mt-4 max-w-[58ch] font-serif text-[clamp(1.25rem,1.05rem+0.6vw,1.5rem)] leading-snug">{s.body}</p>

            <div className="sc-item mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <p className="eyebrow sc-divider border-b pb-3 sc-muted">{labels.situations}</p>
                <ul className="mt-5 space-y-4">
                  {s.situations.map((x) => (
                    <li key={x} className="text-[0.9375rem] leading-relaxed sc-sub">{x}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="eyebrow sc-divider border-b pb-3 sc-muted">{labels.whatWeDo}</p>
                <div id={panel} className="sc-panel" data-open={open || undefined}>
                  <div className="sc-panel-inner">
                  <ul className="space-y-4 pt-5">
                    {s.whatWeDo.map((x) => (
                      <li key={x} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                        <svg viewBox="0 0 16 16" className="mt-1.5 h-3 w-3 shrink-0" fill="none" aria-hidden>
                          <path d="M2 3 8 13.5 14 3" stroke="var(--sc-accent)" strokeWidth="1.75" />
                        </svg>
                        {x}
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
                <button
                  type="button"
                  className="sc-toggle mt-5 inline-flex items-center gap-3 text-sm font-medium"
                  aria-expanded={open}
                  aria-controls={panel}
                  onClick={() => setOpen((v) => !v)}
                >
                  <span className="sc-toggle-icon" aria-hidden />
                  {open ? labels.collapse : `${labels.expand} (${s.whatWeDo.length})`}
                </button>
              </div>
            </div>

            <div className="sc-item mt-12">
              <ModuleButton href={labels.contactHref} tone={tone === "dark" ? "dark" : tone === "gold" ? "ink" : "light"} event="cta_schedule_click" ariaLabel={`${labels.talk}: ${s.title}`}>
                {labels.talk}
              </ModuleButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
