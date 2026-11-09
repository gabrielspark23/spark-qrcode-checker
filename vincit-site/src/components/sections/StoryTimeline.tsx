"use client";

import { useEffect, useRef } from "react";

/**
 * Linha do tempo do Sobre. A linha se desenha em latão no ritmo da rolagem; quando chega a um marco,
 * o V acende e o texto ganha cor. Os V ficam centrados na linha e alinhados à primeira linha de cada texto.
 * Sem JS ou com movimento reduzido: linha inteira, todos os marcos acesos.
 */
export function StoryTimeline({ items }: { items: string[] }) {
  const root = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.enhanced = "";
    const lis = Array.from(el.querySelectorAll<HTMLElement>("li"));
    let raf = 0;
    const paint = () => {
      raf = 0;
      const vh = window.innerHeight;
      const line = vh * 0.62; // "zona de leitura"
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      el.style.setProperty("--tl", p.toFixed(4));
      lis.forEach((li) => {
        const m = li.querySelector<HTMLElement>(".tl-mark");
        const top = (m ?? li).getBoundingClientRect().top;
        li.toggleAttribute("data-on", top < line);
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
    <ol ref={root} className="story-tl relative grid gap-14 lg:ml-[16.66%] lg:max-w-3xl">
      {/* trilho + traço de progresso, centrados em x = 8px (mesmo eixo dos V) */}
      <span className="tl-rail" aria-hidden />
      <span className="tl-fill" aria-hidden />
      {items.map((p, i) => (
        <li
          key={i}
          className={
            "relative pl-12 " +
            (i === 0
              ? "font-serif text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-snug"
              : "text-[1.0625rem] leading-relaxed")
          }
        >
          <span className="tl-mark" aria-hidden>
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2 3 8 13.5 14 3" strokeWidth="1.5" strokeLinejoin="miter" />
            </svg>
          </span>
          <p className={i === 0 ? "tl-text" : "tl-text text-ink-2"}>{p}</p>
        </li>
      ))}
    </ol>
  );
}
