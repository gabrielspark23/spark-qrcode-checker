import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import type { Dict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

/** Faixa final de chamada, igual em todas as páginas internas. */
export function CtaBand({ locale, t }: { locale: Locale; t: Dict }) {
  const f = t.home.final;
  return (
    <section className="on-dark bg-navy py-20 text-on-dark sm:py-24" aria-labelledby="cta-band-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 id="cta-band-title" className="max-w-[24ch] font-serif text-[clamp(1.75rem,1.4rem+1.4vw,2.5rem)] leading-tight">{f.title}</h2>
            <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-on-dark-2">{f.body}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button href={href("contact", locale)} variant="brass" event="cta_schedule_click">{t.nav.schedule}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
