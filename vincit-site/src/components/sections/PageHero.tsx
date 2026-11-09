import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ShieldLine, VLines } from "@/components/brand/Shapes";

/**
 * Cabeçalho das páginas internas: claro e objetivo, com um fragmento da geometria do herói
 * (círculo deslocado, V a 66° e escudo) cortado pela borda direita. Um H1 por página.
 */
export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-app" aria-labelledby="page-title">
      <svg
        viewBox="0 0 520 520"
        fill="none"
        className="enter-draw pointer-events-none absolute -right-40 top-10 hidden h-[30rem] w-[30rem] md:block lg:-right-24"
        aria-hidden
      >
        <circle className="draw-line" pathLength={1} cx="280" cy="250" r="200" stroke="var(--color-gold)" strokeOpacity="0.7" transform="rotate(-110 280 250)" />
        <ShieldLine x={130} y={70} width={260} stroke="var(--text-primary)" opacity={0.18} className="draw-line d2" />
        <VLines ax={260} ay={372} h={270} stroke="var(--text-primary)" opacity={0.35} className="draw-line d3" />
        <circle className="fade-node" cx="260" cy="372" r="5" fill="var(--color-gold)" />
      </svg>
      <Container className="relative pb-16 pt-36 sm:pb-20 sm:pt-44">
        <Eyebrow className="enter">{eyebrow}</Eyebrow>
        <h1 id="page-title" className="h1 enter enter-1 mt-6 max-w-[20ch] text-[clamp(2.5rem,1.8rem+2.6vw,4rem)]">{title}</h1>
        {intro ? <p className="lead enter enter-2 mt-6 max-w-[56ch] text-ink-2">{intro}</p> : null}
        {children ? <div className="enter enter-3 mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
