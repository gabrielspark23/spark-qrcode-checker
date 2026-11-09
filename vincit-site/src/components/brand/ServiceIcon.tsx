import { cn } from "@/lib/cn";

/**
 * Ícones de serviço com animação própria (traço de linha, 24×24, cor = currentColor).
 * A animação dispara no hover/foco do card (`.svc-trigger`) ou do próprio ícone, e um anel
 * de latão se fecha em volta. Cada gesto diz algo do serviço:
 * planning → a agulha da bússola encontra o norte · protection → o "check" se desenha
 * wealth → as colunas sobem · tax → a balança se equilibra · offshore → o meridiano gira
 * estate → as linhas do documento se escrevem.
 */
type Id = "planning" | "protection" | "wealth" | "tax" | "offshore" | "estate";

const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Glyph({ id }: { id: Id }) {
  switch (id) {
    case "planning":
      return (
        <>
          <circle cx="12" cy="12" r="9.5" {...P} />
          <path className="si-needle" d="M15.6 8.4 13.5 13.5 8.4 15.6 10.5 10.5Z" {...P} />
        </>
      );
    case "protection":
      return (
        <>
          <path d="M19.5 12.6c0 4.6-3.2 7-7.1 8.4a1 1 0 0 1-.7 0C7.8 19.6 4.5 17.2 4.5 12.6V6.3a.9.9 0 0 1 .9-.9c1.9 0 4.2-1.1 5.8-2.5a1.1 1.1 0 0 1 1.4 0c1.6 1.4 3.9 2.5 5.8 2.5a.9.9 0 0 1 .9.9z" {...P} />
          <path className="si-draw" pathLength={1} d="m9 12 2 2 4-4" {...P} />
        </>
      );
    case "wealth":
      return (
        <>
          <path d="M11.1 2.6a2 2 0 0 1 1.8 0l7.4 3.6c.5.2.3.9-.2.9H3.9c-.5 0-.7-.7-.2-.9z" {...P} />
          <path className="si-col" d="M6 18v-7" {...P} />
          <path className="si-col si-col-2" d="M10 18v-7" {...P} />
          <path className="si-col si-col-3" d="M14 18v-7" {...P} />
          <path className="si-col si-col-4" d="M18 18v-7" {...P} />
          <path d="M3 21.5h18" {...P} />
        </>
      );
    case "tax":
      return (
        <>
          <path d="M12 4v17M8 21h8" {...P} />
          <g className="si-beam">
            <path d="M4 7h2.5c1.8 0 3.9-.7 5.5-1.6 1.6.9 3.7 1.6 5.5 1.6H20" {...P} />
            <path d="m3 15 2.5-7 2.5 7a3.5 3.5 0 0 1-5 0Z" {...P} />
            <path d="m16 15 2.5-7 2.5 7a3.5 3.5 0 0 1-5 0Z" {...P} />
          </g>
        </>
      );
    case "offshore":
      return (
        <>
          <circle cx="12" cy="12" r="9.5" {...P} />
          <path d="M2.5 12h19" {...P} />
          <g className="si-meridian">
            <ellipse cx="12" cy="12" rx="4.2" ry="9.5" {...P} />
          </g>
        </>
      );
    case "estate":
      return (
        <>
          <path d="M18.5 16.5V5a2 2 0 0 0-2-2H4.5M8 21h11.5a2 2 0 0 0 2-2v-.7a.8.8 0 0 0-.8-.8H11a.8.8 0 0 0-.8.8v.7a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a.8.8 0 0 0 .8.8h3" {...P} />
          <path className="si-draw" pathLength={1} d="M10 8h5" {...P} />
          <path className="si-draw si-draw-2" pathLength={1} d="M10 12h5" {...P} />
        </>
      );
  }
}

export function ServiceIcon({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cn("svc-icon relative inline-flex h-12 w-12 shrink-0 items-center justify-center", className)} aria-hidden>
      <svg className="svc-ring absolute inset-0 h-full w-full" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="23" pathLength={1} stroke="var(--color-gold)" strokeWidth="1" transform="rotate(-90 24 24)" />
      </svg>
      <svg className="relative h-7 w-7" viewBox="0 0 24 24" overflow="visible">
        <Glyph id={id as Id} />
      </svg>
    </span>
  );
}
