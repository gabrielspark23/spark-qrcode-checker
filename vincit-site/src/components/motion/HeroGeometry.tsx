"use client";

import { useEffect, useRef } from "react";

/**
 * Ornamento do herói: dois círculos deslocados (continuidade) em torno do escudo (proteção).
 * Desenho de entrada em CSS; com o scroll, os anéis giram poucos graus e o escudo desce levemente.
 */
export function HeroGeometry() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      el.style.setProperty("--hp", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 640 640" fill="none" className="hero-geo" aria-hidden>
      <g className="hero-geo-rings">
        <circle className="hero-geo-ring" pathLength={1} cx="320" cy="320" r="292" stroke="var(--color-gold)" strokeOpacity="0.22" strokeWidth="1" />
        <circle className="hero-geo-ring hero-geo-ring-2" pathLength={1} cx="352" cy="300" r="292" stroke="var(--color-gold)" strokeOpacity="0.1" strokeWidth="1" />
        <circle cx="320" cy="28" r="3.5" fill="var(--color-gold)" fillOpacity="0.7" />
      </g>
      <g className="hero-geo-shield">
        <path
          d="M320 120 470 170v118c0 92-62 163-150 200-88-37-150-108-150-200V170l150-50Z"
          stroke="var(--color-gold)"
          strokeOpacity="0.1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M245 215 320 368l75-153" stroke="var(--color-gold)" strokeOpacity="0.1" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
