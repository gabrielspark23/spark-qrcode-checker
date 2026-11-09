"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MARK_PATH, MARK_VIEWBOX, SHIELD_OUTLINE_PATH } from "@/lib/brand-geometry";

/**
 * Loading entre páginas: o escudo oficial se desenha (contorno) e o latão sobe por dentro.
 * Aparece só em navegação interna (clique em link do site para outra rota) e some quando a
 * nova página está pronta — com um mínimo curto para a animação ser lida, nunca bloqueando.
 * Com prefers-reduced-motion não aparece.
 */
const MIN_MS = 520;
type Phase = "idle" | "in" | "out";

export function RouteLoader() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const started = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const [prevPath, setPrevPath] = useState(pathname);

  // Fim da navegação: a rota mudou
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    if (phase === "in") setPhase("out");
  }

  useEffect(() => {
    if (phase !== "out") return;
    const wait = Math.max(0, MIN_MS - (performance.now() - started.current));
    timer.current = window.setTimeout(() => {
      document.documentElement.dataset.loader = "leaving";
      timer.current = window.setTimeout(() => {
        delete document.documentElement.dataset.loader;
        setPhase("idle");
      }, 320);
    }, wait);
    return () => window.clearTimeout(timer.current);
  }, [phase]);

  // Início da navegação: clique em link interno para outra rota
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // âncora na mesma página
      started.current = performance.now();
      document.documentElement.dataset.loader = "on";
      setPhase("in");
      // segurança: nunca fica preso
      window.setTimeout(() => setPhase((p) => (p === "in" ? "out" : p)), 4000);
    };
    // captura: roda antes do <Link> do Next, que marca o evento como tratado
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (phase === "idle") return null;
  return (
    <div className="route-loader" aria-hidden>
      <svg viewBox={MARK_VIEWBOX} className="route-loader-mark">
        <defs>
          <clipPath id="loader-fill">
            <rect className="route-loader-rise" x="0" y="0" width="520" height="520" />
          </clipPath>
        </defs>
        <path d={SHIELD_OUTLINE_PATH} fill="none" stroke="var(--color-gold)" strokeWidth="3" pathLength={1} className="route-loader-outline" />
        <path d={MARK_PATH} fill="var(--color-gold)" clipPath="url(#loader-fill)" />
      </svg>
    </div>
  );
}
