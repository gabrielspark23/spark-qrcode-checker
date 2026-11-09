import { SHIELD_OUTLINE_PATH, BRAND_GEOMETRY } from "@/lib/brand-geometry";
import { vRunFor } from "@/components/brand/Shapes";

/**
 * Composição lateral de "Who we serve": o MESMO conjunto de formas (escudo, V, dois círculos)
 * se reorganiza para cada público. As transições são de transform/opacity (CSS), então a
 * troca é contínua — e sem JS cada painel mostra a sua composição estática.
 */
type Seg = "families" | "business" | "crossborder" | "retirement";

const B = BRAND_GEOMETRY.shieldBox;
const LAYOUT: Record<Seg, { shield: string; shieldO: number; v: string; c1: string; c2: string; c2o: number }> = {
  // Proteção envolve a família: escudo grande, círculos pequenos dentro
  families: { shield: "translate(200px,200px) scale(1)", shieldO: 1, v: "translate(200px,236px) scale(0.42)", c1: "translate(178px,236px) scale(0.24)", c2: "translate(222px,236px) scale(0.24)", c2o: 1 },
  // Estrutura do negócio: V dominante, escudo menor, um círculo deslocado
  business: { shield: "translate(286px,250px) scale(0.42)", shieldO: 0.8, v: "translate(170px,230px) scale(1)", c1: "translate(276px,140px) scale(0.5)", c2: "translate(276px,140px) scale(0.5)", c2o: 0 },
  // Dois países: dois círculos afastados ligados pelo V
  crossborder: { shield: "translate(200px,330px) scale(0.22)", shieldO: 0.6, v: "translate(200px,250px) scale(1.05)", c1: "translate(92px,120px) scale(0.42)", c2: "translate(308px,120px) scale(0.42)", c2o: 1 },
  // Aposentadoria: um grande arco no horizonte, escudo calmo ao centro
  retirement: { shield: "translate(200px,228px) scale(0.5)", shieldO: 0.9, v: "translate(200px,226px) scale(0.3)", c1: "translate(200px,420px) scale(1.55)", c2: "translate(200px,420px) scale(1.2)", c2o: 0.5 },
};

export function SegmentComposition({ segment, className }: { segment: Seg; className?: string }) {
  const L = LAYOUT[segment];
  const s = 220 / B.w;
  const vh = 150;
  const run = vRunFor(vh);
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden>
      <circle cx="200" cy="200" r="190" stroke="var(--border-soft)" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
      {/* escudo oficial (silhueta), centrado na origem do grupo */}
      <g className="seg-shape" style={{ transform: L.shield, opacity: L.shieldO }}>
        <g transform={`scale(${s}) translate(${-(B.x + B.w / 2)} ${-(B.y + B.h / 2)})`}>
          <path d={SHIELD_OUTLINE_PATH} stroke="var(--text-primary)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        </g>
      </g>
      {/* V a 66°, ápice na origem do grupo */}
      <g className="seg-shape" style={{ transform: L.v }}>
        <path d={`M${-run} ${-vh / 2} L0 ${vh / 2} L${run} ${-vh / 2}`} stroke="var(--text-primary)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <circle cx="0" cy={vh / 2} r="5" fill="var(--color-gold)" />
      </g>
      <g className="seg-shape" style={{ transform: L.c1 }}>
        <circle r="100" stroke="var(--color-gold)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </g>
      <g className="seg-shape" style={{ transform: L.c2, opacity: L.c2o }}>
        <circle r="100" stroke="var(--text-primary)" strokeOpacity="0.5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}
