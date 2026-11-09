import { MARK_PARTS, MARK_VIEWBOX, SHIELD_OUTLINE_PATH } from "@/lib/brand-geometry";

/**
 * Marca da Vincit dentro do botão de envio.
 * - "sending": o contorno do escudo se desenha em loop (um traço de latão que percorre a silhueta) e o V respira.
 * - "done": o escudo se preenche de latão e o V fica em grafite — confirmação antes da tela de sucesso.
 */
export function SendMark({ state }: { state: "sending" | "done" }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={`send-mark send-mark-${state}`} aria-hidden>
      <path className="sm-fill" d={SHIELD_OUTLINE_PATH} />
      <path className="sm-track" d={SHIELD_OUTLINE_PATH} pathLength={1} />
      <path className="sm-run" d={SHIELD_OUTLINE_PATH} pathLength={1} />
      <path className="sm-v" d={MARK_PARTS.v} />
    </svg>
  );
}
