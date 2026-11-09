import { Container, Eyebrow, Rich } from "@/components/ui/Layout";
import { LinkArrow } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

/** Faixa "Who we are": grafite-suave, 4 a 5 linhas, palavras-chave em destaque. */
export function WhoWeAre({ locale, t }: { locale: Locale; t: Dict }) {
  return (
    <section className="on-dark border-t border-navy-line bg-navy-soft py-20 text-on-dark sm:py-28" aria-labelledby="who-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Eyebrow onDark>
              <span id="who-title">{t.home.who.eyebrow}</span>
            </Eyebrow>
          </div>
          <div className="lg:col-span-9">
            <p className="font-serif text-[clamp(1.5rem,1.2rem+1.3vw,2.25rem)] leading-[1.35] text-on-dark-2">
              <Rich text={t.home.who.body} strongClass="text-on-dark" />
            </p>
            <LinkArrow href={href("about", locale)} className="mt-10 text-on-dark">
              {t.common.aboutUs}
            </LinkArrow>
          </div>
        </div>
      </Container>
    </section>
  );
}
