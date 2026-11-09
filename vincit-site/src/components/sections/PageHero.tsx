import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { ShieldLine, VLines } from "@/components/brand/Shapes";
import { cn } from "@/lib/cn";

/**
 * Cabeçalho das páginas internas. Cada página escolhe tom e motivo, para que não sigam
 * todas o mesmo molde — mas todos os motivos vêm da mesma geometria da marca.
 * - v: círculo + escudo + V (padrão) · ring: as seis frentes num círculo (Serviços)
 * - shield: escudo com o V interno (Equipe) · orbit: círculos deslocados (Sobre)
 */
type Motif = "v" | "ring" | "shield" | "orbit" | "none";

function MotifArt({ motif, dark }: { motif: Motif; dark: boolean }) {
  const ink = dark ? "var(--text-on-dark)" : "var(--text-primary)";
  if (motif === "none") return null;
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      className="enter-draw pointer-events-none absolute -right-40 top-8 hidden h-[32rem] w-[32rem] md:block lg:-right-20"
      aria-hidden
    >
      {motif === "v" ? (
        <>
          <circle className="draw-line" pathLength={1} cx="280" cy="250" r="200" stroke="var(--color-gold)" strokeOpacity="0.7" transform="rotate(-110 280 250)" />
          <ShieldLine x={130} y={70} width={260} stroke={ink} opacity={0.18} className="draw-line d2" />
          <VLines ax={260} ay={372} h={270} stroke={ink} opacity={0.35} className="draw-line d3" />
          <circle className="fade-node" cx="260" cy="372" r="5" fill="var(--color-gold)" />
        </>
      ) : null}
      {motif === "ring" ? (
        <>
          <circle className="draw-line" pathLength={1} cx="270" cy="260" r="200" stroke="var(--color-gold)" strokeOpacity="0.75" transform="rotate(-90 270 260)" />
          <circle className="draw-line d2" pathLength={1} cx="292" cy="246" r="200" stroke={ink} strokeOpacity="0.14" />
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (-90 + i * 60) * (Math.PI / 180);
            const x = 270 + 200 * Math.cos(a), y = 260 + 200 * Math.sin(a);
            return (
              <g key={i} className="fade-node">
                <line x1={x} y1={y} x2="270" y2="260" stroke={ink} strokeOpacity="0.12" />
                <circle cx={x} cy={y} r="5" fill={dark ? "var(--color-navy)" : "var(--bg-app)"} stroke="var(--color-gold)" strokeWidth="1.25" />
              </g>
            );
          })}
          <circle className="fade-node" cx="270" cy="260" r="6" fill="var(--color-gold)" />
        </>
      ) : null}
      {motif === "shield" ? (
        <>
          <ShieldLine x={110} y={40} width={330} stroke="var(--color-gold)" opacity={0.75} className="draw-line" />
          <ShieldLine x={150} y={86} width={250} stroke={ink} opacity={0.16} className="draw-line d2" />
          <VLines ax={275} ay={330} h={200} stroke={ink} opacity={0.4} className="draw-line d3" />
          <circle className="fade-node" cx="275" cy="330" r="5" fill="var(--color-gold)" />
        </>
      ) : null}
      {motif === "orbit" ? (
        <>
          {/* órbita viva: os círculos deslocados giram devagar em torno do centro do anel de latão
              (sentidos opostos), e um ponto de latão percorre o anel. Parado com movimento reduzido. */}
          <circle className="draw-line" pathLength={1} cx="250" cy="260" r="210" stroke="var(--color-gold)" strokeOpacity="0.7" transform="rotate(-120 250 260)" />
          <g className="orbit-spin orbit-a">
            <circle className="draw-line d2" pathLength={1} cx="290" cy="240" r="170" stroke={ink} strokeOpacity="0.22" />
            <circle className="fade-node" cx="290" cy="70" r="3" fill={ink} fillOpacity="0.35" />
          </g>
          <g className="orbit-spin orbit-b">
            <circle className="draw-line d3" pathLength={1} cx="320" cy="225" r="120" stroke={ink} strokeOpacity="0.14" />
          </g>
          <g className="orbit-spin orbit-dot">
            <circle className="fade-node" cx="250" cy="50" r="5" fill="var(--color-gold)" />
            <circle className="orbit-halo" cx="250" cy="50" r="5" stroke="var(--color-gold)" />
          </g>
        </>
      ) : null}
    </svg>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  tone = "light",
  motif = "v",
  size = "default",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
  tone?: "light" | "dark";
  motif?: Motif;
  size?: "default" | "statement";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={cn("relative overflow-hidden border-b", dark ? "on-dark border-navy-line bg-navy text-on-dark" : "border-line bg-app")}
      aria-labelledby="page-title"
    >
      <MotifArt motif={motif} dark={dark} />
      <Container className={cn("relative pt-36 sm:pt-44", size === "statement" ? "pb-24 sm:pb-32" : "pb-16 sm:pb-20")}>
        <Eyebrow onDark={dark} className="enter">{eyebrow}</Eyebrow>
        <h1
          id="page-title"
          className={cn(
            "mt-6",
            size === "statement"
              ? "display max-w-[16ch] text-[clamp(2.75rem,1.4rem+5vw,6rem)] leading-[1.02]"
              : "h1 max-w-[20ch] text-[clamp(2.5rem,1.8rem+2.6vw,4rem)]",
          )}
        >
          {title}
        </h1>
        {intro ? <p className={cn("lead enter enter-2 mt-6 max-w-[56ch]", dark ? "text-on-dark-2" : "text-ink-2")}>{intro}</p> : null}
        {children ? <div className="enter enter-3 mt-10">{children}</div> : null}
      </Container>
    </section>
  );
}
