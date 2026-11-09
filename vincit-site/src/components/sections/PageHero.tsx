import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";

/** Cabeçalho das páginas internas: faixa grafite com H1 único. */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-on-dark" aria-labelledby="page-title">
      <div className="texture-lines absolute inset-0" aria-hidden />
      <Container className="relative pb-16 pt-36 sm:pb-20 sm:pt-44">
        <Eyebrow onDark className="enter">{eyebrow}</Eyebrow>
        <h1 id="page-title" className="h1 enter enter-1 mt-6 max-w-[22ch]">{title}</h1>
        {intro ? <p className="lead enter enter-2 mt-6 max-w-[60ch] text-on-dark-2">{intro}</p> : null}
        {children ? <div className="enter enter-3 mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
