import { SHIELD_OUTLINE_PATH, BRAND_GEOMETRY, MARK_PARTS } from "@/lib/brand-geometry";

/**
 * Primitivas geométricas derivadas da marca, para composições em SVG.
 * Traço de 1 unidade compensado pela escala (sem vector-effect, que quebra o desenho por
 * stroke-dasharray) e pathLength=1 para desenhar com .draw-line.
 */

const B = BRAND_GEOMETRY.shieldBox;

/** Silhueta do escudo oficial, encaixada numa caixa (x, y, largura). Altura = largura × 1,16. */
export function ShieldLine({
  x,
  y,
  width,
  className,
  stroke = "currentColor",
  opacity = 1,
}: {
  x: number;
  y: number;
  width: number;
  className?: string;
  stroke?: string;
  opacity?: number;
}) {
  const s = width / B.w;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-B.x} ${-B.y})`}>
      <path
        d={SHIELD_OUTLINE_PATH}
        fill="none"
        stroke={stroke}
        strokeOpacity={opacity}
        strokeWidth={1 / s}
        pathLength={1}
        className={className}
      />
    </g>
  );
}

/** Dois braços do V a 66° convergindo em (ax, ay), com altura h. */
export function VLines({
  ax,
  ay,
  h,
  className,
  stroke = "currentColor",
  opacity = 1,
}: {
  ax: number;
  ay: number;
  h: number;
  className?: string;
  stroke?: string;
  opacity?: number;
}) {
  const run = h / Math.tan((BRAND_GEOMETRY.vAngle * Math.PI) / 180);
  return (
    <g fill="none" stroke={stroke} strokeOpacity={opacity} strokeWidth={1}>
      <path d={`M${ax - run} ${ay - h} L${ax} ${ay}`} pathLength={1} className={className} />
      <path d={`M${ax + run} ${ay - h} L${ax} ${ay}`} pathLength={1} className={className} />
    </g>
  );
}

export const vRunFor = (h: number) => h / Math.tan((BRAND_GEOMETRY.vAngle * Math.PI) / 180);

/**
 * O interior oficial do escudo (o V e o "C" com seus traços), encaixado na mesma caixa da
 * ShieldLine (mesmos x, y e largura) — completa a marca dentro de um contorno de escudo.
 */
export function ShieldInterior({
  x,
  y,
  width,
  className,
  fill = "var(--color-gold)",
}: {
  x: number;
  y: number;
  width: number;
  className?: string;
  fill?: string;
}) {
  const s = width / B.w;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-B.x} ${-B.y})`} className={className}>
      <path d={MARK_PARTS.v} fill={fill} fillRule="evenodd" />
      <path d={MARK_PARTS.circle} fill={fill} fillRule="evenodd" />
    </g>
  );
}
