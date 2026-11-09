import type { ReactNode } from "react";
import "@/app/globals.css";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { EventDelegate } from "./EventDelegate";
import { getDict } from "@/content";
import { htmlLang, type Locale } from "@/lib/i18n";
import { orgJsonLd } from "@/lib/meta";
import { sans, serif } from "@/lib/fonts";

/** <html> por idioma (duas root layouts): `lang` correto em cada página. */
export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const t = getDict(locale);
  return (
    <html lang={htmlLang[locale]} className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd()).replace(/</g, "\\u003c") }} />
        <SiteHeader locale={locale} nav={t.nav} whatsappText={t.common.talkWhatsApp} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} t={t} />
        <EventDelegate />
      </body>
    </html>
  );
}
