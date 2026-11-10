"use client";

import { useEffect, useRef } from "react";
import type { PolicyBlock, PolicySection } from "@/content/privacy";

const num = (i: number) => String(i + 1).padStart(2, "0");

function Block({ b }: { b: PolicyBlock }) {
  if (typeof b === "string") return <p className="text-[1.0625rem] leading-[1.75] text-ink-2">{b}</p>;
  return (
    <div>
      {"lead" in b ? <p className="text-[1.0625rem] font-medium leading-relaxed text-ink">{b.lead}</p> : null}
      <ul className="mt-3 space-y-2.5 border-l border-line-soft pl-5">
        {b.list.map((x) => (
          <li key={x} className="text-[1.0625rem] leading-[1.7] text-ink-2">{x}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Corpo da política em linhas largas: número, título e resumo à esquerda; texto completo à direita.
 * Barra de progresso de leitura fixa sob o header.
 */
export function PolicyBody({ sections }: { sections: PolicySection[] }) {
  const bar = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const b = bar.current;
    if (!el || !b) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      b.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
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
    <div ref={root}>
      <span ref={bar} className="policy-progress" aria-hidden />
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-t border-line-soft py-12 sm:py-14">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <p className="text-sm tabular-nums text-brass">{num(i)}</p>
              <h2 id={`${s.id}-h`} className="mt-3 font-serif text-[clamp(1.75rem,1.4rem+1.3vw,2.5rem)] leading-[1.1]">{s.title}</h2>
              <p className="mt-4 max-w-[34ch] font-serif text-[1.1875rem] italic leading-snug text-ink-3">{s.summary}</p>
            </div>
            <div className="space-y-6 lg:col-span-7 lg:pt-8">
              {s.blocks.map((b, k) => (
                <Block key={k} b={b} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
