import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { ServicesIndex } from "@/components/sections/ServicesIndex";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

/** Serviços como catálogo: cabeçalho grafite com as seis frentes num círculo + índice lateral fixo. */
export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const p = t.servicesPage;
  return (
    <>
      <PageHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} tone="dark" motif="ring" />

      <section className="bg-app py-16 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <ServicesIndex items={t.services.map((s) => ({ id: s.id, title: s.title, brand: s.brand }))} label={p.indexLabel} />
            </aside>
            <div className="lg:col-span-9">
              {t.services.map((s, i) => {
                return (
                  <article key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="svc-trigger scroll-mt-28 border-t border-line-soft py-14 first:border-t-0 first:pt-0 sm:py-20">
                    <div className="flex items-center justify-between gap-6">
                      <p className="eyebrow text-ink-3">
                        {String(i + 1).padStart(2, "0")} / 06 · {s.brand}
                      </p>
                      <ServiceIcon id={s.id} className="-m-2.5" />
                    </div>
                    <h2 id={`${s.id}-title`} className="mt-6 font-serif text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-[1.05]">{s.title}</h2>
                    <p className="lead mt-6 max-w-[60ch] text-ink-2">{s.body}</p>
                    <div className="mt-10 grid gap-10 sm:grid-cols-2">
                      <div>
                        <h3 className="eyebrow border-b border-line-soft pb-3 font-sans text-ink-2">{t.common.typicalSituations}</h3>
                        <ul className="mt-5 space-y-4">
                          {s.situations.map((x) => (
                            <li key={x} className="border-l-2 border-line pl-4 text-[0.9375rem] leading-relaxed text-ink-2">{x}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="eyebrow border-b border-line-soft pb-3 font-sans text-ink-2">{t.common.whatWeDo}</h3>
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
                    <div className="mt-10">
                      <ModuleButton href={href("contact", locale)} event="cta_schedule_click" ariaLabel={`${t.common.talkToTeam}: ${s.title}`}>
                        {t.common.talkToTeam}
                      </ModuleButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
