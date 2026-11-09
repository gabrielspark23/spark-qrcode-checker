"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { href, routeKeyFromPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";
import type { Dict } from "@/content";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.91 1.3-1.91 2.63V21h-4V9.75Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Páginas internas que terminam com a chamada em grafite: o rodapé fica claro (inversão). */
const LIGHT_FOOTER = new Set(["services", "whoWeServe", "team", "about"]);

/**
 * Rodapé: cartão grafite recuado sobre pedra (ou claro nas páginas internas com chamada grafite). Logo e redes à esquerda, filete vertical de latão,
 * convite em pílula à direita; filete horizontal, navegação grande e linha legal.
 */
export function SiteFooter({ locale, t }: { locale: Locale; t: Dict }) {
  const f = t.footer;
  const key = routeKeyFromPath(usePathname() ?? "/");
  const light = key !== null && LIGHT_FOOTER.has(key);
  const c = light
    ? { card: "bg-surface text-ink", muted: "text-ink-3 transition-colors duration-150 hover:text-ink", text2: "text-ink-2", text: "text-ink", ring: "border-line-rule text-ink-2", line: "border-line", pill: "border-line-rule" }
    : { card: "on-dark bg-navy text-on-dark", muted: "text-on-dark-3 transition-colors duration-150 hover:text-on-dark", text2: "text-on-dark-2", text: "text-on-dark", ring: "border-[#4a4e58] text-on-dark-2", line: "border-navy-line", pill: "border-[#4a4e58]" };
  const muted = c.muted;
  const social = [
    { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <footer
      className={cn(
        "px-3 pb-3 sm:px-5 sm:pb-5",
        // rodapé claro: moldura e faixa acima em grafite — o cartão branco ganha contraste
        light ? "on-dark bg-navy pt-16 sm:pt-24" : "bg-app pt-3 sm:pt-5",
      )}
    >
      <div className={cn("relative overflow-hidden rounded-[10px]", c.card)}>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-12 sm:pt-16 lg:px-16">
          {/* Topo: marca | convite */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1px_1fr] lg:gap-16">
            <div className="flex flex-col justify-between gap-12">
              <div>
                <Link href={href("home", locale)} className="inline-block rounded-[2px]" aria-label="Vincit Capital — Home">
                  <Logo onDark={!light} />
                </Link>
              </div>
              <ul className="flex gap-3" aria-label={f.social}>
                {social.map(({ href: h, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={h}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={cn("footer-social inline-flex h-12 w-12 items-center justify-center rounded-full border", c.ring)}
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <span className="hidden bg-brass/60 lg:block" aria-hidden />

            <div>
              <p className={cn("max-w-[24ch] font-serif text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-snug", c.text)}>
                {f.statement}
              </p>
              <div className={cn("mt-8 flex max-w-lg flex-col gap-3 rounded-[28px] border p-2 sm:flex-row sm:items-center sm:rounded-full sm:pl-6", c.pill)}>
                <span className={cn("px-4 pt-2 text-sm sm:flex-1 sm:p-0", c.text2)}>
                  {f.pill}
                </span>
                <Button href={href("contact", locale)} variant={light ? "shield" : "brass-invert"} event="cta_schedule_click" className="btn-pill rounded-full">
                  {t.nav.schedule}
                </Button>
              </div>
              <address className={cn("mt-8 space-y-1 text-sm not-italic", c.text2)}>
                <p>
                  {site.address.line1 ? <>{site.address.line1}, </> : null}
                  {site.address.city}, {site.address.region}
                </p>
                {site.phone ? <p><a className={muted} href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p> : null}
                {site.email ? <p><a className={muted} href={`mailto:${site.email}`}>{site.email}</a></p> : null}
              </address>
            </div>
          </div>

          {/* Filete + navegação grande */}
          <div className="mt-14 border-t border-brass/60 pt-8 sm:mt-16">
            <nav aria-label={f.navigation}>
              <ul className="flex flex-wrap gap-x-10 gap-y-4">
                {(["home", "services", "whoWeServe", "team", "about", "contact"] as const).map((k) => (
                  <li key={k}>
                    <Link href={href(k, locale)} className={cn("nav-link text-[1.375rem] sm:text-2xl", c.text)}>
                      {k === "home" ? (locale === "pt" ? "Início" : "Home") : t.nav[k]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Linha legal */}
          <div className={cn("mt-14 flex flex-col gap-5 border-t pt-6 text-xs lg:flex-row lg:items-start lg:justify-between", c.line, light ? "text-ink-3" : "text-on-dark-3")}>
            <p className="max-w-2xl leading-relaxed">{f.legal}</p>
            <div className="flex flex-col gap-3 lg:items-end">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                <li><Link className={muted} href={href("disclosures", locale)}>{f.disclosures}</Link></li>
                <li><Link className={muted} href={href("privacy", locale)}>{f.privacy}</Link></li>
                <li><a className={muted} href={site.osLoginUrl} data-event="login_click">{t.nav.clientLogin}</a></li>
              </ul>
              <p>© {new Date().getFullYear()} {site.name}. {f.rights}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
