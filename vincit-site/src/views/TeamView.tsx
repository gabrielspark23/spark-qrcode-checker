import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { CtaBand } from "@/components/sections/CtaBand";
import { SimpleHeader } from "@/components/sections/SimpleHeader";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Equipe: cabeçalho simples, foto do escritório (a mesma de vincitfinancial.com) e a liderança em cartões. */
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
      <SimpleHeader eyebrow={tm.eyebrow} title={tm.title} intro={tm.intro} />

      <section className="bg-app pt-16 sm:pt-20" aria-hidden>
        <Container>
          <div className="relative aspect-[16/6] overflow-hidden">
            <Image src="/images/team-office.webp" alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover object-[35%_center]" />
          </div>
        </Container>
      </section>

      <section className="bg-app py-16 sm:py-24" aria-labelledby="leadership-title">
        <Container>
          <h2 id="leadership-title" className="font-serif text-[clamp(1.875rem,1.5rem+1.2vw,2.5rem)] leading-tight">{tm.leadership}</h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-2">
            {tm.people.map((p) => (
              <li key={p.name} className="flex flex-col border border-line bg-surface p-8 sm:p-10">
                <h3 className="font-serif text-[1.75rem] leading-tight">{p.name}</h3>
                <p className="eyebrow mt-2 text-ink-3">{p.role}</p>
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-2">{p.bio}</p>
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn — ${p.name}`} className="link-arrow mt-auto self-start pt-6 text-sm font-semibold">
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand locale={locale} t={t} />
    </>
  );
}
