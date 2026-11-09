import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { HeroComposition } from "./HeroComposition";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/** Herói: fundo claro, composição assimétrica, título editorial; legível sem JS. */
export function Hero({ locale, t }: { locale: Locale; t: Dict }) {
  const h = t.home.hero;
  const wa = whatsappHref(t.common.talkWhatsApp);
  const pt = locale === "pt";
  return (
    <section className="relative overflow-hidden bg-app" aria-labelledby="hero-title">
      {/* peça geométrica: à direita, parcialmente fora da área visível */}
      <div className="pointer-events-none absolute right-[-9rem] top-24 hidden h-[46rem] w-[46rem] lg:block xl:right-[-5rem]">
        <HeroComposition
          usLabel={pt ? "EUA · SAN DIEGO" : "U.S. · SAN DIEGO"}
          brLabel={pt ? "BRASIL" : "BRAZIL"}
          planLabel={pt ? "UM PLANO" : "ONE PLAN"}
          disciplines={h.index}
        />
      </div>

      <Container className="relative pb-14 pt-32 sm:pt-40 lg:min-h-[52rem] lg:pb-24 lg:pt-52">
        <div className="max-w-[44rem]">
          <p className="eyebrow enter flex items-center gap-3 text-ink-2">
            <span className="draw h-px w-8 bg-brass" aria-hidden />
            {h.eyebrow}
          </p>
          <h1 id="hero-title" className="display mt-8 text-[clamp(2.75rem,1.6rem+4.2vw,5.25rem)] leading-[1.02]">
            {h.titleA} <span className="italic text-ink-2">{h.titleB}</span>
          </h1>
          <p className="lead enter enter-2 mt-8 max-w-[50ch] text-ink-2">{h.subtitle}</p>
          <div className="enter enter-3 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Button href={href("contact", locale)} variant="shield" size="lg" notch="strong" event="cta_schedule_click">
              {t.nav.schedule}
            </Button>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" data-event="cta_whatsapp_click" className="link-arrow self-start sm:self-auto">
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                <span>{t.common.talkWhatsApp}</span>
              </a>
            ) : null}
          </div>
        </div>

        {/* mobile/tablet: a mesma peça, menor, abaixo do texto */}
        <div className="pointer-events-none -mx-5 mt-10 h-[22rem] sm:mx-0 sm:h-[28rem] lg:hidden">
          <HeroComposition
            usLabel={pt ? "EUA · SAN DIEGO" : "U.S. · SAN DIEGO"}
            brLabel={pt ? "BRASIL" : "BRAZIL"}
            planLabel={pt ? "UM PLANO" : "ONE PLAN"}
            disciplines={h.index}
          />
        </div>

      </Container>
    </section>
  );
}
