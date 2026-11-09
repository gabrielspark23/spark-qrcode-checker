"use client";

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";

/**
 * Fotografia do herói.
 * - Entrada: a moldura abre de baixo para cima (máscara) enquanto a foto assenta da escala 1,06 para 1.
 * - Rolagem: parallax curto (a foto anda ~6% dentro da moldura) e o enquadramento se abre levemente.
 *   Só transform/clip-path, num único rAF; sem fixar a página.
 * - Movimento reduzido ou sem JS: foto parada, já enquadrada.
 * - Direção de arte: recorte largo no desktop, recorte 4:5 centrado na família no celular.
 */
export function HeroPhoto({ alt }: { alt: string }) {
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quando a moldura está no lugar inicial; 1 quando o topo dela chega ao topo da tela
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height) * 2 - 0.35));
      el.style.setProperty("--hp", p.toFixed(4));
    };
    const req = () => { if (!raf) raf = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", req);
      window.removeEventListener("resize", req);
    };
  }, []);

  const common = { alt, sizes: "(min-width: 1024px) 92vw, 100vw", quality: 75, preload: true } as const;
  const { props: { srcSet: wide } } = getImageProps({ ...common, src: "/images/hero-life.webp", width: 2800, height: 1867 });
  const { props: { srcSet: tall, ...rest } } = getImageProps({ ...common, src: "/images/hero-life-portrait.webp", width: 1200, height: 1500 });

  return (
    <div ref={frame} className="hero-photo relative overflow-hidden bg-surface-muted">
      <picture>
        <source media="(min-width: 640px)" srcSet={wide} />
        <source srcSet={tall} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt vem de getImageProps */}
        <img {...rest} className="hero-photo-img absolute inset-0 h-full w-full object-cover" />
      </picture>
    </div>
  );
}
