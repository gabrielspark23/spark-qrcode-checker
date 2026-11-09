import { PageHero } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { FinalCta } from "@/components/sections/FinalCta";
import { BrandMark } from "@/components/brand/BrandMark";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Container, Section, SectionHeader } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

export function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const a = t.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={a.title} />

      <Section tone="light">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              {a.story.map((p, i) => (
                <p key={i} className={i === 0 ? "lead text-ink" : "text-[1.0625rem] leading-relaxed text-ink-2"}>{p}</p>
              ))}
            </div>
            <aside className="lg:col-span-4 lg:col-start-9">
              <dl className="space-y-8 border-l-2 border-brass pl-6">
                <div>
                  <dt className="eyebrow text-ink-3">{a.missionLabel}</dt>
                  <dd className="mt-2 font-serif text-xl leading-snug">{a.mission}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-ink-3">{a.visionLabel}</dt>
                  <dd className="mt-2 font-serif text-xl leading-snug">{a.vision}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </Section>

      <section className="on-dark bg-navy-soft py-20 text-on-dark sm:py-24" aria-label={a.quote}>
        <Container narrow className="text-center">
          <BrandMark className="mx-auto h-10 w-10" />
          <blockquote className="mt-8 font-serif text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] italic leading-snug">
            “{a.quote}”
          </blockquote>
        </Container>
      </section>

      <Section tone="white" labelledBy="values-title">
        <Container>
          <SectionHeader id="values-title" title={a.valuesTitle} />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v, i) => (
              <li key={v.title} className="bg-surface p-8">
                <span className="text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h3 mt-4">{v.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="light" bordered labelledBy="process-full-title">
        <Container>
          <SectionHeader id="process-full-title" title={a.processTitle} />
          <ProcessSteps t={t} full keyActionsLabel={a.keyActions} />
        </Container>
      </Section>

      <Section tone="muted" bordered labelledBy="where-title">
        <Container>
          <SectionHeader id="where-title" title={a.whereTitle} />
          <div className="grid gap-8 md:grid-cols-2">
            {a.where.map((w) => (
              <div key={w.city}>
                <ImageSlot ratio="16/9" label={t.common.photoPending.replace("4:5", "16:9")} />
                <h3 className="h3 mt-6">{w.city}</h3>
                <p className="mt-2 text-ink-2">{w.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
