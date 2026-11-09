import { EditorialHero } from "@/components/sections/EditorialHero";
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
      <EditorialHero eyebrow="Vincit Capital" title={title} variant="compact" />
      <section className="bg-app py-16 sm:py-24">
        <Container narrow>
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
