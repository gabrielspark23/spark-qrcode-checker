import { ServicesChapters } from "@/components/sections/ServicesChapters";
import { EditorialHero } from "@/components/sections/EditorialHero";
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
      <EditorialHero eyebrow={p.eyebrow} title={p.title} intro={p.intro} />

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
