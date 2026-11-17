import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";

/**
 * Cabeçalho padrão das páginas internas: claro, alinhado à esquerda, título em tamanho contido,
 * texto de apoio e ações opcionais. Sem arte nem animação de entrada (linha "U.S. advisory").
 */
export function SimpleHeader({ eyebrow, title, intro, actions }: { eyebrow: string; title: string; intro?: string; actions?: ReactNode }) {
  return (
    <section className="border-b border-line bg-app" aria-labelledby="page-title">
      <Container className="pb-16 pt-36 sm:pb-20 sm:pt-44">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 id="page-title" className="mt-5 max-w-[22ch] font-serif text-[clamp(2.25rem,1.7rem+2vw,3.5rem)] leading-[1.1]">
          {title}
        </h1>
        {intro ? <p className="mt-6 max-w-[60ch] text-[1.125rem] leading-relaxed text-ink-2">{intro}</p> : null}
        {actions ? <div className="mt-10 flex flex-wrap items-center gap-4">{actions}</div> : null}
      </Container>
    </section>
  );
}
