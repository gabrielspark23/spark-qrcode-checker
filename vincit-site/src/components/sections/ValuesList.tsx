"use client";

import { useEffect, useRef } from "react";

type Value = { title: string; body: string };

/** Conteúdo de uma linha — renderizado duas vezes com o mesmo layout (base e camada dourada). */
function Row({ v, i }: { v: Value; i: number }) {
  return (
    <div className="grid items-baseline gap-4 px-5 py-8 sm:px-8 md:grid-cols-12">
      <span className="v-num text-xs tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
      <span className="v-title font-serif text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] leading-none md:col-span-6">{v.title}</span>
      <span className="v-body text-[1.0625rem] md:col-span-5">{v.body}</span>
    </div>
  );
}

/**
 * Valores do Sobre. Conforme a rolagem, o fundo de cada linha se preenche de latão da esquerda para a direita
 * e, quando a linha sobe para fora da zona de leitura, o latão sai pela esquerda — uma parte em destaque por vez.
 * A camada dourada repete o mesmo conteúdo com texto grafite e é recortada pela mesma borda: fundo e cor da
 * fonte mudam juntos, sem descompasso. Sem JS ou com movimento reduzido: linhas comuns, sem destaque.
 */
export function ValuesList({ values }: { values: Value[] }) {
  const root = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.enhanced = "";
    const rows = Array.from(el.querySelectorAll<HTMLElement>("li"));
    let raf = 0;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      rows.forEach((li) => {
        const r = li.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        const enter = clamp((vh * 0.82 - mid) / (vh * 0.24)); // preenche ao chegar perto do meio
        const exit = clamp((vh * 0.4 - mid) / (vh * 0.2)); // esvazia pela esquerda ao subir
        li.style.setProperty("--ve", enter.toFixed(4));
        li.style.setProperty("--vx", exit.toFixed(4));
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
    <ul ref={root} className="values-list mt-8 border-t border-line-soft">
      {values.map((v, i) => (
        <li key={v.title} className="value-row relative border-b border-line-soft">
          <h3 className="sr-only">{v.title}</h3>
          <div className="value-base" aria-hidden>
            <Row v={v} i={i} />
          </div>
          <p className="sr-only">{v.body}</p>
          <div className="value-gold" aria-hidden>
            <Row v={v} i={i} />
          </div>
        </li>
      ))}
    </ul>
  );
}
