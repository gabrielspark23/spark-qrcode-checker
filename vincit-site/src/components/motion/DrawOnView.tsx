"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Desenha os traços `.geo-path` quando o bloco entra na tela (uma vez).
 * Sem JS ou com movimento reduzido, os traços já aparecem completos.
 */
export function DrawOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9) return; // já visível: não esconde
    el.dataset.draw = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.draw = "done";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("draw-on-view", className)}>
      {children}
    </div>
  );
}
