"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { vRunFor } from "@/components/brand/Shapes";
import type { Dict } from "@/content";

/**
 * Linha de planejamento: atravessa os quatro momentos; entre cada um, um entalhe em V
 * com os braços a 66° (V da marca). Revela-se com a rolagem (clip-path), amortecida,
 * sem prender a página. O texto está sempre visível; sem JS a linha aparece inteira.
 */
const NOTCH_DEPTH = 28;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

export function PlanningLine({ t }: { t: Dict }) {
  const root = useRef<HTMLElement>(null);
  const lineBox = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1200);
  const steps = t.process;
  const xs = steps.map((_, i) => (i + 0.5) / steps.length); // centro de cada coluna

  useEffect(() => {
    const el = root.current;
    const box = lineBox.current;
    if (!el || !box) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = -1;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));

    const target = () => {
      if (reduced) return 1;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      return clamp((vh * 0.78 - r.top) / (r.height * 0.75));
    };
    const tick = () => {
      raf = 0;
      const tgt = target();
      cur = cur < 0 ? tgt : cur + (tgt - cur) * 0.18;
      if (Math.abs(tgt - cur) < 0.002) cur = tgt;
      el.style.setProperty("--p", cur.toFixed(4));
      nodes.forEach((n, i) => {
        if (cur >= xs[i] - 0.02) n.dataset.on = "";
        else delete n.dataset.on;
      });
      if (cur !== tgt) raf = requestAnimationFrame(tick);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => {
      setW(box.clientWidth || 1200);
      req();
    });
    ro.observe(box);
    window.addEventListener("scroll", req, { passive: true });
    req();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", req);
    };
    // xs é derivado do número de passos (estável)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Linha horizontal com um entalhe em V entre cada par de passos
  const y = 10;
  const run = vRunFor(NOTCH_DEPTH);
  let d = `M0 ${y}`;
  for (let i = 0; i < steps.length - 1; i++) {
    const mid = ((xs[i] + xs[i + 1]) / 2) * w;
    d += ` L${mid - run} ${y} L${mid} ${y + NOTCH_DEPTH} L${mid + run} ${y}`;
  }
  d += ` L${w} ${y}`;

  return (
    <section ref={root} className="on-dark bg-navy pb-24 pt-8 text-on-dark sm:pb-32 sm:pt-12" aria-labelledby="process-title">
      <Container>
        <div className="mb-16 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow onDark>{t.home.process.eyebrow}</Eyebrow>
            <h2 id="process-title" className="h1 mt-6 max-w-[18ch]">{t.home.process.title}</h2>
          </div>
        </div>

        {/* Desktop: linha horizontal */}
        <div ref={lineBox} className="relative hidden h-12 md:block" aria-hidden>
          <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${w} 48`} preserveAspectRatio="none">
            <path d={d} fill="none" stroke="var(--color-navy-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={d} fill="none" stroke="var(--text-on-dark)" strokeWidth="1.25" vectorEffect="non-scaling-stroke" className="plan-line" />
          </svg>
          {xs.map((x, i) => (
            <span
              key={i}
              data-node
              className="plan-node absolute top-[10px] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-on-dark-3 bg-navy"
              style={{ left: `${x * 100}%` }}
            />
          ))}
        </div>

        <ol className="relative grid gap-12 md:mt-8 md:grid-cols-4 md:gap-8">
          {/* Mobile: linha vertical */}
          <span className="absolute bottom-2 left-[5px] top-2 w-px bg-navy-line md:hidden" aria-hidden>
            <span className="plan-line-v absolute inset-0 bg-on-dark" />
          </span>
          {steps.map((s) => (
            <li key={s.n} className="relative pl-8 md:pl-0 md:text-center">
              <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border border-on-dark-3 bg-navy md:hidden" aria-hidden />
              <p className="text-sm tabular-nums text-on-dark-3">{s.n}</p>
              <h3 className="mt-2 font-serif text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight">{s.title}</h3>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
