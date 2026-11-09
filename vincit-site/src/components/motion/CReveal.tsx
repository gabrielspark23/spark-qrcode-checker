"use client";

import { useEffect, useRef } from "react";

/**
 * C-Reveal em contraforma — passagem do claro para o grafite na saída de "Who we serve".
 *
 * Geometria (SVG com máscara, três partes controladas separadamente):
 * - forma externa: grande disco grafite (#16181d), posicionado à direita;
 * - contraforma: disco interno, deslocado, transparente (o claro aparece por dentro);
 * - abertura: cunha que sai da contraforma para a direita, com bordas retas a 42°
 *   (a base do escudo oficial) — é o que faz o desenho ser lido como um C.
 *
 * Fases (vinculadas à posição real de scroll, sem fixar a página):
 * A. entrada: o C desliza pela lateral direita já em ~80% da escala final, abertura e contraforma nítidas;
 * B. expansão: o C cresce e sobe para a esquerda; a contraforma se contrai e se desloca;
 *    a abertura se fecha aos poucos;
 * C. conclusão: contraforma e abertura somem, o grafite cobre 100% da faixa — e a seção
 *    seguinte continua no mesmo grafite.
 * Sem JS ou com movimento reduzido: um C estático já fundido ao grafite na base.
 */
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const SHIELD_BASE = 42; // graus

type Shape = { cx: number; cy: number; R: number; ix: number; iy: number; r: number; half: number };

/**
 * Forma em coordenadas da JANELA (W × vh). e: 0 → 1.
 * 0–0,7: o C de desenho cresce de 80% a 100%, sobe para a esquerda; contraforma e abertura
 *        se contraem mas seguem legíveis.
 * 0,7–1: contraforma e abertura fecham; o grafite se expande até cobrir a janela inteira.
 */
function shapeAt(e: number, W: number, vh: number, mobile: boolean): Shape {
  const Rc = mobile ? 0.6 * W : Math.min(0.34 * W, 0.5 * vh);
  const f = easeInOut(clamp(e / 0.72));
  const g = easeInOut(clamp((e - 0.72) / 0.28));
  // fase A/B: entra pela lateral direita (desliza na horizontal) e cresce de 80% a 100%
  const ax = lerp((mobile ? 1.35 : 1.2) * W, (mobile ? 0.58 : 0.62) * W, f);
  const ay = lerp(0.62 * vh, 0.54 * vh, f);
  const aR = lerp(0.8 * Rc, Rc, f);
  // fase C: cresce até cobrir os cantos
  const ex = 0.58 * W;
  const ey = 0.5 * vh;
  const cover = Math.hypot(Math.max(ex, W - ex), Math.max(ey, vh - ey)) * 1.06;
  const cx = lerp(ax, ex, g);
  const cy = lerp(ay, ey, g);
  const R = lerp(aR, cover, g);
  // contraforma grande e nítida; contrai um pouco na fase B e some na fase C
  const ir = aR * lerp(0.58, 0.44, f) * (1 - g);
  const ix = ax + aR * 0.14;
  const iy = ay - aR * 0.03;
  // abertura: começa no ângulo da base do escudo (42°), fecha até ~30° e some na fase C
  const half = lerp(SHIELD_BASE, 30, f) * (1 - g);
  return { cx, cy, R, ix, iy, r: ir, half };
}

function openingPath(s: Shape, W: number) {
  if (s.half <= 0.2 || s.r <= 0.5) return "";
  const far = W + s.R * 2;
  const t = Math.tan((s.half * Math.PI) / 180);
  const dx = far - s.ix;
  return `M${s.ix.toFixed(1)} ${s.iy.toFixed(1)} L${far.toFixed(1)} ${(s.iy - dx * t).toFixed(1)} L${far.toFixed(1)} ${(s.iy + dx * t).toFixed(1)} Z`;
}

export function CReveal({ id = "c-reveal" }: { id?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = host.current;
    const sv = svg.current;
    if (!el || !sv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const outer = sv.querySelector<SVGCircleElement>("[data-outer]")!;
    const inner = sv.querySelector<SVGCircleElement>("[data-inner]")!;
    const open = sv.querySelector<SVGPathElement>("[data-open]")!;
    const full = sv.querySelector<SVGRectElement>("[data-full]")!;
    const staticBase = sv.querySelector<SVGRectElement>("[data-static]");
    let raf = 0;
    let cur = -1;
    let W = 0;
    let H = 0;

    const measure = () => {
      W = el.clientWidth;
      H = el.clientHeight;
      sv.setAttribute("viewBox", `0 0 ${W} ${H}`);
    };
    const target = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0: a faixa já ocupa ~75% inferior da tela (o C entra inteiro, sem corte) ·
      // 1: a base da faixa chega à base da tela
      return clamp((0.25 * vh - r.top) / (r.height - 0.75 * vh));
    };
    const paint = (p: number) => {
      const e = clamp(p / 0.94); // conclui um pouco antes do fim da faixa
      const mobile = W < 640;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top; // janela → coordenadas da faixa
      const s = shapeAt(e, W, vh, mobile);
      outer.setAttribute("cx", s.cx.toFixed(1));
      outer.setAttribute("cy", (s.cy - top).toFixed(1));
      outer.setAttribute("r", s.R.toFixed(1));
      inner.setAttribute("cx", s.ix.toFixed(1));
      inner.setAttribute("cy", (s.iy - top).toFixed(1));
      inner.setAttribute("r", Math.max(0, s.r).toFixed(1));
      open.setAttribute("d", openingPath({ ...s, iy: s.iy - top }, W));
      // garantia de cobertura total no fim (cantos incluídos)
      full.setAttribute("opacity", e >= 0.995 ? "1" : "0");
    };
    const tick = () => {
      raf = 0;
      const t = target();
      cur = cur < 0 ? t : cur + (t - cur) * 0.25; // amortecimento leve, sem overshoot
      if (Math.abs(t - cur) < 0.001) cur = t;
      paint(cur);
      if (cur !== t) raf = requestAnimationFrame(tick);
    };
    const req = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => {
      measure();
      cur = -1;
      req();
    });
    measure();
    staticBase?.setAttribute("opacity", "0"); // modo animado: começa todo claro
    sv.setAttribute("preserveAspectRatio", "none");
    ro.observe(el);
    window.addEventListener("scroll", req, { passive: true });
    req();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", req);
    };
  }, []);

  // Estado estático (servidor, sem JS, movimento reduzido): C a meio caminho, base já em grafite.
  const SW = 1440;
  const SH = 900;
  const st = shapeAt(0.6, SW, SH, false);
  const maskId = `${id}-mask`;

  return (
    <div ref={host} className="c-reveal relative h-[130svh] w-full overflow-hidden sm:h-[150svh]" aria-hidden>
      <svg ref={svg} className="absolute inset-0 h-full w-full" viewBox={`0 0 ${SW} ${SH}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="-10000" y="-10000" width="20000" height="20000">
            <circle data-outer cx={st.cx} cy={st.cy} r={st.R} fill="#fff" />
            <circle data-inner cx={st.ix} cy={st.iy} r={st.r} fill="#000" />
            <path data-open d={openingPath(st, SW)} fill="#000" />
            <rect data-static x="-10000" y={SH * 0.82} width="20000" height="20000" fill="#fff" />
            <rect data-full x="-10000" y="-10000" width="20000" height="20000" fill="#fff" opacity="0" />
          </mask>
        </defs>
        <rect x="-10000" y="-10000" width="20000" height="20000" fill="var(--color-navy)" mask={`url(#${maskId})`} />
      </svg>
    </div>
  );
}
