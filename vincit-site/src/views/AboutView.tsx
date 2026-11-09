import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

/** Sobre como manifesto: título grande, história em linha do tempo com entalhes em V, valores em tipografia. */
export function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const a = t.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} motif="orbit" size="statement" />

      {/* História: linha do tempo */}
      <section className="bg-app py-20 sm:py-28" aria-label={a.eyebrow}>
        <Container>
          <ol className="relative grid gap-14 lg:ml-[16.66%] lg:max-w-3xl">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-line-soft" aria-hidden />
            {a.story.map((p, i) => (
              <li key={i} className="relative pl-12">
                <svg className="absolute left-0 top-1.5 h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M1.5 2 8 14 14.5 2" stroke="var(--color-gold)" strokeWidth="1.5" />
                </svg>
                <p className={i === 0 ? "font-serif text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-snug" : "text-[1.0625rem] leading-relaxed text-ink-2"}>{p}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Missão e visão */}
      <section className="on-dark bg-navy py-20 text-on-dark sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="flex lg:col-span-2">
              <LogoMark className="h-16 w-auto" />
            </div>
            <dl className="grid gap-12 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
              <div>
                <dt className="eyebrow text-brass">{a.missionLabel}</dt>
                <dd className="mt-4 font-serif text-[1.75rem] leading-snug">{a.mission}</dd>
              </div>
              <div>
                <dt className="eyebrow text-brass">{a.visionLabel}</dt>
                <dd className="mt-4 font-serif text-[1.75rem] leading-snug">{a.vision}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* Valores em tipografia grande */}
      <section className="bg-app py-20 sm:py-28" aria-labelledby="values-title">
        <Container>
          <h2 id="values-title" className="eyebrow text-ink-3">{a.valuesTitle}</h2>
          <ul className="mt-8 border-t border-line-soft">
            {t.values.map((v, i) => (
              <li key={v.title} className="grid items-baseline gap-4 border-b border-line-soft py-8 md:grid-cols-12">
                <span className="text-xs tabular-nums text-ink-3 md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] leading-none md:col-span-6">{v.title}</h3>
                <p className="text-[1.0625rem] text-ink-2 md:col-span-5">{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-20 sm:py-28" aria-labelledby="process-full-title">
        <Container>
          <h2 id="process-full-title" className="h1 mb-14 max-w-[18ch]">{a.processTitle}</h2>
          <ProcessSteps t={t} full keyActionsLabel={a.keyActions} />
        </Container>
      </section>

      <section className="border-t border-line bg-surface-muted py-20 sm:py-24" aria-labelledby="where-title">
        <Container>
          <h2 id="where-title" className="h2">{a.whereTitle}</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {t.home.globe.locations.map((l) => (
              <li key={l.id} className="border-t-2 border-brass pt-6">
                <h3 className="font-serif text-2xl">{l.name}</h3>
                <p className="mt-2 text-ink-2">{l.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
