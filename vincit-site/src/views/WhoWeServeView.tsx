import { Check } from "lucide-react";
import { EditorialHero } from "@/components/sections/EditorialHero";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";


/** Para quem: faixas largas alternadas, número grande e a composição de cada público em destaque. */
export function WhoWeServeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <EditorialHero
        eyebrow={t.serve.eyebrow}
        title={t.serve.title}
        intro={t.serve.intro}
        aside={
          <ol className="border-t border-line-soft">
            {t.segments.map((s, i) => (
              <li key={s.id} className="border-b border-line-soft">
                <a href={`#${s.id}`} className="ed-index flex items-baseline gap-4 py-3 text-[0.9375rem]">
                  <span className="text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        }
      />
      {t.segments.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          aria-labelledby={`${s.id}-title`}
          className={cn("scroll-mt-20 overflow-hidden py-20 sm:py-28", i % 2 ? "bg-surface-muted" : "bg-surface")}
        >
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className={cn("lg:col-span-9", i % 2 === 1 && "lg:col-start-4")}>
                <p className="mb-3 font-serif text-[clamp(4rem,3rem+5vw,8rem)] leading-none text-line-soft tabular-nums sm:mb-0" aria-hidden>
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
            </div>
          </Container>
        </section>
      ))}
    </>
  );
}
