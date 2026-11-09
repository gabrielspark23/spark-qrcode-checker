"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Palco da seção Manifesto (Offset Lens): marca a entrada (uma vez) e alimenta um parallax curto
 * das camadas de fundo (--lp, -1..1). Só transform/clip-path; nada de prender a rolagem.
 * Sem JS ou com movimento reduzido: tudo visível e parado.
 */
export function ManifestoLens({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.lens = "pending";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.lens = "in";
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); // -1 (saindo por cima) .. 1 (entrando por baixo)
      el.style.setProperty("--lp", Math.max(-1, Math.min(1, p)).toFixed(4));
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);
  return (
    <section ref={ref} className={className} aria-labelledby="manifesto-home-title">
      {children}
    </section>
  );
}
