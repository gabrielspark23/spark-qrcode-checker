import type { Metadata } from "next";
import { HomeManifesto } from "@/components/sections/HomeManifesto";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";

export const metadata: Metadata = { title: "Manifesto — Offset Lens (A/B)", robots: { index: false, follow: false } };

/** Comparação interna das duas direções da seção Manifesto. Não é linkada no site. */
export default function ManifestoLab() {
  const t = getDict("en");
  const label = (k: string, name: string, body: string) => (
    <div className="bg-navy py-10 text-on-dark">
      <Container>
        <p className="eyebrow text-brass">Variant {k}</p>
        <p className="mt-2 font-serif text-2xl">{name}</p>
        <p className="mt-2 max-w-2xl text-sm text-on-dark-2">{body}</p>
      </Container>
    </div>
  );
  return (
    <div className="pt-[4.5rem]">
      {label("A", "Offset Lens Editorial", "Dois cantos amplos em diagonal, lâmina deslocada para a direita, plano tonal em curva. Mais expressiva.")}
      <div className="pt-10 bg-navy"><HomeManifesto locale="en" t={t} variant="editorial" /></div>
      {label("B", "Offset Lens Structural", "Um único canto amplo, raios menores, lâmina à esquerda, filete de latão no fechamento. Mais institucional.")}
      <div className="pt-10 bg-navy"><HomeManifesto locale="en" t={t} variant="structural" /></div>
    </div>
  );
}
