"use client";

import { useEffect, useState } from "react";
import { ShieldLine, VLines, vRunFor } from "@/components/brand/Shapes";

/**
 * Peça do herói com propósito: as seis frentes (no círculo de latão — continuidade) convergem,
 * uma a uma, no ápice do V dentro do escudo — "um plano". Pelos braços do V descem pulsos que
 * saem dos EUA e do Brasil e se encontram no mesmo ponto.
 * Sem JS / movimento reduzido: as seis linhas aparecem juntas, estáticas (mesma mensagem).
 */
const C = { x: 440, y: 352, r: 300 };
const ANGLES = [262, 236, 210, 184, 158, 132]; // lado visível do círculo, de cima para baixo
const APEX = { x: 405, y: 589 };
const VH = 500;

export function HeroComposition({
  usLabel,
  brLabel,
  planLabel,
  disciplines,
}: {
  usLabel: string;
  brLabel: string;
  planLabel: string;
  disciplines: string[];
}) {
  const [active, setActive] = useState(-1); // -1 = estático (todas)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const first = window.setTimeout(() => setActive(0), 1400); // depois do desenho de entrada
    const id = window.setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % ANGLES.length;
      setActive(i);
    }, 2600);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const run = vRunFor(VH);
  const nodes = ANGLES.map((a) => ({
    x: C.x + C.r * Math.cos((a * Math.PI) / 180),
    y: C.y + C.r * Math.sin((a * Math.PI) / 180),
  }));
  const left = `M${APEX.x - run} ${APEX.y - VH} L${APEX.x} ${APEX.y}`;
  const right = `M${APEX.x + run} ${APEX.y - VH} L${APEX.x} ${APEX.y}`;

  return (
    <svg viewBox="0 0 760 760" fill="none" className="enter-draw h-full w-full" aria-hidden>
      <circle className="draw-line" pathLength={1} cx={C.x} cy={C.y} r={C.r} stroke="var(--color-gold)" strokeOpacity="0.7" transform={`rotate(-100 ${C.x} ${C.y})`} />
      <circle className="draw-line d2" pathLength={1} cx="478" cy="330" r="300" stroke="var(--text-primary)" strokeOpacity="0.1" transform="rotate(-80 478 330)" />
      <ShieldLine x={190} y={90} width={430} stroke="var(--text-primary)" opacity={0.28} className="draw-line d2" />
      <VLines ax={APEX.x} ay={APEX.y} h={VH} stroke="var(--text-primary)" opacity={0.5} className="draw-line d3" />
      <path className="draw-line d4" pathLength={1} d={`M${APEX.x} ${APEX.y} L${APEX.x} 760`} stroke="var(--text-primary)" strokeOpacity="0.16" />

      {/* frentes → plano */}
      <g className="fade-node">
        {nodes.map((n, i) =>
          active === -1 || active === i ? (
            <path
              key={active === -1 ? `s${i}` : `a${i}-${active}`}
              d={`M${n.x.toFixed(1)} ${n.y.toFixed(1)} L${APEX.x} ${APEX.y}`}
              pathLength={1}
              stroke="var(--color-gold)"
              strokeOpacity={active === -1 ? 0.35 : 0.9}
              className={active === -1 ? undefined : "hero-link"}
            />
          ) : null,
        )}
        {nodes.map((n, i) => {
          const on = active === i;
          return (
            <g key={i} className="hero-node" data-on={on ? "" : undefined}>
              <circle cx={n.x} cy={n.y} r={on ? 6 : 4} fill={on ? "var(--color-gold)" : "var(--bg-app)"} stroke="var(--color-gold)" strokeWidth="1.25" />
              <text
                x={n.x + 16}
                y={n.y + 4}
                fill={on || active === -1 ? "var(--text-primary)" : "var(--text-muted)"}
                fontSize="12.5"
                fontWeight="600"
                letterSpacing="1.4"
                fontFamily="var(--font-sans)"
              >
                {disciplines[i]?.toUpperCase()}
              </text>
            </g>
          );
        })}
      </g>

      {/* pulsos EUA → plano ← Brasil */}
      <circle r="3.5" fill="var(--color-gold)" className="hero-pulse" style={{ offsetPath: `path("${left}")` }} />
      <circle r="3.5" fill="var(--color-gold)" className="hero-pulse hero-pulse-2" style={{ offsetPath: `path("${right}")` }} />

      <g className="fade-node">
        <circle cx={APEX.x - run} cy={APEX.y - VH} r="4" fill="var(--text-primary)" />
        <circle cx={APEX.x + run} cy={APEX.y - VH} r="4" fill="var(--text-primary)" />
        <circle cx={APEX.x} cy={APEX.y} r="7" fill="var(--color-gold)" />
        <circle cx={APEX.x} cy={APEX.y} r="15" stroke="var(--color-gold)" strokeOpacity="0.6" className="hero-apex-ring" />
        <text x={APEX.x - run - 8} y={APEX.y - VH - 18} fill="var(--text-secondary)" fontSize="13" fontWeight="600" letterSpacing="1.8" fontFamily="var(--font-sans)">{usLabel}</text>
        <text x={APEX.x + run + 8} y={APEX.y - VH - 18} textAnchor="end" fill="var(--text-secondary)" fontSize="13" fontWeight="600" letterSpacing="1.8" fontFamily="var(--font-sans)">{brLabel}</text>
        <text x={APEX.x + 28} y={APEX.y + 5} fill="var(--text-primary)" fontSize="13" fontWeight="700" letterSpacing="1.8" fontFamily="var(--font-sans)">{planLabel}</text>
      </g>
    </svg>
  );
}
