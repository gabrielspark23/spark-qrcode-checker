"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OrbitGlyph } from "@/components/brand/OrbitGlyph";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

type Item = { id: string; title: string };

/** Ângulo (graus, tela) do ponto de destaque: arco inferior esquerdo, voltado para o texto. */
const FEATURE = 135;

/**
 * Roda-gigante de Serviços ("seis disciplinas, um plano").
 * - Um grande anel ancorado no canto superior direito; o eixo é a marca da Vincit (o plano).
 * - A cada passo a roda gira 60° e traz o próximo serviço ao ponto de destaque; as "cabines" ficam de pé.
 * - Ícones exclusivos (OrbitGlyph). No destaque: o nó acende, o ícone faz o seu gesto, o nome aparece
 *   e um pulso de latão corre pelo raio até o eixo. Cada nó leva à seção do serviço.
 * - Pausa fora da tela; com movimento reduzido fica parada, com o primeiro serviço em destaque.
 */
export function ServicesOrbit({ items, className }: { items: Item[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0); // passos dados (não volta a zero: a rotação nunca "salta")
  const n = items.length;
  const step = 360 / n;
  const active = ((k % n) + n) % n;

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const start = () => {
      if (!timer) timer = window.setInterval(() => setK((v) => v + 1), 2600);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  // nó i fica no destaque quando i ≡ k (mod n): ângulo base = FEATURE - i·passo; a roda gira +k·passo
  const pos = (i: number) => {
    const a = ((FEATURE - i * step) * Math.PI) / 180;
    return { x: 50 + 40 * Math.cos(a), y: 50 + 40 * Math.sin(a) };
  };

  return (
    <div ref={root} className={cn("svc-wheel", className)} style={{ "--k": k, "--step": `${step}deg` } as CSSProperties}>
      <div className="svc-wheel-spin">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
          <circle cx="50" cy="50" r="40" stroke="var(--color-gold)" strokeOpacity="0.6" strokeWidth="0.14" />
          <circle cx="51.6" cy="48.6" r="40" stroke="var(--text-on-dark)" strokeOpacity="0.07" strokeWidth="0.14" />
          <circle cx="50" cy="50" r="27" stroke="var(--text-on-dark)" strokeOpacity="0.06" strokeWidth="0.14" />
          {items.map((it, i) => {
            const { x, y } = pos(i);
            return (
              <g key={it.id}>
                <line x1={x} y1={y} x2="50" y2="50" stroke="var(--text-on-dark)" strokeOpacity="0.09" strokeWidth="0.14" />
                <line
                  key={i === active ? `on-${k}` : "off"}
                  className="svc-wheel-pulse"
                  data-on={i === active || undefined}
                  pathLength={1}
                  x1={x}
                  y1={y}
                  x2="50"
                  y2="50"
                  stroke="var(--color-gold)"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {items.map((it, i) => {
          const { x, y } = pos(i);
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="svc-wheel-node"
              data-on={i === active || undefined}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={it.title}
            >
              <span className="svc-wheel-cab">
                <span key={i === active ? `g-${k}` : "g"} className="contents">
                  <OrbitGlyph id={it.id} />
                </span>
                <span className="svc-wheel-label">{it.title}</span>
              </span>
            </a>
          );
        })}
      </div>

      {/* eixo: o plano */}
      <span className="svc-wheel-hub" aria-hidden>
        <span key={k} className="svc-wheel-halo" />
        <svg viewBox={MARK_VIEWBOX} className="relative h-10 w-auto">
          <path d={MARK_PATH} fill="var(--color-gold)" />
        </svg>
      </span>
    </div>
  );
}
