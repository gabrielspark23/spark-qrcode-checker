import { PolicyBody } from "@/components/sections/PolicyBody";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { privacyEn, privacyPt } from "@/content/privacy";
import { href, type Locale } from "@/lib/i18n";

/**
 * Política de Privacidade em formato linear: uma única coluna de leitura, como um documento bem diagramado —
 * título e data, um resumo entre filetes, o índice e as seções em sequência. Sem foto, sem faixas.
 */
export function PrivacyView({ locale }: { locale: Locale }) {
  const p = locale === "pt" ? privacyPt : privacyEn;
  return (
    <section className="bg-app pb-24 pt-32 sm:pb-32 sm:pt-40" aria-labelledby="page-title">
      <Container>
        <div className="mx-auto max-w-3xl">
        <p className="eyebrow enter flex items-center gap-3 text-ink-3">
          <span className="draw h-px w-8 bg-brass" aria-hidden />
          {p.eyebrow}
        </p>
        <h1 id="page-title" className="display mt-7 text-[clamp(2.75rem,1.8rem+3.4vw,4.75rem)] leading-[1]">{p.title}</h1>
        <p className="enter enter-2 mt-4 text-sm text-ink-3">
          {p.updatedLabel}: <time className="text-ink">{p.updated}</time>
        </p>
        <p className="enter enter-2 mt-10 text-[1.1875rem] leading-relaxed text-ink-2">{p.intro}</p>

        {/* em resumo */}
        <div className="mt-14 border-y border-line-soft py-8">
          <p className="eyebrow text-ink-3">{p.glanceTitle}</p>
          <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {p.glance.map((g) => (
              <div key={g.title}>
                <dt className="font-serif text-[1.25rem] leading-snug">{g.title}</dt>
                <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{g.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* índice */}
        <nav aria-label={p.tocLabel} className="mt-12">
          <p className="eyebrow text-ink-3">{p.tocLabel}</p>
          <ol className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {p.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="policy-toc flex gap-3 text-[0.9375rem] leading-snug text-ink-2">
                  <span className="tabular-nums text-xs text-brass" style={{ paddingTop: "0.2em" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-14">
          <PolicyBody sections={p.sections} />
        </div>

        <div className="border-t border-line-soft pt-12">
          <ModuleButton href={href("contact", locale)} event="privacy_contact_click">{p.contactCta}</ModuleButton>
        </div>
        </div>
      </Container>
    </section>
  );
}
