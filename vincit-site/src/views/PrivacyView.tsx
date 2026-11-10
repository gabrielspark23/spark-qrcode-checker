import Image from "next/image";
import { PolicyBody } from "@/components/sections/PolicyBody";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { privacyEn, privacyPt } from "@/content/privacy";
import { href, type Locale } from "@/lib/i18n";

/**
 * Política de Privacidade em linguagem editorial: abertura com fotografia de arquitetura em moldura assimétrica,
 * faixa grafite "Em resumo" com os quatro compromissos e o texto completo com índice fixo.
 * Foto: Matthew Jesús (Pexels, licença Pexels), tratada para a paleta da marca.
 */
export function PrivacyView({ locale }: { locale: Locale }) {
  const p = locale === "pt" ? privacyPt : privacyEn;
  return (
    <>
      {/* abertura */}
      <section className="ed-hero relative overflow-hidden bg-app" aria-labelledby="page-title">
        <Container className="relative pb-20 pt-32 sm:pb-28 sm:pt-40">
          <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="eyebrow enter flex items-center gap-3 text-ink-3">
                <span className="draw h-px w-8 bg-brass" aria-hidden />
                {p.eyebrow}
              </p>
              <h1 id="page-title" className="display ed-line mt-8 text-[clamp(3rem,1.6rem+5vw,6.75rem)] leading-[0.96]">{p.title}</h1>
              <p className="enter enter-2 mt-10 max-w-[46ch] text-[1.1875rem] leading-relaxed text-ink-2">{p.intro}</p>
              <p className="enter enter-3 mt-10 inline-flex items-center gap-3 border-t border-line-soft pt-5 text-sm text-ink-3">
                <span className="eyebrow">{p.updatedLabel}</span>
                <span className="h-px w-6 bg-brass" aria-hidden />
                <time className="text-ink">{p.updated}</time>
              </p>
            </div>
            <div className="relative lg:col-span-5">
              <span className="policy-photo-rule" aria-hidden />
              <div className="policy-photo relative aspect-[4/5] overflow-hidden">
                <Image src="/images/privacy-architecture.webp" alt={p.photoAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* em resumo */}
      <section className="on-dark bg-navy py-20 text-on-dark sm:py-24" aria-labelledby="glance-title">
        <Container>
          <h2 id="glance-title" className="eyebrow flex items-center gap-3 text-brass">
            <span className="h-px w-6 bg-brass" aria-hidden />
            {p.glanceTitle}
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[2px] bg-navy-line sm:grid-cols-2 lg:grid-cols-4">
            {p.glance.map((g, i) => (
              <li key={g.title} className="policy-glance bg-navy p-7 sm:p-8">
                <span className="text-xs tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-8 font-serif text-[1.625rem] leading-tight">{g.title}</p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-on-dark-2">{g.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* texto completo */}
      <section className="bg-app py-20 sm:py-28">
        <Container>
          <PolicyBody sections={p.sections} tocLabel={p.tocLabel} />
          <div className="mt-6 border-t border-line-soft pt-12 lg:ml-[calc(33.333%+1.5rem)]">
            <ModuleButton href={href("contact", locale)} event="privacy_contact_click">{p.contactCta}</ModuleButton>
          </div>
        </Container>
      </section>
    </>
  );
}
