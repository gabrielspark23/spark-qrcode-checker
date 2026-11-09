import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Container, Section, SectionHeader } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Equipe em composição editorial tipográfica (sem retratos até haver fotos autorizadas). */
export function TeamView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const tm = t.team;
  const personLd = tm.people.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role,
    worksFor: { "@type": "Organization", name: site.name },
    sameAs: [p.linkedin],
  }));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow={tm.eyebrow} title={tm.title} intro={tm.intro} />

      <Section tone="light" labelledBy="leadership-title">
        <Container>
          <SectionHeader id="leadership-title" title={tm.leadership} />
          <ol className="border-t border-line-soft">
            {tm.people.map((p, i) => (
              <li key={p.name} className="grid gap-6 border-b border-line-soft py-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <span className="text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="h2 mt-3">{p.name}</h3>
                  <p className="eyebrow mt-3 text-ink-2">{p.role}</p>
                </div>
                <div className="lg:col-span-6 lg:col-start-6">
                  <p className="text-[1.0625rem] leading-relaxed text-ink-2">{p.bio}</p>
                  <a
                    href={p.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn — ${p.name}`}
                    className="link-arrow mt-6 text-sm"
                  >
                    <span>LinkedIn</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="muted" bordered labelledBy="network-title">
        <Container>
          <SectionHeader id="network-title" title={tm.network} intro={tm.networkIntro} />
          <ul className="grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-4">
            {tm.partners.map((p) => (
              <li key={p.name} className="bg-surface p-8">
                <h3 className="font-serif text-xl">{p.name}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <FinalCta locale={locale} t={t} />
    </>
  );
}
