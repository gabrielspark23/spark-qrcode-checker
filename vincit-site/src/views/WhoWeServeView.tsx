import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { SimpleHeader } from "@/components/sections/SimpleHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

/** Para quem: cabeçalho simples e os perfis em cartões lado a lado. */
export function WhoWeServeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const contact = href("contact", locale);
  return (
    <>
      <SimpleHeader
        eyebrow={t.serve.eyebrow}
        title={t.serve.title}
        intro={t.serve.intro}
        actions={<Button href={contact} event="cta_schedule_click">{t.nav.schedule}</Button>}
      />
      <section className="bg-app py-16 sm:py-24" aria-label={t.serve.eyebrow}>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {t.segments.map((s) => (
              <article key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="flex scroll-mt-24 flex-col border border-line bg-surface p-8 sm:p-10">
                <span className="block h-px w-8 bg-brass" aria-hidden />
                <h2 id={`${s.id}-title`} className="mt-5 font-serif text-[1.875rem] leading-tight">{s.title}</h2>
                <p className="mt-3 text-[1.0625rem] font-medium leading-snug">{s.short}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line-soft pt-6">
                  {s.help.map((h) => (
                    <li key={h} className="flex gap-3 text-[0.9375rem]">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brass" strokeWidth={2} aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
                <Link href={contact} className="link-arrow mt-auto self-start pt-8 text-sm font-semibold" data-event="cta_schedule_click" aria-label={`${t.common.talkToTeam}: ${s.title}`}>
                  <span>{t.common.talkToTeam}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand locale={locale} t={t} />
    </>
  );
}
