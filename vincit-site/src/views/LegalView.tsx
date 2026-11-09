import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import type { Locale } from "@/lib/i18n";

export function LegalView({ locale, kind }: { locale: Locale; kind: "disclosures" | "privacy" }) {
  const t = getDict(locale);
  const l = t.legal;
  const sections = kind === "disclosures" ? l.disclosureSections : l.privacySections;
  const title = kind === "disclosures" ? l.disclosuresTitle : l.privacyTitle;
  return (
    <>
      <PageHero eyebrow="Vincit Capital" title={title} />
      <section className="bg-app py-16 sm:py-24">
        <Container narrow>
          <div className="mb-12 border-l-2 border-danger bg-surface p-6">
            <p className="font-semibold">{l.pendingTitle}</p>
            <p className="mt-2 text-[0.9375rem] text-ink-2">{l.pendingBody}</p>
          </div>
          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title} className="border-t border-line pt-8">
                <h2 className="h3">{s.title}</h2>
                <p className="measure mt-3 text-[1.0625rem] leading-relaxed text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
          {l.englishPrevails ? <p className="mt-12 text-sm italic text-ink-3">{l.englishPrevails}</p> : null}
        </Container>
      </section>
    </>
  );
}
