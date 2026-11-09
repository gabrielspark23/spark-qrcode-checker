"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Offset Circular Reveal — transição de uma seção clara para grafite, vinculada ao scroll.
 *
 * - Duas camadas com o MESMO layout: clara (decorativa, aria-hidden/inert) e grafite (conteúdo real).
 *   A grafite é recortada por um círculo; o texto nunca some: fora do círculo aparece tinta sobre
 *   pedra, dentro aparece claro sobre grafite.
 * - O círculo nasce com ~5% do raio final, centrado em 68% × 65% da área, cresce com o scroll
 *   e o centro sobe levemente até cobrir tudo; o último trecho segura a seção já coberta.
 * - Sem JS, com prefers-reduced-motion ou quando o conteúdo não cabe na tela: seção grafite
 *   normal, sem fixação nem máscara.
 */

const START = { x: 0.68, y: 0.65 };
const END = { x: 0.6, y: 0.42 };
const START_RATIO = 0.05;
const COVER_AT = 0.78; // fração do trecho fixo em que a cobertura termina
const HEADER = 72;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// Saída suave (cúbica in-out): começa e termina sem tranco.
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function CircleReveal({
  light,
  dark,
  labelledBy,
  lightClassName = "bg-app text-ink",
  length = "240svh",
  className,
}: {
  light: ReactNode;
  dark: ReactNode;
  labelledBy?: string;
  lightClassName?: string;
  /** Altura total da seção quando animada (o trecho fixo é length − 100svh). */
  length?: string;
  className?: string;
}) {
  const wrap = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const st = stage.current;
    const ct = content.current;
    if (!el || !st || !ct) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = false;
    let raf = 0;
    const vars = ["--cx", "--cy", "--r", "--draw", "--ring"];

    const update = () => {
      raf = 0;
      if (!enabled) return;
      const vh = window.innerHeight;
      const vw = st.clientWidth;
      const rect = el.getBoundingClientRect();
      const pinned = el.offsetHeight - vh;

      // 0 → 1 enquanto a seção entra pela base da tela (desenha a geometria)
      const enter = clamp(1 - rect.top / vh);
      // 0 → 1 durante o trecho fixo (expande o círculo)
      const p = clamp(-rect.top / (pinned * COVER_AT));
      const e = ease(p);

      const cx = lerp(START.x * vw, END.x * vw, e);
      const cy = lerp(START.y * vh, END.y * vh, e);
      const endX = END.x * vw;
      const endY = END.y * vh;
      const full = Math.hypot(Math.max(endX, vw - endX), Math.max(endY, vh - endY)) + 2;
      const r = lerp(full * START_RATIO, full, e);

      st.style.setProperty("--cx", `${cx.toFixed(1)}px`);
      st.style.setProperty("--cy", `${cy.toFixed(1)}px`);
      st.style.setProperty("--r", `${r.toFixed(1)}px`);
      st.style.setProperty("--draw", ease(clamp(enter * 1.15)).toFixed(3));
      st.style.setProperty("--ring", (1 - e).toFixed(3));
    };

    const setup = () => {
      // Cabe na tela? (conteúdo + cabeçalho + respiro)
      const fits = ct.offsetHeight + HEADER + 48 <= window.innerHeight;
      const next = !mq.matches && fits;
      if (next !== enabled) {
        enabled = next;
        if (enabled) el.dataset.enhanced = "";
        else {
          delete el.dataset.enhanced;
          vars.forEach((v) => st.style.removeProperty(v));
        }
      }
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    setup();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", setup);
    mq.addEventListener("change", setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setup);
      mq.removeEventListener("change", setup);
    };
  }, []);

  return (
    <section
      ref={wrap}
      className={cn("reveal", className)}
      aria-labelledby={labelledBy}
      style={{ ["--reveal-length" as string]: length }}
    >
      <div ref={stage} className="reveal-stage">
        <div className={cn("reveal-layer reveal-light", lightClassName)} aria-hidden inert>
          {light}
        </div>
        <div className="reveal-layer reveal-dark on-dark bg-navy text-on-dark">
          <div ref={content} className="w-full">
            {dark}
          </div>
        </div>
        <svg className="reveal-ring" aria-hidden>
          <circle className="reveal-ring-a" />
          <circle className="reveal-ring-b" />
        </svg>
      </div>
    </section>
  );
}
