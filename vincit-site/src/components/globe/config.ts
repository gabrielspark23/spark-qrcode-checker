/**
 * Geografia do globo — só localizações publicadas pela Vincit:
 * - San Diego, CA: sede nos EUA (PRD §1.1).
 * - Porto Alegre e Caxias do Sul (RS): escritórios listados em vincitcapital.com.br.
 */
export const SAN_DIEGO: [number, number] = [-117.1611, 32.7157];
export const PORTO_ALEGRE: [number, number] = [-51.2044, -30.0254]; // Moinhos de Vento
export const CAXIAS_DO_SUL: [number, number] = [-51.1794, -29.1678];
export const ISO_BRAZIL = "076";
export const ISO_USA = "840";

/** [λ, φ, γ] da projeção + zoom. Vista inicial: Américas, com San Diego e o Sul do Brasil visíveis. */
export type View = { rotate: [number, number, number]; zoom: number };
export const VIEWS = {
  reset: { rotate: [86, -2, 0], zoom: 1 },
  us: { rotate: [112, -30, 0], zoom: 1.5 },
  poa: { rotate: [51.2, 30, 0], zoom: 2.3 },
  cxs: { rotate: [51.2, 29.2, 0], zoom: 2.3 },
} satisfies Record<string, View>;

export type GlobeTarget = keyof typeof VIEWS;
export const GLOBE_EVENT = "vincit:globe";
