"use client";

import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

type Item = { id: string; title: string };

/**
 * "Seis disciplinas, um plano" em forma de órbita (cabeçalho de Serviços).
 * - Os seis serviços ficam num anel de latão que gira muito devagar; os ícones continuam de pé.
 * - Em sequência, um serviço acende: o anel do ícone se fecha, o ícone faz o seu gesto, e um pulso
 *   corre pelo raio até o centro — a marca da Vincit, que responde. Cada nó leva à seção do serviço.
 * - Pausa fora da tela; com movimento reduzido fica parado e completo.
 */
export function ServicesOrbit({ items, className }: { items: Item[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let i = -1;
    const step = () => {
      i = (i + 1) % items.length;
      setActive(i);
      setBeat((b) => b + 1);
    };
    const start = () => {
      if (timer) return;
      step();
      timer = window.setInterval(step, 1800);
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
  }, [items.length]);

  const n = items.length;
  return (
    <div ref={root} className={cn("svc-orbit", className)}>
      <div className="svc-orbit-spin">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" fill="none" aria-hidden>
          <circle className="draw-line" pathLength={1} cx="50" cy="50" r="40" stroke="var(--color-gold)" strokeOpacity="0.7" strokeWidth="0.2" transform="rotate(-90 50 50)" />
          <circle cx="53" cy="47.5" r="40" stroke="var(--text-on-dark)" strokeOpacity="0.08" strokeWidth="0.2" />
          {items.map((it, k) => {
            const a = ((-90 + (k * 360) / n) * Math.PI) / 180;
            const x = 50 + 40 * Math.cos(a), y = 50 + 40 * Math.sin(a);
            return (
              <g key={it.id}>
                <line x1={x} y1={y} x2="50" y2="50" stroke="var(--text-on-dark)" strokeOpacity="0.1" strokeWidth="0.2" />
                <line
                  className="svc-orbit-pulse"
                  data-on={k === active || undefined}
                  pathLength={1}
                  x1={x}
                  y1={y}
                  x2="50"
                  y2="50"
                  stroke="var(--color-gold)"
                  strokeWidth="0.45"
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        {items.map((it, k) => {
          const a = ((-90 + (k * 360) / n) * Math.PI) / 180;
          return (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="svc-orbit-node svc-trigger"
              data-on={k === active || undefined}
              style={{ left: `${50 + 40 * Math.cos(a)}%`, top: `${50 + 40 * Math.sin(a)}%` }}
              aria-label={it.title}
            >
              <span className="svc-orbit-upright">
                <ServiceIcon id={it.id} />
                <span className="svc-orbit-label">{it.title}</span>
              </span>
            </a>
          );
        })}
      </div>

      {/* centro: o plano (marca da Vincit), que responde a cada pulso */}
      <span className="svc-orbit-core" aria-hidden>
        <span key={beat} className="svc-orbit-halo" />
        <svg viewBox={MARK_VIEWBOX} className="relative h-9 w-auto">
          <path d={MARK_PATH} fill="var(--color-gold)" />
        </svg>
      </span>
    </div>
  );
}
