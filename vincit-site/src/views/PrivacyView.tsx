import { PolicyBody } from "@/components/sections/PolicyBody";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { privacyEn, privacyPt } from "@/content/privacy";
import { href, type Locale } from "@/lib/i18n";

/**
 * Política de Privacidade — documento largo: assinatura da firma e data à esquerda, título grande à direita;
 * introdução em serifa na largura toda; resumo em quatro blocos de pedra arredondados; índice em linha;
 * seções em linhas largas (número e título à esquerda, texto à direita), com progresso de leitura no topo.
 */
export function PrivacyView({ locale }: { locale: Locale }) {
  const p = locale === "pt" ? privacyPt : privacyEn;
  return (
    <section className="ed-hero bg-app pb-24 pt-32 sm:pb-32 sm:pt-40" aria-labelledby="page-title">
      <Container>
        {/* abertura */}
        <div className="grid gap-10 border-b border-line-soft pb-12 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pb-16">
          <div className="order-2 lg:order-none lg:col-span-4 lg:pb-3">
            <p className="eyebrow enter flex items-center gap-3 text-ink-3">
              <span className="draw h-px w-8 bg-brass" aria-hidden />
              Vincit Capital
            </p>
            <p className="enter enter-2 mt-5 inline-flex items-center gap-3 rounded-full border border-line-soft px-4 py-2 text-sm text-ink-3">
              {p.updatedLabel}
              <span className="h-1 w-1 rounded-full bg-brass" aria-hidden />
              <time className="text-ink">{p.updated}</time>
            </p>
          </div>
          <h1 id="page-title" className="display ed-line order-1 text-right text-[clamp(3rem,1.4rem+5.6vw,7.5rem)] leading-[0.95] lg:order-none lg:col-span-8">
            {p.title}
          </h1>
        </div>

        <p className="enter enter-2 mt-12 max-w-[60ch] font-serif text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-snug sm:mt-16">{p.intro}</p>

        {/* em resumo */}
        <div className="mt-16 sm:mt-20">
          <p className="eyebrow text-ink-3">{p.glanceTitle}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {p.glance.map((g, i) => (
              <li key={g.title} className="policy-glance rounded-[1.75rem] bg-surface-muted p-7">
                <span className="text-xs tabular-nums text-brass">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 font-serif text-[1.375rem] leading-snug">{g.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{g.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* índice */}
        <nav aria-label={p.tocLabel} className="mt-16 sm:mt-20">
          <p className="eyebrow text-ink-3">{p.tocLabel}</p>
          <ol className="mt-5 flex flex-wrap gap-2">
            {p.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="policy-chip inline-flex items-center gap-2 rounded-full border border-line-soft px-4 py-2 text-sm text-ink-2">
                  <span className="tabular-nums text-xs text-brass">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16 sm:mt-20">
          <PolicyBody sections={p.sections} />
        </div>

        <div className="border-t border-line-soft pt-12 lg:pl-[calc(41.666%+1rem)]">
          <ModuleButton href={href("contact", locale)} event="privacy_contact_click">{p.contactCta}</ModuleButton>
        </div>
      </Container>
    </section>
  );
}
