"use client";

import { useEffect, useRef } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";
import { cn } from "@/lib/cn";

/**
 * A marca oficial ao fundo da lista da liderança: traçado limpo (sem desgaste), em latão, em tom de marca d'água.
 * Na rolagem só desliza um pouco na vertical (parallax curto), sem girar. Parado com movimento reduzido.
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
      el.style.transform = `translate3d(0, ${(p * 80 - 40).toFixed(1)}px, 0)`;
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);
  return (
    <div ref={ref} className={cn("worn-shield pointer-events-none", className)} aria-hidden>
      <svg viewBox={MARK_VIEWBOX} className="h-full w-full">
        <path d={MARK_PATH} fill="currentColor" />
      </svg>
    </div>
  );
}
