"use client";

import { useEffect, useRef, useState } from "react";
import type { PolicyBlock, PolicySection } from "@/content/privacy";

const num = (i: number) => String(i + 1).padStart(2, "0");

function Block({ b }: { b: PolicyBlock }) {
  if (typeof b === "string") return <p className="text-[1.0625rem] leading-[1.75] text-ink-2">{b}</p>;
  return (
    <div>
      {"lead" in b ? <p className="text-[1.0625rem] font-medium leading-relaxed text-ink">{b.lead}</p> : null}
      <ul className="mt-4 space-y-3">
        {b.list.map((x) => (
          <li key={x} className="flex gap-4 text-[1.0625rem] leading-[1.7] text-ink-2">
            <svg viewBox="0 0 16 16" className="mt-2.5 h-2.5 w-2.5 shrink-0" fill="none" aria-hidden>
              <path d="M2 3 8 13.5 14 3" stroke="var(--color-gold)" strokeWidth="2" />
            </svg>
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Corpo da política: índice fixo à esquerda (com o item em leitura em destaque e um filete de progresso)
 * e as seções numeradas à direita, cada uma com um resumo em serifa antes do texto completo.
 */
export function PolicyBody({ sections, tocLabel }: { sections: PolicySection[]; tocLabel: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const secs = Array.from(el.querySelectorAll<HTMLElement>("[data-policy-section]"));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let a = 0;
      secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) a = i; });
      setActive(a);
      const r = el.getBoundingClientRect();
      setProgress(Math.min(1, Math.max(0, (line - r.top) / (r.height - window.innerHeight * 0.3))));
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);

  return (
    <div ref={root} className="grid gap-14 lg:grid-cols-12 lg:gap-10">
      <nav aria-label={tocLabel} className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-28">
          <p className="eyebrow text-ink-3">{tocLabel}</p>
          <div className="relative mt-6 pl-5">
            <span className="absolute bottom-0 left-0 top-0 w-px bg-line-soft" aria-hidden />
            <span className="absolute left-0 top-0 w-px origin-top bg-brass transition-transform duration-300" style={{ height: "100%", transform: `scaleY(${progress})` }} aria-hidden />
            <ol className="space-y-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={i === active ? "true" : undefined}
                    className={`policy-toc flex gap-3 py-1.5 text-[0.9375rem] leading-snug ${i === active ? "text-ink" : "text-ink-3"}`}
                  >
                    <span className={`tabular-nums text-xs ${i === active ? "text-brass" : ""}`} style={{ paddingTop: "0.2em" }}>{num(i)}</span>
                    <span>{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </nav>

      <div className="lg:col-span-8">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} data-policy-section aria-labelledby={`${s.id}-h`} className="policy-section scroll-mt-28 border-t border-line-soft py-14 first:border-t-0 first:pt-0">
            <div className="grid gap-6 sm:grid-cols-[5.5rem_1fr]">
              <p className="font-serif text-[2.75rem] leading-none text-brass tabular-nums" aria-hidden>{num(i)}</p>
              <div>
                <h2 id={`${s.id}-h`} className="font-serif text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)] leading-tight">{s.title}</h2>
                <p className="mt-4 max-w-[52ch] font-serif text-[1.25rem] italic leading-snug text-ink-3">{s.summary}</p>
                <div className="mt-8 space-y-7">
                  {s.blocks.map((b, k) => <Block key={k} b={b} />)}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
