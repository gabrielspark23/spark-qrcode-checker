import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { SegmentComposition } from "@/components/sections/SegmentComposition";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function WhoWeServeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.serve.eyebrow} title={t.serve.title} intro={t.serve.intro} />
      <div className="bg-app">
        {t.segments.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="border-t border-line py-20 sm:py-24">
            <Container>
              <div className="grid items-center gap-12 lg:grid-cols-12">
                <div className={cn("lg:col-span-5", i % 2 === 1 && "lg:order-2 lg:col-start-8")}>
                  <div className="flex aspect-square items-center justify-center border border-line bg-surface">
                    <SegmentComposition segment={s.id as "families" | "business" | "crossborder" | "retirement"} className="h-4/5 w-4/5" />
                  </div>
                </div>
                <div className={cn("lg:col-span-6", i % 2 ? "lg:order-1" : "lg:col-start-7")}>
                  <p className="text-sm tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</p>
                  <h2 id={`${s.id}-title`} className="h2 mt-3">{s.title}</h2>
                  <span className="rule-brass mt-6" aria-hidden />
                  <p className="lead mt-6 text-ink-2">{s.body}</p>
                  <h3 className="eyebrow mt-10 font-sans text-ink-3">{t.common.weHelpWith}</h3>
                  <ul className="mt-4 space-y-3">
                    {s.help.map((h) => (
                      <li key={h} className="flex gap-3 text-[0.9375rem]">
                        <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10">
                    <ModuleButton href={href("contact", locale)} event="cta_schedule_click">
                      {t.common.talkToTeam}
                    </ModuleButton>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
