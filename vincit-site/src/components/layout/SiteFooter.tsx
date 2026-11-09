import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { DraftNote } from "@/components/ui/Layout";
import { href, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import type { Dict } from "@/content";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dict }) {
  const f = t.footer;
  const linkCls = "text-on-dark-2 transition-colors duration-150 hover:text-on-dark";
  return (
    <footer className="on-dark border-t border-navy-line bg-navy text-on-dark">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href={href("home", locale)} className="inline-block rounded-[2px]" aria-label="Vincit Capital — Home">
              <Logo onDark />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-on-dark-2">{f.tagline}</p>
            <span className="rule-brass mt-8" aria-hidden />
          </div>

          <nav aria-label={f.navigation} className="lg:col-span-2">
            <h2 className="eyebrow mb-5 font-sans text-on-dark-3">{f.navigation}</h2>
            <ul className="space-y-3 text-sm">
              {(["services", "whoWeServe", "team", "about", "contact"] as const).map((k) => (
                <li key={k}>
                  <Link href={href(k, locale)} className={linkCls}>
                    {t.nav[k]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={f.services} className="lg:col-span-3">
            <h2 className="eyebrow mb-5 font-sans text-on-dark-3">{f.services}</h2>
            <ul className="space-y-3 text-sm">
              {t.services.map((s) => (
                <li key={s.id}>
                  <Link href={href("services", locale, s.id)} className={linkCls}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h2 className="eyebrow mb-5 font-sans text-on-dark-3">{f.contact}</h2>
            <address className="space-y-3 text-sm not-italic text-on-dark-2">
              <p>
                {site.address.line1 ? <>{site.address.line1}<br /></> : null}
                {site.address.city}, {site.address.region}
              </p>
              {site.phone ? <p><a className={linkCls} href={`tel:${site.phone}`}>{site.phoneDisplay}</a></p> : null}
              {site.email ? <p><a className={linkCls} href={`mailto:${site.email}`}>{site.email}</a></p> : null}
              {!site.phone || !site.email ? <DraftNote onDark code="D8">{t.contact.pendingAddress}</DraftNote> : null}
            </address>
            <h2 className="eyebrow mb-4 mt-8 font-sans text-on-dark-3">{f.social}</h2>
            <ul className="flex gap-5 text-sm">
              <li><a className={linkCls} href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className={linkCls} href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-navy-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-on-dark-3">{f.legal}</p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-on-dark-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {site.name}. {f.rights}</p>
            <ul className="flex gap-6">
              <li><Link className={linkCls} href={href("disclosures", locale)}>{f.disclosures}</Link></li>
              <li><Link className={linkCls} href={href("privacy", locale)}>{f.privacy}</Link></li>
              <li>
                <a className={linkCls} href={site.osLoginUrl} data-event="login_click">{t.nav.clientLogin}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
