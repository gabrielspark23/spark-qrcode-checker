import type { Metadata } from "next";
import { routes, type Locale, type RouteKey } from "./i18n";
import { site } from "./site";
import { getDict } from "@/content";

const titles: Record<RouteKey, Record<Locale, string>> = {
  home: { en: "Financial planning between Brazil and the U.S.", pt: "Planejamento financeiro entre o Brasil e os EUA" },
  services: { en: "Our Services", pt: "Nossos serviços" },
  whoWeServe: { en: "Who We Serve", pt: "Para quem" },
  team: { en: "Our Team", pt: "Nossa equipe" },
  about: { en: "About", pt: "Sobre" },
  contact: { en: "Contact & Schedule", pt: "Contato e agendamento" },
  disclosures: { en: "Disclosures", pt: "Informações regulatórias" },
  privacy: { en: "Privacy Policy", pt: "Política de Privacidade" },
};

/** Título, descrição, canonical e hreflang EN/PT/x-default por página. */
export function pageMeta(key: RouteKey, locale: Locale, description?: string): Metadata {
  const t = getDict(locale);
  const path = routes[key][locale];
  return {
    title: key === "home" ? { absolute: `${site.name} — ${titles.home[locale]}` } : titles[key][locale],
    description: description ?? t.meta.siteDescription,
    alternates: {
      canonical: path,
      languages: { en: routes[key].en, "pt-BR": routes[key].pt, "x-default": routes[key].en },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "pt" ? "pt_BR" : "en_US",
      url: path,
      title: titles[key][locale],
      description: description ?? t.meta.siteDescription,
    },
  };
}

export function baseMeta(locale: Locale): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: site.name, template: `%s · ${site.name}` },
    description: getDict(locale).meta.siteDescription,
    // Preview: não indexar até a virada de DNS (dia 10).
    robots: process.env.NEXT_PUBLIC_ALLOW_INDEX === "1" ? undefined : { index: false, follow: false },
  };
}

export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: site.name,
    url: site.url,
    areaServed: ["US", "BR"],
    knowsLanguage: ["en", "pt-BR"],
    address: { "@type": "PostalAddress", addressLocality: site.address.city, addressRegion: site.address.region, addressCountry: site.address.country },
    sameAs: [site.instagram, site.linkedin],
  };
}
