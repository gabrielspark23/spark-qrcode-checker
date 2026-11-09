"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Offset Circular Reveal — a seção grafite chega com a rolagem, sem prender a página.
 *
 * Propósito: marcar a passagem de capítulo (do "o que fazemos" para "o que nos orienta") e
 * conduzir a leitura: cada marco geométrico se desenha quando o item correspondente chega à
 * zona de leitura, na ordem em que deve ser lido.
 *
 * - Nada é fixado (sem sticky, sem altura extra): o círculo cresce enquanto a seção sobe
 *   pela tela, no ritmo do próprio scroll, com um amortecimento leve para não parecer mecânico.
 * - Começa com ~5% do raio final, centro em 68% × 65% da seção, e sobe até 60% × 42%.
 * - Duas camadas com o mesmo layout: na borda da máscara o texto troca de cor, nunca some.
 * - Sem JS ou com prefers-reduced-motion: seção grafite comum, marcos já desenhados.
 */

const START = { x: 0.68, y: 0.65 };
const END = { x: 0.6, y: 0.42 };
const START_RATIO = 0.05;
const TRAVEL = 0.6; // fração da altura da tela em que a cobertura acontece
const SMOOTH = 0.2; // amortecimento por quadro (0 = parado, 1 = sem amortecimento)

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function CircleReveal({
  light,
  dark,
  labelledBy,
  lightClassName = "bg-app text-ink",
  className,
}: {
  light: ReactNode;
  dark: ReactNode;
  labelledBy?: string;
  lightClassName?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const darkLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const st = stage.current;
    const dk = darkLayer.current;
    if (!el || !st || !dk) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let raf = 0;
    let cur = -1; // progresso exibido (amortecido)
    const items = () => Array.from(dk.querySelectorAll<HTMLElement>("[data-step]"));

    const target = () => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const cy = rect.top + START.y * rect.height; // centro inicial em coordenadas da tela
      return clamp((vh - cy) / (vh * TRAVEL));
    };

    const paint = (p: number) => {
      const w = st.clientWidth;
      const h = st.clientHeight;
      const e = easeOut(p);
      const cx = lerp(START.x * w, END.x * w, e);
      const cy = lerp(START.y * h, END.y * h, e);
      const ex = END.x * w;
      const ey = END.y * h;
      const full = Math.hypot(Math.max(ex, w - ex), Math.max(ey, h - ey)) + 2;
      const r = p >= 1 ? full * 1.05 : lerp(full * START_RATIO, full, e);
      st.style.setProperty("--cx", `${cx.toFixed(1)}px`);
      st.style.setProperty("--cy", `${cy.toFixed(1)}px`);
      st.style.setProperty("--r", `${r.toFixed(1)}px`);
      // anéis: aparecem logo no início e somem conforme a cobertura termina
      st.style.setProperty("--ring", (clamp(p * 10) * (1 - e)).toFixed(3));

      // Marcos: cada um se desenha quando o seu item entra na zona de leitura
      const vh = window.innerHeight;
      items().forEach((it) => {
        const t = it.getBoundingClientRect().top;
        const d = clamp((vh * 0.9 - t) / (vh * 0.28));
        st.style.setProperty(`--d${it.dataset.step}`, d.toFixed(3));
      });
    };

    const tick = () => {
      raf = 0;
      if (!enabled) return;
      const tgt = target();
      cur = cur < 0 ? tgt : cur + (tgt - cur) * SMOOTH;
      if (Math.abs(tgt - cur) < 0.0015) cur = tgt;
      paint(cur);
      if (cur !== tgt) raf = requestAnimationFrame(tick);
    };

    const request = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const setup = () => {
      const next = !mq.matches;
      if (next !== enabled) {
        enabled = next;
        if (enabled) {
          el.dataset.enhanced = "";
          cur = -1;
        } else {
          delete el.dataset.enhanced;
          ["--cx", "--cy", "--r", "--ring", "--d0", "--d1", "--d2"].forEach((v) => st.style.removeProperty(v));
        }
      }
      request();
    };

    setup();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    mq.addEventListener("change", setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      mq.removeEventListener("change", setup);
    };
  }, []);

  return (
    <section ref={wrap} className={cn("reveal", className)} aria-labelledby={labelledBy}>
      <div ref={stage} className="reveal-stage">
        <div ref={darkLayer} className="reveal-layer reveal-dark on-dark bg-navy text-on-dark">
          {dark}
        </div>
        <div className={cn("reveal-layer reveal-light", lightClassName)} aria-hidden inert>
          {light}
        </div>
        <svg className="reveal-ring" aria-hidden>
          <circle className="reveal-ring-a" />
          <circle className="reveal-ring-b" />
        </svg>
      </div>
    </section>
  );
}
