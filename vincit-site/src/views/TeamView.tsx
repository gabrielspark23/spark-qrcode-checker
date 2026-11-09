import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Container, DraftNote, Section, SectionHeader } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

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
          <ul className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
            {tm.people.map((p) => (
              <li key={p.name} className="flex flex-col">
                <ImageSlot ratio="4/5" label={t.common.photoPending} />
                <h3 className="h3 mt-6">{p.name}</h3>
                <p className="eyebrow mt-2 text-ink-3">{p.role}</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{p.bio}</p>
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-arrow mt-auto self-start pt-5 text-sm"
                  aria-label={`LinkedIn — ${p.name}`}
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="white" bordered labelledBy="advisory-title">
        <Container>
          <SectionHeader id="advisory-title" title={tm.advisory} />
          <DraftNote code="D7">{tm.advisoryNote}</DraftNote>
        </Container>
      </Section>

      <Section tone="muted" bordered labelledBy="network-title">
        <Container>
          <SectionHeader id="network-title" title={tm.network} intro={tm.networkIntro} />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
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
