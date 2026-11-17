import { Hero } from "@/components/sections/Hero";
import { Perspective } from "@/components/sections/Perspective";
import { GlobeSection } from "@/components/globe/GlobeSection";
import { GlobeStatic } from "@/components/globe/GlobeStatic";
import { Expertise } from "@/components/sections/Expertise";
import { WhoWeServeTabs } from "@/components/sections/WhoWeServeTabs";
import { PlanningLine } from "@/components/sections/PlanningLine";
import { PlatformPeople } from "@/components/sections/PlatformPeople";
import { HomeManifesto } from "@/components/sections/HomeManifesto";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

/**
 * Home como narrativa:
 * 1. O que fazemos (herói claro) → 2. o que oferecemos (módulos) → 3. para quem (painéis) →
 * 4. como trabalhamos (linha) → 5. plataforma e pessoas → 6. manifesto (vídeo) →
 * 7. curadoria financeira e 8. onde atuamos (globo), no fim por serem de contexto.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <ChapterRail chapters={t.home.chapters} label={t.home.chaptersLabel} />
      <Hero locale={locale} t={t} />
      <Expertise locale={locale} t={t} />
      <WhoWeServeTabs locale={locale} t={t} />
      <PlanningLine t={t} />
      <PlatformPeople locale={locale} t={t} />
      <HomeManifesto locale={locale} t={t} />
      <Perspective t={t} />
      <GlobeSection t={t} staticGlobe={<GlobeStatic label={t.home.globe.label} />} />
    </>
  );
}
