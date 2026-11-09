"use client";

import { useEffect, useRef } from "react";

/**
 * Liga "Our Perspective" ao globo: o anel de latão que revelou o grafite não desaparece —
 * com a rolagem, ele se contrai a partir do círculo final da máscara e pousa no contorno do
 * globo. O círculo (continuidade) vira o mundo onde a Vincit atua.
 * Segue o scroll (amortecido), não prende a página; desligado com movimento reduzido.
 */
const END = { x: 0.6, y: 0.42 }; // centro final da máscara (mesmo do CircleReveal)
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function RingHandoff() {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage = document.querySelector<HTMLElement>(".reveal-stage");
    const globe = document.querySelector<HTMLElement>("[data-globe-stage]");
    const a = el.querySelector<SVGCircleElement>(".handoff-a");
    const b = el.querySelector<SVGCircleElement>(".handoff-b");
    if (!stage || !globe || !a || !b) return;
    let raf = 0;
    let cur = -1;

    const target = () => {
      const g = globe.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando o centro do globo entra pela base; 1 quando chega a ~52% da tela
      return clamp((vh - (g.top + g.height / 2)) / (vh * 0.48));
    };
    const paint = (q: number) => {
      const s = stage.getBoundingClientRect();
      const g = globe.getBoundingClientRect();
      if (q <= 0.001 || s.bottom < -window.innerHeight || g.top > window.innerHeight * 1.6) {
        el.style.opacity = "0";
        return;
      }
      const e = ease(q);
      // círculo inicial = máscara já completa (grande, quase toda fora da tela)
      const sx = s.left + END.x * s.width;
      const sy = s.top + END.y * s.height;
      const sr = Math.hypot(Math.max(END.x * s.width, (1 - END.x) * s.width), Math.max(END.y * s.height, (1 - END.y) * s.height));
      // círculo final = contorno do globo (mesmo raio do canvas/SVG)
      const gx = g.left + g.width / 2;
      const gy = g.top + g.height / 2;
      const gr = g.width / 2 - 4;
      const cx = sx + (gx - sx) * e, cy = sy + (gy - sy) * e, r = sr + (gr - sr) * e;
      a.setAttribute("cx", cx.toFixed(1)); a.setAttribute("cy", cy.toFixed(1)); a.setAttribute("r", Math.max(0, r).toFixed(1));
      b.setAttribute("cx", cx.toFixed(1)); b.setAttribute("cy", cy.toFixed(1)); b.setAttribute("r", Math.max(0, r + 22 * (1 - e)).toFixed(1));
      // aparece no começo; ao pousar, cede lugar ao contorno do próprio globo
      el.style.opacity = String(Math.min(1, q * 6) * (1 - Math.max(0, (q - 0.9) / 0.1) * 0.6));
    };
    const tick = () => {
      raf = 0;
      const t = target();
      cur = cur < 0 ? t : cur + (t - cur) * 0.22;
      if (Math.abs(t - cur) < 0.002) cur = t;
      paint(cur);
      if (cur !== t) raf = requestAnimationFrame(tick);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    req();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);

  return (
    <svg ref={svg} className="pointer-events-none fixed inset-0 z-30 h-svh w-screen" style={{ opacity: 0 }} aria-hidden>
      <circle className="handoff-a" fill="none" stroke="var(--color-gold)" strokeOpacity="0.6" strokeWidth="1" />
      <circle className="handoff-b" fill="none" stroke="var(--color-gold)" strokeOpacity="0.22" strokeWidth="1" />
    </svg>
  );
}
