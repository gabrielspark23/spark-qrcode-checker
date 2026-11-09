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
 * 1. O que fazemos (herói claro) → 2. como pensamos (reveal circular para grafite) →
 * 3. onde atuamos (globo BR–EUA, ainda em grafite) → 4. o que oferecemos (módulos) →
 * 5. para quem (painéis) → 6. como trabalhamos (linha) → 7. plataforma e pessoas → 8. manifesto (vídeo), sobre o fundo claro.
 */
export function HomeView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  return (
    <>
      <ChapterRail chapters={t.home.chapters} label={t.home.chaptersLabel} />
      <Hero locale={locale} t={t} />
      <Perspective t={t} />
      <GlobeSection t={t} staticGlobe={<GlobeStatic label={t.home.globe.label} />} />
      <Expertise locale={locale} t={t} />
      <WhoWeServeTabs locale={locale} t={t} />
      <PlanningLine t={t} />
      <PlatformPeople locale={locale} t={t} />
      <HomeManifesto locale={locale} t={t} />
    </>
  );
}
