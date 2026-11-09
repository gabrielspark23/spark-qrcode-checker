import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Section, SectionHeader } from "@/components/ui/Layout";
import { LinkArrow } from "@/components/ui/Button";
import { serviceIcons } from "./icons";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

/** 6 cartões: ícone de linha, marca, título, 1 frase, link para a âncora. */
export function ServicesGrid({ locale, t }: { locale: Locale; t: Dict }) {
  const s = t.home.services;
  return (
    <Section tone="light" labelledBy="services-title">
      <Container>
        <SectionHeader
          id="services-title"
          eyebrow={s.eyebrow}
          title={s.title}
          intro={s.intro}
          aside={<LinkArrow href={href("services", locale)}>{t.common.seeAllServices}</LinkArrow>}
        />
        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {t.services.map((svc, i) => {
            const Icon = serviceIcons[svc.id];
            return (
              <li key={svc.id} className="bg-surface">
                <Link
                  href={href("services", locale, svc.id)}
                  className="card-interactive group relative flex h-full flex-col p-8 transition-colors duration-200 hover:bg-app sm:p-10"
                >
                  <span className="card-rule absolute inset-x-0 top-0 h-0.5 bg-brass" aria-hidden />
                  <div className="flex items-start justify-between">
                    <Icon className="h-7 w-7 text-ink" strokeWidth={1.25} aria-hidden />
                    <span className="text-xs tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="eyebrow mt-10 text-ink-3">{svc.brand}</p>
                  <h3 className="h3 mt-2">{svc.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{svc.short}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-ink">
                    {t.common.learnMore}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
