/* eslint-disable @next/next/no-img-element */
/**
 * Globo estático: SVG gerado por `scripts/build-globe.mjs` (mesma vista e mesmos pontos do
 * globo interativo). Usado no mobile, em aparelhos modestos, com movimento reduzido, sem JS e
 * como primeiro quadro no desktop. Imagem externa e lazy: não pesa no HTML da Home.
 */
export function GlobeStatic({ label }: { label: string }) {
  return <img src="/globe-static.svg" alt={label} width={640} height={640} loading="lazy" decoding="async" className="h-full w-full" />;
}
