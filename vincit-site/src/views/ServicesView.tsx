import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { getDict } from "@/content";
import { href, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/**
 * Serviços — mesma linguagem editorial da Home.
 * 1. Abertura clara: título grande e o índice das seis disciplinas em linhas amplas, com a varredura em latão
 *    dos Valores (fundo e texto mudam juntos). Cada linha leva ao capítulo.
 * 2. Seis capítulos: à esquerda o numeral, a marca, o título e o convite; à direita "Situações típicas" e
 *    "O que fazemos" numa lâmina com cantos assimétricos (Offset Lens). Dois capítulos em grafite dão ritmo.
 */
const DARK = new Set([1, 4]);

export function ServicesView({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const p = t.servicesPage;
  const row = (s: (typeof t.services)[number], i: number) => (
    <span className="grid w-full items-baseline gap-x-8 gap-y-2 px-5 py-7 sm:px-8 md:grid-cols-12 md:py-9">
      <span className="disc-num text-xs tabular-nums md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
      <span className="font-serif text-[clamp(1.875rem,1.3rem+2.2vw,3.25rem)] leading-[1.05] md:col-span-6">{s.title}</span>
      <span className="disc-short text-[0.9375rem] leading-relaxed md:col-span-4">{s.short}</span>
      <span className="hidden justify-self-end md:col-span-1 md:block" aria-hidden>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 7l10 10M17 9v8H9" />
        </svg>
      </span>
    </span>
  );

  return (
    <>
      {/* 1. Abertura */}
      <section className="bg-app pb-20 pt-32 sm:pb-28 sm:pt-44" aria-labelledby="page-title">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow enter flex items-center gap-3 text-ink-3">
                <span className="draw h-px w-8 bg-brass" aria-hidden />
                {p.eyebrow}
              </p>
              <h1 id="page-title" className="display mt-7 text-[clamp(2.75rem,1.6rem+4vw,5.25rem)] leading-[1.02]">
                {p.title}
              </h1>
            </div>
            <p className="enter enter-2 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-4 lg:col-start-9 lg:pb-3">
              {p.intro}
            </p>
          </div>

          <nav aria-label={p.indexLabel} className="mt-16 sm:mt-20">
            <ul className="disc-index border-t border-line-soft">
              {t.services.map((s, i) => (
                <li key={s.id} className="border-b border-line-soft">
                  <a href={`#${s.id}`} className="disc-row relative block">
                    <span className="disc-base flex">{row(s, i)}</span>
                    <span className="disc-gold absolute inset-0 flex items-center" aria-hidden>{row(s, i)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>

      {/* 2. Capítulos */}
      {t.services.map((s, i) => {
        const dark = DARK.has(i);
        return (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className={cn("svc-chapter scroll-mt-16 py-20 sm:py-28", dark ? "on-dark bg-navy text-on-dark" : "bg-app", i > 0 && !dark && !DARK.has(i - 1) && "border-t border-line-soft")}
          >
            <Container>
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <div className="lg:sticky lg:top-28">
                    <p className={cn("font-serif text-[clamp(4.5rem,3rem+4vw,7.5rem)] leading-none tabular-nums", dark ? "text-brass/45" : "text-brass/55")} aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className={cn("eyebrow mt-6", dark ? "text-brass" : "text-ink-3")}>{s.brand}</p>
                    <h2 id={`${s.id}-title`} className="mt-4 font-serif text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-[1.05]">{s.title}</h2>
                    <p className={cn("mt-6 max-w-[48ch] text-[1.0625rem] leading-relaxed", dark ? "text-on-dark-2" : "text-ink-2")}>{s.body}</p>
                    <div className="mt-10">
                      <ModuleButton
                        href={href("contact", locale)}
                        tone={dark ? "dark" : undefined}
                        event="cta_schedule_click"
                        ariaLabel={`${t.common.talkToTeam}: ${s.title}`}
                      >
                        {t.common.talkToTeam}
                      </ModuleButton>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <div className={cn("svc-plate p-7 sm:p-10", dark ? "svc-plate-dark" : "svc-plate-light")}>
                    <h3 className={cn("eyebrow", dark ? "text-on-dark-2" : "text-ink-2")}>{t.common.typicalSituations}</h3>
                    <ul className="mt-6 space-y-5">
                      {s.situations.map((x) => (
                        <li key={x} className="font-serif text-[1.25rem] leading-snug sm:text-[1.375rem]">“{x}”</li>
                      ))}
                    </ul>

                    <h3 className={cn("eyebrow mt-12 border-t pt-8", dark ? "border-navy-line text-on-dark-2" : "border-line-soft text-ink-2")}>{t.common.whatWeDo}</h3>
                    <ul className="mt-6 space-y-4">
                      {s.whatWeDo.map((x) => (
                        <li key={x} className="flex gap-4 text-[1rem] leading-relaxed">
                          <svg viewBox="0 0 16 16" className="mt-1.5 h-3 w-3 shrink-0" fill="none" aria-hidden>
                            <path d="M2 3 8 13.5 14 3" stroke="var(--color-gold)" strokeWidth="1.75" />
                          </svg>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
