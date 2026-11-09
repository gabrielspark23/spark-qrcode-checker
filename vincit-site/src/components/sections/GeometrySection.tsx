import { CircleReveal } from "@/components/motion/CircleReveal";
import { geometryMarks } from "@/components/brand/Geometry";
import { Container } from "@/components/ui/Layout";
import type { Dict } from "@/content";
import { cn } from "@/lib/cn";

/** Uma das duas camadas (mesmo layout). `dark` é a camada real; a clara é decorativa. */
function GeometryContent({ t, dark }: { t: Dict; dark: boolean }) {
  const g = t.home.geometry;
  return (
    <Container>
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className={cn("eyebrow flex items-center gap-3", dark ? "text-brass" : "text-ink-2")}>
            <span className={cn("h-px w-6", dark ? "bg-brass" : "bg-line-rule")} aria-hidden />
            {g.eyebrow}
          </p>
          <h2 id={dark ? "geometry-title" : undefined} className="h1 mt-6 max-w-[14ch]">
            {g.title}
          </h2>
          <p className={cn("lead mt-6 max-w-[38ch]", dark ? "text-on-dark-2" : "text-ink-2")}>{g.intro}</p>
        </div>

        <ul className={cn("border-t lg:col-span-6 lg:col-start-7 lg:mt-24", dark ? "border-navy-line" : "border-line-soft")}>
          {g.items.map((item, i) => {
            const Mark = geometryMarks[item.shape as keyof typeof geometryMarks];
            return (
              <li
                key={item.title}
                data-step={dark ? i : undefined}
                style={{ ["--draw" as string]: `var(--d${i}, 1)` }}
                className={cn("geo-item grid grid-cols-[3.5rem_1fr] gap-6 border-b py-6 sm:grid-cols-[4.5rem_1fr] sm:py-7", dark ? "border-navy-line" : "border-line-soft")}
              >
                <Mark className="h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]" tone={dark ? "brass" : "ink"} />
                <div>
                  <p className={cn("text-xs tabular-nums", dark ? "text-on-dark-3" : "text-ink-3")}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="h3 mt-1">{item.title}</h3>
                  <p className={cn("mt-2 max-w-[44ch] text-[0.9375rem] leading-relaxed", dark ? "text-on-dark-2" : "text-ink-2")}>{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}

export function GeometrySection({ t }: { t: Dict }) {
  return (
    <CircleReveal
      labelledBy="geometry-title"
      lightClassName="bg-surface-muted text-ink"
      light={<GeometryContent t={t} dark={false} />}
      dark={<GeometryContent t={t} dark />}
    />
  );
}
