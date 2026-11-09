"use client";

import { useEffect, useRef } from "react";

/**
 * Valores do Sobre. Cada divisória é uma barra: o latão se preenche da esquerda para a direita no ritmo
 * da rolagem, e o título desliza e ganha cor junto. Sem JS ou com movimento reduzido: barras cheias, tudo visível.
 */
export function ValuesList({ values }: { values: { title: string; body: string }[] }) {
  const root = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.enhanced = "";
    const rows = Array.from(el.querySelectorAll<HTMLElement>("li"));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      rows.forEach((li) => {
        const t = li.getBoundingClientRect().top;
        // começa quando a linha entra pelo pé da tela; termina perto do meio
        const p = Math.min(1, Math.max(0, (vh * 0.95 - t) / (vh * 0.5)));
        li.style.setProperty("--vp", p.toFixed(4));
      });
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
      delete el.dataset.enhanced;
    };
  }, []);

  return (
    <ul ref={root} className="values-list mt-8">
      {values.map((v, i) => (
        <li key={v.title} className="value-row relative grid items-baseline gap-4 py-8 md:grid-cols-12">
          <span className="value-bar" aria-hidden />
          <span className="text-xs tabular-nums text-ink-3 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="value-title font-serif text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] leading-none md:col-span-6">{v.title}</h3>
          <p className="value-body text-[1.0625rem] text-ink-2 md:col-span-5">{v.body}</p>
        </li>
      ))}
      <li className="value-end relative h-px" aria-hidden>
        <span className="value-bar" />
      </li>
    </ul>
  );
}
