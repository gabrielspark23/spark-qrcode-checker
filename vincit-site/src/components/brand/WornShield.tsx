"use client";

import { useEffect, useRef } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

/**
 * A marca oficial como um escudo desgastado, quase apagado, ao fundo — e "caindo":
 * desce e gira poucos graus conforme a seção passa pela tela. O desgaste é um filtro de ruído
 * que corrói o preenchimento (sem imagem, sem degradê). Estático com movimento reduzido.
 */
export function WornShield({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight)));
      el.style.transform = `translate3d(0, ${(p * 220 - 60).toFixed(1)}px, 0) rotate(${(-14 + p * 22).toFixed(2)}deg)`;
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", req, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
    };
  }, []);
  return (
    <div ref={ref} className={cn("worn-shield pointer-events-none", className)} aria-hidden>
      <svg viewBox={MARK_VIEWBOX} className="h-full w-full">
        <defs>
          <filter id="worn" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.06" numOctaves="3" seed="7" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.55" result="mask" />
            <feComposite in="SourceGraphic" in2="mask" operator="in" />
          </filter>
        </defs>
        <path d={MARK_PATH} fill="currentColor" filter="url(#worn)" />
      </svg>
    </div>
  );
}
