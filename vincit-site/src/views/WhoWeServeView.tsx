import { Check } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { MarkShards, type ShardFocus } from "@/components/brand/MarkShards";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { DrawOnView } from "@/components/motion/DrawOnView";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Seg = "families" | "business" | "crossborder" | "retirement";
const FOCUS: Record<Seg, ShardFocus> = { families: "shield", business: "all", crossborder: "v", retirement: "circle" };

/** Para quem: faixas largas alternadas, número grande e a composição de cada público em destaque. */
export function WhoWeServeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <PageHero eyebrow={t.serve.eyebrow} title={t.serve.title} intro={t.serve.intro} motif="none" size="statement" />
      {t.segments.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-title`}
          className={cn("scroll-mt-20 overflow-hidden py-20 sm:py-28", i % 2 ? "bg-surface-muted" : "bg-surface")}
        >
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className={cn("lg:col-span-6", i % 2 === 1 && "lg:order-2 lg:col-start-7")}>
                <p className="font-serif text-[clamp(4rem,3rem+5vw,8rem)] leading-none text-line-soft tabular-nums" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`${s.id}-title`} className="h1 -mt-4 max-w-[14ch]">{s.title}</h2>
                <p className="mt-6 max-w-[28ch] font-serif text-[1.5rem] leading-snug">{s.short}</p>
                <p className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-ink-2">{s.body}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {s.help.map((h) => (
                    <li key={h} className="flex gap-3 text-[0.9375rem]">
                      <Check className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <ModuleButton href={href("contact", locale)} event="cta_schedule_click" ariaLabel={`${t.common.talkToTeam}: ${s.title}`}>
                    {t.common.talkToTeam}
                  </ModuleButton>
                </div>
              </div>
              <DrawOnView className={cn("flex justify-center lg:col-span-5", i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
                <MarkShards focus={FOCUS[s.id as Seg]} labels={t.home.parts} className="w-72 sm:w-[24rem]" />
              </DrawOnView>
            </div>
          </Container>
        </section>
      ))}
      <FinalCta locale={locale} t={t} />
    </>
  );
}
