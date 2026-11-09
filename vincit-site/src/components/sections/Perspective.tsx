import { CircleReveal } from "@/components/motion/CircleReveal";
import { Container } from "@/components/ui/Layout";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

/** Uma camada (mesmo layout nas duas). `dark` é a real; a clara é decorativa. */
function Layer({ t, dark }: { t: Dict; dark: boolean }) {
  const p = t.home.perspective;
  return (
    <div className="py-24 sm:py-32 lg:py-40">
      <Container>
        <p className={cn("eyebrow flex items-center gap-3", dark ? "text-brass" : "text-ink-2")}>
          <span className={cn("h-px w-6", dark ? "bg-brass" : "bg-line-rule")} aria-hidden />
          <span>{p.eyebrow}</span>
        </p>
        <h2 id={dark ? "perspective-title" : undefined} className="mt-10 max-w-[16ch] font-serif text-[clamp(2.5rem,1.4rem+4.4vw,5.5rem)] leading-[1.04] tracking-[-0.02em] lg:ml-[16.66%]">
          {p.statement}
        </h2>
        <ol className={cn("mt-24 grid gap-10 border-t pt-10 md:grid-cols-3 lg:ml-[16.66%]", dark ? "border-navy-line" : "border-line-soft")}>
          {p.principles.map((x, i) => (
            <li key={x.title}>
              <span className={cn("text-xs tabular-nums", dark ? "text-brass" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h3 mt-3">{x.title}</h3>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}

export function Perspective({ t }: { t: Dict }) {
  return (
    <CircleReveal
      labelledBy="perspective-title"
      lightClassName="bg-app text-ink"
      light={<Layer t={t} dark={false} />}
      dark={<Layer t={t} dark />}
    />
  );
}
