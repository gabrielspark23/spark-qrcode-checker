import { useId } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "@/lib/brand-geometry";

/**
 * A logo oficial da Vincit (escudo + V + círculo) no botão de envio — mesma linguagem do carregamento entre páginas.
 * - "sending": a logo apagada se enche de latão de baixo para cima, em loop suave.
 * - "done": a logo fica cheia e dá um leve pulso — confirmação antes da tela de sucesso.
 */
export function SendMark({ state }: { state: "sending" | "done" }) {
  const clip = `send-fill-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox={MARK_VIEWBOX} className={`send-mark send-mark-${state}`} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <rect className="sm-rise" x="0" y="0" width="520" height="520" />
        </clipPath>
      </defs>
      <path className="sm-base" d={MARK_PATH} />
      <path className="sm-gold" d={MARK_PATH} clipPath={`url(#${clip})`} />
    </svg>
  );
}
