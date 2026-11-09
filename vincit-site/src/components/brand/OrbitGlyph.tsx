/**
 * Ícones exclusivos da órbita de Serviços (não repetem os ícones das seções).
 * Geometria simples em traço fino (32×32, currentColor) + um acento em latão por ícone.
 * Cada um tem um gesto próprio, disparado quando o nó acende ([data-on]) ou no hover/foco:
 * planning → a rota se desenha · protection → o arco se fecha sobre o ponto · wealth → o sol nasce
 * tax → a diagonal se traça e os pontos trocam · offshore → dois países se sobrepõem · estate → as gerações se ramificam.
 */
const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const G = "var(--color-gold)";

export function OrbitGlyph({ id }: { id: string }) {
  return (
    <svg className={`og og-${id}`} viewBox="0 0 32 32" width="30" height="30" overflow="visible" aria-hidden>
      {id === "planning" ? (
        <>
          <path className="og-draw" pathLength={1} d="M5 25 L13 17 L19 21 L27 9" {...L} />
          <circle cx="5" cy="25" r="1.8" fill="currentColor" />
          <circle cx="13" cy="17" r="1.8" fill="currentColor" />
          <circle cx="19" cy="21" r="1.8" fill="currentColor" />
          <circle className="og-pop" cx="27" cy="9" r="2.6" fill={G} />
        </>
      ) : null}
      {id === "protection" ? (
        <>
          <path className="og-draw" pathLength={1} d="M5 22 A11 11 0 0 1 27 22" {...L} />
          <path d="M4 26h24" {...L} />
          <circle className="og-pop" cx="16" cy="21" r="3" fill={G} />
        </>
      ) : null}
      {id === "wealth" ? (
        <>
          <path d="M4 22h24" {...L} />
          <path d="M8 26h16" {...L} strokeOpacity="0.55" />
          <g className="og-rise">
            <path d="M10 22 A6 6 0 0 1 22 22" fill={G} />
            <path d="M16 11v-3M9 13.5 7.5 12M23 13.5l1.5-1.5" stroke={G} strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </>
      ) : null}
      {id === "tax" ? (
        <>
          <rect x="5" y="5" width="22" height="22" rx="2.5" {...L} />
          <path className="og-draw" pathLength={1} d="M24 8 8 24" {...L} />
          <circle className="og-dot-a" cx="11" cy="11" r="2.4" fill={G} />
          <circle className="og-dot-b" cx="21" cy="21" r="2.4" fill="currentColor" />
        </>
      ) : null}
      {id === "offshore" ? (
        <>
          <circle className="og-left" cx="12" cy="16" r="8" {...L} />
          <circle className="og-right" cx="20" cy="16" r="8" {...L} stroke={G} />
        </>
      ) : null}
      {id === "estate" ? (
        <>
          <circle cx="16" cy="6" r="2.4" fill={G} />
          <path className="og-draw" pathLength={1} d="M16 8.5v5M16 13.5 9 18M16 13.5l7 4.5" {...L} />
          <path className="og-draw og-late" pathLength={1} d="M9 18v3.5M9 21.5 5.5 25M9 21.5l3.5 3.5M23 18v3.5M23 21.5 19.5 25M23 21.5l3.5 3.5" {...L} />
          <circle cx="5.5" cy="26" r="1.3" fill="currentColor" />
          <circle cx="12.5" cy="26" r="1.3" fill="currentColor" />
          <circle cx="19.5" cy="26" r="1.3" fill="currentColor" />
          <circle cx="26.5" cy="26" r="1.3" fill="currentColor" />
        </>
      ) : null}
    </svg>
  );
}
