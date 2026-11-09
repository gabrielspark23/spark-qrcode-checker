import { ArrowUpRight } from "lucide-react";
import { ModuleButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content";

/**
 * Tecnologia e liderança. Sem capturas do OS até haver imagens aprovadas: só o que existe,
 * no presente; o que vem, como "em seguida". Equipe em cartões tipográficos (sem retratos).
 */
export function PlatformPeople({ locale, t }: { locale: Locale; t: Dict }) {
  const tt = t.home.techTeam;
  return (
    <section className="on-dark bg-navy-soft py-24 text-on-dark sm:py-32" aria-labelledby="platform-title">
      <Container>
        <p className="eyebrow flex items-center gap-3 text-brass">
          <span className="h-px w-6 bg-brass" aria-hidden />
          {tt.eyebrow}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <h2 id="platform-title" className="h1 max-w-[14ch] lg:col-span-6">{tt.techTitle}</h2>
          <p className="border-l-2 border-brass pl-4 text-[1.0625rem] text-on-dark lg:col-span-5 lg:col-start-8">{tt.custody}</p>
        </div>

        <div className="mt-24 border-t border-navy-line pt-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h3 className="h2">{tt.teamTitle}</h3>
            <ModuleButton href={href("team", locale)} tone="dark">{tt.meet}</ModuleButton>
          </div>
          <ul className="mt-10 grid gap-px border border-navy-line bg-navy-line sm:grid-cols-2 lg:grid-cols-4">
            {t.team.people.map((p, i) => (
              <li key={p.name} className="leader-card flex flex-col bg-navy-soft p-8">
                <span className="lc-num text-xs tabular-nums text-on-dark-3">{String(i + 1).padStart(2, "0")}</span>
                <p className="lc-name mt-10 font-serif text-2xl leading-tight">{p.name}</p>
                <p className="lc-role eyebrow mt-3 text-brass">{p.role}</p>
                <a
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`LinkedIn — ${p.name}`}
                  className="lc-link link-arrow mt-auto self-start pt-8 text-sm text-on-dark-2 hover:text-on-dark"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
