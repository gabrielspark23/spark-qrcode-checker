import { cn } from "@/lib/cn";

/**
 * Linguagem geométrica da marca (não substitui o logotipo oficial):
 * - Círculo: continuidade
 * - V: convergência entre Brasil e Estados Unidos
 * - Escudo: proteção e estabilidade
 *
 * Traços com pathLength=1: `.geo-path` desenha conforme a variável --draw (0→1),
 * definida por quem controla o movimento (CircleReveal, DrawOnView). Sem JS, --draw = 1.
 */

type MarkProps = { className?: string; tone?: "ink" | "brass" | "light" };

const stroke = (tone: MarkProps["tone"]) =>
  tone === "brass" ? "var(--color-gold)" : tone === "light" ? "var(--text-on-dark)" : "var(--text-primary)";

export function CircleMark({ className, tone = "ink" }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("geo-mark", className)} aria-hidden>
      <circle className="geo-path" pathLength={1} cx="32" cy="32" r="26" stroke={stroke(tone)} strokeWidth="1.25"
        transform="rotate(-90 32 32)" />
      <circle cx="32" cy="32" r="17" stroke={stroke(tone)} strokeWidth="1" strokeOpacity="0.35" />
      <g className="geo-orbit">
        <circle cx="32" cy="6" r="2.75" fill="var(--color-gold)" />
      </g>
    </svg>
  );
}

export function VMark({ className, tone = "ink" }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("geo-mark", className)} aria-hidden>
      <path className="geo-path" pathLength={1} d="M8 10 32 54" stroke={stroke(tone)} strokeWidth="1.25" />
      <path className="geo-path" pathLength={1} d="M56 10 32 54" stroke={stroke(tone)} strokeWidth="1.25" />
      <path d="M20 10 32 32 44 10" stroke={stroke(tone)} strokeWidth="1" strokeOpacity="0.35" />
      <circle className="geo-node" cx="32" cy="54" r="2.75" fill="var(--color-gold)" />
    </svg>
  );
}

export function ShieldMark({ className, tone = "ink" }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("geo-mark", className)} aria-hidden>
      <path
        className="geo-path"
        pathLength={1}
        d="M32 5 54 12.5v17.2c0 13.4-9.1 23.8-22 29.3-12.9-5.5-22-15.9-22-29.3V12.5L32 5Z"
        stroke={stroke(tone)}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path className="geo-inner" pathLength={1} d="M21 21 32 43l11-22" stroke="var(--color-gold)" strokeWidth="1.25" />
    </svg>
  );
}

export const geometryMarks = { circle: CircleMark, v: VMark, shield: ShieldMark } as const;

/** Diagrama de convergência BR → V ← US (faixa "Who we are"). */
export function ConvergenceDiagram({ className, onDark = true }: { className?: string; onDark?: boolean }) {
  const line = onDark ? "var(--text-on-dark-muted)" : "var(--border-rule)";
  const label = onDark ? "var(--text-on-dark-muted)" : "var(--text-muted)";
  return (
    <svg viewBox="0 0 168 104" fill="none" className={cn("geo-mark", className)} aria-hidden>
      <text x="4" y="11" fill={label} fontSize="10" fontWeight="600" letterSpacing="1.4" fontFamily="var(--font-sans)">BR</text>
      <text x="164" y="11" fill={label} fontSize="10" fontWeight="600" letterSpacing="1.4" fontFamily="var(--font-sans)" textAnchor="end">US</text>
      <path className="geo-path" pathLength={1} d="M10 22 84 94" stroke={line} strokeWidth="1" />
      <path className="geo-path" pathLength={1} d="M158 22 84 94" stroke={line} strokeWidth="1" />
      <circle cx="84" cy="94" r="3" fill="var(--color-gold)" className="geo-node" />
    </svg>
  );
}
