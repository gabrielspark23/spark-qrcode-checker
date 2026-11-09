/**
 * Geografia do globo. Só localizações confirmadas:
 * - San Diego, CA (sede nos EUA, PRD §1.1).
 * - Brasil: destacado como PAÍS — nenhuma cidade/endereço brasileiro foi confirmado.
 */
export const SAN_DIEGO: [number, number] = [-117.1611, 32.7157];
export const ISO_BRAZIL = "076";
export const ISO_USA = "840";

/** Vista inicial: Américas, com San Diego e o Brasil visíveis no mesmo hemisfério. */
export const VIEW_INITIAL: [number, number, number] = [86, -6, 0];
export const VIEW_US: [number, number, number] = [112, -26, 0];
export const VIEW_BR: [number, number, number] = [54, 12, 0];

export type GlobeTarget = "us" | "br" | "reset";
export const GLOBE_EVENT = "vincit:globe";
