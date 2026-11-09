import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { BrandMark } from "@/components/brand/BrandMark";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/** Herói da Home: grafite, título serifado em 2 linhas, 1 frase, 1 botão + link WhatsApp. Legível sem JS. */
export function Hero({ locale, t }: { locale: Locale; t: Dict }) {
  const h = t.home.hero;
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-on-dark" aria-labelledby="hero-title">
      <div className="texture-lines absolute inset-0" aria-hidden />
      <BrandMark
        className="pointer-events-none absolute -right-24 top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 opacity-[0.05] lg:block"
        tone="brass"
      />
      <Container className="relative pb-16 pt-36 sm:pb-20 sm:pt-44 lg:pb-24 lg:pt-48">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow enter flex items-center gap-3 text-brass">
              <span className="draw h-px w-8 bg-brass" aria-hidden />
              {h.eyebrow}
            </p>
            <h1 id="hero-title" className="display enter enter-1 mt-8 max-w-[18ch]">
              {h.titleA} <span className="italic text-on-dark-2">{h.titleB}</span>
            </h1>
            <p className="lead enter enter-2 mt-8 max-w-[56ch] text-on-dark-2">{h.subtitle}</p>
            <div className="enter enter-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <Button href={href("contact", locale)} variant="brass" size="lg" event="cta_schedule_click">
                {t.nav.schedule}
              </Button>
              <a
                href={wa ?? href("contact", locale, "whatsapp")}
                target={wa ? "_blank" : undefined}
                rel={wa ? "noopener noreferrer" : undefined}
                data-event="cta_whatsapp_click"
                className="link-arrow self-start text-on-dark sm:self-auto"
              >
                <MessageCircle className="h-4 w-4 text-brass" strokeWidth={1.75} aria-hidden />
                <span>{t.common.talkWhatsApp}</span>
              </a>
            </div>
          </div>

          <div className="hidden lg:col-span-4 lg:block">
            <p className="eyebrow mb-4 text-on-dark-3">{h.indexLabel}</p>
            <ol className="border-t border-navy-line">
              {h.index.map((item, i) => (
                <li key={item}>
                  <a
                    href={href("services", locale, t.services[i].id)}
                    className="group flex items-baseline gap-4 border-b border-navy-line py-3 text-on-dark-2 transition-colors duration-150 hover:text-on-dark"
                  >
                    <span className="w-6 text-xs tabular-nums text-on-dark-3 transition-colors duration-150 group-hover:text-brass">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-lg">{item}</span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <dl className="mt-20 grid gap-6 border-t border-navy-line pt-8 sm:grid-cols-3">
          {h.facts.map((f) => (
            <div key={f.k}>
              <dt className="eyebrow text-on-dark-3">{f.k}</dt>
              <dd className="mt-2 text-[0.9375rem] text-on-dark">{f.v}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
