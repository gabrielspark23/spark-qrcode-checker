export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];

export const htmlLang: Record<Locale, string> = { en: "en", pt: "pt-BR" };

/** Rotas por idioma (PRD §4.1). A âncora de cada serviço é igual nos dois idiomas. */
export const routes = {
  home: { en: "/", pt: "/pt" },
  services: { en: "/services", pt: "/pt/servicos" },
  whoWeServe: { en: "/who-we-serve", pt: "/pt/para-quem" },
  team: { en: "/team", pt: "/pt/equipe" },
  about: { en: "/about", pt: "/pt/sobre" },
  contact: { en: "/contact", pt: "/pt/contato" },
  disclosures: { en: "/disclosures", pt: "/pt/informacoes-regulatorias" },
  privacy: { en: "/privacy", pt: "/pt/privacidade" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

export function href(key: RouteKey, locale: Locale, hash?: string) {
  return routes[key][locale] + (hash ? `#${hash}` : "");
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/pt" || pathname.startsWith("/pt/") ? "pt" : "en";
}

/** Mesma página no outro idioma (troca de idioma mantém a página). */
export function alternatePath(pathname: string, target: Locale): string {
  const clean = pathname.replace(/\/$/, "") || "/";
  for (const key of Object.keys(routes) as RouteKey[]) {
    const r = routes[key];
    if (r.en === clean || r.pt === clean) return r[target];
  }
  return routes.home[target];
}

export function routeKeyFromPath(pathname: string): RouteKey | null {
  const clean = pathname.replace(/\/$/, "") || "/";
  for (const key of Object.keys(routes) as RouteKey[]) {
    if (routes[key].en === clean || routes[key].pt === clean) return key;
  }
  return null;
}
