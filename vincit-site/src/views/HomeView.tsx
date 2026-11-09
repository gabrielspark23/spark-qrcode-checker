import { Hero } from "@/components/sections/Hero";
import { WhoWeAre } from "@/components/sections/WhoWeAre";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { SegmentCards } from "@/components/sections/SegmentCards";
import { CustodyBand } from "@/components/sections/CustodyBand";
import { TechBlock } from "@/components/sections/TechBlock";
import { FinalCtaConverge } from "@/components/sections/FinalCtaConverge";
import { GeometrySection } from "@/components/sections/GeometrySection";
import { Container, Section, SectionHeader } from "@/components/ui/Layout";
import { LinkArrow } from "@/components/ui/Button";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";

export function HomeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <Hero locale={locale} t={t} />
      <WhoWeAre locale={locale} t={t} />
      <ServicesGrid locale={locale} t={t} />
      <GeometrySection t={t} />
      <Section tone="white" labelledBy="process-title">
        <Container>
          <SectionHeader
            id="process-title"
            eyebrow={t.home.process.eyebrow}
            title={t.home.process.title}
            aside={<LinkArrow href={href("about", locale)}>{t.common.aboutUs}</LinkArrow>}
          />
          <ProcessSteps t={t} />
        </Container>
      </Section>
      <Section tone="light" labelledBy="serve-title">
        <Container>
          <SectionHeader
            id="serve-title"
            eyebrow={t.home.serve.eyebrow}
            title={t.home.serve.title}
            aside={<LinkArrow href={href("whoWeServe", locale)}>{t.common.seeWhoWeServe}</LinkArrow>}
          />
          <SegmentCards locale={locale} t={t} />
        </Container>
      </Section>
      <CustodyBand t={t} />
      <TechBlock t={t} />
      <FinalCtaConverge locale={locale} t={t} />
    </>
  );
}
