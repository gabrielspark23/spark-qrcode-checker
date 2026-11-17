import { CtaBand } from "@/components/sections/CtaBand";
import { SimpleHeader } from "@/components/sections/SimpleHeader";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

/** Quem somos, em leitura direta: história (com o que valorizamos/acreditamos) e valores. Onde estamos fica no globo da Home. */
export function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const a = t.about;
  return (
    <>
      <SimpleHeader eyebrow={a.eyebrow} title={a.title} />

      {/* História + o que valorizamos / no que acreditamos */}
      <section className="bg-app py-16 sm:py-24" aria-labelledby="story-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 id="story-title" className="font-serif text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)] leading-tight lg:col-span-4">{a.storyTitle}</h2>
            <div className="lg:col-span-8">
              <div className="space-y-5">
                {a.story.map((p, i) => (
                  <p key={p} className={i === 0 ? "font-serif text-[1.5rem] leading-snug" : "text-[1.0625rem] leading-relaxed text-ink-2"}>{p}</p>
                ))}
              </div>
              <dl className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-2">
                {[
                  [a.missionLabel, a.mission],
                  [a.visionLabel, a.vision],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="eyebrow text-ink-3">{k}</dt>
                    <dd className="mt-3 text-[1.0625rem] leading-relaxed">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="border-t border-line bg-surface py-16 sm:py-24" aria-labelledby="values-title">
        <Container>
          <h2 id="values-title" className="font-serif text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)] leading-tight">{a.valuesTitle}</h2>
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((v) => (
              <li key={v.title} className="border-t-2 border-brass pt-6">
                <h3 className="font-serif text-[1.5rem]">{v.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{v.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand locale={locale} t={t} />
    </>
  );
}
