import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { WornShield } from "@/components/brand/WornShield";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/** Equipe: cabeçalho grafite com o escudo, a curadoria como citação e a liderança em lista editorial. */
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
      {/* Topo: grafite, tela dividida com a foto da equipe (publicada em vincitcapital.com.br) */}
      <section className="on-dark relative grid overflow-hidden bg-navy text-on-dark lg:min-h-[44rem] lg:grid-cols-2" aria-labelledby="page-title">
        <Container className="ed-hero relative flex flex-col items-end justify-between gap-16 pb-16 pt-36 text-right sm:pt-44 lg:order-2 lg:ml-0 lg:max-w-none lg:pl-16 lg:pr-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          <Eyebrow onDark className="enter flex-row-reverse">{tm.eyebrow}</Eyebrow>
          <div className="flex flex-col items-end">
            <h1 id="page-title" className="display ed-line max-w-[11ch] text-[clamp(2.75rem,1.6rem+3.8vw,5.25rem)] leading-[1]">{tm.title}</h1>
            <p className="mt-8 max-w-[38ch] border-t border-navy-line pt-6 text-[1.0625rem] leading-relaxed text-on-dark-2">{tm.intro}</p>
          </div>
        </Container>
        <div className="relative aspect-[4/3] lg:order-1 lg:aspect-auto">
          <Image
            src="/images/team-vincit.webp"
            alt={locale === "pt" ? "Equipe da Vincit Capital no escritório" : "The Vincit Capital team at the office"}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[30%_center]"
          />
        </div>
      </section>

      <section className="on-dark border-t border-navy-line bg-navy-soft py-16 text-on-dark sm:py-20">
        <Container>
          <blockquote className="max-w-[34ch] font-serif text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] italic leading-snug lg:ml-[25%]">
            “{t.about.quote}”
          </blockquote>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-app py-20 sm:py-28" aria-labelledby="leadership-title">
        <WornShield className="absolute -right-20 top-6 h-[22rem] w-[19rem] sm:-right-10 sm:top-10 sm:h-[46rem] sm:w-[40rem]" />
        <Container className="relative">
          <h2 id="leadership-title" className="eyebrow text-ink-3">{tm.leadership}</h2>
          <ol className="mt-8 border-t border-line-soft">
            {tm.people.map((p, i) => (
              <li key={p.name} className="group grid gap-6 border-b border-line-soft py-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <span className="text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-serif text-[clamp(2rem,1.5rem+2vw,3.25rem)] leading-[1.05]">{p.name}</h3>
                  <p className="eyebrow mt-4 text-ink-2">{p.role}</p>
                </div>
                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="text-[1.0625rem] leading-relaxed text-ink-2">{p.bio}</p>
                  <a href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn — ${p.name}`} className="link-arrow mt-6 text-sm">
                    <span>LinkedIn</span>
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-surface-muted py-20 sm:py-24" aria-labelledby="network-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 id="network-title" className="h2">{tm.network}</h2>
              <p className="mt-4 text-ink-2">{tm.networkIntro}</p>
            </div>
            <ul className="grid gap-px border border-line-soft bg-line-soft sm:grid-cols-2 lg:col-span-8">
              {tm.partners.map((p) => (
                <li key={p.name} className="net-card bg-surface p-8">
                  <h3 className="nc-name font-serif text-xl">{p.name}</h3>
                  <span className="nc-rule" aria-hidden />
                  <p className="nc-body mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
