import { Check, Clock } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { Container, Section, SectionHeader } from "@/components/ui/Layout";
import type { Dict } from "@/content";

/** "Tecnologia": presente só para o que existe; captura em moldura (a receber, aprovada pelo Pedro). */
export function TechBlock({ t }: { t: Dict }) {
  const k = t.home.tech;
  return (
    <Section tone="muted" labelledBy="tech-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeader id="tech-title" eyebrow={k.eyebrow} title={k.title} intro={k.body} />
            <div className="-mt-4 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-ink-3">{k.now}</p>
                <ul className="mt-3 space-y-2">
                  {k.nowItems.map((i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-success" strokeWidth={1.75} aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-ink-3">{k.next}</p>
                <ul className="mt-3 space-y-2">
                  {k.nextItems.map((i) => (
                    <li key={i} className="flex gap-3 text-[0.9375rem] text-ink-2">
                      <Clock className="mt-1 h-4 w-4 shrink-0 text-ink-3" strokeWidth={1.5} aria-hidden />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <figure className="m-0 lg:col-span-7">
            <div className="on-dark border border-navy-line bg-navy p-2">
              <div className="flex items-center gap-1.5 px-2 pb-2 pt-1" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-navy-line" />
                <span className="h-2 w-2 rounded-full bg-navy-line" />
                <span className="h-2 w-2 rounded-full bg-navy-line" />
              </div>
              <div
                role="img"
                aria-label={k.caption}
                className="relative flex aspect-[16/10] flex-col items-center justify-center gap-4 border border-navy-line bg-navy-soft"
              >
                <div className="texture-lines absolute inset-0" aria-hidden />
                <BrandMark className="relative h-12 w-12" />
                <span className="relative text-xs tracking-wide text-on-dark-3">Vincit OS</span>
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-ink-3">{k.caption}</figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
