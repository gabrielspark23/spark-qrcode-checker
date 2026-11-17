import { EditorialHero } from "@/components/sections/EditorialHero";
import { OrbitArt } from "@/components/sections/PageHero";
import { ValuesList } from "@/components/sections/ValuesList";
import { StoryTimeline } from "@/components/sections/StoryTimeline";
import { LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

/** Sobre como manifesto: título grande, história em linha do tempo com entalhes em V, valores em tipografia. */
export function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const a = t.about;
  return (
    <>
      <EditorialHero eyebrow={a.eyebrow} title={a.title} variant="stagger" art={<OrbitArt />} />

      {/* História: linha do tempo */}
      <section className="bg-app py-20 sm:py-28" aria-label={a.eyebrow}>
        <Container>
          <StoryTimeline items={a.story} />
        </Container>
      </section>

      {/* O que valorizamos e no que acreditamos (o manifesto em vídeo volta quando houver versão em inglês) */}
      <section className="on-dark bg-navy py-20 text-on-dark sm:py-28" aria-label={a.missionLabel}>
        <Container>
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="flex lg:col-span-2">
              <LogoMark className="h-16 w-auto" />
            </div>
            <dl className="grid gap-12 sm:grid-cols-2 lg:col-span-9 lg:col-start-4">
              <div>
                <dt className="eyebrow text-brass">{a.missionLabel}</dt>
                <dd className="mt-4 font-serif text-[1.75rem] leading-snug">{a.mission}</dd>
              </div>
              <div>
                <dt className="eyebrow text-brass">{a.visionLabel}</dt>
                <dd className="mt-4 font-serif text-[1.75rem] leading-snug">{a.vision}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      {/* Valores em tipografia grande */}
      <section className="bg-app py-20 sm:py-28" aria-labelledby="values-title">
        <Container>
          <h2 id="values-title" className="eyebrow text-ink-3">{a.valuesTitle}</h2>
          <ValuesList values={t.values} />
        </Container>
      </section>


      <section className="where-map relative overflow-hidden border-t border-line bg-surface-muted py-20 sm:py-24" aria-labelledby="where-title">
        {/* mapa pontilhado das Américas (mesmos dados do globo), no tom do fundo, com as três praças em latão */}
        <span className="where-map-bg" aria-hidden />
        <Container className="relative">
          <h2 id="where-title" className="h2">{a.whereTitle}</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {t.home.globe.locations.map((l) => (
              <li key={l.id} className="border-t-2 border-brass pt-6">
                <h3 className="font-serif text-2xl">{l.name}</h3>
                <p className="mt-2 text-ink-2">{l.role}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
