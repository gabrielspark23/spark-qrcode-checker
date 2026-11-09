import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { HeroPhoto } from "./HeroPhoto";
import { href, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/site";
import type { Dict } from "@/content";

/**
 * Herói editorial: fundo pedra, título serifado à esquerda e, em contraponto, a frase de posicionamento
 * e o convite à direita, alinhados à base do título. Abaixo, uma fotografia larga que começa no alinhamento
 * do texto e sangra até a borda direita da tela — a imagem continua a composição, não fica numa coluna à parte.
 * A geometria da marca aparece só no detalhe: o filete de latão e o V do botão.
 */
export function Hero({ locale, t }: { locale: Locale; t: Dict }) {
  const h = t.home.hero;
  const wa = whatsappHref(t.common.talkWhatsApp);
  return (
    <section className="relative overflow-hidden bg-app" aria-labelledby="hero-title">
      <Container className="relative pt-28 sm:pt-36 lg:pt-36">
        <p className="eyebrow enter flex items-center gap-3 text-ink-3">
          <span className="draw h-px w-8 bg-brass" aria-hidden />
          {h.eyebrow}
        </p>

        <div className="mt-6 grid gap-7 sm:mt-8 sm:gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1
            id="hero-title"
            className="display hero-title text-[clamp(2.25rem,1.5rem+3.2vw,4.5rem)] leading-[1.04] lg:col-span-8"
          >
            <span className="block">{h.titleA}</span>{" "}
            <span className="block text-ink-2">{h.titleB}</span>
          </h1>

          <div className="enter enter-2 lg:col-span-4 lg:pb-2">
            <p className="max-w-[38ch] text-base leading-relaxed text-ink-2 sm:text-[1.0625rem]">{h.subtitle}</p>
            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
              <Button href={href("contact", locale)} variant="shield" notch="strong" event="cta_schedule_click">
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
        </div>
      </Container>

      {/* fotografia: alinhada ao texto à esquerda, sangra até a borda direita */}
      <div className="mt-10 sm:mt-14 lg:mt-16">
        <div className="hero-photo-wrap">
          <HeroPhoto alt={h.photoAlt} />
        </div>
      </div>
    </section>
  );
}
