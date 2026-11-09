import { ShieldLine, VLines, vRunFor } from "@/components/brand/Shapes";

/**
 * Peça geométrica do herói. Escudo oficial (silhueta), V a 66° e dois círculos deslocados
 * (como o "C" da marca) convergem no mesmo ponto: a ponta do escudo = o plano.
 * Desenha uma vez na entrada (CSS); estática sem JS ou com movimento reduzido.
 */
export function HeroComposition({ usLabel, brLabel, planLabel }: { usLabel: string; brLabel: string; planLabel: string }) {
  const apex = { x: 405, y: 589 };
  const h = 500;
  const run = vRunFor(h);
  return (
    <svg viewBox="0 0 760 760" fill="none" className="enter-draw h-full w-full" aria-hidden>
      {/* círculos deslocados — continuidade */}
      <circle className="draw-line" pathLength={1} cx="440" cy="352" r="300" stroke="var(--color-gold)" strokeOpacity="0.7" transform="rotate(-100 440 352)" />
      <circle className="draw-line d2" pathLength={1} cx="478" cy="330" r="300" stroke="var(--text-primary)" strokeOpacity="0.1" transform="rotate(-80 478 330)" />
      {/* escudo oficial — proteção */}
      <ShieldLine x={190} y={90} width={430} stroke="var(--text-primary)" opacity={0.32} className="draw-line d2" />
      {/* V — convergência Brasil–EUA */}
      <VLines ax={apex.x} ay={apex.y} h={h} stroke="var(--text-primary)" opacity={0.55} className="draw-line d3" />
      {/* prolongamento do V além da ponta (linha arquitetônica) */}
      <path className="draw-line d4" pathLength={1} d={`M${apex.x} ${apex.y} L${apex.x} 760`} stroke="var(--text-primary)" strokeOpacity="0.18" />

      <g className="fade-node">
        <circle cx={apex.x - run} cy={apex.y - h} r="4" fill="var(--text-primary)" />
        <circle cx={apex.x + run} cy={apex.y - h} r="4" fill="var(--text-primary)" />
        <circle cx={apex.x} cy={apex.y} r="6" fill="var(--color-gold)" />
        <circle cx={apex.x} cy={apex.y} r="14" stroke="var(--color-gold)" strokeOpacity="0.6" />
        <text x={apex.x - run - 8} y={apex.y - h - 18} textAnchor="start" fill="var(--text-secondary)" fontSize="13" fontWeight="600" letterSpacing="1.8" fontFamily="var(--font-sans)">{usLabel}</text>
        <text x={apex.x + run + 8} y={apex.y - h - 18} textAnchor="end" fill="var(--text-secondary)" fontSize="13" fontWeight="600" letterSpacing="1.8" fontFamily="var(--font-sans)">{brLabel}</text>
        <text x={apex.x + 26} y={apex.y + 5} fill="var(--text-primary)" fontSize="13" fontWeight="600" letterSpacing="1.8" fontFamily="var(--font-sans)">{planLabel}</text>
      </g>
    </svg>
  );
}
