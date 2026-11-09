import { ServicesChapters } from "@/components/sections/ServicesChapters";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

/**
 * Serviços — página tipográfica: abertura editorial clara, faixa grafite com os seis capítulos e os capítulos
 * em grade com filetes. Nenhuma foto por serviço; o impacto vem da tipografia, das proporções e do ritmo.
 */
export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const p = t.servicesPage;
  return (
    <>
      <section className="bg-app pb-16 pt-32 sm:pb-24 sm:pt-44" aria-labelledby="page-title">
        <Container>
          <p className="eyebrow enter flex items-center gap-3 text-ink-3">
            <span className="draw h-px w-8 bg-brass" aria-hidden />
            {p.eyebrow}
          </p>
          <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 id="page-title" className="display text-[clamp(3rem,1.6rem+5vw,6.5rem)] leading-[0.98] lg:col-span-8">
              {p.title}
            </h1>
            <p className="enter enter-2 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-4 lg:pb-4">{p.intro}</p>
          </div>
        </Container>
      </section>

      <ServicesChapters
        services={t.services.map(({ id, brand, title, short, body, situations, whatWeDo }) => ({ id, brand, title, short, body, situations, whatWeDo }))}
        labels={{
          service: p.serviceLabel,
          overview: p.overviewLabel,
          situations: t.common.typicalSituations,
          whatWeDo: t.common.whatWeDo,
          expand: p.expand,
          collapse: p.collapse,
          talk: t.common.talkToTeam,
          index: p.indexLabel,
          contactHref: href("contact", locale),
        }}
      />
    </>
  );
}
