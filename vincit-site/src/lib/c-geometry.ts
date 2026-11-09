/**
 * Geometria do C em contraforma (C-Reveal). Coordenadas em px da janela.
 * O contorno é um único caminho: arco externo (pelo lado esquerdo) → borda reta da abertura
 * → arco interno (contraforma) → outra borda reta. A abertura nasce a 42° (base do escudo).
 */
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const SHIELD_BASE = 42;

export type CShape = { cx: number; cy: number; R: number; ix: number; iy: number; r: number; half: number; full: boolean };

/** e: 0 → 1. 0–0,7: o C entra pela direita (80%→100% da escala) e fica inteiro; 0,7–1: cobre tudo. */
export function cShapeAt(e: number, W: number, vh: number, mobile: boolean): CShape {
  const Rc = mobile ? 0.7 * W : Math.min(0.46 * W, 0.72 * vh);
  const f = easeInOut(clamp(e / 0.7));
  const g = easeInOut(clamp((e - 0.7) / 0.3));
  const ax = lerp((mobile ? 1.4 : 1.25) * W, (mobile ? 0.6 : 0.64) * W, f);
  const ay = lerp(0.58 * vh, 0.5 * vh, f);
  const aR = lerp(0.8 * Rc, Rc, f);
  const ex = 0.58 * W;
  const ey = 0.5 * vh;
  const cover = Math.hypot(Math.max(ex, W - ex), Math.max(ey, vh - ey)) * 1.08;
  return {
    cx: lerp(ax, ex, g),
    cy: lerp(ay, ey, g),
    R: lerp(aR, cover, g),
    ix: ax + aR * 0.14,
    iy: ay - aR * 0.03,
    r: aR * lerp(0.58, 0.46, f) * (1 - g),
    // a abertura fecha primeiro (sem virar uma lasca comprida); a contraforma some por último
    half: lerp(SHIELD_BASE, 30, f) * (1 - easeInOut(clamp((e - 0.7) / 0.05))),
    full: e >= 0.995,
  };
}

/** Caminho SVG do C (para clip-path: path()). `dy` desloca da janela para o elemento. */
export function cPath(s: CShape, dy = 0): string {
  const cx = s.cx, cy = s.cy - dy, ix = s.ix, iy = s.iy - dy;
  const circle = (x: number, y: number, r: number) =>
    `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0Z`;
  if (s.r < 1) return circle(cx, cy, s.R);
  // abertura fechada: disco com o furo da contraforma (evenodd)
  if (s.half < 0.3) return circle(cx, cy, s.R) + circle(ix, iy, s.r);
  const t = (s.half * Math.PI) / 180;
  // ponto onde o raio (a partir do centro da contraforma, ângulo a) cruza o círculo externo
  const hit = (a: number) => {
    const dx = Math.cos(a), dyy = Math.sin(a);
    const ox = ix - cx, oy = iy - cy;
    const b = ox * dx + oy * dyy;
    const c = ox * ox + oy * oy - s.R * s.R;
    const k = -b + Math.sqrt(Math.max(0, b * b - c));
    return [ix + dx * k, iy + dyy * k];
  };
  const [ux, uy] = hit(-t); // borda de cima (y para cima = negativo)
  const [lx, ly] = hit(t);
  const pu = [ix + Math.cos(-t) * s.r, iy + Math.sin(-t) * s.r];
  const pl = [ix + Math.cos(t) * s.r, iy + Math.sin(t) * s.r];
  const R = s.R.toFixed(1), r = s.r.toFixed(1);
  return (
    `M${ux.toFixed(1)} ${uy.toFixed(1)}` +
    `A${R} ${R} 0 1 0 ${lx.toFixed(1)} ${ly.toFixed(1)}` + // externo, pelo lado esquerdo
    `L${pl[0].toFixed(1)} ${pl[1].toFixed(1)}` +
    `A${r} ${r} 0 1 1 ${pu[0].toFixed(1)} ${pu[1].toFixed(1)}` + // contraforma, sentido oposto
    `Z`
  );
}
