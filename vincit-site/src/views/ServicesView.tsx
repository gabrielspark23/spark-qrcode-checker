import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { serviceIcons } from "@/components/sections/icons";
import { Button } from "@/components/ui/Button";
import { Container, DraftNote } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const p = t.servicesPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro}>
        <nav aria-label={p.indexLabel}>
          <ul className="flex flex-wrap gap-2">
            {t.services.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-10 items-center rounded-[2px] border border-[#5b5f69] px-4 text-sm text-on-dark-2 transition-colors duration-150 hover:border-brass hover:text-on-dark"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>

      <div className="bg-app">
        {t.services.map((s, i) => {
          const Icon = serviceIcons[s.id];
          return (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className={i % 2 ? "border-t border-line bg-surface py-20 sm:py-24" : "border-t border-line py-20 sm:py-24"}
            >
              <Container>
                <div className="grid gap-12 lg:grid-cols-12">
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <Icon className="h-8 w-8 text-ink" strokeWidth={1.25} aria-hidden />
                      <span className="text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")} / 06</span>
                    </div>
                    <p className="eyebrow mt-8 text-ink-3">{s.brand}</p>
                    <h2 id={`${s.id}-title`} className="h2 mt-3">{s.title}</h2>
                    <span className="rule-brass mt-6" aria-hidden />
                    <p className="lead mt-6 text-ink-2">{s.body}</p>
                    {s.draftNote ? <DraftNote className="mt-6" code="D1">{s.draftNote}</DraftNote> : null}
                    <div className="mt-10">
                      <Button href={href("contact", locale)} variant="secondary" event="cta_schedule_click">
                        {t.common.talkToTeam}
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                    <div>
                      <h3 className="eyebrow border-b border-line pb-3 font-sans text-ink-2">{t.common.typicalSituations}</h3>
                      <ul className="mt-5 space-y-4">
                        {s.situations.map((x) => (
                          <li key={x} className="border-l-2 border-line pl-4 text-[0.9375rem] leading-relaxed text-ink-2">{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="eyebrow border-b border-line pb-3 font-sans text-ink-2">{t.common.whatWeDo}</h3>
                      <ul className="mt-5 space-y-4">
                        {s.whatWeDo.map((x) => (
                          <li key={x} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                            <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                            {x}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Container>
            </section>
          );
        })}
      </div>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
