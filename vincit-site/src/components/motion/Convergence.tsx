"use client";

import { useEffect, useRef } from "react";

/**
 * Convergência: duas linhas finas saem dos cantos (BR e US) e se encontram num ponto de latão
 * logo acima da chamada para ação, no ritmo da rolagem — sem fixar a página.
 * Propósito: levar o olhar até a ação e dizer, sem palavras, "dois países, uma conversa".
 * Sem JS: linhas ocultas (o conteúdo não depende delas). Movimento reduzido: já desenhadas.
 */
const SMOOTH = 0.2;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export function Convergence({ apexRef }: { apexRef: React.RefObject<HTMLElement | null> }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const apex = apexRef.current;
    const section = el?.parentElement;
    if (!el || !apex || !section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let cur = -1;

    const layout = () => {
      const s = section.getBoundingClientRect();
      const a = apex.getBoundingClientRect();
      const inset = Math.max(20, s.width * 0.06);
      const ax = a.left + a.width / 2 - s.left;
      const ay = a.top - s.top;
      const lx = ax - inset;
      const rx = s.width - inset - ax;
      el.style.setProperty("--l-len", `${Math.hypot(lx, ay)}px`);
      el.style.setProperty("--r-len", `${Math.hypot(rx, ay)}px`);
      el.style.setProperty("--l-ang", `${Math.atan2(ay, lx)}rad`);
      el.style.setProperty("--r-ang", `${-Math.atan2(ay, rx)}rad`);
      el.style.setProperty("--inset", `${inset}px`);
      el.style.setProperty("--ax", `${ax}px`);
      el.style.setProperty("--ay", `${ay}px`);
      el.dataset.ready = "";
    };

    const target = () => {
      const vh = window.innerHeight;
      const top = section.getBoundingClientRect().top;
      // começa quando a seção aparece; termina quando o ápice chega a ~55% da tela
      const a = apex.getBoundingClientRect().top;
      return clamp((vh - top) / (vh - vh * 0.55 + (a - top)));
    };

    const tick = () => {
      raf = 0;
      const tgt = reduced ? 1 : target();
      cur = cur < 0 ? tgt : cur + (tgt - cur) * SMOOTH;
      if (Math.abs(tgt - cur) < 0.0015) cur = tgt;
      el.style.setProperty("--p", cur.toFixed(4));
      if (cur !== tgt) raf = requestAnimationFrame(tick);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      layout();
      request();
    };

    layout();
    request();
    const ro = new ResizeObserver(onResize);
    ro.observe(section);
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", request);
    };
  }, [apexRef]);

  return (
    <div ref={root} className="converge" aria-hidden>
      <span className="converge-line converge-l" />
      <span className="converge-line converge-r" />
      <span className="converge-label converge-label-l">BR</span>
      <span className="converge-label converge-label-r">US</span>
      <span className="converge-node" />
    </div>
  );
}
