import { EditorialHero } from "@/components/sections/EditorialHero";
import { OrbitArt } from "@/components/sections/PageHero";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { ValuesList } from "@/components/sections/ValuesList";
import { StoryTimeline } from "@/components/sections/StoryTimeline";
import { ManifestoVideo } from "@/components/sections/ManifestoVideo";
import { LogoMark } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

/** Sobre como manifesto: título grande, história em linha do tempo com entalhes em V, valores em tipografia. */
export function AboutView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const a = t.about;
  const m = a.manifesto;
  return (
    <>
      <EditorialHero eyebrow={a.eyebrow} title={a.title} variant="stagger" art={<OrbitArt />} />

      {/* História: linha do tempo */}
      <section className="bg-app py-20 sm:py-28" aria-label={a.eyebrow}>
        <Container>
          <StoryTimeline items={a.story} />
        </Container>
      </section>

      {/* Manifesto (vídeo oficial) + missão e visão, no mesmo capítulo grafite */}
      <section className="on-dark bg-navy py-20 text-on-dark sm:py-28" aria-labelledby="manifesto-title">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 id="manifesto-title" className="eyebrow flex items-center gap-3 text-brass">
                <span className="h-px w-6 bg-brass" aria-hidden />
                {m.eyebrow}
              </h2>
              <p className="mt-8 font-serif text-[clamp(1.625rem,1.2rem+1.4vw,2.25rem)] leading-snug">
                {m.lines.map((l) => (
                  <span key={l} className="block text-on-dark-2">{l}</span>
                ))}
                <span className="mt-3 block text-on-dark">{m.closing}</span>
              </p>
            </div>
            <div className="lg:col-span-8">
              <ManifestoVideo title={m.title} playLabel={m.play} duration={m.duration} note={m.note || undefined} captions={locale === "en"} />
            </div>
          </div>

          <div className="mt-20 grid gap-14 border-t border-navy-line pt-16 sm:mt-28 lg:grid-cols-12">
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

      <section className="border-t border-line bg-surface py-20 sm:py-28" aria-labelledby="process-full-title">
        <Container>
          <h2 id="process-full-title" className="h1 mb-14 max-w-[18ch]">{a.processTitle}</h2>
          <ProcessSteps t={t} full keyActionsLabel={a.keyActions} />
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
